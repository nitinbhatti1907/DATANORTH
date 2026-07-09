import { NextResponse } from "next/server";
import { getIndicatorsRepository } from "@/lib/server/data-repository";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("category");
  const indicators = await getIndicatorsRepository();
  const data = cat
    ? indicators.filter((i) => i.category === cat)
    : indicators;
  return NextResponse.json({ indicators: data, count: data.length });
}
