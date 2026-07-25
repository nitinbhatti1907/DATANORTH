import Papa from "papaparse";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
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
const STATCAN_TARGET_DGUIDS = Object.keys(STATCAN_CSD_DGUID_TO_GEOGRAPHY);

const HIGH_SCHOOL_COMPLETION_TOTAL_COLUMN =
  "Secondary (high) school diploma or equivalency certificate (3):Total - Secondary (high) school diploma or equivalency certificate[1]";
const HIGH_SCHOOL_COMPLETION_WITH_DIPLOMA_COLUMN =
  "Secondary (high) school diploma or equivalency certificate (3):With high school diploma or equivalency certificate[3]";

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

export async function processRawIndicatorPath(params: {
  rawPath: string;
  category?: string;
  indicatorSlug: string;
}): Promise<ProcessResult> {
  const files = await listRawFiles(params.rawPath);
  if (!files.length) {
    return emptyProcessResult(params.rawPath, "No CSV or Excel files found.");
  }

  if (params.indicatorSlug === "high-school-completion") {
    return processHighSchoolCompletionPaths(files);
  }

  const fileObjects = await Promise.all(
    files.map(async (filePath) => {
      const bytes = await fs.promises.readFile(filePath);
      return new File([bytes], path.basename(filePath));
    }),
  );

  return processRawIndicatorFiles({
    files: fileObjects,
    category: params.category,
    indicatorSlug: params.indicatorSlug,
  });
}

async function processHighSchoolCompletionPaths(filePaths: string[]) {
  const transformedRows: RawRow[] = [];
  const warnings: string[] = [];
  let rawRowsRead = 0;
  let skippedRows = 0;
  let filesProcessed = 0;

  for (const filePath of filePaths) {
    if (!filePath.toLowerCase().endsWith(".csv")) continue;
    if (path.basename(filePath).toLowerCase().includes("metadata")) continue;

    filesProcessed += 1;
    const result = await streamHighSchoolCompletionCsv(filePath);
    rawRowsRead += result.rawRowsRead;
    skippedRows += result.skippedRows;
    transformedRows.push(...result.rows);
    warnings.push(...result.warnings);
  }

  const deduped = dedupeTransformedRows(transformedRows);
  const errors = [...deduped.errors];
  if (deduped.exactDuplicateRows) {
    warnings.unshift(
      `${deduped.exactDuplicateRows} exact duplicate row${
        deduped.exactDuplicateRows === 1 ? " was" : "s were"
      } skipped while combining raw files.`,
    );
  }

  const validation = validateUploadRows(deduped.rows, {
    indicatorSlug: "high-school-completion",
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
    warnings: warnings.slice(0, 50),
    summary: {
      filesProcessed,
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

async function streamHighSchoolCompletionCsv(filePath: string) {
  const rows: RawRow[] = [];
  const warnings: string[] = [];
  const selectedRows = new Map<
    string,
    {
      indicator_slug: string;
      geography_code: string;
      year: string;
      total?: number;
      completed?: number;
    }
  >();
  let rawRowsRead = 0;
  let skippedRows = 0;
  let header: string[] | null = null;
  let index: Record<string, number> = {};

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!header) {
      header = parseCsvLine(line).map((column) => column.replace(/^\uFEFF/, ""));
      index = Object.fromEntries(header.map((name, columnIndex) => [name, columnIndex]));
      continue;
    }

    rawRowsRead += 1;
    if (!hasTargetDguid(line)) {
      skippedRows += 1;
      continue;
    }

    const columns = parseCsvLine(line);
    const transformed = transformHighSchoolCompletionColumns(columns, index);
    if (transformed) {
      rows.push(transformed);
    }

    const selectedFact = transformSelectedHighSchoolCompletionFact(columns, index);
    if (selectedFact) {
      const existing = selectedRows.get(selectedFact.key) ?? {
        indicator_slug: "high-school-completion",
        geography_code: selectedFact.geography_code,
        year: selectedFact.year,
      };
      if (selectedFact.kind === "total") {
        existing.total = selectedFact.value;
      } else {
        existing.completed = selectedFact.value;
      }
      selectedRows.set(selectedFact.key, existing);
    }

    if (!transformed && !selectedFact) {
      skippedRows += 1;
      continue;
    }

    const foundGeographies = new Set(
      [
        ...rows.map((row) => String(row.geography_code)),
        ...Array.from(selectedRows.values())
          .filter((row) => row.total != null && row.completed != null)
          .map((row) => row.geography_code),
      ],
    );
    if (foundGeographies.size >= STATCAN_TARGET_DGUIDS.length) {
      rl.close();
      break;
    }
  }

  for (const row of selectedRows.values()) {
    if (row.total == null || row.completed == null || row.total === 0) continue;
    rows.push({
      indicator_slug: row.indicator_slug,
      geography_code: row.geography_code,
      year: row.year,
      value: Number(((row.completed / row.total) * 100).toFixed(1)),
    });
  }

  if (!rows.length) {
    warnings.push(
      `${path.basename(filePath)}: no DATANORTH high-school-completion rows were found.`,
    );
  }

  return { rows, rawRowsRead, skippedRows, warnings };
}

function transformSelectedHighSchoolCompletionFact(
  columns: string[],
  index: Record<string, number>,
) {
  const geographyCode = STATCAN_CSD_DGUID_TO_GEOGRAPHY[getColumn(columns, index, "DGUID")];
  if (!geographyCode) return null;
  if (getColumn(columns, index, "Statistics (3)") !== "Count") return null;
  if (getColumn(columns, index, "Gender (3)") !== "Total - Gender") return null;
  if (getColumn(columns, index, "Age (15A)") !== "Total - Age") return null;
  if (
    getColumn(columns, index, "Labour force status (8)").trim() !==
    "Total - Labour force status"
  ) {
    return null;
  }
  if (
    getColumn(columns, index, "Registered or Treaty Indian status (3)") !==
    "Total - Registered or Treaty Indian status"
  ) {
    return null;
  }
  if (
    getColumn(columns, index, "Indigenous identity (9)") !==
    "Total - Indigenous identity"
  ) {
    return null;
  }

  const credential = getColumn(
    columns,
    index,
    "Secondary (high) school diploma or equivalency certificate (3)",
  );
  const rawValue = getColumn(columns, index, "VALUE").replace(/,/g, "");
  const value = Number(rawValue);
  if (!Number.isFinite(value)) return null;

  const year = getColumn(columns, index, "REF_DATE");
  const key = `${geographyCode}||${year}`;
  if (
    credential ===
    "Total - Secondary (high) school diploma or equivalency certificate"
  ) {
    return { key, geography_code: geographyCode, year, kind: "total" as const, value };
  }
  if (credential === "With high school diploma or equivalency certificate") {
    return {
      key,
      geography_code: geographyCode,
      year,
      kind: "completed" as const,
      value,
    };
  }

  return null;
}

function hasTargetDguid(line: string) {
  return STATCAN_TARGET_DGUIDS.some((dguid) => line.includes(dguid));
}

function transformHighSchoolCompletionColumns(
  columns: string[],
  index: Record<string, number>,
) {
  const geographyCode = STATCAN_CSD_DGUID_TO_GEOGRAPHY[getColumn(columns, index, "DGUID")];
  if (!geographyCode) return null;
  if (getColumn(columns, index, "Statistics (3)") !== "Count") return null;
  if (getColumn(columns, index, "Gender (3)") !== "Total - Gender") return null;
  if (getColumn(columns, index, "Age (15A)") !== "Total - Age") return null;
  if (
    getColumn(columns, index, "Labour force status (8)").trim() !==
    "Total - Labour force status"
  ) {
    return null;
  }
  if (
    getColumn(columns, index, "Registered or Treaty Indian status (3)") !==
    "Total - Registered or Treaty Indian status"
  ) {
    return null;
  }
  if (
    getColumn(columns, index, "Indigenous identity (9)") !==
    "Total - Indigenous identity"
  ) {
    return null;
  }

  const total = Number(
    getColumn(columns, index, HIGH_SCHOOL_COMPLETION_TOTAL_COLUMN).replace(/,/g, ""),
  );
  const completed = Number(
    getColumn(columns, index, HIGH_SCHOOL_COMPLETION_WITH_DIPLOMA_COLUMN).replace(
      /,/g,
      "",
    ),
  );
  if (!Number.isFinite(total) || !Number.isFinite(completed) || total === 0) {
    return null;
  }

  return {
    indicator_slug: "high-school-completion",
    geography_code: geographyCode,
    year: getColumn(columns, index, "REF_DATE"),
    value: Number(((completed / total) * 100).toFixed(1)),
  };
}

function getColumn(
  columns: string[],
  index: Record<string, number>,
  columnName: string,
) {
  const columnIndex = index[columnName];
  return columnIndex == null ? "" : (columns[columnIndex] ?? "");
}

async function listRawFiles(rawPath: string) {
  const stat = await fs.promises.stat(rawPath);
  if (stat.isFile()) return [rawPath];

  const entries = await fs.promises.readdir(rawPath, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const entryPath = path.join(rawPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listRawFiles(entryPath)));
    } else if (/\.(csv|xlsx|xls)$/i.test(entry.name)) {
      files.push(entryPath);
    }
  }
  return files;
}

function emptyProcessResult(source: string, warning: string): ProcessResult {
  return {
    rows: [],
    csv: "",
    errors: [],
    warnings: [`${source}: ${warning}`],
    summary: {
      filesProcessed: 0,
      rawRowsRead: 0,
      candidateRows: 0,
      processedRows: 0,
      skippedRows: 0,
      exactDuplicateRows: 0,
      conflictRows: 0,
      geographies: [],
      years: [],
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

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells;
}
