import { NextResponse } from "next/server";
import { SSM_HEALTH_SERVICES } from "@/lib/data/health";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const data = category
    ? SSM_HEALTH_SERVICES.filter((s) => s.category === category)
    : SSM_HEALTH_SERVICES;
  return NextResponse.json({ services: data, count: data.length });
}
