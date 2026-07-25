import { and, asc, eq } from "drizzle-orm";
import Papa from "papaparse";
import { getDb, hasDatabaseConfig } from "@/db/client";
import { dataUploads, indicators, indicatorValues } from "@/db/schema";

export type UploadPreviewRow = {
  indicator_slug: string;
  geography_code: string;
  year: number;
  value: number;
  label?: string;
  quarter?: number;
  month?: number;
  confidence_low?: number;
  confidence_high?: number;
  is_forecast?: boolean;
  model_id?: string;
};

export type UploadValidationResult = {
  rows: UploadPreviewRow[];
  errors: string[];
};

type RawRow = Record<string, unknown>;
export type ImportMode = "replace" | "extend";

const REQUIRED_COLUMNS = ["geography_code", "year", "value"];

function normalizeKey(key: string) {
  return key.trim().toLowerCase().replace(/\s+/g, "_");
}

function asNumber(value: unknown) {
  if (value == null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function asBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  if (value == null || value === "") return false;
  return ["true", "1", "yes", "y"].includes(String(value).toLowerCase());
}

function normalizeRawRow(row: RawRow): RawRow {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [normalizeKey(key), value]),
  );
}

export async function parseUploadFile(file: File): Promise<RawRow[]> {
  const buffer = await file.arrayBuffer();
  const name = file.name.toLowerCase();

  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    const XLSX = await import("xlsx");
    const workbook = XLSX.read(buffer, { type: "array" });
    const firstSheet = workbook.SheetNames[0];
    if (!firstSheet) return [];
    return XLSX.utils.sheet_to_json<RawRow>(workbook.Sheets[firstSheet], {
      defval: "",
    });
  }

  const text = new TextDecoder().decode(buffer);
  const parsed = Papa.parse<RawRow>(text, {
    header: true,
    skipEmptyLines: true,
  });
  return parsed.data;
}

export function validateUploadRows(
  rawRows: RawRow[],
  defaults: { indicatorSlug?: string } = {},
): UploadValidationResult {
  const rows: UploadPreviewRow[] = [];
  const errors: string[] = [];
  const seenKeys = new Set<string>();

  rawRows.forEach((raw, index) => {
    const row = normalizeRawRow(raw);
    const rowNumber = index + 2;
    const missing = REQUIRED_COLUMNS.filter((column) => {
      return row[column] == null || row[column] === "";
    });

    if (!defaults.indicatorSlug && (row.indicator_slug == null || row.indicator_slug === "")) {
      missing.push("indicator_slug");
    }

    if (missing.length) {
      errors.push(`Row ${rowNumber}: missing ${missing.join(", ")}`);
      return;
    }

    const year = asNumber(row.year);
    const value = asNumber(row.value);
    if (year == null || value == null) {
      errors.push(`Row ${rowNumber}: year and value must be numeric`);
      return;
    }

    const indicatorSlug = String(row.indicator_slug || defaults.indicatorSlug);
    if (defaults.indicatorSlug && indicatorSlug !== defaults.indicatorSlug) {
      errors.push(
        `Row ${rowNumber}: indicator_slug must match selected indicator ${defaults.indicatorSlug}`,
      );
      return;
    }

    const parsedRow = {
      indicator_slug: indicatorSlug,
      geography_code: String(row.geography_code),
      year,
      value,
      label: row.label ? String(row.label) : undefined,
      quarter: asNumber(row.quarter),
      month: asNumber(row.month),
      confidence_low: asNumber(row.confidence_low),
      confidence_high: asNumber(row.confidence_high),
      is_forecast: asBoolean(row.is_forecast),
      model_id: row.model_id ? String(row.model_id) : undefined,
    };

    const duplicateKey = getRowKey(parsedRow);
    if (seenKeys.has(duplicateKey)) {
      errors.push(
        `Row ${rowNumber}: duplicate record for ${parsedRow.geography_code}, ${parsedRow.year}${
          parsedRow.label ? `, ${parsedRow.label}` : ""
        }`,
      );
      return;
    }
    seenKeys.add(duplicateKey);
    rows.push(parsedRow);
  });

  return { rows, errors };
}

function getRowKey(row: UploadPreviewRow) {
  return [
    row.indicator_slug,
    row.geography_code,
    row.year,
    row.quarter ?? "",
    row.month ?? "",
    row.label ?? "",
  ].join("||");
}

export async function findCurrentConflicts(rows: UploadPreviewRow[]) {
  if (!rows.length || !hasDatabaseConfig()) return [];
  const indicatorSlug = rows[0]?.indicator_slug;
  if (!indicatorSlug) return [];

  const db = getDb();
  const currentRows = await db
    .select({
      indicator_slug: indicatorValues.indicatorSlug,
      geography_code: indicatorValues.geographyCode,
      year: indicatorValues.year,
      quarter: indicatorValues.quarter,
      month: indicatorValues.month,
      label: indicatorValues.label,
      value: indicatorValues.value,
    })
    .from(indicatorValues)
    .where(
      and(
        eq(indicatorValues.indicatorSlug, indicatorSlug),
        eq(indicatorValues.isCurrent, true),
      ),
    );

  const currentKeys = new Set(
    currentRows.map((row) =>
      getRowKey({
        indicator_slug: row.indicator_slug,
        geography_code: row.geography_code,
        year: row.year,
        quarter: row.quarter ?? undefined,
        month: row.month ?? undefined,
        label: row.label ?? undefined,
        value: Number(row.value),
      }),
    ),
  );

  return rows
    .filter((row) => currentKeys.has(getRowKey(row)))
    .slice(0, 50)
    .map(
      (row) =>
        `${row.indicator_slug} ${row.geography_code} ${row.year}${
          row.label ? ` ${row.label}` : ""
        } already exists in current data.`,
    );
}

export async function exportCurrentIndicatorCsv(indicatorSlug: string) {
  if (!hasDatabaseConfig()) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const db = getDb();
  const rows = await db
    .select({
      indicator_slug: indicatorValues.indicatorSlug,
      geography_code: indicatorValues.geographyCode,
      year: indicatorValues.year,
      quarter: indicatorValues.quarter,
      month: indicatorValues.month,
      label: indicatorValues.label,
      value: indicatorValues.value,
      confidence_low: indicatorValues.confidenceLow,
      confidence_high: indicatorValues.confidenceHigh,
      is_forecast: indicatorValues.isForecast,
      model_id: indicatorValues.modelId,
      ingested_at: indicatorValues.ingestedAt,
      ingested_by: indicatorValues.ingestedBy,
      upload_id: indicatorValues.uploadId,
    })
    .from(indicatorValues)
    .where(
      and(
        eq(indicatorValues.indicatorSlug, indicatorSlug),
        eq(indicatorValues.isCurrent, true),
      ),
    )
    .orderBy(
      asc(indicatorValues.geographyCode),
      asc(indicatorValues.year),
      asc(indicatorValues.label),
    );

  return Papa.unparse(rows);
}

export async function ingestUpload(params: {
  file: File;
  rawRows: RawRow[];
  rows: UploadPreviewRow[];
  uploadedBy: string;
  category?: string;
  indicatorSlug: string;
  importMode: ImportMode;
  sourceUrl?: string;
}) {
  if (!hasDatabaseConfig()) {
    throw new Error("DATABASE_URL is not configured.");
  }
  if (process.env.ADMIN_UPLOADS_ENABLED !== "true") {
    throw new Error("ADMIN_UPLOADS_ENABLED must be true before writes are allowed.");
  }

  if (params.importMode === "extend") {
    const conflicts = await findCurrentConflicts(params.rows);
    if (conflicts.length) {
      throw new Error(
        `Extend mode found ${conflicts.length} existing current records. Use replace mode or remove duplicate rows.`,
      );
    }
  }

  const db = getDb();
  return db.transaction(async (tx) => {
    const [upload] = await tx
      .insert(dataUploads)
      .values({
        source: "admin",
        status: "pending",
        filename: params.file.name,
        originalFilename: params.file.name,
        category: params.category,
        indicatorSlug: params.indicatorSlug,
        uploadedBy: params.uploadedBy,
        rowCount: params.rows.length,
      })
      .returning();

    try {
      if (params.importMode === "replace") {
        await tx
          .update(indicatorValues)
          .set({ isCurrent: false })
          .where(
            and(
              eq(indicatorValues.indicatorSlug, params.indicatorSlug),
              eq(indicatorValues.isCurrent, true),
            ),
          );
      }

      for (const row of params.rows) {
        await tx.insert(indicatorValues).values({
          indicatorSlug: row.indicator_slug,
          geographyCode: row.geography_code,
          year: row.year,
          quarter: row.quarter,
          month: row.month,
          label: row.label,
          value: String(row.value),
          confidenceLow:
            row.confidence_low == null ? undefined : String(row.confidence_low),
          confidenceHigh:
            row.confidence_high == null ? undefined : String(row.confidence_high),
          isForecast: row.is_forecast ?? false,
          modelId: row.model_id,
          uploadId: upload.id,
          ingestedBy: params.uploadedBy,
          isCurrent: true,
        });
      }

      await tx
        .update(indicators)
        .set({
          isSample: false,
          ...(params.sourceUrl ? { sourceUrl: params.sourceUrl } : {}),
          updatedAt: new Date(),
        })
        .where(eq(indicators.slug, params.indicatorSlug));

      const [complete] = await tx
        .update(dataUploads)
        .set({ status: "success", completedAt: new Date() })
        .where(eq(dataUploads.id, upload.id))
        .returning();
      return complete;
    } catch (error) {
      await tx
        .update(dataUploads)
        .set({
          status: "failed",
          completedAt: new Date(),
          errorMessage: error instanceof Error ? error.message : "Unknown error",
        })
        .where(eq(dataUploads.id, upload.id));
      throw error;
    }
  });
}
