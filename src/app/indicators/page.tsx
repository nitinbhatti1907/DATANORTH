import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { IndicatorCard } from "@/components/cards/indicator-card";
import { CATEGORIES } from "@/lib/data/categories";
import { getIndicatorsRepository } from "@/lib/server/data-repository";
import { getRequestLocale } from "@/lib/server/locale";
import { translateCategory } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All indicators",
  description: "Every measurable thing DATANORTH tracks.",
};

const COPY = {
  en: {
    heading: "All indicators",
    across: "indicators across",
    categories: "categories",
    intro:
      "Click any indicator to see its trend, compare communities, and download the underlying data.",
  },
  fr: {
    heading: "Tous les indicateurs",
    across: "indicateurs dans",
    categories: "categories",
    intro:
      "Cliquez sur un indicateur pour voir sa tendance, comparer les communautes et telecharger les donnees sous-jacentes.",
  },
} as const;

export default async function IndicatorsIndexPage() {
  const locale = await getRequestLocale();
  const copy = COPY[locale];
  const indicators = await getIndicatorsRepository(locale);
  const byCat = new Map<string, typeof indicators>();
  for (const i of indicators) {
    const arr = byCat.get(i.category) ?? [];
    arr.push(i);
    byCat.set(i.category, arr);
  }

  return (
    <div className="content-container py-10">
      <Breadcrumbs items={[{ label: copy.heading }]} locale={locale} />
      <div className="mt-6 max-w-2xl">
        <h1 className="font-display text-display-lg font-semibold tracking-tight text-ink-900">
          {copy.heading}
        </h1>
        <p className="mt-3 text-ink-600">
          {indicators.length} {copy.across} {byCat.size} {copy.categories}.{" "}
          {copy.intro}
        </p>
      </div>

      <div className="mt-10 space-y-12">
        {Array.from(byCat.entries()).map(([catSlug, inds]) => {
          const cat = translateCategory(
            CATEGORIES[catSlug as keyof typeof CATEGORIES],
            locale,
          );
          return (
            <div key={catSlug}>
              <div className="flex items-center gap-3">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: cat.accent }}
                  aria-hidden
                />
                <h2 className="font-display text-display-sm font-semibold tracking-tight text-ink-900">
                  {cat.name}
                </h2>
                <span className="text-sm text-ink-500">({inds.length})</span>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {inds.map((i) => (
                  <IndicatorCard key={i.slug} indicator={i} locale={locale} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
