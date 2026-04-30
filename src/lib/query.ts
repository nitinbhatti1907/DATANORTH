import { INDICATOR_VALUES, COMPOSITION_VALUES } from "@/lib/data/values";
import { getIndicator } from "@/lib/data/indicators";
import { getGeography } from "@/lib/data/geographies";
import type { ChartDataResponse, CompositionSeries, ChartShape } from "@/types";

const ORDER: Record<string, number> = {
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

export function queryChartData(params: {
  indicatorSlug: string;
  geographies?: string[];
  yearFrom?: number;
  yearTo?: number;
}): ChartDataResponse | null {
  const indicator = getIndicator(params.indicatorSlug);
  if (!indicator) return null;
  const shape: ChartShape = indicator.shape ?? "timeseries";

  if (shape === "composition") {
    const rows = COMPOSITION_VALUES.filter(
      (v) => v.indicatorSlug === params.indicatorSlug,
    );
    const allGeos = Array.from(new Set(rows.map((v) => v.geographyCode)));
    const geoFilter = params.geographies?.length ? params.geographies : allGeos;

    const byGeo = new Map<
      string,
      { year: number; parts: Array<{ label: string; value: number }> }
    >();
    for (const r of rows) {
      if (!geoFilter.includes(r.geographyCode)) continue;
      const entry = byGeo.get(r.geographyCode) ?? { year: r.year, parts: [] };
      entry.parts.push({ label: r.label, value: r.value });
      byGeo.set(r.geographyCode, entry);
    }

    const composition: CompositionSeries[] = Array.from(byGeo.entries())
      .map(([code, { year, parts }]) => ({
        geographyCode: code,
        geographyName: getGeography(code)?.name ?? code,
        year,
        parts: indicator.compositionCategories
          ? indicator.compositionCategories.map(
              (label) =>
                parts.find((p) => p.label === label) ?? { label, value: 0 },
            )
          : parts,
      }))
      .sort(
        (a, b) =>
          (ORDER[a.geographyCode] ?? 50) - (ORDER[b.geographyCode] ?? 50),
      );

    return {
      indicator,
      shape,
      composition,
      filters: {
        geographies: params.geographies ?? [],
        yearFrom: params.yearFrom,
        yearTo: params.yearTo,
      },
      generatedAt: new Date().toISOString(),
    };
  }

  const rawValues = INDICATOR_VALUES.filter(
    (v) => v.indicatorSlug === params.indicatorSlug,
  );
  const allGeos = Array.from(new Set(rawValues.map((v) => v.geographyCode)));
  const geoFilter = params.geographies?.length ? params.geographies : allGeos;

  const seriesByGeo = new Map<
    string,
    Array<{ year: number; value: number; isForecast?: boolean }>
  >();
  for (const v of rawValues) {
    if (!geoFilter.includes(v.geographyCode)) continue;
    if (params.yearFrom != null && v.year < params.yearFrom) continue;
    if (params.yearTo != null && v.year > params.yearTo) continue;
    const arr = seriesByGeo.get(v.geographyCode) ?? [];
    arr.push({ year: v.year, value: v.value, isForecast: v.isForecast });
    seriesByGeo.set(v.geographyCode, arr);
  }

  const series = Array.from(seriesByGeo.entries())
    .map(([code, points]) => ({
      geographyCode: code,
      geographyName: getGeography(code)?.name ?? code,
      points: points.sort((a, b) => a.year - b.year),
    }))
    .sort(
      (a, b) =>
        (ORDER[a.geographyCode] ?? 50) - (ORDER[b.geographyCode] ?? 50),
    );

  return {
    indicator,
    shape,
    series,
    filters: {
      geographies: params.geographies ?? [],
      yearFrom: params.yearFrom,
      yearTo: params.yearTo,
    },
    generatedAt: new Date().toISOString(),
  };
}

export function getAvailableYears(indicatorSlug: string): number[] {
  const indicator = getIndicator(indicatorSlug);
  const shape = indicator?.shape ?? "timeseries";
  const years = new Set<number>();
  if (shape === "composition") {
    for (const v of COMPOSITION_VALUES) {
      if (v.indicatorSlug === indicatorSlug) years.add(v.year);
    }
  } else {
    for (const v of INDICATOR_VALUES) {
      if (v.indicatorSlug === indicatorSlug) years.add(v.year);
    }
  }
  return Array.from(years).sort((a, b) => a - b);
}

export function getLatestValue(
  indicatorSlug: string,
  geographyCode: string,
): { value: number; year: number; previous?: number } | null {
  const indicator = getIndicator(indicatorSlug);
  const shape = indicator?.shape ?? "timeseries";
  if (shape === "composition") {
    const rows = COMPOSITION_VALUES.filter(
      (v) =>
        v.indicatorSlug === indicatorSlug &&
        v.geographyCode === geographyCode,
    );
    if (rows.length === 0) return null;
    const top = [...rows].sort((a, b) => b.value - a.value)[0];
    return { value: top.value, year: top.year };
  }
  const vals = INDICATOR_VALUES.filter(
    (v) =>
      v.indicatorSlug === indicatorSlug && v.geographyCode === geographyCode,
  ).sort((a, b) => b.year - a.year);
  if (vals.length === 0) return null;
  return {
    value: vals[0].value,
    year: vals[0].year,
    previous: vals[1]?.value,
  };
}