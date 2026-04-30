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
import type { Indicator } from "@/types";
import { queryChartData } from "@/lib/query";

export function IndicatorView({
  indicator,
  availableYears,
}: {
  indicator: Indicator;
  availableYears: number[];
}) {
  const pathname = usePathname();
  const params = useSearchParams();

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

  useEffect(() => {
    const next = new URLSearchParams();
    if (
      geographies.length > 0 &&
      !(geographies.length === 1 && geographies[0] === "SSM")
    ) {
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

  const chartData = useMemo(
    () =>
      queryChartData({
        indicatorSlug: indicator.slug,
        geographies,
        yearFrom,
        yearTo,
      }),
    [indicator.slug, geographies, yearFrom, yearTo],
  );

  const isComposition = indicator.shape === "composition";

  const hasData =
    chartData &&
    ((chartData.shape === "timeseries" &&
      (chartData.series?.length ?? 0) > 0) ||
      (chartData.shape === "composition" &&
        (chartData.composition?.length ?? 0) > 0));

  return (
    <>
      <div className="mt-8">
        <FilterBar
          value={{ geographies, yearFrom, yearTo }}
          availableYears={availableYears}
          showYearRange={!isComposition}
          onChange={onChange}
        />
      </div>
      <div className="mt-6">
        {hasData ? (
          <ChartPanel data={chartData!} height={420} />
        ) : (
          <div className="rounded-lg border border-ink-200 bg-white p-10 text-center text-ink-600 shadow-elev-1">
            No data matches the current filters. Try adding a geography.
          </div>
        )}
      </div>
    </>
  );
}