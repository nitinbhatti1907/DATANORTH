import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { IndicatorCard } from "@/components/cards/indicator-card";
import { INDICATORS } from "@/lib/data/indicators";
import { CATEGORIES } from "@/lib/data/categories";

export const dynamic = "force-static";

export const metadata = {
  title: "All indicators",
  description: "Every measurable thing DATANORTH tracks.",
};

export default function IndicatorsIndexPage() {
  // Group by category
  const byCat = new Map<string, typeof INDICATORS>();
  for (const i of INDICATORS) {
    const arr = byCat.get(i.category) ?? [];
    arr.push(i);
    byCat.set(i.category, arr);
  }

  return (
    <div className="content-container py-10">
      <Breadcrumbs items={[{ label: "Indicators" }]} />
      <div className="mt-6 max-w-2xl">
        <h1 className="font-display text-display-lg font-semibold tracking-tight text-ink-900">
          All indicators
        </h1>
        <p className="mt-3 text-ink-600">
          {INDICATORS.length} indicators across {byCat.size} categories. Click
          any indicator to see its trend, compare communities, and download
          the underlying data.
        </p>
      </div>

      <div className="mt-10 space-y-12">
        {Array.from(byCat.entries()).map(([catSlug, inds]) => {
          const cat = CATEGORIES[catSlug as keyof typeof CATEGORIES];
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
                  <IndicatorCard key={i.slug} indicator={i} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
