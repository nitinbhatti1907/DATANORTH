import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/server/admin-auth";
import {
  ingestUpload,
  parseUploadFile,
  validateUploadRows,
} from "@/lib/server/upload-ingest";
import { getUploadHistoryRepository } from "@/lib/server/data-repository";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
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
  const geographyCode = String(form.get("geographyCode") ?? "") || undefined;

  const rawRows = await parseUploadFile(file);
  const validation = validateUploadRows(rawRows, {
    indicatorSlug,
    geographyCode,
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

  if (form.get("mode") === "validate") {
    return NextResponse.json({
      status: "valid",
      rowCount: validation.rows.length,
      preview: validation.rows.slice(0, 10),
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
      geographyCode,
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
