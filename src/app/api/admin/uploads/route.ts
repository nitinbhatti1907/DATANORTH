import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/server/admin-auth";
import {
  exportCurrentIndicatorCsv,
  findCurrentConflicts,
  ingestUpload,
  parseUploadFile,
  validateUploadRows,
  type ImportMode,
} from "@/lib/server/upload-ingest";
import { getUploadHistoryRepository } from "@/lib/server/data-repository";

export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(req.url);
  if (url.searchParams.get("action") === "backup") {
    const indicatorSlug = url.searchParams.get("indicatorSlug");
    if (!indicatorSlug) {
      return NextResponse.json(
        { error: "Missing selected indicator." },
        { status: 400 },
      );
    }

    try {
      const csv = await exportCurrentIndicatorCsv(indicatorSlug);
      return new Response(csv, {
        headers: {
          "content-type": "text/csv; charset=utf-8",
          "content-disposition": `attachment; filename="${indicatorSlug}_current_backup.csv"`,
        },
      });
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Could not export current indicator data.",
        },
        { status: 500 },
      );
    }
  }

  const uploads = await getUploadHistoryRepository();
  return NextResponse.json({ uploads });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing upload file." }, { status: 400 });
  }

  const category = String(form.get("category") ?? "") || undefined;
  const indicatorSlug = String(form.get("indicatorSlug") ?? "") || undefined;
  const importMode = parseImportMode(form.get("importMode"));
  const mode = form.get("mode");
  const sourceUrl = normalizeSourceUrl(form.get("sourceUrl"));

  if (!category || !indicatorSlug) {
    return NextResponse.json(
      { error: "Select a category and indicator before uploading data." },
      { status: 400 },
    );
  }

  if (mode !== "validate" && sourceUrl === false) {
    return NextResponse.json(
      { error: "Source URL must be a valid http:// or https:// link." },
      { status: 400 },
    );
  }

  const rawRows = await parseUploadFile(file);
  const validation = validateUploadRows(rawRows, {
    indicatorSlug,
  });

  if (validation.errors.length) {
    return NextResponse.json(
      {
        status: "invalid",
        errors: validation.errors.slice(0, 50),
        rowCount: validation.rows.length,
      },
      { status: 400 },
    );
  }

  if (importMode === "extend") {
    const conflicts = await findCurrentConflicts(validation.rows);
    if (conflicts.length) {
      return NextResponse.json(
        {
          status: "conflict",
          error:
            "Extend mode found records that already exist in current data. Use replace mode or remove duplicate rows.",
          errors: conflicts,
          rowCount: validation.rows.length,
        },
        { status: 409 },
      );
    }
  }

  if (mode === "validate") {
    return NextResponse.json({
      status: "valid",
      rowCount: validation.rows.length,
      preview: validation.rows.slice(0, 10),
      warnings:
        importMode === "replace"
          ? [
              "Replace mode will archive all current rows for this indicator before inserting this file.",
            ]
          : undefined,
    });
  }

  try {
    const upload = await ingestUpload({
      file,
      rawRows,
      rows: validation.rows,
      uploadedBy: session.email ?? session.userId,
      category,
      indicatorSlug,
      importMode,
      sourceUrl: typeof sourceUrl === "string" ? sourceUrl : undefined,
    });
    return NextResponse.json({ status: "success", upload });
  } catch (error) {
    return NextResponse.json(
      {
        status: "failed",
        error: error instanceof Error ? error.message : "Upload failed.",
      },
      { status: 500 },
    );
  }
}

function parseImportMode(value: FormDataEntryValue | null): ImportMode {
  return value === "replace" ? "replace" : "extend";
}

function normalizeSourceUrl(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return undefined;

  try {
    const url = new URL(raw);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : false;
  } catch {
    return false;
  }
}
