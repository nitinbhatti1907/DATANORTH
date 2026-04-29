import { INDICATOR_VALUES } from "@/lib/data/values";
import { getIndicator } from "@/lib/data/indicators";
import { getGeography } from "@/lib/data/geographies";
import type { ChartDataResponse } from "@/types";

export function queryChartData(params: {
  indicatorSlug: string;
  geographies?: string[];
  yearFrom?: number;
  yearTo?: number;
}): ChartDataResponse | null {
  const indicator = getIndicator(params.indicatorSlug);
  if (!indicator) return null;

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
    // Put the "big" reference geographies last so smaller communities show clearly
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
    filters: {
      geographies: params.geographies ?? [],
      yearFrom: params.yearFrom,
      yearTo: params.yearTo,
    },
    generatedAt: new Date().toISOString(),
  };
}

export function getAvailableYears(indicatorSlug: string): number[] {
  const years = new Set<number>();
  for (const v of INDICATOR_VALUES) {
    if (v.indicatorSlug === indicatorSlug) years.add(v.year);
  }
  return Array.from(years).sort((a, b) => a - b);
}

export function getLatestValue(
  indicatorSlug: string,
  geographyCode: string,
): { value: number; year: number; previous?: number } | null {
  const vals = INDICATOR_VALUES.filter(
    (v) => v.indicatorSlug === indicatorSlug && v.geographyCode === geographyCode,
  ).sort((a, b) => b.year - a.year);
  if (vals.length === 0) return null;
  return {
    value: vals[0].value,
    year: vals[0].year,
    previous: vals[1]?.value,
  };
}
