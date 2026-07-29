import { NextResponse } from "next/server";
import { getGeographiesRepository } from "@/lib/server/data-repository";
import { LOCALE_HEADER, normalizeLocale } from "@/lib/i18n";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const locale = normalizeLocale(
    searchParams.get("locale") ?? req.headers.get(LOCALE_HEADER),
  );
  const geographies = await getGeographiesRepository(locale);
  return NextResponse.json({
    geographies,
    count: geographies.length,
  });
}
