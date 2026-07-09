import { NextResponse } from "next/server";
import { getGeographiesRepository } from "@/lib/server/data-repository";

export async function GET() {
  const geographies = await getGeographiesRepository();
  return NextResponse.json({
    geographies,
    count: geographies.length,
  });
}
