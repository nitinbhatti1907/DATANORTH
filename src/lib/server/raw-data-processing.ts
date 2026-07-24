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

export async function processRawIndicatorFiles(params: {
  files: File[];
  category?: string;
  indicatorSlug: string;
}): Promise<ProcessResult> {
  const transformedRows: RawRow[] = [];
  const warnings: string[] = [];

  for (const file of params.files) {
    const rawRows = await parseUploadFile(file);
    if (!rawRows.length) {
      warnings.push(`${file.name}: no rows found.`);
      continue;
    }

    rawRows.forEach((raw, index) => {
      const normalized = normalizeRawRow(raw);
      const transformed = transformRawRow(normalized, params.indicatorSlug);
      if (!transformed.geography_code || !transformed.year || !transformed.value) {
        warnings.push(
          `${file.name} row ${index + 2}: skipped because geography, year, or value could not be recognized.`,
        );
        return;
      }
      transformedRows.push(transformed);
    });
  }

  const validation = validateUploadRows(transformedRows, {
    indicatorSlug: params.indicatorSlug,
  });

  return {
    rows: validation.rows,
    csv: Papa.unparse(validation.rows),
    errors: validation.errors,
    warnings: warnings.slice(0, 50),
  };
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
