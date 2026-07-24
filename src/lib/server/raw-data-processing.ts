import Papa from "papaparse";
import {
  parseUploadFile,
  validateUploadRows,
  type UploadPreviewRow,
} from "@/lib/server/upload-ingest";

type RawRow = Record<string, unknown>;

type ProcessResult = {
  rows: UploadPreviewRow[];
  csv: string;
  errors: string[];
  warnings: string[];
  summary: ProcessSummary;
};

export type ProcessSummary = {
  filesProcessed: number;
  rawRowsRead: number;
  candidateRows: number;
  processedRows: number;
  skippedRows: number;
  exactDuplicateRows: number;
  conflictRows: number;
  geographies: string[];
  years: number[];
};

const COLUMN_ALIASES = {
  geography_code: [
    "geography_code",
    "geo_code",
    "community_code",
    "community",
    "geography",
    "geo",
    "region",
    "area",
  ],
  year: ["year", "ref_date", "reference_period", "date", "period"],
  value: [
    "value",
    "val",
    "estimate",
    "count",
    "population",
    "amount",
    "rate",
    "percentage",
    "percent",
  ],
  label: ["label", "series", "category", "type", "characteristic"],
  quarter: ["quarter", "qtr"],
  month: ["month"],
  confidence_low: ["confidence_low", "ci_low", "lower_bound"],
  confidence_high: ["confidence_high", "ci_high", "upper_bound"],
  is_forecast: ["is_forecast", "forecast"],
  model_id: ["model_id", "model"],
};

const STATCAN_CSD_DGUID_TO_GEOGRAPHY: Record<string, string> = {
  "2021A00053557061": "SSM",
  "2021A00053553005": "SUDBURY",
  "2021A00053558004": "THUNDER-BAY",
  "2021A00053548044": "NORTH-BAY",
  "2021A00053556027": "TIMMINS",
  "2021A00053560010": "KENORA",
  "2021A00053557041": "ELLIOT-LAKE",
};

export async function processRawIndicatorFiles(params: {
  files: File[];
  category?: string;
  indicatorSlug: string;
}): Promise<ProcessResult> {
  const transformedRows: RawRow[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  const skippedRowWarnings: string[] = [];
  let rawRowsRead = 0;
  let skippedRows = 0;

  for (const file of params.files) {
    const rawRows = await parseUploadFile(file);
    rawRowsRead += rawRows.length;
    if (!rawRows.length) {
      warnings.push(`${file.name}: no rows found.`);
      continue;
    }

    rawRows.forEach((raw, index) => {
      const normalized = normalizeRawRow(raw);
      const transformed =
        transformStatCanMedianAgeRow(normalized, params.indicatorSlug) ??
        transformRawRow(normalized, params.indicatorSlug);
      if (
        isMissing(transformed.geography_code) ||
        isMissing(transformed.year) ||
        isMissing(transformed.value)
      ) {
        if (skippedRowWarnings.length < 25) {
          skippedRowWarnings.push(
            `${file.name} row ${index + 2}: skipped because geography, year, or value could not be recognized.`,
          );
        }
        skippedRows += 1;
        return;
      }
      transformedRows.push(transformed);
    });
  }

  const deduped = dedupeTransformedRows(transformedRows);
  errors.push(...deduped.errors);
  if (deduped.exactDuplicateRows) {
    warnings.push(
      `${deduped.exactDuplicateRows} exact duplicate row${
        deduped.exactDuplicateRows === 1 ? " was" : "s were"
      } skipped while combining raw files.`,
    );
  }

  const validation = validateUploadRows(deduped.rows, {
    indicatorSlug: params.indicatorSlug,
  });
  errors.push(...validation.errors);

  const geographies = Array.from(
    new Set(validation.rows.map((row) => row.geography_code)),
  ).sort();
  const years = Array.from(new Set(validation.rows.map((row) => row.year))).sort(
    (a, b) => a - b,
  );

  return {
    rows: validation.rows,
    csv: Papa.unparse(validation.rows),
    errors,
    warnings: [...warnings, ...skippedRowWarnings].slice(0, 50),
    summary: {
      filesProcessed: params.files.length,
      rawRowsRead,
      candidateRows: transformedRows.length,
      processedRows: validation.rows.length,
      skippedRows,
      exactDuplicateRows: deduped.exactDuplicateRows,
      conflictRows: deduped.conflictRows,
      geographies,
      years,
    },
  };
}

function dedupeTransformedRows(rows: RawRow[]) {
  const uniqueRows: RawRow[] = [];
  const seen = new Map<string, string>();
  const errors: string[] = [];
  let exactDuplicateRows = 0;
  let conflictRows = 0;

  rows.forEach((row, index) => {
    const key = getTransformedRowKey(row);
    const signature = getTransformedRowSignature(row);
    const existingSignature = seen.get(key);

    if (!existingSignature) {
      seen.set(key, signature);
      uniqueRows.push(row);
      return;
    }

    if (existingSignature === signature) {
      exactDuplicateRows += 1;
      return;
    }

    conflictRows += 1;
    errors.push(
      `Combined raw row ${index + 1}: conflicting value for ${String(
        row.geography_code,
      )}, ${String(row.year)}${row.label ? `, ${String(row.label)}` : ""}.`,
    );
  });

  return {
    rows: uniqueRows,
    errors: errors.slice(0, 50),
    exactDuplicateRows,
    conflictRows,
  };
}

function getTransformedRowKey(row: RawRow) {
  return [
    normalizeCell(row.indicator_slug),
    normalizeCell(row.geography_code),
    normalizeCell(row.year),
    normalizeCell(row.quarter),
    normalizeCell(row.month),
    normalizeCell(row.label),
  ].join("||");
}

function getTransformedRowSignature(row: RawRow) {
  return [
    normalizeCell(row.value),
    normalizeCell(row.confidence_low),
    normalizeCell(row.confidence_high),
    normalizeCell(row.is_forecast),
    normalizeCell(row.model_id),
  ].join("||");
}

function normalizeCell(value: unknown) {
  if (value == null) return "";
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return String(numeric);
  return String(value).trim();
}

function isMissing(value: unknown) {
  return value == null || String(value).trim() === "";
}

function normalizeKey(key: string) {
  return key.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function normalizeRawRow(row: RawRow): RawRow {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [normalizeKey(key), value]),
  );
}

function transformRawRow(row: RawRow, indicatorSlug: string): RawRow {
  return {
    indicator_slug: indicatorSlug,
    geography_code: pick(row, COLUMN_ALIASES.geography_code),
    year: parseYear(pick(row, COLUMN_ALIASES.year)),
    value: pick(row, COLUMN_ALIASES.value),
    label: pick(row, COLUMN_ALIASES.label),
    quarter: pick(row, COLUMN_ALIASES.quarter),
    month: pick(row, COLUMN_ALIASES.month),
    confidence_low: pick(row, COLUMN_ALIASES.confidence_low),
    confidence_high: pick(row, COLUMN_ALIASES.confidence_high),
    is_forecast: pick(row, COLUMN_ALIASES.is_forecast),
    model_id: pick(row, COLUMN_ALIASES.model_id),
  };
}

function transformStatCanMedianAgeRow(row: RawRow, indicatorSlug: string) {
  if (indicatorSlug !== "median-age") return null;

  const characteristic = String(
    pick(row, ["age_in_single_years_average_age_and_median_age_128"]) ?? "",
  );
  if (characteristic !== "Median age") return null;

  const dguid = String(row.dguid ?? "");
  const geographyCode = STATCAN_CSD_DGUID_TO_GEOGRAPHY[dguid];
  if (!geographyCode) return null;

  return {
    indicator_slug: indicatorSlug,
    geography_code: geographyCode,
    year: pick(row, ["census_year_2", "ref_date"]),
    value: pick(row, ["gender_3a_total_gender_1"]),
  };
}

function pick(row: RawRow, aliases: string[]) {
  for (const alias of aliases) {
    const value = row[alias];
    if (value != null && value !== "") return value;
  }
  return undefined;
}

function parseYear(value: unknown) {
  if (typeof value === "number") return value;
  const match = String(value ?? "").match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : value;
}
