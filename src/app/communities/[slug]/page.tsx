import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { KPIStrip, type KPITileData } from "@/components/data/kpi-strip";
import { IndicatorCard } from "@/components/cards/indicator-card";
import { ChartPanel } from "@/components/data/chart-panel";
import { GEOGRAPHIES, FEATURED_COMMUNITIES, getGeography } from "@/lib/data/geographies";
import { INDICATORS, getFeaturedIndicators } from "@/lib/data/indicators";
import { CATEGORIES } from "@/lib/data/categories";
import { getLatestValue, queryChartData } from "@/lib/query";
import { formatNumber } from "@/lib/format";
import { ArrowLeft, MapPin } from "lucide-react";

export const dynamic = "force-static";
export const dynamicParams = false;

function slugifyName(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "");
}

export function generateStaticParams() {
  return FEATURED_COMMUNITIES.map((code) => {
    const g = getGeography(code);
    return { slug: slugifyName(g?.name ?? code) };
  });
}

function findByUrlSlug(slug: string) {
  return GEOGRAPHIES.find((g) => slugifyName(g.name) === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = findByUrlSlug(slug);
  if (!g) return { title: "Not found" };
  return {
    title: `${g.name} — community profile`,
    description: `Indicators for ${g.name}, Northern Ontario.`,
  };
}

export default async function CommunityProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const geography = findByUrlSlug(slug);
  if (!geography) notFound();

  const featured = getFeaturedIndicators();
  const tiles: KPITileData[] = featured.flatMap<KPITileData>((ind) => {
    const latest = getLatestValue(ind.slug, geography.code);
    if (!latest) return [];
    return [
      {
        indicator: ind,
        latest: latest.value,
        previous: latest.previous,
        latestYear: latest.year,
        href: `/indicators/${ind.slug}?geo=${geography.code}`,
      },
    ];
  });

  const allIndicators = INDICATORS.filter((i) => !i.featured);

  const headlineIndicator = INDICATORS.find(
    (i) => i.slug === "median-household-income",
  );
  const chartData = headlineIndicator
    ? queryChartData({
        indicatorSlug: headlineIndicator.slug,
        geographies: [geography.code, "NORTHERN-ON", "ON"],
      })
    : null;

  // Group remaining indicators by category
  const byCat = new Map<string, typeof INDICATORS>();
  for (const i of allIndicators) {
    const arr = byCat.get(i.category) ?? [];
    arr.push(i);
    byCat.set(i.category, arr);
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink-200 bg-gradient-to-br from-nordik-50 to-white">
        <div className="absolute inset-0 bg-grid bg-grid-fade" aria-hidden />
        <div className="content-container relative py-12">
          <Breadcrumbs
            items={[
              { href: "/communities", label: "Communities" },
              { label: geography.name },
            ]}
          />
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-nordik-700">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                Community profile
              </div>
              <h1 className="mt-2 font-display text-display-xl font-semibold leading-[1.02] tracking-tight text-ink-900">
                {geography.name}
              </h1>
              {geography.population && (
                <p className="mt-3 text-ink-600">
                  Population{" "}
                  <span className="num-plate text-ink-900">
                    {formatNumber(geography.population)}
                  </span>{" "}
                  <span className="text-xs text-ink-500">(2021 Census)</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured indicators */}
      {tiles.length > 0 && (
        <section className="content-container py-10">
          <h2 className="font-display text-display-sm font-semibold tracking-tight text-ink-900">
            Featured indicators
          </h2>
          <div className="mt-6">
            <KPIStrip tiles={tiles} />
          </div>
        </section>
      )}

      {/* Headline chart */}
      {chartData && (
        <section className="content-container py-10">
          <h2 className="font-display text-display-sm font-semibold tracking-tight text-ink-900">
            {geography.name} vs. Northern Ontario
          </h2>
          <p className="mt-2 max-w-2xl text-ink-600">
            How {geography.name}&rsquo;s{" "}
            {chartData.indicator.name.toLowerCase()} compares to the regional
            and provincial benchmarks.
          </p>
          <div className="mt-6">
            <ChartPanel data={chartData} height={400} />
          </div>
        </section>
      )}

      {/* All indicators by category */}
      <section className="content-container py-10">
        <h2 className="font-display text-display-sm font-semibold tracking-tight text-ink-900">
          More indicators
        </h2>
        <div className="mt-6 space-y-10">
          {Array.from(byCat.entries()).map(([catSlug, inds]) => {
            const cat = CATEGORIES[catSlug as keyof typeof CATEGORIES];
            if (!cat) return null;
            return (
              <div key={catSlug}>
                <div className="flex items-center gap-2.5">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: cat.accent }}
                    aria-hidden
                  />
                  <h3 className="font-display text-lg font-semibold text-ink-900">
                    {cat.name}
                  </h3>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {inds.map((i) => (
                    <IndicatorCard
                      key={i.slug}
                      indicator={i}
                      geographyCode={geography.code}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10">
          <Link
            href="/communities"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-nordik-700 link-underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All communities
          </Link>
        </div>
      </section>
    </>
  );
}
