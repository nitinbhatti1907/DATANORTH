import { NextResponse } from "next/server";
import { queryChartDataRepository } from "@/lib/server/data-repository";
import { LOCALE_HEADER, normalizeLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("indicator");
  if (!slug) {
    return NextResponse.json(
      { error: "Missing required parameter: indicator" },
      { status: 400 },
    );
  }
  const geoParam = searchParams.get("geo") ?? "";
  const geographies = geoParam ? geoParam.split(",").filter(Boolean) : undefined;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const locale = normalizeLocale(
    searchParams.get("locale") ?? req.headers.get(LOCALE_HEADER),
  );

  const data = await queryChartDataRepository({
    indicatorSlug: slug,
    geographies,
    yearFrom: from ? Number(from) : undefined,
    yearTo: to ? Number(to) : undefined,
    locale,
  });

  if (!data) {
    return NextResponse.json({ error: "Indicator not found" }, { status: 404 });
  }

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
