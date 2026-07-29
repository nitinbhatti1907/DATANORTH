"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Input, Select } from "@/components/ui/controls";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, CATEGORY_LIST } from "@/lib/data/categories";
import {
  getTranslations,
  localizePath,
  translateCategory,
  type Locale,
} from "@/lib/i18n";
import type { Indicator } from "@/types";
import { Search, ArrowUpRight } from "lucide-react";

const COPY = {
  en: {
    breadcrumb: "Explore data",
    heading: "Explore the data",
    intro:
      "Search every indicator by keyword or category. Open one to see its trend, filter by community, and download the underlying data.",
    searchPlaceholder: "Search indicators...",
    searchLabel: "Search indicators",
    filterLabel: "Filter by category",
    allCategories: "All categories",
    indicatorSingular: "indicator",
    indicatorPlural: "indicators",
    empty: "No indicators matched your search.",
  },
  fr: {
    breadcrumb: "Explorer les donnees",
    heading: "Explorer les donnees",
    intro:
      "Recherchez chaque indicateur par mot-cle ou par categorie. Ouvrez un indicateur pour voir sa tendance, filtrer par communaute et telecharger les donnees sous-jacentes.",
    searchPlaceholder: "Rechercher des indicateurs...",
    searchLabel: "Rechercher des indicateurs",
    filterLabel: "Filtrer par categorie",
    allCategories: "Toutes les categories",
    indicatorSingular: "indicateur",
    indicatorPlural: "indicateurs",
    empty: "Aucun indicateur ne correspond a votre recherche.",
  },
} as const;

type ExploreContentProps = {
  indicators: Indicator[];
  locale: Locale;
};

export function ExploreContent({ indicators, locale }: ExploreContentProps) {
  const copy = COPY[locale];
  const common = getTranslations(locale).common;
  const categories = useMemo(
    () => CATEGORY_LIST.map((category) => translateCategory(category, locale)),
    [locale],
  );
  const categoryMap = useMemo(
    () =>
      Object.fromEntries(
        Object.values(CATEGORIES).map((category) => [
          category.slug,
          translateCategory(category, locale),
        ]),
      ) as typeof CATEGORIES,
    [locale],
  );
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return indicators.filter((i) => {
      if (cat && i.category !== cat) return false;
      if (!needle) return true;
      return (
        i.name.toLowerCase().includes(needle) ||
        i.description.toLowerCase().includes(needle) ||
        i.source.toLowerCase().includes(needle)
      );
    });
  }, [q, cat, indicators]);

  return (
    <div className="content-container py-10">
      <Breadcrumbs items={[{ label: copy.breadcrumb }]} locale={locale} />
      <div className="mt-6 max-w-2xl">
        <h1 className="font-display text-display-lg font-semibold tracking-tight text-ink-900">
          {copy.heading}
        </h1>
        <p className="mt-3 text-ink-600">{copy.intro}</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <div className="relative min-w-[280px] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
            aria-hidden
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={copy.searchPlaceholder}
            className="pl-9"
            aria-label={copy.searchLabel}
          />
        </div>
        <Select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          aria-label={copy.filterLabel}
        >
          <option value="">{copy.allCategories}</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-4 text-sm text-ink-500">
        {results.length}{" "}
        {results.length === 1 ? copy.indicatorSingular : copy.indicatorPlural}
      </div>

      <ul className="mt-4 divide-y divide-ink-100 rounded-lg border border-ink-200 bg-white shadow-elev-1">
        {results.map((i) => {
          const c = categoryMap[i.category];
          return (
            <li key={i.slug}>
              <Link
                href={localizePath(`/indicators/${i.slug}`, locale)}
                className="group flex items-start justify-between gap-4 px-5 py-4 hover:bg-nordik-50/40"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ background: c.accent }}
                      aria-hidden
                    />
                    <span className="text-xs font-medium uppercase tracking-wider text-ink-500">
                      {c.name}
                    </span>
                    {i.isSample && (
                      <Badge variant="sample">{common.sample}</Badge>
                    )}
                  </div>
                  <h2 className="mt-1 text-base font-semibold text-ink-900 group-hover:text-nordik-700">
                    {i.name}
                  </h2>
                  <p className="mt-1 line-clamp-1 text-sm text-ink-600">
                    {i.description}
                  </p>
                </div>
                <ArrowUpRight
                  className="mt-1 h-4 w-4 shrink-0 text-ink-400 group-hover:text-nordik-700"
                  aria-hidden
                />
              </Link>
            </li>
          );
        })}
        {results.length === 0 && (
          <li className="px-5 py-10 text-center text-sm text-ink-500">
            {copy.empty}
          </li>
        )}
      </ul>
    </div>
  );
}
