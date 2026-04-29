import { NextResponse } from "next/server";
import { INDICATORS } from "@/lib/data/indicators";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("category");
  const data = cat
    ? INDICATORS.filter((i) => i.category === cat)
    : INDICATORS;
  return NextResponse.json({ indicators: data, count: data.length });
}
