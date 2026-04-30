"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  AreaChart,
  BarChart3,
  Layers,
  LineChart,
  PieChart as PieIcon,
  CircleDot,
  Table,
} from "lucide-react";
import type { ChartDataResponse, ChartShape } from "@/types";
import { DownloadMenu } from "./download-menu";
import { SourceFooter } from "./source-footer";
import { cn } from "@/lib/utils";
import { formatUnit } from "@/lib/format";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[360px] items-center justify-center text-sm text-ink-500">
      Loading chart…
    </div>
  ),
});

type View =
  | "line"
  | "bar"
  | "area"
  | "stacked-bar"
  | "pie"
  | "donut"
  | "table";

const VIZ_COLORS = [
  "#164284",
  "#b45309",
  "#047857",
  "#6d28d9",
  "#0369a1",
  "#be123c",
  "#0f766e",
  "#c2410c",
];

const VIEW_META: Record<View, { label: string; icon: React.ElementType }> = {
  line: { label: "Line", icon: LineChart },
  bar: { label: "Bar", icon: BarChart3 },
  area: { label: "Area", icon: AreaChart },
  "stacked-bar": { label: "Stacked", icon: Layers },
  pie: { label: "Pie", icon: PieIcon },
  donut: { label: "Donut", icon: CircleDot },
  table: { label: "Table", icon: Table },
};

function viewsFor(shape: ChartShape, seriesCount: number): View[] {
  if (shape === "composition") {
    const v: View[] = ["pie", "donut", "bar"];
    if (seriesCount >= 2) v.push("stacked-bar");
    v.push("table");
    return v;
  }
  const v: View[] = ["line", "bar", "area"];
  if (seriesCount >= 2) v.push("stacked-bar");
  v.push("table");
  return v;
}

export function ChartPanel({
  data,
  height = 360,
  className,
}: {
  data: ChartDataResponse;
  height?: number;
  className?: string;
}) {
  const seriesCount =
    data.shape === "composition"
      ? data.composition?.length ?? 0
      : data.series?.length ?? 0;

  const allowed = useMemo(
    () => viewsFor(data.shape, seriesCount),
    [data.shape, seriesCount],
  );

  const [view, setView] = useState<View>(allowed[0]);

  if (!allowed.includes(view)) {
    setTimeout(() => setView(allowed[0]), 0);
  }

  const option = useMemo(
    () => buildOption(data, view, height),
    [data, view, height],
  );

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
          <ViewToggle views={allowed} view={view} onChange={setView} />
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
  views,
  view,
  onChange,
}: {
  views: View[];
  view: View;
  onChange: (v: View) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Chart view"
      className="inline-flex flex-wrap rounded-md border border-ink-200 bg-white p-0.5 shadow-elev-1"
    >
      {views.map((v) => {
        const meta = VIEW_META[v];
        const Icon = meta.icon;
        const active = view === v;
        return (
          <button
            key={v}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(v)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-[6px] px-2.5 text-xs font-medium transition-colors",
              active
                ? "bg-nordik-700 text-white"
                : "text-ink-600 hover:bg-ink-100",
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function TableView({ data }: { data: ChartDataResponse }) {
  if (data.shape === "composition" && data.composition) {
    const labels =
      data.indicator.compositionCategories ??
      Array.from(
        new Set(data.composition.flatMap((s) => s.parts.map((p) => p.label))),
      );
    return (
      <div className="overflow-x-auto px-3 pb-3">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 border-b border-ink-200 bg-white px-3 py-2 text-left font-medium text-ink-600">
                Geography
              </th>
              {labels.map((l) => (
                <th
                  key={l}
                  className="border-b border-ink-200 px-3 py-2 text-right font-medium text-ink-600"
                >
                  {l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.composition.map((s) => (
              <tr key={s.geographyCode} className="hover:bg-nordik-50/40">
                <td className="sticky left-0 z-10 border-b border-ink-100 bg-white px-3 py-2 font-medium text-ink-800">
                  {s.geographyName}
                </td>
                {labels.map((l) => {
                  const p = s.parts.find((pp) => pp.label === l);
                  return (
                    <td
                      key={l}
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

  const series = data.series ?? [];
  const years = Array.from(
    new Set(series.flatMap((s) => s.points.map((p) => p.year))),
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
          {series.map((s) => (
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

function buildOption(data: ChartDataResponse, view: View, _height: number) {
  const baseTextStyle = {
    fontFamily: "var(--font-inter), system-ui, sans-serif",
    color: "#475569",
  };
  const tooltipBase = {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    textStyle: { color: "#0f172a", fontSize: 12 },
    extraCssText: "box-shadow: 0 4px 16px rgba(15,23,42,0.12);",
  };

  if (data.shape === "composition" && data.composition) {
    const labels =
      data.indicator.compositionCategories ??
      Array.from(
        new Set(data.composition.flatMap((s) => s.parts.map((p) => p.label))),
      );

    if (view === "pie" || view === "donut") {
      const geos = data.composition;
      const cols = Math.min(geos.length, 3);
      const isDonut = view === "donut";
      return {
        color: VIZ_COLORS,
        textStyle: baseTextStyle,
        tooltip: {
          ...tooltipBase,
          trigger: "item",
          valueFormatter: (v: number) => formatUnit(v, data.indicator.unit),
        },
        legend: {
          orient: "horizontal",
          bottom: 4,
          textStyle: { color: "#475569", fontSize: 12 },
          icon: "circle",
          itemWidth: 8,
          itemHeight: 8,
          data: labels,
        },
        series: geos.map((g, i) => ({
          name: g.geographyName,
          type: "pie",
          radius: isDonut ? ["48%", "70%"] : "65%",
          center: [
            `${((i % cols) * 100) / cols + 100 / cols / 2}%`,
            geos.length > cols ? `${30 + Math.floor(i / cols) * 50}%` : "45%",
          ],
          avoidLabelOverlap: true,
          label: {
            show: !isDonut && geos.length === 1,
            formatter: "{b}: {d}%",
            fontSize: 11,
            color: "#475569",
          },
          labelLine: { show: !isDonut && geos.length === 1 },
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 2,
          },
          data: g.parts.map((p) => ({ name: p.label, value: p.value })),
          emphasis: {
            scale: true,
            scaleSize: 4,
            itemStyle: { shadowBlur: 12, shadowColor: "rgba(0,0,0,0.15)" },
          },
        })),
        title: geos.map((g, i) => ({
          text: g.geographyName,
          left:
            geos.length > 1
              ? `${((i % cols) * 100) / cols + 100 / cols / 2}%`
              : "center",
          top:
            geos.length > cols
              ? `${10 + Math.floor(i / cols) * 50}%`
              : geos.length > 1
                ? "5%"
                : undefined,
          textStyle: {
            fontSize: 12,
            fontWeight: 500,
            color: "#0f172a",
          },
          textAlign: "center",
        })),
      };
    }

    if (view === "stacked-bar") {
      return {
        color: VIZ_COLORS,
        textStyle: baseTextStyle,
        grid: { left: 56, right: 24, top: 40, bottom: 56, containLabel: false },
        tooltip: {
          ...tooltipBase,
          trigger: "axis",
          axisPointer: { type: "shadow" },
          valueFormatter: (v: number) => formatUnit(v, data.indicator.unit),
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
          data: data.composition.map((g) => g.geographyName),
          axisLine: { lineStyle: { color: "#cbd5e1" } },
          axisTick: { show: false },
          axisLabel: { color: "#64748b", fontSize: 11, interval: 0 },
        },
        yAxis: {
          type: "value",
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: "#f1f5f9" } },
          axisLabel: {
            color: "#64748b",
            fontSize: 11,
            formatter: (v: number) => `${v}%`,
          },
        },
        series: labels.map((label) => ({
          name: label,
          type: "bar",
          stack: "total",
          barMaxWidth: 36,
          data: data.composition!.map(
            (g) => g.parts.find((p) => p.label === label)?.value ?? 0,
          ),
          itemStyle: { borderRadius: 0 },
        })),
      };
    }

    return {
      color: VIZ_COLORS,
      textStyle: baseTextStyle,
      grid: { left: 56, right: 24, top: 40, bottom: 48, containLabel: false },
      tooltip: {
        ...tooltipBase,
        trigger: "axis",
        axisPointer: { type: "shadow" },
        valueFormatter: (v: number) => formatUnit(v, data.indicator.unit),
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
        data: labels,
        axisLine: { lineStyle: { color: "#cbd5e1" } },
        axisTick: { show: false },
        axisLabel: { color: "#64748b", fontSize: 11, interval: 0 },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: "#f1f5f9" } },
        axisLabel: {
          color: "#64748b",
          fontSize: 11,
          formatter: (v: number) => `${v}%`,
        },
      },
      series: data.composition.map((g) => ({
        name: g.geographyName,
        type: "bar",
        barMaxWidth: 22,
        data: labels.map(
          (label) => g.parts.find((p) => p.label === label)?.value ?? 0,
        ),
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      })),
    };
  }

  const series = data.series ?? [];
  const years = Array.from(
    new Set(series.flatMap((s) => s.points.map((p) => p.year))),
  ).sort((a, b) => a - b);

  const isStacked = view === "stacked-bar";
  const isArea = view === "area";
  const seriesType = view === "bar" || isStacked ? "bar" : "line";

  return {
    color: VIZ_COLORS,
    textStyle: baseTextStyle,
    grid: { left: 56, right: 24, top: 40, bottom: 48, containLabel: false },
    tooltip: {
      ...tooltipBase,
      trigger: "axis",
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
      boundaryGap: seriesType === "bar",
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
    series: series.map((s, i) => ({
      name: s.geographyName,
      type: seriesType,
      stack: isStacked ? "total" : undefined,
      smooth: seriesType === "line",
      showSymbol: seriesType === "line" ? s.points.length < 30 : false,
      symbolSize: 6,
      barMaxWidth: 28,
      data: years.map((y) => {
        const p = s.points.find((pp) => pp.year === y);
        return p?.value ?? null;
      }),
      lineStyle: { width: 2.25 },
      areaStyle: isArea
        ? {
            opacity: 0.18,
            color: VIZ_COLORS[i % VIZ_COLORS.length],
          }
        : undefined,
      itemStyle: { borderRadius: seriesType === "bar" ? [4, 4, 0, 0] : 0 },
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