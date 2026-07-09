import { and, eq, isNull } from "drizzle-orm";
import Papa from "papaparse";
import { getDb, hasDatabaseConfig } from "@/db/client";
import { dataUploads, indicatorValues } from "@/db/schema";

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

const REQUIRED_COLUMNS = ["indicator_slug", "geography_code", "year", "value"];

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
  defaults: { indicatorSlug?: string; geographyCode?: string } = {},
): UploadValidationResult {
  const rows: UploadPreviewRow[] = [];
  const errors: string[] = [];

  rawRows.forEach((raw, index) => {
    const row = normalizeRawRow(raw);
    const rowNumber = index + 2;
    const missing = REQUIRED_COLUMNS.filter((column) => {
      if (column === "indicator_slug" && defaults.indicatorSlug) return false;
      if (column === "geography_code" && defaults.geographyCode) return false;
      return row[column] == null || row[column] === "";
    });

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

    rows.push({
      indicator_slug: String(row.indicator_slug || defaults.indicatorSlug),
      geography_code: String(row.geography_code || defaults.geographyCode),
      year,
      value,
      label: row.label ? String(row.label) : undefined,
      quarter: asNumber(row.quarter),
      month: asNumber(row.month),
      confidence_low: asNumber(row.confidence_low),
      confidence_high: asNumber(row.confidence_high),
      is_forecast: asBoolean(row.is_forecast),
      model_id: row.model_id ? String(row.model_id) : undefined,
    });
  });

  return { rows, errors };
}

export async function ingestUpload(params: {
  file: File;
  rawRows: RawRow[];
  rows: UploadPreviewRow[];
  uploadedBy: string;
  category?: string;
  indicatorSlug?: string;
  geographyCode?: string;
}) {
  if (!hasDatabaseConfig()) {
    throw new Error("DATABASE_URL is not configured.");
  }
  if (process.env.ADMIN_UPLOADS_ENABLED !== "true") {
    throw new Error("ADMIN_UPLOADS_ENABLED must be true before writes are allowed.");
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
        geographyCode: params.geographyCode,
        uploadedBy: params.uploadedBy,
        rowCount: params.rows.length,
      })
      .returning();

    try {
      for (const row of params.rows) {
        const labelFilter = row.label
          ? eq(indicatorValues.label, row.label)
          : isNull(indicatorValues.label);

        await tx
          .update(indicatorValues)
          .set({ isCurrent: false })
          .where(
            and(
              eq(indicatorValues.indicatorSlug, row.indicator_slug),
              eq(indicatorValues.geographyCode, row.geography_code),
              eq(indicatorValues.year, row.year),
              labelFilter,
              eq(indicatorValues.isCurrent, true),
            ),
          );

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
