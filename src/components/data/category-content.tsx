"use client";

import { useSearchParams } from "next/navigation";
import { CategoryViewToggle } from "./view-toggle";
import { CategoryDashboard } from "./category-dashboard";
import { IndicatorCard } from "@/components/cards/indicator-card";
import type { Category, Indicator } from "@/types";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

export function CategoryContent({
  category,
  indicators,
  locale = DEFAULT_LOCALE,
}: {
  category: Category;
  indicators: Indicator[];
  locale?: Locale;
}) {
  const params = useSearchParams();
  const view = params?.get("view") === "dashboard" ? "dashboard" : "indicators";

  return (
    <section className="content-container py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-display-sm font-semibold tracking-tight text-ink-900">
          {view === "dashboard"
            ? locale === "fr"
              ? "Tableau de bord"
              : "Dashboard"
            : locale === "fr"
              ? `Tous les indicateurs (${indicators.length})`
              : `All indicators (${indicators.length})`}
        </h2>
        <CategoryViewToggle current={view} accent={category.accent} locale={locale} />
      </div>

      {view === "dashboard" ? (
        <CategoryDashboard category={category} indicators={indicators} />
      ) : indicators.length === 0 ? (
        <p className="mt-4 text-ink-600">
          {locale === "fr"
            ? "Aucun indicateur n'est actuellement publie dans cette categorie."
            : "No indicators are currently published in this category."}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger">
          {indicators.map((i) => (
            <IndicatorCard key={i.slug} indicator={i} locale={locale} />
          ))}
        </div>
      )}
    </section>
  );
}
