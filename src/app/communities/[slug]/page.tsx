import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { KPIStrip, type KPITileData } from "@/components/data/kpi-strip";
import { IndicatorCard } from "@/components/cards/indicator-card";
import { ChartPanel } from "@/components/data/chart-panel";
import { GEOGRAPHIES, FEATURED_COMMUNITIES, getGeography } from "@/lib/data/geographies";
import { CATEGORIES } from "@/lib/data/categories";
import { getLatestValue, queryChartData } from "@/lib/query";
import { formatNumber } from "@/lib/format";
import { getRequestLocale } from "@/lib/server/locale";
import { getIndicatorsRepository } from "@/lib/server/data-repository";
import {
  localizePath,
  translateCategory,
  translateGeography,
} from "@/lib/i18n";
import { ArrowLeft, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";
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
  const locale = await getRequestLocale();
  const baseGeography = findByUrlSlug(slug);
  if (!baseGeography) notFound();
  const geography = translateGeography(baseGeography, locale);
  const copy =
    locale === "fr"
      ? {
          communities: "Communautes",
          profile: "Profil de la communaute",
          population: "Population",
          census: "Recensement de 2021",
          featured: "Indicateurs en vedette",
          versus: "par rapport au Nord de l'Ontario",
          comparePrefix: "Comment",
          compareMiddle: "se compare aux reperes regionaux et provinciaux pour",
          more: "Autres indicateurs",
          all: "Toutes les communautes",
        }
      : {
          communities: "Communities",
          profile: "Community profile",
          population: "Population",
          census: "2021 Census",
          featured: "Featured indicators",
          versus: "vs. Northern Ontario",
          comparePrefix: "How",
          compareMiddle: "compares to the regional and provincial benchmarks for",
          more: "More indicators",
          all: "All communities",
        };

  const localizedIndicators = await getIndicatorsRepository(locale);
  const featured = localizedIndicators.filter((indicator) => indicator.featured);
  const tiles: KPITileData[] = featured.flatMap<KPITileData>((ind) => {
    const latest = getLatestValue(ind.slug, baseGeography.code);
    if (!latest) return [];
    return [
      {
        indicator: ind,
        latest: latest.value,
        previous: latest.previous,
        latestYear: latest.year,
        href: localizePath(
          `/indicators/${ind.slug}`,
          locale,
          `?geo=${baseGeography.code}`,
        ),
      },
    ];
  });

  const allIndicators = localizedIndicators.filter((i) => !i.featured);

  const headlineIndicator = localizedIndicators.find(
    (i) => i.slug === "median-household-income",
  );
  const chartData = headlineIndicator
    ? queryChartData({
        indicatorSlug: headlineIndicator.slug,
        geographies: [baseGeography.code, "NORTHERN-ON", "ON"],
        locale,
      })
    : null;

  // Group remaining indicators by category
  const byCat = new Map<string, typeof allIndicators>();
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
              { href: localizePath("/communities", locale), label: copy.communities },
              { label: geography.name },
            ]}
            locale={locale}
          />
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-nordik-700">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {copy.profile}
              </div>
              <h1 className="mt-2 font-display text-display-xl font-semibold leading-[1.02] tracking-tight text-ink-900">
                {geography.name}
              </h1>
              {geography.population && (
                <p className="mt-3 text-ink-600">
                  {copy.population}{" "}
                  <span className="num-plate text-ink-900">
                    {formatNumber(geography.population)}
                  </span>{" "}
                  <span className="text-xs text-ink-500">({copy.census})</span>
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
            {copy.featured}
          </h2>
          <div className="mt-6">
            <KPIStrip tiles={tiles} locale={locale} />
          </div>
        </section>
      )}

      {/* Headline chart */}
      {chartData && (
        <section className="content-container py-10">
          <h2 className="font-display text-display-sm font-semibold tracking-tight text-ink-900">
            {geography.name} {copy.versus}
          </h2>
          <p className="mt-2 max-w-2xl text-ink-600">
            {copy.comparePrefix} {geography.name} {copy.compareMiddle}{" "}
            {chartData.indicator.name.toLowerCase()}.
          </p>
          <div className="mt-6">
            <ChartPanel data={chartData} height={400} />
          </div>
        </section>
      )}

      {/* All indicators by category */}
      <section className="content-container py-10">
        <h2 className="font-display text-display-sm font-semibold tracking-tight text-ink-900">
          {copy.more}
        </h2>
        <div className="mt-6 space-y-10">
          {Array.from(byCat.entries()).map(([catSlug, inds]) => {
            const cat = translateCategory(
              CATEGORIES[catSlug as keyof typeof CATEGORIES],
              locale,
            );
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
                      geographyCode={baseGeography.code}
                      locale={locale}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10">
          <Link
            href={localizePath("/communities", locale)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-nordik-700 link-underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {copy.all}
          </Link>
        </div>
      </section>
    </>
  );
}
