import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { IndicatorCard } from "@/components/cards/indicator-card";
import { KPIStrip, type KPITileData } from "@/components/data/kpi-strip";
import { CATEGORY_LIST, getCategory } from "@/lib/data/categories";
import { getIndicatorsByCategory } from "@/lib/data/indicators";
import { getLatestValue } from "@/lib/query";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORY_LIST.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Not found" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const indicators = getIndicatorsByCategory(slug);
  const tiles: KPITileData[] = indicators
    .flatMap<KPITileData>((ind) => {
      const latest = getLatestValue(ind.slug, "SSM");
      if (!latest) return [];
      return [
        {
          indicator: ind,
          latest: latest.value,
          previous: latest.previous,
          latestYear: latest.year,
          href: `/indicators/${ind.slug}?geo=SSM`,
        },
      ];
    })
    .slice(0, 4);

  return (
    <>
      {/* Hero strip with image + tinted overlay */}
      <section
        className="relative overflow-hidden border-b border-ink-200"
        style={{
          background: `linear-gradient(135deg, ${category.accent}18 0%, rgba(255,255,255,0) 55%)`,
        }}
      >
        <div className="content-container py-10">
          <Breadcrumbs
            items={[
              { href: "/categories", label: "Categories" },
              { label: category.name },
            ]}
          />
          <div className="mt-6 grid gap-8 md:grid-cols-[2fr_1fr] md:items-end">
            <div>
              <div
                className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider"
                style={{ color: category.accent }}
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: category.accent }}
                />
                Category
              </div>
              <h1 className="mt-2 font-display text-display-xl font-semibold leading-[1.02] tracking-tight text-ink-900">
                {category.name}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
                {category.longDescription}
              </p>
            </div>
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-lg border border-ink-200 shadow-elev-2"
              aria-hidden
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, ${category.accent}22 0%, transparent 100%)`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Snapshot */}
      {tiles.length > 0 && (
        <section className="content-container py-10">
          <div className="text-xs font-medium uppercase tracking-wider text-ink-500">
            Sault Ste. Marie · snapshot
          </div>
          <h2 className="mt-2 font-display text-display-sm font-semibold tracking-tight text-ink-900">
            Featured indicators
          </h2>
          <div className="mt-6">
            <KPIStrip tiles={tiles} />
          </div>
        </section>
      )}

      {/* All indicators in this category */}
      <section className="content-container py-10">
        <h2 className="font-display text-display-sm font-semibold tracking-tight text-ink-900">
          All indicators ({indicators.length})
        </h2>
        {indicators.length === 0 ? (
          <p className="mt-4 text-ink-600">
            No indicators are currently published in this category.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger">
            {indicators.map((i) => (
              <IndicatorCard key={i.slug} indicator={i} />
            ))}
          </div>
        )}

        <div className="mt-10">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-nordik-700 link-underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to all categories
          </Link>
        </div>
      </section>
    </>
  );
}
