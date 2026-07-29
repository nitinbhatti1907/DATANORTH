import { NextResponse } from "next/server";
import { getIndicatorsRepository } from "@/lib/server/data-repository";
import { LOCALE_HEADER, normalizeLocale } from "@/lib/i18n";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("category");
  const locale = normalizeLocale(
    searchParams.get("locale") ?? req.headers.get(LOCALE_HEADER),
  );
  const indicators = await getIndicatorsRepository(locale);
  const data = cat
    ? indicators.filter((i) => i.category === cat)
    : indicators;
  return NextResponse.json({ indicators: data, count: data.length });
}
