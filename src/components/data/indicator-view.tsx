"use client";

import {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useTransition,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ChartPanel } from "@/components/data/chart-panel";
import { FilterBar } from "@/components/data/filter-bar";
import type { ChartDataResponse, Indicator, IndicatorValue } from "@/types";
import { getGeography } from "@/lib/data/geographies";

/**
 * Owns filter state for the indicator page. Reads initial values from the URL
 * on mount, then updates the URL via history.replaceState — so filter changes
 * never cause a server re-render.
 *
 * Crucially, reading searchParams *here* (client side) lets the parent page
 * be fully static. If we read searchParams in the server component, the route
 * becomes dynamic and every navigation = server roundtrip.
 */
export function IndicatorView({
  indicator,
  values,
  availableYears,
}: {
  indicator: Indicator;
  values: IndicatorValue[];
  availableYears: number[];
}) {
  const pathname = usePathname();
  const params = useSearchParams();

  // Initial state from URL (client-only)
  const initialGeos = (params?.get("geo") ?? "").split(",").filter(Boolean);
  const initialFrom = params?.get("from");
  const initialTo = params?.get("to");

  const [geographies, setGeographies] = useState<string[]>(
    initialGeos.length > 0 ? initialGeos : ["SSM"],
  );
  const [yearFrom, setYearFrom] = useState<number | undefined>(
    initialFrom ? Number(initialFrom) : undefined,
  );
  const [yearTo, setYearTo] = useState<number | undefined>(
    initialTo ? Number(initialTo) : undefined,
  );
  const [, startTransition] = useTransition();

  // Sync URL without triggering a server render
  useEffect(() => {
    const next = new URLSearchParams();
    if (geographies.length > 0 && !(geographies.length === 1 && geographies[0] === "SSM")) {
      next.set("geo", geographies.join(","));
    }
    if (yearFrom != null) next.set("from", String(yearFrom));
    if (yearTo != null) next.set("to", String(yearTo));
    const qs = next.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    window.history.replaceState(null, "", url);
  }, [geographies, yearFrom, yearTo, pathname]);

  const onChange = useCallback(
    (update: {
      geographies?: string[];
      yearFrom?: number;
      yearTo?: number;
    }) => {
      startTransition(() => {
        if (update.geographies !== undefined) setGeographies(update.geographies);
        if ("yearFrom" in update) setYearFrom(update.yearFrom);
        if ("yearTo" in update) setYearTo(update.yearTo);
      });
    },
    [],
  );

  const chartData = useMemo<ChartDataResponse>(() => {
    const geoFilter =
      geographies.length > 0
        ? geographies
        : Array.from(new Set(values.map((v) => v.geographyCode)));

    const bucket = new Map<
      string,
      Array<{ year: number; value: number; isForecast?: boolean }>
    >();
    for (const v of values) {
      if (!geoFilter.includes(v.geographyCode)) continue;
      if (yearFrom != null && v.year < yearFrom) continue;
      if (yearTo != null && v.year > yearTo) continue;
      const arr = bucket.get(v.geographyCode) ?? [];
      arr.push({ year: v.year, value: v.value, isForecast: v.isForecast });
      bucket.set(v.geographyCode, arr);
    }

    const series = Array.from(bucket.entries())
      .map(([code, points]) => ({
        geographyCode: code,
        geographyName: getGeography(code)?.name ?? code,
        points: points.sort((a, b) => a.year - b.year),
      }))
      .sort((a, b) => {
        const order: Record<string, number> = {
          SSM: 0,
          SUDBURY: 1,
          "THUNDER-BAY": 2,
          "NORTH-BAY": 3,
          TIMMINS: 4,
          KENORA: 5,
          "ELLIOT-LAKE": 6,
          "NORTHERN-ON": 10,
          ON: 11,
        };
        return (
          (order[a.geographyCode] ?? 50) - (order[b.geographyCode] ?? 50)
        );
      });

    return {
      indicator,
      series,
      filters: { geographies, yearFrom, yearTo },
      generatedAt: new Date().toISOString(),
    };
  }, [indicator, values, geographies, yearFrom, yearTo]);

  return (
    <>
      <div className="mt-8">
        <FilterBar
          value={{ geographies, yearFrom, yearTo }}
          availableYears={availableYears}
          onChange={onChange}
        />
      </div>
      <div className="mt-6">
        {chartData.series.length > 0 ? (
          <ChartPanel data={chartData} height={420} />
        ) : (
          <div className="rounded-lg border border-ink-200 bg-white p-10 text-center text-ink-600 shadow-elev-1">
            No data matches the current filters. Try adding a geography or
            widening the year range.
          </div>
        )}
      </div>
    </>
  );
}
