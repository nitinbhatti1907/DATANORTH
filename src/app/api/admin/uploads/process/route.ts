import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/server/admin-auth";
import {
  processRawIndicatorFiles,
  processRawIndicatorPath,
} from "@/lib/server/raw-data-processing";

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const form = await req.formData();
  const indicatorSlug = String(form.get("indicatorSlug") ?? "");
  const category = String(form.get("category") ?? "") || undefined;
  const rawPath = String(form.get("rawPath") ?? "").trim();
  const files = form.getAll("files").filter((file): file is File => file instanceof File);

  if (!indicatorSlug) {
    return NextResponse.json(
      { error: "Select an indicator before processing raw files." },
      { status: 400 },
    );
  }

  if (!files.length && !rawPath) {
    return NextResponse.json({ error: "Missing raw source file." }, { status: 400 });
  }

  const processed = rawPath
    ? await processRawIndicatorPath({
        rawPath,
        category,
        indicatorSlug,
      })
    : await processRawIndicatorFiles({
        files,
        category,
        indicatorSlug,
      });

  if (processed.errors.length) {
    return NextResponse.json(
      {
        status: "invalid",
        error: "Raw file could not be converted into the required format.",
        errors: processed.errors.slice(0, 50),
        warnings: processed.warnings,
        summary: processed.summary,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    status: "processed",
    filename: `${indicatorSlug}_processed.csv`,
    rowCount: processed.rows.length,
    preview: processed.rows.slice(0, 10),
    csv: processed.csv,
    warnings: processed.warnings,
    summary: processed.summary,
  });
}
