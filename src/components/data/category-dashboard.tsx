"use client";

import { useMemo, useState, useEffect, useCallback, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ChartPanel } from "@/components/data/chart-panel";
import { FilterBar } from "@/components/data/filter-bar";
import { KPITile, type KPITileData } from "@/components/data/kpi-strip";
import type { Category, Indicator, ChartDataResponse } from "@/types";

type Variant = "comparison" | "composition-led" | "snapshot" | "index";

// Map each category slug to a layout variant + a hero indicator slug
const CATEGORY_LAYOUT: Record<
  string,
  { variant: Variant; hero?: string; secondary?: string[] }
> = {
  // Comparison-led: big trend chart on top, supporting charts in grid below
  housing: { variant: "comparison", hero: "average-home-price" },
  economy: { variant: "comparison", hero: "median-household-income" },
  "labour-market": { variant: "comparison", hero: "median-wage-by-occupation" },

  // Composition-led: composition chart as hero, surrounded by timeseries
  population: { variant: "composition-led", hero: "age-distribution" },
  education: { variant: "composition-led", hero: "highest-education" },
  immigration: { variant: "composition-led", hero: "immigrants-by-region" },

  // Snapshot-led: KPI tiles emphasized, dense small-charts grid
  "health-and-wellbeing": { variant: "snapshot", hero: "life-expectancy" },
  "community-services": { variant: "snapshot", hero: "library-visits" },

  // Index: multi-metric overview
  "climate-and-environment": {
    variant: "index",
    hero: "annual-mean-temperature",
  },
  weather: { variant: "index", hero: "annual-snowfall" },
};

export function CategoryDashboard({
  category,
  indicators,
}: {
  category: Category;
  indicators: Indicator[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const layout = CATEGORY_LAYOUT[category.slug] ?? { variant: "comparison" };

  // Filter state (geography only — applied to all charts in dashboard)
  const initialGeo = (searchParams?.get("geo") ?? "").split(",").filter(Boolean);
  const initialFrom = searchParams?.get("from");
  const initialTo = searchParams?.get("to");
  const [geographies, setGeographies] = useState<string[]>(
    initialGeo.length ? initialGeo : ["SSM"],
  );
  const [yearFrom, setYearFrom] = useState<number | undefined>(
    initialFrom ? Number(initialFrom) : undefined,
  );
  const [yearTo, setYearTo] = useState<number | undefined>(
    initialTo ? Number(initialTo) : undefined,
  );
  const [charts, setCharts] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const next = new URLSearchParams();
    next.set("view", "dashboard");
    if (geographies.length && !(geographies.length === 1 && geographies[0] === "SSM"))
      next.set("geo", geographies.join(","));
    if (yearFrom != null) next.set("from", String(yearFrom));
    if (yearTo != null) next.set("to", String(yearTo));
    window.history.replaceState(null, "", `${pathname}?${next.toString()}`);
  }, [geographies, yearFrom, yearTo, pathname]);

  const onChange = useCallback(
    (update: { geographies?: string[]; yearFrom?: number; yearTo?: number }) => {
      startTransition(() => {
        if (update.geographies !== undefined) setGeographies(update.geographies);
        if ("yearFrom" in update) setYearFrom(update.yearFrom);
        if ("yearTo" in update) setYearTo(update.yearTo);
      });
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadCharts() {
      setLoading(true);
      const results = await Promise.all(
        indicators.map(async (ind) => {
          const params = new URLSearchParams({ indicator: ind.slug });
          if (geographies.length) params.set("geo", geographies.join(","));
          if (ind.shape !== "composition") {
            if (yearFrom != null) params.set("from", String(yearFrom));
            if (yearTo != null) params.set("to", String(yearTo));
          }

          const response = await fetch(`/api/chart-data?${params.toString()}`, {
            signal: controller.signal,
          });
          if (!response.ok) return null;
          const data = (await response.json()) as ChartDataResponse;
          return { indicator: data.indicator, data };
        }),
      );

      if (!controller.signal.aborted) {
        setCharts(results.filter(Boolean) as ChartItem[]);
        setLoading(false);
      }
    }

    loadCharts().catch((error) => {
      if (!controller.signal.aborted) {
        console.error(error);
        setCharts([]);
        setLoading(false);
      }
    });

    return () => controller.abort();
  }, [indicators, geographies, yearFrom, yearTo]);

  const availableYears = useMemo(() => {
    const set = new Set<number>();
    for (const chart of charts) {
      if (chart.data.shape !== "timeseries") continue;
      for (const series of chart.data.series ?? []) {
        for (const point of series.points) set.add(point.year);
      }
    }
    return Array.from(set).sort((a, b) => a - b);
  }, [charts]);

  // KPI tiles for snapshot/index layouts
  const tiles: KPITileData[] = useMemo(() => {
    return charts
      .flatMap<KPITileData>((chart) => {
        const latest = getLatestValueFromChart(chart.data, geographies[0] ?? "SSM");
        if (!latest) return [];
        return [
          {
            indicator: chart.indicator,
            latest: latest.value,
            previous: latest.previous,
            latestYear: latest.year,
            href: `/indicators/${chart.indicator.slug}?geo=${geographies[0] ?? "SSM"}`,
          },
        ];
      })
      .slice(0, 4);
  }, [charts, geographies]);

  const heroChart = layout.hero
    ? charts.find((c) => c.indicator.slug === layout.hero)
    : undefined;
  const restCharts = heroChart
    ? charts.filter((c) => c.indicator.slug !== layout.hero)
    : charts;

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-6">
        <FilterBar
          value={{ geographies, yearFrom, yearTo }}
          availableYears={availableYears}
          onChange={onChange}
        />
        <p className="mt-2 text-xs text-ink-500">
          Filters apply to every chart on this dashboard. Year range only
          affects time-series charts.
        </p>
      </div>

      {loading && (
        <div className="rounded-lg border border-ink-200 bg-white p-10 text-center text-ink-600 shadow-elev-1">
          Loading data...
        </div>
      )}

      {/* Layout dispatch */}
      {!loading && layout.variant === "comparison" && (
        <ComparisonLayout
          accent={category.accent}
          hero={heroChart}
          rest={restCharts}
        />
      )}
      {!loading && layout.variant === "composition-led" && (
        <CompositionLedLayout
          accent={category.accent}
          hero={heroChart}
          rest={restCharts}
        />
      )}
      {!loading && layout.variant === "snapshot" && (
        <SnapshotLayout
          accent={category.accent}
          tiles={tiles}
          hero={heroChart}
          rest={restCharts}
        />
      )}
      {!loading && layout.variant === "index" && (
        <IndexLayout
          accent={category.accent}
          tiles={tiles}
          charts={charts}
        />
      )}
    </div>
  );
}

/* =================== LAYOUTS =================== */

type ChartItem = { indicator: Indicator; data: ChartDataResponse };

function getLatestValueFromChart(
  data: ChartDataResponse,
  geographyCode: string,
): { value: number; year: number; previous?: number } | null {
  if (data.shape === "composition") {
    const composition = data.composition?.find(
      (series) => series.geographyCode === geographyCode,
    );
    if (!composition?.parts.length) return null;
    const top = [...composition.parts].sort((a, b) => b.value - a.value)[0];
    if (top.value == null) return null;
    return { value: top.value, year: composition.year };
  }

  const series = data.series?.find((item) => item.geographyCode === geographyCode);
  if (!series?.points.length) return null;
  const points = [...series.points].sort((a, b) => b.year - a.year);
  const latest = points[0];
  if (latest.value == null) return null;
  return {
    value: latest.value,
    year: latest.year,
    previous: points[1]?.value ?? undefined,
  };
}

// (1) COMPARISON — wide hero trend, then 2-col grid
function ComparisonLayout({
  accent,
  hero,
  rest,
}: {
  accent: string;
  hero?: ChartItem;
  rest: ChartItem[];
}) {
  return (
    <div className="space-y-6">
      {hero && (
        <div
          className="rounded-xl p-1.5"
          style={{
            background: `linear-gradient(135deg, ${accent}1a 0%, ${accent}05 100%)`,
          }}
        >
          <ChartPanel data={hero.data} height={420} />
        </div>
      )}
      <div className="grid gap-5 lg:grid-cols-2">
        {rest.map((c) => (
          <ChartPanel key={c.indicator.slug} data={c.data} height={300} />
        ))}
      </div>
    </div>
  );
}

// (2) COMPOSITION-LED — composition hero on the left, supporting charts on the right
function CompositionLedLayout({
  accent,
  hero,
  rest,
}: {
  accent: string;
  hero?: ChartItem;
  rest: ChartItem[];
}) {
  const [first, ...others] = rest;
  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-2">
        {hero && (
          <div
            className="rounded-xl p-1.5"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${accent}22 0%, ${accent}05 50%, transparent 80%)`,
            }}
          >
            <ChartPanel data={hero.data} height={460} />
          </div>
        )}
        {first && <ChartPanel data={first.data} height={460} />}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {others.map((c) => (
          <ChartPanel key={c.indicator.slug} data={c.data} height={280} />
        ))}
      </div>
    </div>
  );
}

// (3) SNAPSHOT — KPI strip up top, then dense grid
function SnapshotLayout({
  accent,
  tiles,
  hero,
  rest,
}: {
  accent: string;
  tiles: KPITileData[];
  hero?: ChartItem;
  rest: ChartItem[];
}) {
  return (
    <div className="space-y-6">
      <div
        className="rounded-xl border p-5"
        style={{
          borderColor: `${accent}33`,
          background: `linear-gradient(180deg, ${accent}10 0%, transparent 100%)`,
        }}
      >
        <div className="text-xs font-medium uppercase tracking-wider text-ink-500">
          At a glance
        </div>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((t) => (
            <KPITile key={t.indicator.slug} data={t} />
          ))}
        </div>
      </div>
      {hero && <ChartPanel data={hero.data} height={360} />}
      <div className="grid gap-5 md:grid-cols-2">
        {rest.map((c) => (
          <ChartPanel key={c.indicator.slug} data={c.data} height={260} />
        ))}
      </div>
    </div>
  );
}

// (4) INDEX — multi-metric overview, all charts equally weighted in a tight grid
function IndexLayout({
  accent,
  tiles,
  charts,
}: {
  accent: string;
  tiles: KPITileData[];
  charts: ChartItem[];
}) {
  return (
    <div className="space-y-6">
      <div
        className="overflow-hidden rounded-xl border"
        style={{
          borderColor: `${accent}33`,
          background: `linear-gradient(135deg, ${accent}14 0%, ${accent}03 50%, transparent 100%)`,
        }}
      >
        <div className="px-5 py-5">
          <div className="text-xs font-medium uppercase tracking-wider" style={{ color: accent }}>
            Latest readings
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tiles.map((t) => (
              <KPITile key={t.indicator.slug} data={t} />
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {charts.map((c) => (
          <ChartPanel key={c.indicator.slug} data={c.data} height={280} />
        ))}
      </div>
    </div>
  );
}
