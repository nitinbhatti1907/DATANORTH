import type { IndicatorValue, CompositionValue } from "@/types";

type Seed = {
  indicatorSlug: string;
  geographyCode: string;
  base: number;
  trend: number;
  noise: number;
  yearStart?: number;
  yearEnd?: number;
};

const COMMUNITIES = [
  "SSM",
  "SUDBURY",
  "THUNDER-BAY",
  "NORTH-BAY",
  "TIMMINS",
  "KENORA",
  "NORTHERN-ON",
];

function spread(
  slug: string,
  base: number,
  trend: number,
  noise: number,
  factors: Partial<Record<string, { b?: number; t?: number; n?: number }>> = {},
  opts: { yearStart?: number; yearEnd?: number; includeOntario?: boolean } = {},
): Seed[] {
  const list: Seed[] = [];
  for (const code of COMMUNITIES) {
    const f = factors[code] ?? {};
    list.push({
      indicatorSlug: slug,
      geographyCode: code,
      base: base * (f.b ?? 1),
      trend: trend * (f.t ?? 1),
      noise: noise * (f.n ?? 1),
      yearStart: opts.yearStart,
      yearEnd: opts.yearEnd,
    });
  }
  if (opts.includeOntario) {
    list.push({
      indicatorSlug: slug,
      geographyCode: "ON",
      base: base * 1.05,
      trend: trend * 1.05,
      noise: noise * 0.6,
      yearStart: opts.yearStart,
      yearEnd: opts.yearEnd,
    });
  }
  return list;
}

const SEEDS: Seed[] = [
  ...spread("total-population", 75000, 180, 300, {
    SUDBURY: { b: 2.16, t: 2.2 },
    "THUNDER-BAY": { b: 1.44, t: 0.5, n: 1.3 },
    "NORTH-BAY": { b: 0.69, t: 0.33 },
    TIMMINS: { b: 0.56, t: -0.55 },
    KENORA: { b: 0.2, t: -0.14 },
    "NORTHERN-ON": { b: 10.4, t: 6.7 },
  }),
  ...spread("median-age", 45.1, 0.08, 0.1, {
    SUDBURY: { b: 0.95 },
    "THUNDER-BAY": { b: 0.97 },
    "NORTH-BAY": { b: 0.98, t: 1.1 },
    TIMMINS: { b: 0.93, t: 1.1 },
    KENORA: { b: 0.96 },
    "NORTHERN-ON": { b: 0.96 },
  }),
  ...spread("population-growth-rate", 0.6, 0.05, 0.4, {
    SUDBURY: { b: 1.3 },
    "THUNDER-BAY": { b: 0.4 },
    TIMMINS: { b: -0.5 },
    KENORA: { b: -0.3 },
    "NORTHERN-ON": { b: 0.8 },
  }),
  ...spread("household-size", 2.3, 0.005, 0.05, {
    SUDBURY: { b: 1.04 },
    "THUNDER-BAY": { b: 1.0 },
    TIMMINS: { b: 1.06 },
    KENORA: { b: 1.02 },
    "NORTHERN-ON": { b: 1.02 },
  }),
  ...spread(
    "median-household-income",
    66000,
    1800,
    900,
    {
      SUDBURY: { b: 1.11 },
      "THUNDER-BAY": { b: 1.08 },
      "NORTH-BAY": { b: 0.98 },
      TIMMINS: { b: 1.03 },
      KENORA: { b: 0.94 },
      "NORTHERN-ON": { b: 1.03 },
    },
    { includeOntario: true },
  ),
  ...spread("business-count", 2100, 18, 25, {
    SUDBURY: { b: 2.14, t: 1.95 },
    "THUNDER-BAY": { b: 1.48, t: 0.55 },
    "NORTH-BAY": { b: 0.69, t: 0.45 },
    TIMMINS: { b: 0.52 },
    KENORA: { b: 0.28 },
    "NORTHERN-ON": { b: 10.5, t: 6.7 },
  }),
  ...spread("low-income-rate", 13.5, -0.15, 0.3, {
    SUDBURY: { b: 0.85 },
    "THUNDER-BAY": { b: 1.05 },
    "NORTH-BAY": { b: 1.02 },
    TIMMINS: { b: 1.0 },
    KENORA: { b: 1.18 },
    "NORTHERN-ON": { b: 1.0 },
  }),
  ...spread(
    "gdp-per-capita",
    52000,
    1600,
    1200,
    {
      SUDBURY: { b: 1.18 },
      "THUNDER-BAY": { b: 1.1 },
      "NORTH-BAY": { b: 0.96 },
      TIMMINS: { b: 1.22 },
      KENORA: { b: 0.85 },
      "NORTHERN-ON": { b: 1.05 },
    },
    { includeOntario: true },
  ),
  ...spread(
    "unemployment-rate",
    8.2,
    -0.08,
    0.6,
    {
      SUDBURY: { b: 0.87 },
      "THUNDER-BAY": { b: 0.84 },
      "NORTH-BAY": { b: 0.9 },
      TIMMINS: { b: 0.76 },
      KENORA: { b: 0.95 },
      "NORTHERN-ON": { b: 0.88 },
    },
    { includeOntario: true },
  ),
  ...spread(
    "employment-rate",
    54.5,
    0.12,
    0.5,
    {
      SUDBURY: { b: 1.08 },
      "THUNDER-BAY": { b: 1.06 },
      "NORTH-BAY": { b: 1.02 },
      TIMMINS: { b: 1.04 },
      KENORA: { b: 0.95 },
      "NORTHERN-ON": { b: 1.04 },
    },
    { includeOntario: true },
  ),
  ...spread(
    "labour-force-participation",
    60.5,
    0.1,
    0.5,
    {
      SUDBURY: { b: 1.05 },
      "THUNDER-BAY": { b: 1.04 },
      TIMMINS: { b: 1.04 },
      KENORA: { b: 0.97 },
      "NORTHERN-ON": { b: 1.03 },
    },
    { includeOntario: true },
  ),
  ...spread(
    "average-weekly-earnings",
    1100,
    32,
    18,
    {
      SUDBURY: { b: 1.09 },
      "THUNDER-BAY": { b: 1.05 },
      "NORTH-BAY": { b: 0.98 },
      TIMMINS: { b: 1.12 },
      KENORA: { b: 0.92 },
      "NORTHERN-ON": { b: 1.04 },
    },
    { includeOntario: true },
  ),
  ...spread("average-home-price", 180000, 22000, 6000, {
    SUDBURY: { b: 1.33 },
    "THUNDER-BAY": { b: 1.17 },
    "NORTH-BAY": { b: 1.22 },
    TIMMINS: { b: 1.05 },
    KENORA: { b: 1.0 },
    "NORTHERN-ON": { b: 1.17 },
  }),
  ...spread(
    "housing-starts",
    110,
    -3,
    25,
    {
      SUDBURY: { b: 2.36, t: -1.3 },
      "THUNDER-BAY": { b: 1.45, t: -0.7 },
      "NORTH-BAY": { b: 0.78 },
      TIMMINS: { b: 0.45 },
      KENORA: { b: 0.27 },
      "NORTHERN-ON": { b: 5.5 },
    },
    { yearStart: 2015 },
  ),
  ...spread("rental-vacancy-rate", 3.5, 0.08, 0.5, {
    SUDBURY: { b: 0.85 },
    "THUNDER-BAY": { b: 0.95 },
    "NORTH-BAY": { b: 0.9 },
    TIMMINS: { b: 1.05 },
    KENORA: { b: 1.2 },
    "NORTHERN-ON": { b: 1.0 },
  }),
  ...spread("average-monthly-rent", 1100, 75, 30, {
    SUDBURY: { b: 1.18 },
    "THUNDER-BAY": { b: 1.1 },
    "NORTH-BAY": { b: 1.13 },
    TIMMINS: { b: 1.0 },
    KENORA: { b: 0.95 },
    "NORTHERN-ON": { b: 1.08 },
  }),
  ...spread("core-housing-need", 11.5, -0.05, 0.4, {
    SUDBURY: { b: 0.92 },
    "THUNDER-BAY": { b: 1.04 },
    "NORTH-BAY": { b: 1.0 },
    TIMMINS: { b: 0.96 },
    KENORA: { b: 1.18 },
    "NORTHERN-ON": { b: 1.0 },
  }),
  ...spread("ed-wait-time-average", 2.3, 0.02, 0.3, {
    SUDBURY: { b: 0.82 },
    "THUNDER-BAY": { b: 0.95 },
    "NORTH-BAY": { b: 0.88 },
    TIMMINS: { b: 1.04 },
    KENORA: { b: 1.18 },
    "NORTHERN-ON": { b: 1.0 },
  }),
  ...spread(
    "life-expectancy",
    80.4,
    0.08,
    0.15,
    {
      SUDBURY: { b: 1.005 },
      "THUNDER-BAY": { b: 0.995 },
      "NORTH-BAY": { b: 1.002 },
      TIMMINS: { b: 0.998 },
      KENORA: { b: 0.99 },
      "NORTHERN-ON": { b: 1.0 },
    },
    { includeOntario: true },
  ),
  ...spread(
    "self-rated-health",
    58,
    0.05,
    0.6,
    {
      SUDBURY: { b: 1.03 },
      "THUNDER-BAY": { b: 1.0 },
      "NORTH-BAY": { b: 1.02 },
      TIMMINS: { b: 0.98 },
      KENORA: { b: 0.95 },
      "NORTHERN-ON": { b: 1.0 },
    },
    { includeOntario: true },
  ),
  ...spread("physician-supply", 9.5, 0.12, 0.3, {
    SUDBURY: { b: 1.18 },
    "THUNDER-BAY": { b: 1.1 },
    "NORTH-BAY": { b: 1.05 },
    TIMMINS: { b: 0.92 },
    KENORA: { b: 0.85 },
    "NORTHERN-ON": { b: 1.0 },
  }),
  ...spread(
    "mental-health-rating",
    66,
    -0.2,
    0.7,
    {
      SUDBURY: { b: 1.02 },
      "THUNDER-BAY": { b: 0.99 },
      "NORTH-BAY": { b: 1.0 },
      TIMMINS: { b: 0.97 },
      KENORA: { b: 0.94 },
      "NORTHERN-ON": { b: 1.0 },
    },
    { includeOntario: true },
  ),
  ...spread(
    "post-secondary-attainment",
    58.5,
    0.5,
    0.4,
    {
      SUDBURY: { b: 1.06 },
      "THUNDER-BAY": { b: 1.05 },
      "NORTH-BAY": { b: 1.02 },
      TIMMINS: { b: 0.98 },
      KENORA: { b: 0.94 },
      "NORTHERN-ON": { b: 1.03 },
    },
    { includeOntario: true },
  ),
  ...spread(
    "high-school-completion",
    82,
    0.3,
    0.4,
    {
      SUDBURY: { b: 1.04 },
      "THUNDER-BAY": { b: 1.03 },
      "NORTH-BAY": { b: 1.02 },
      TIMMINS: { b: 0.99 },
      KENORA: { b: 0.97 },
      "NORTHERN-ON": { b: 1.02 },
    },
    { includeOntario: true },
  ),
  ...spread(
    "university-degree-rate",
    19,
    0.4,
    0.3,
    {
      SUDBURY: { b: 1.18 },
      "THUNDER-BAY": { b: 1.15 },
      "NORTH-BAY": { b: 1.05 },
      TIMMINS: { b: 0.85 },
      KENORA: { b: 0.78 },
      "NORTHERN-ON": { b: 1.05 },
    },
    { includeOntario: true },
  ),
  ...spread(
    "youth-not-in-education-employment",
    11.5,
    -0.1,
    0.6,
    {
      SUDBURY: { b: 0.88 },
      "THUNDER-BAY": { b: 0.96 },
      "NORTH-BAY": { b: 0.95 },
      TIMMINS: { b: 1.04 },
      KENORA: { b: 1.18 },
      "NORTHERN-ON": { b: 1.0 },
    },
    { includeOntario: true },
  ),
  ...spread("annual-mean-temperature", 4.2, 0.05, 0.6, {
    SUDBURY: { b: 0.88 },
    "THUNDER-BAY": { b: 0.67 },
    "NORTH-BAY": { b: 0.79 },
    TIMMINS: { b: 0.45 },
    KENORA: { b: 0.55 },
    "NORTHERN-ON": { b: 0.81 },
  }),
  ...spread("annual-precipitation", 870, 1.5, 50, {
    SUDBURY: { b: 0.94 },
    "THUNDER-BAY": { b: 0.81 },
    "NORTH-BAY": { b: 1.05 },
    TIMMINS: { b: 0.95 },
    KENORA: { b: 0.79 },
    "NORTHERN-ON": { b: 0.92 },
  }),
  ...spread("extreme-heat-days", 6, 0.25, 2, {
    SUDBURY: { b: 1.16 },
    "THUNDER-BAY": { b: 0.83 },
    "NORTH-BAY": { b: 1.0 },
    TIMMINS: { b: 1.16 },
    KENORA: { b: 1.5 },
    "NORTHERN-ON": { b: 1.0 },
  }),
  ...spread("ghg-emissions-per-capita", 14.5, -0.15, 0.4, {
    SUDBURY: { b: 1.02 },
    "THUNDER-BAY": { b: 0.96 },
    "NORTH-BAY": { b: 0.93 },
    TIMMINS: { b: 1.18 },
    KENORA: { b: 1.04 },
    "NORTHERN-ON": { b: 1.0 },
  }),
  ...spread(
    "renewable-electricity-share",
    62,
    1.6,
    1.5,
    {
      SUDBURY: { b: 1.0 },
      "THUNDER-BAY": { b: 1.05 },
      "NORTH-BAY": { b: 0.97 },
      TIMMINS: { b: 1.02 },
      KENORA: { b: 1.06 },
      "NORTHERN-ON": { b: 1.02 },
    },
    { includeOntario: true },
  ),
  ...spread(
    "immigrant-population",
    5.4,
    0.15,
    0.1,
    {
      SUDBURY: { b: 1.28 },
      "THUNDER-BAY": { b: 1.87 },
      "NORTH-BAY": { b: 1.0 },
      TIMMINS: { b: 0.74 },
      KENORA: { b: 0.69 },
      "NORTHERN-ON": { b: 1.3 },
    },
    { includeOntario: true },
  ),
  ...spread(
    "recent-immigrants",
    1.1,
    0.05,
    0.08,
    {
      SUDBURY: { b: 1.4 },
      "THUNDER-BAY": { b: 1.6 },
      TIMMINS: { b: 0.7 },
      KENORA: { b: 0.55 },
      "NORTHERN-ON": { b: 1.25 },
    },
    { includeOntario: true },
  ),
  ...spread(
    "non-official-language",
    7.5,
    0.18,
    0.1,
    {
      SUDBURY: { b: 1.4 },
      "THUNDER-BAY": { b: 1.6 },
      TIMMINS: { b: 1.0 },
      KENORA: { b: 0.7 },
      "NORTHERN-ON": { b: 1.2 },
    },
    { includeOntario: true },
  ),
  ...spread(
    "visible-minority-share",
    4.6,
    0.2,
    0.12,
    {
      SUDBURY: { b: 1.5 },
      "THUNDER-BAY": { b: 1.85 },
      "NORTH-BAY": { b: 1.05 },
      TIMMINS: { b: 0.7 },
      KENORA: { b: 0.6 },
      "NORTHERN-ON": { b: 1.3 },
    },
    { includeOntario: true },
  ),
  ...spread("library-visits", 4.2, 0.05, 0.3, {
    SUDBURY: { b: 1.1 },
    "THUNDER-BAY": { b: 1.05 },
    "NORTH-BAY": { b: 1.0 },
    TIMMINS: { b: 0.92 },
    KENORA: { b: 0.85 },
    "NORTHERN-ON": { b: 1.0 },
  }),
  ...spread("recreation-participation", 41, 0.3, 0.6, {
    SUDBURY: { b: 1.06 },
    "THUNDER-BAY": { b: 1.04 },
    "NORTH-BAY": { b: 1.02 },
    TIMMINS: { b: 0.99 },
    KENORA: { b: 0.94 },
    "NORTHERN-ON": { b: 1.0 },
  }),
  ...spread(
    "volunteer-rate",
    44,
    -0.4,
    0.7,
    {
      SUDBURY: { b: 1.04 },
      "THUNDER-BAY": { b: 1.0 },
      "NORTH-BAY": { b: 1.06 },
      TIMMINS: { b: 1.05 },
      KENORA: { b: 1.02 },
      "NORTHERN-ON": { b: 1.02 },
    },
    { includeOntario: true },
  ),
  ...spread("transit-availability", 65, 0.5, 0.8, {
    SUDBURY: { b: 1.08 },
    "THUNDER-BAY": { b: 1.05 },
    "NORTH-BAY": { b: 0.95 },
    TIMMINS: { b: 0.85 },
    KENORA: { b: 0.65 },
    "NORTHERN-ON": { b: 0.92 },
  }),
  ...spread("annual-snowfall", 290, -1.5, 25, {
    SUDBURY: { b: 0.86 },
    "THUNDER-BAY": { b: 1.04 },
    "NORTH-BAY": { b: 1.1 },
    TIMMINS: { b: 1.18 },
    KENORA: { b: 0.84 },
    "NORTHERN-ON": { b: 0.98 },
  }),
  ...spread("summer-mean-temp", 17.5, 0.04, 0.5, {
    SUDBURY: { b: 0.96 },
    "THUNDER-BAY": { b: 0.91 },
    "NORTH-BAY": { b: 0.94 },
    TIMMINS: { b: 0.89 },
    KENORA: { b: 0.92 },
    "NORTHERN-ON": { b: 0.92 },
  }),
  ...spread("winter-mean-temp", -8.5, 0.06, 0.7, {
    SUDBURY: { b: 1.08 },
    "THUNDER-BAY": { b: 1.18 },
    "NORTH-BAY": { b: 1.12 },
    TIMMINS: { b: 1.35 },
    KENORA: { b: 1.4 },
    "NORTHERN-ON": { b: 1.18 },
  }),
  ...spread("frost-free-days", 145, 0.4, 4, {
    SUDBURY: { b: 0.97 },
    "THUNDER-BAY": { b: 0.93 },
    "NORTH-BAY": { b: 0.95 },
    TIMMINS: { b: 0.88 },
    KENORA: { b: 0.92 },
    "NORTHERN-ON": { b: 0.94 },
  }),
  ...spread("annual-precipitation-days", 168, -0.2, 4, {
    SUDBURY: { b: 1.0 },
    "THUNDER-BAY": { b: 0.92 },
    "NORTH-BAY": { b: 1.04 },
    TIMMINS: { b: 1.0 },
    KENORA: { b: 0.88 },
    "NORTHERN-ON": { b: 0.96 },
  }),
];

function seededNoise(seed: number, year: number): number {
  const x = Math.sin(seed * 9301 + year * 49297) * 233280;
  return (x - Math.floor(x)) * 2 - 1;
}
function hashSeed(a: string, b: string): number {
  let h = 0;
  const s = a + "|" + b;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function generateValues(): IndicatorValue[] {
  const values: IndicatorValue[] = [];
  for (const seed of SEEDS) {
    const yearStart = seed.yearStart ?? 2014;
    const yearEnd = seed.yearEnd ?? 2024;
    const h = hashSeed(seed.indicatorSlug, seed.geographyCode);
    for (let y = yearStart; y <= yearEnd; y++) {
      const t = y - yearStart;
      const n = seededNoise(h, y) * seed.noise;
      const value = seed.base + seed.trend * t + n;
      values.push({
        indicatorSlug: seed.indicatorSlug,
        geographyCode: seed.geographyCode,
        year: y,
        value: Math.round(value * 100) / 100,
      });
    }
  }
  return values;
}

export const INDICATOR_VALUES = generateValues();

type CompositionTilt = Partial<Record<string, number[]>>;

function distribute(
  slug: string,
  labels: string[],
  baseShares: number[],
  year: number,
  tilts: CompositionTilt = {},
): CompositionValue[] {
  const out: CompositionValue[] = [];
  for (const code of [...COMMUNITIES, "ON"]) {
    const tilt = tilts[code];
    let raw = baseShares.map((b, i) => b * (tilt?.[i] ?? 1));
    const total = raw.reduce((a, b) => a + b, 0);
    raw = raw.map((v) => (v * 100) / total);
    raw.forEach((v, i) => {
      out.push({
        indicatorSlug: slug,
        geographyCode: code,
        year,
        label: labels[i],
        value: Math.round(v * 100) / 100,
      });
    });
  }
  return out;
}

const COMPOSITION_BUILDERS: CompositionValue[][] = [
  distribute(
    "age-distribution",
    ["0–14", "15–24", "25–44", "45–64", "65+"],
    [14.5, 11, 24, 28, 22.5],
    2024,
    {
      SSM: [1.0, 1.0, 1.0, 1.0, 1.05],
      SUDBURY: [1.05, 1.1, 1.05, 0.97, 0.92],
      "THUNDER-BAY": [0.95, 1.0, 1.0, 1.0, 1.05],
      "NORTH-BAY": [0.97, 0.97, 0.96, 1.05, 1.06],
      TIMMINS: [1.0, 0.97, 0.95, 1.02, 1.1],
      KENORA: [1.05, 0.95, 0.95, 1.0, 1.08],
      "NORTHERN-ON": [1.0, 1.0, 1.0, 1.0, 1.02],
      ON: [1.05, 1.0, 1.06, 1.0, 0.92],
    },
  ),
  distribute(
    "industry-employment",
    [
      "Goods-producing",
      "Trade & transport",
      "Health & education",
      "Public administration",
      "Professional services",
      "Other services",
    ],
    [22, 21, 25, 9, 13, 10],
    2024,
    {
      SSM: [0.9, 1.0, 1.15, 1.05, 0.92, 1.0],
      SUDBURY: [0.95, 1.0, 1.18, 0.95, 1.0, 0.95],
      "THUNDER-BAY": [0.92, 1.05, 1.12, 1.05, 1.0, 0.92],
      "NORTH-BAY": [0.85, 1.05, 1.1, 1.18, 0.95, 0.95],
      TIMMINS: [1.6, 1.0, 0.85, 0.85, 0.7, 0.95],
      KENORA: [1.4, 1.05, 0.95, 1.05, 0.7, 1.0],
      "NORTHERN-ON": [1.05, 1.0, 1.0, 1.0, 0.92, 0.98],
      ON: [0.85, 1.0, 0.92, 0.85, 1.35, 1.05],
    },
  ),
  distribute(
    "employment-by-class",
    [
      "Public-sector employees",
      "Private-sector employees",
      "Self-employed (incorporated)",
      "Self-employed (unincorporated)",
    ],
    [22, 65, 5, 8],
    2024,
    {
      SSM: [1.05, 0.97, 0.95, 1.05],
      SUDBURY: [1.05, 1.0, 1.0, 0.95],
      "THUNDER-BAY": [1.1, 0.97, 0.95, 1.0],
      "NORTH-BAY": [1.18, 0.94, 0.92, 1.0],
      TIMMINS: [0.95, 1.07, 0.85, 0.95],
      KENORA: [1.1, 0.95, 0.85, 1.05],
      "NORTHERN-ON": [1.05, 1.0, 0.92, 1.0],
      ON: [0.85, 1.05, 1.18, 1.05],
    },
  ),
  distribute(
    "housing-tenure",
    ["Owner", "Renter", "Band housing"],
    [70, 28.5, 1.5],
    2024,
    {
      SSM: [1.02, 0.97, 0.5],
      SUDBURY: [1.0, 1.02, 0.5],
      "THUNDER-BAY": [0.97, 1.05, 0.5],
      "NORTH-BAY": [1.0, 1.0, 0.5],
      TIMMINS: [1.05, 0.92, 0.5],
      KENORA: [0.95, 1.0, 1.8],
      "NORTHERN-ON": [1.0, 0.95, 1.5],
      ON: [0.95, 1.1, 0.1],
    },
  ),
  distribute(
    "highest-education",
    [
      "No certificate",
      "High school",
      "Trades / apprenticeship",
      "College",
      "University",
    ],
    [13, 26, 12, 27, 22],
    2024,
    {
      SSM: [1.05, 1.05, 1.1, 1.05, 0.85],
      SUDBURY: [0.92, 0.97, 1.0, 1.08, 1.05],
      "THUNDER-BAY": [0.95, 1.0, 1.0, 1.05, 1.02],
      "NORTH-BAY": [1.0, 1.05, 1.05, 1.05, 0.92],
      TIMMINS: [1.15, 1.05, 1.18, 0.95, 0.7],
      KENORA: [1.25, 1.05, 1.18, 0.95, 0.62],
      "NORTHERN-ON": [1.05, 1.02, 1.06, 1.02, 0.92],
      ON: [0.85, 0.95, 0.95, 1.0, 1.18],
    },
  ),
  distribute(
    "immigrants-by-region",
    ["Europe", "Asia", "Americas", "Africa", "Oceania & other"],
    [42, 32, 12, 12, 2],
    2024,
    {
      SSM: [1.2, 0.85, 1.0, 0.85, 1.0],
      SUDBURY: [1.15, 0.9, 1.0, 0.95, 1.0],
      "THUNDER-BAY": [1.1, 0.95, 0.92, 1.0, 1.0],
      "NORTH-BAY": [1.18, 0.85, 1.05, 0.9, 1.0],
      TIMMINS: [1.25, 0.78, 1.05, 0.85, 1.0],
      KENORA: [1.3, 0.7, 1.1, 0.85, 1.0],
      "NORTHERN-ON": [1.18, 0.9, 0.98, 0.92, 1.0],
      ON: [0.7, 1.18, 1.05, 1.18, 1.0],
    },
  ),
  distribute(
    "service-mix",
    [
      "Health & social",
      "Recreation",
      "Education & training",
      "Cultural",
      "Government services",
    ],
    [38, 18, 22, 12, 10],
    2024,
    {
      SSM: [1.05, 0.95, 1.0, 1.0, 1.0],
      SUDBURY: [1.06, 0.92, 1.05, 1.05, 0.95],
      "THUNDER-BAY": [1.04, 0.95, 1.05, 1.0, 1.0],
      "NORTH-BAY": [1.0, 0.92, 1.0, 1.0, 1.18],
      TIMMINS: [0.95, 1.0, 0.95, 0.92, 1.18],
      KENORA: [1.05, 1.05, 0.85, 0.92, 1.18],
      "NORTHERN-ON": [1.0, 0.97, 1.0, 1.0, 1.05],
      ON: [0.92, 1.0, 1.05, 1.05, 1.0],
    },
  ),
];

export const COMPOSITION_VALUES: CompositionValue[] = COMPOSITION_BUILDERS.flat();