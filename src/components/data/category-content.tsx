"use client";

import { useSearchParams } from "next/navigation";
import { CategoryViewToggle } from "./view-toggle";
import { CategoryDashboard } from "./category-dashboard";
import { IndicatorCard } from "@/components/cards/indicator-card";
import type { Category, Indicator } from "@/types";

export function CategoryContent({
  category,
  indicators,
}: {
  category: Category;
  indicators: Indicator[];
}) {
  const params = useSearchParams();
  const view = params?.get("view") === "dashboard" ? "dashboard" : "indicators";

  return (
    <section className="content-container py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-display-sm font-semibold tracking-tight text-ink-900">
          {view === "dashboard" ? "Dashboard" : `All indicators (${indicators.length})`}
        </h2>
        <CategoryViewToggle current={view} accent={category.accent} />
      </div>

      {view === "dashboard" ? (
        <CategoryDashboard category={category} indicators={indicators} />
      ) : indicators.length === 0 ? (
        <p className="mt-4 text-ink-600">
          No indicators are currently published in this category.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger">
          {indicators.map((i) => (
            <IndicatorCard key={i.slug} indicator={i} />
          ))}
        </div>
      )}
    </section>
  );
}