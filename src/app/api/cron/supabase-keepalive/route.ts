import { desc } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { getDb, hasDatabaseConfig } from "@/db/client";
import { indicators } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json(
      { ok: false, database: "not_configured" },
      { status: 503 },
    );
  }

  const [latestIndicator] = await getDb()
    .select({ slug: indicators.slug, updatedAt: indicators.updatedAt })
    .from(indicators)
    .orderBy(desc(indicators.updatedAt))
    .limit(1);

  return NextResponse.json({
    ok: true,
    checkedAt: new Date().toISOString(),
    latestIndicator: latestIndicator?.slug ?? null,
  });
}
