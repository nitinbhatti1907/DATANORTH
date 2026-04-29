import { NextResponse } from "next/server";
import { GEOGRAPHIES } from "@/lib/data/geographies";

export async function GET() {
  return NextResponse.json({
    geographies: GEOGRAPHIES,
    count: GEOGRAPHIES.length,
  });
}
