"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { BarChart3, LineChart, Table } from "lucide-react";
import type { ChartDataResponse } from "@/types";
import { DownloadMenu } from "./download-menu";
import { SourceFooter } from "./source-footer";
import { cn } from "@/lib/utils";
import { formatUnit } from "@/lib/format";

// Dynamic import — ECharts is client-only, heavy
const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[360px] items-center justify-center text-sm text-ink-500">
      Loading chart…
    </div>
  ),
});

type View = "line" | "bar" | "table";

// Consistent viz palette — aligned to --viz-* variables in globals.css
const VIZ_COLORS = [
  "#164284", // nordik-700
  "#b45309", // amber-700
  "#047857", // emerald-700
  "#6d28d9", // violet-700
  "#0369a1", // sky-700
  "#be123c", // rose-700
  "#0f766e", // teal-700
  "#c2410c", // orange-700
];

export function ChartPanel({
  data,
  defaultView = "line",
  height = 360,
  className,
}: {
  data: ChartDataResponse;
  defaultView?: View;
  height?: number;
  className?: string;
}) {
  const [view, setView] = useState<View>(defaultView);

  const option = useMemo(() => buildEChartsOption(data, view, height), [
    data,
    view,
    height,
  ]);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-lg border border-ink-200 bg-white shadow-elev-1",
        className,
      )}
      aria-labelledby={`chart-${data.indicator.slug}`}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-ink-100 px-5 py-4">
        <div>
          <h3
            id={`chart-${data.indicator.slug}`}
            className="font-display text-lg font-semibold tracking-tight text-ink-900"
          >
            {data.indicator.name}
          </h3>
          <p className="mt-0.5 text-sm text-ink-600">
            {data.indicator.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle view={view} onChange={setView} />
          <DownloadMenu data={data} />
        </div>
      </header>

      <div className="px-2 pt-3 pb-1 echarts-override">
        {view === "table" ? (
          <TableView data={data} />
        ) : (
          <ReactECharts
            option={option}
            style={{ height }}
            notMerge
            lazyUpdate
            opts={{ renderer: "svg" }}
          />
        )}
      </div>

      <SourceFooter indicator={data.indicator} />
    </section>
  );
}

function ViewToggle({
  view,
  onChange,
}: {
  view: View;
  onChange: (v: View) => void;
}) {
  const items: Array<{ value: View; icon: React.ElementType; label: string }> =
    [
      { value: "line", icon: LineChart, label: "Line" },
      { value: "bar", icon: BarChart3, label: "Bar" },
      { value: "table", icon: Table, label: "Table" },
    ];
  return (
    <div
      role="tablist"
      aria-label="Chart view"
      className="inline-flex rounded-md border border-ink-200 bg-white p-0.5 shadow-elev-1"
    >
      {items.map((item) => {
        const active = view === item.value;
        const Icon = item.icon;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-[6px] px-2.5 text-xs font-medium transition-colors",
              active
                ? "bg-nordik-700 text-white"
                : "text-ink-600 hover:bg-ink-100",
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function TableView({ data }: { data: ChartDataResponse }) {
  const years = Array.from(
    new Set(
      data.series.flatMap((s) => s.points.map((p) => p.year)),
    ),
  ).sort((a, b) => a - b);

  return (
    <div className="overflow-x-auto px-3 pb-3">
      <table className="min-w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 border-b border-ink-200 bg-white px-3 py-2 text-left font-medium text-ink-600">
              Geography
            </th>
            {years.map((y) => (
              <th
                key={y}
                className="border-b border-ink-200 px-3 py-2 text-right font-medium text-ink-600"
              >
                {y}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.series.map((s) => (
            <tr key={s.geographyCode} className="hover:bg-nordik-50/40">
              <td className="sticky left-0 z-10 border-b border-ink-100 bg-white px-3 py-2 font-medium text-ink-800">
                {s.geographyName}
              </td>
              {years.map((y) => {
                const p = s.points.find((pp) => pp.year === y);
                return (
                  <td
                    key={y}
                    className="border-b border-ink-100 px-3 py-2 text-right font-mono tabular-nums text-ink-700"
                  >
                    {p?.value != null
                      ? formatUnit(p.value, data.indicator.unit)
                      : "—"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function buildEChartsOption(
  data: ChartDataResponse,
  view: View,
  _height: number,
) {
  const years = Array.from(
    new Set(data.series.flatMap((s) => s.points.map((p) => p.year))),
  ).sort((a, b) => a - b);

  return {
    color: VIZ_COLORS,
    textStyle: {
      fontFamily: "var(--font-inter), system-ui, sans-serif",
      color: "#475569",
    },
    grid: { left: 56, right: 24, top: 40, bottom: 48, containLabel: false },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#ffffff",
      borderColor: "#e2e8f0",
      borderWidth: 1,
      textStyle: { color: "#0f172a", fontSize: 12 },
      extraCssText: "box-shadow: 0 4px 16px rgba(15,23,42,0.12);",
      valueFormatter: (v: number) =>
        v == null ? "—" : formatUnit(v, data.indicator.unit),
    },
    legend: {
      top: 0,
      left: 0,
      textStyle: { color: "#475569", fontSize: 12 },
      icon: "roundRect",
      itemWidth: 10,
      itemHeight: 10,
    },
    xAxis: {
      type: "category",
      data: years.map(String),
      axisLine: { lineStyle: { color: "#cbd5e1" } },
      axisTick: { show: false },
      axisLabel: { color: "#64748b", fontSize: 11 },
      boundaryGap: view === "bar",
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#f1f5f9" } },
      axisLabel: {
        color: "#64748b",
        fontSize: 11,
        formatter: (v: number) => compactAxis(v, data.indicator.unit),
      },
    },
    series: data.series.map((s) => ({
      name: s.geographyName,
      type: view === "bar" ? "bar" : "line",
      smooth: view === "line",
      showSymbol: view === "line" ? s.points.length < 30 : false,
      symbolSize: 6,
      barMaxWidth: 28,
      data: years.map((y) => {
        const p = s.points.find((pp) => pp.year === y);
        return p?.value ?? null;
      }),
      lineStyle: { width: 2.25 },
      itemStyle: { borderRadius: view === "bar" ? [4, 4, 0, 0] : 0 },
    })),
    animationDuration: 400,
  };
}

function compactAxis(v: number, unit: string): string {
  if (unit === "%") return `${v.toFixed(0)}%`;
  if (unit === "CAD") {
    if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
    return `$${v}`;
  }
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(0)}k`;
  return `${v}`;
}
