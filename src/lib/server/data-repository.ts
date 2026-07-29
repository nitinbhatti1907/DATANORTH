import { and, asc, desc, eq, gte, inArray, lte } from "drizzle-orm";
import { getDb, hasDatabaseConfig } from "@/db/client";
import {
  dataUploads,
  geographies as dbGeographies,
  indicators as dbIndicators,
  indicatorValues,
} from "@/db/schema";
import { GEOGRAPHIES } from "@/lib/data/geographies";
import { INDICATORS, getIndicator } from "@/lib/data/indicators";
import { queryChartData as queryStaticChartData } from "@/lib/query";
import {
  DEFAULT_LOCALE,
  translateGeography,
  translateIndicator,
  translateIndicators,
  translateLicense,
  type Locale,
} from "@/lib/i18n";
import type {
  ChartDataResponse,
  ChartShape,
  CompositionSeries,
  Geography,
  Indicator,
  IndicatorValue,
} from "@/types";

type IndicatorRow = typeof dbIndicators.$inferSelect;
type GeographyRow = typeof dbGeographies.$inferSelect;
type ValueRow = typeof indicatorValues.$inferSelect;

const GEOGRAPHY_ORDER: Record<string, number> = {
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

function localized(primary: string, fallback: string | null | undefined, locale: Locale) {
  return locale === "fr" && fallback ? fallback : primary;
}

function toIndicator(
  row: IndicatorRow,
  locale: Locale = DEFAULT_LOCALE,
): Indicator {
  return {
    slug: row.slug,
    name: localized(row.nameEn, row.nameFr, locale),
    category: row.category as Indicator["category"],
    description: localized(row.descriptionEn, row.descriptionFr, locale),
    unit: row.unit as Indicator["unit"],
    higherIsBetter: row.higherIsBetter,
    source: localized(row.sourceEn, row.sourceFr, locale),
    sourceUrl: row.sourceUrl,
    methodology: localized(row.methodologyEn, row.methodologyFr, locale),
    license: translateLicense(row.license, locale),
    updateFrequency: row.updateFrequency as Indicator["updateFrequency"],
    lastUpdated: row.lastUpdated,
    featured: row.featured,
    isSample: row.isSample,
    shape: row.shape as ChartShape,
    compositionCategories: row.compositionCategories ?? undefined,
  };
}

function toGeography(
  row: GeographyRow,
  locale: Locale = DEFAULT_LOCALE,
): Geography {
  return {
    code: row.code,
    name: localized(row.nameEn, row.nameFr, locale),
    type: row.type as Geography["type"],
    parentCode: row.parentCode ?? undefined,
    population: row.population ?? undefined,
  };
}

function numberOrUndefined(value: string | null) {
  return value == null ? undefined : Number(value);
}

function currentValue(row: ValueRow): IndicatorValue {
  return {
    indicatorSlug: row.indicatorSlug,
    geographyCode: row.geographyCode,
    year: row.year,
    quarter: row.quarter ?? undefined,
    month: row.month ?? undefined,
    value: Number(row.value),
    confidenceLow: numberOrUndefined(row.confidenceLow),
    confidenceHigh: numberOrUndefined(row.confidenceHigh),
    isForecast: row.isForecast,
    modelId: row.modelId ?? undefined,
  };
}

export async function getIndicatorsRepository(
  locale: Locale = DEFAULT_LOCALE,
): Promise<Indicator[]> {
  if (!hasDatabaseConfig()) return translateIndicators(INDICATORS, locale);
  const rows = await getDb()
    .select()
    .from(dbIndicators)
    .orderBy(asc(dbIndicators.category), asc(dbIndicators.slug));
  return rows.map((row) => toIndicator(row, locale));
}

export async function getGeographiesRepository(
  locale: Locale = DEFAULT_LOCALE,
): Promise<Geography[]> {
  if (!hasDatabaseConfig()) {
    return GEOGRAPHIES.map((geography) => translateGeography(geography, locale));
  }
  const rows = await getDb()
    .select()
    .from(dbGeographies)
    .orderBy(asc(dbGeographies.code));
  return rows.map((row) => translateGeography(toGeography(row, locale), locale));
}

export async function queryChartDataRepository(params: {
  indicatorSlug: string;
  geographies?: string[];
  yearFrom?: number;
  yearTo?: number;
  locale?: Locale;
}): Promise<ChartDataResponse | null> {
  if (!hasDatabaseConfig()) return queryStaticChartData(params);
  const locale = params.locale ?? DEFAULT_LOCALE;

  const db = getDb();
  const [indicatorRow] = await db
    .select()
    .from(dbIndicators)
    .where(eq(dbIndicators.slug, params.indicatorSlug))
    .limit(1);

  if (!indicatorRow) return null;

  const indicator = translateIndicator(toIndicator(indicatorRow, locale), locale);
  const shape = indicator.shape ?? "timeseries";
  const conditions = [
    eq(indicatorValues.indicatorSlug, params.indicatorSlug),
    eq(indicatorValues.isCurrent, true),
  ];

  if (params.geographies?.length) {
    conditions.push(inArray(indicatorValues.geographyCode, params.geographies));
  }

  if (shape !== "composition") {
    if (params.yearFrom != null) {
      conditions.push(gte(indicatorValues.year, params.yearFrom));
    }
    if (params.yearTo != null) {
      conditions.push(lte(indicatorValues.year, params.yearTo));
    }
  }

  const rows = await db
    .select()
    .from(indicatorValues)
    .where(and(...conditions))
    .orderBy(asc(indicatorValues.geographyCode), asc(indicatorValues.year));

  const geographies = await getGeographiesRepository(locale);
  const geographyNames = new Map(geographies.map((g) => [g.code, g.name]));

  if (shape === "composition") {
    const grouped = new Map<
      string,
      { year: number; parts: Array<{ label: string; value: number }> }
    >();

    for (const row of rows) {
      const label = row.label ?? "Value";
      const existing = grouped.get(row.geographyCode);
      const entry =
        !existing || row.year > existing.year
          ? { year: row.year, parts: [] }
          : existing;
      if (row.year === entry.year) {
        entry.parts.push({ label, value: Number(row.value) });
      }
      grouped.set(row.geographyCode, entry);
    }

    const composition: CompositionSeries[] = Array.from(grouped.entries())
      .map(([code, entry]) => ({
        geographyCode: code,
        geographyName: geographyNames.get(code) ?? code,
        year: entry.year,
        parts: indicator.compositionCategories
          ? indicator.compositionCategories.map(
              (label) =>
                entry.parts.find((part) => part.label === label) ?? {
                  label,
                  value: 0,
                },
            )
          : entry.parts,
      }))
      .sort(
        (a, b) =>
          (GEOGRAPHY_ORDER[a.geographyCode] ?? 50) -
          (GEOGRAPHY_ORDER[b.geographyCode] ?? 50),
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

  const grouped = new Map<string, IndicatorValue[]>();
  for (const row of rows) {
    const values = grouped.get(row.geographyCode) ?? [];
    values.push(currentValue(row));
    grouped.set(row.geographyCode, values);
  }

  const series = Array.from(grouped.entries())
    .map(([code, values]) => ({
      geographyCode: code,
      geographyName: geographyNames.get(code) ?? code,
      points: values
        .sort((a, b) => a.year - b.year)
        .map((value) => ({
          year: value.year,
          value: value.value,
          confidenceLow: value.confidenceLow,
          confidenceHigh: value.confidenceHigh,
          isForecast: value.isForecast,
        })),
    }))
    .sort(
      (a, b) =>
        (GEOGRAPHY_ORDER[a.geographyCode] ?? 50) -
        (GEOGRAPHY_ORDER[b.geographyCode] ?? 50),
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

export async function getAvailableYearsRepository(indicatorSlug: string) {
  if (!hasDatabaseConfig()) {
    const { getAvailableYears } = await import("@/lib/query");
    return getAvailableYears(indicatorSlug);
  }

  const rows = await getDb()
    .select({ year: indicatorValues.year })
    .from(indicatorValues)
    .where(
      and(
        eq(indicatorValues.indicatorSlug, indicatorSlug),
        eq(indicatorValues.isCurrent, true),
      ),
    )
    .orderBy(asc(indicatorValues.year));

  return Array.from(new Set(rows.map((row) => row.year)));
}

export async function getLatestValueRepository(
  indicatorSlug: string,
  geographyCode: string,
) {
  if (!hasDatabaseConfig()) {
    const { getLatestValue } = await import("@/lib/query");
    return getLatestValue(indicatorSlug, geographyCode);
  }

  const indicator = getIndicator(indicatorSlug);
  const rows = await getDb()
    .select()
    .from(indicatorValues)
    .where(
      and(
        eq(indicatorValues.indicatorSlug, indicatorSlug),
        eq(indicatorValues.geographyCode, geographyCode),
        eq(indicatorValues.isCurrent, true),
      ),
    )
    .orderBy(desc(indicatorValues.year));

  if (!rows.length) return null;
  if (indicator?.shape === "composition") {
    const top = [...rows].sort((a, b) => Number(b.value) - Number(a.value))[0];
    return { value: Number(top.value), year: top.year };
  }

  return {
    value: Number(rows[0].value),
    year: rows[0].year,
    previous: rows[1] ? Number(rows[1].value) : undefined,
  };
}

export async function getUploadHistoryRepository(limit = 50) {
  if (!hasDatabaseConfig()) return [];
  return getDb()
    .select()
    .from(dataUploads)
    .orderBy(desc(dataUploads.createdAt))
    .limit(limit);
}
