import type { IndicatorValue } from "@/types";

/**
 * Synthetic demonstration values for Northern Ontario communities.
 * All values marked `isSample` in the indicator registry are generated
 * here for UI review only. Replace with ingested real data before use.
 *
 * Values are loosely calibrated to public Census / LFS orders of magnitude
 * so charts don't look implausible, but they should NOT be cited as fact.
 */

type Seed = {
  indicatorSlug: string;
  geographyCode: string;
  base: number; // 2014 baseline
  trend: number; // annual change (absolute units)
  noise: number; // annual random jitter
  yearStart?: number;
  yearEnd?: number;
};

const SEEDS: Seed[] = [
  // Population (persons)
  { indicatorSlug: "total-population", geographyCode: "SSM", base: 75000, trend: 180, noise: 300 },
  { indicatorSlug: "total-population", geographyCode: "SUDBURY", base: 162000, trend: 400, noise: 500 },
  { indicatorSlug: "total-population", geographyCode: "THUNDER-BAY", base: 108000, trend: 90, noise: 400 },
  { indicatorSlug: "total-population", geographyCode: "NORTH-BAY", base: 52000, trend: 60, noise: 200 },
  { indicatorSlug: "total-population", geographyCode: "TIMMINS", base: 42000, trend: -100, noise: 300 },
  { indicatorSlug: "total-population", geographyCode: "KENORA", base: 15200, trend: -25, noise: 80 },
  { indicatorSlug: "total-population", geographyCode: "NORTHERN-ON", base: 780000, trend: 1200, noise: 1500 },

  // Median age (years)
  { indicatorSlug: "median-age", geographyCode: "SSM", base: 45.1, trend: 0.08, noise: 0.1 },
  { indicatorSlug: "median-age", geographyCode: "SUDBURY", base: 42.8, trend: 0.07, noise: 0.1 },
  { indicatorSlug: "median-age", geographyCode: "THUNDER-BAY", base: 43.6, trend: 0.07, noise: 0.1 },
  { indicatorSlug: "median-age", geographyCode: "NORTH-BAY", base: 44.2, trend: 0.09, noise: 0.12 },
  { indicatorSlug: "median-age", geographyCode: "TIMMINS", base: 42.0, trend: 0.09, noise: 0.1 },
  { indicatorSlug: "median-age", geographyCode: "NORTHERN-ON", base: 43.5, trend: 0.08, noise: 0.08 },

  // Median household income (CAD)
  { indicatorSlug: "median-household-income", geographyCode: "SSM", base: 66000, trend: 1800, noise: 900 },
  { indicatorSlug: "median-household-income", geographyCode: "SUDBURY", base: 73000, trend: 2000, noise: 1000 },
  { indicatorSlug: "median-household-income", geographyCode: "THUNDER-BAY", base: 71000, trend: 1900, noise: 1000 },
  { indicatorSlug: "median-household-income", geographyCode: "NORTH-BAY", base: 65000, trend: 1700, noise: 900 },
  { indicatorSlug: "median-household-income", geographyCode: "TIMMINS", base: 68000, trend: 1800, noise: 1100 },
  { indicatorSlug: "median-household-income", geographyCode: "KENORA", base: 62000, trend: 1600, noise: 1100 },
  { indicatorSlug: "median-household-income", geographyCode: "NORTHERN-ON", base: 68000, trend: 1850, noise: 600 },
  { indicatorSlug: "median-household-income", geographyCode: "ON", base: 74000, trend: 2100, noise: 500 },

  // Business count
  { indicatorSlug: "business-count", geographyCode: "SSM", base: 2100, trend: 18, noise: 25 },
  { indicatorSlug: "business-count", geographyCode: "SUDBURY", base: 4500, trend: 35, noise: 45 },
  { indicatorSlug: "business-count", geographyCode: "THUNDER-BAY", base: 3100, trend: 10, noise: 35 },
  { indicatorSlug: "business-count", geographyCode: "NORTH-BAY", base: 1450, trend: 8, noise: 18 },
  { indicatorSlug: "business-count", geographyCode: "NORTHERN-ON", base: 22000, trend: 120, noise: 180 },

  // Unemployment rate (%)
  { indicatorSlug: "unemployment-rate", geographyCode: "SSM", base: 8.2, trend: -0.08, noise: 0.6 },
  { indicatorSlug: "unemployment-rate", geographyCode: "SUDBURY", base: 7.1, trend: -0.06, noise: 0.5 },
  { indicatorSlug: "unemployment-rate", geographyCode: "THUNDER-BAY", base: 6.9, trend: -0.05, noise: 0.5 },
  { indicatorSlug: "unemployment-rate", geographyCode: "NORTH-BAY", base: 7.4, trend: -0.07, noise: 0.6 },
  { indicatorSlug: "unemployment-rate", geographyCode: "TIMMINS", base: 6.2, trend: -0.04, noise: 0.5 },
  { indicatorSlug: "unemployment-rate", geographyCode: "NORTHERN-ON", base: 7.2, trend: -0.06, noise: 0.3 },
  { indicatorSlug: "unemployment-rate", geographyCode: "ON", base: 6.6, trend: -0.04, noise: 0.25 },

  // Employment rate (%)
  { indicatorSlug: "employment-rate", geographyCode: "SSM", base: 54.5, trend: 0.12, noise: 0.5 },
  { indicatorSlug: "employment-rate", geographyCode: "SUDBURY", base: 58.9, trend: 0.14, noise: 0.5 },
  { indicatorSlug: "employment-rate", geographyCode: "THUNDER-BAY", base: 57.6, trend: 0.12, noise: 0.5 },
  { indicatorSlug: "employment-rate", geographyCode: "NORTHERN-ON", base: 56.8, trend: 0.13, noise: 0.3 },
  { indicatorSlug: "employment-rate", geographyCode: "ON", base: 60.5, trend: 0.12, noise: 0.25 },

  // Average home price (CAD)
  { indicatorSlug: "average-home-price", geographyCode: "SSM", base: 180000, trend: 22000, noise: 6000 },
  { indicatorSlug: "average-home-price", geographyCode: "SUDBURY", base: 240000, trend: 28000, noise: 7000 },
  { indicatorSlug: "average-home-price", geographyCode: "THUNDER-BAY", base: 210000, trend: 24000, noise: 7000 },
  { indicatorSlug: "average-home-price", geographyCode: "NORTH-BAY", base: 220000, trend: 23000, noise: 6500 },
  { indicatorSlug: "average-home-price", geographyCode: "TIMMINS", base: 190000, trend: 18000, noise: 6000 },
  { indicatorSlug: "average-home-price", geographyCode: "NORTHERN-ON", base: 210000, trend: 24000, noise: 4000 },

  // Housing starts (count)
  { indicatorSlug: "housing-starts", geographyCode: "SSM", base: 110, trend: -3, noise: 25, yearStart: 2015 },
  { indicatorSlug: "housing-starts", geographyCode: "SUDBURY", base: 260, trend: 4, noise: 40, yearStart: 2015 },
  { indicatorSlug: "housing-starts", geographyCode: "THUNDER-BAY", base: 160, trend: 2, noise: 30, yearStart: 2015 },

  // ED wait time (days-equivalent used only as a numeric unit for demo)
  { indicatorSlug: "ed-wait-time-average", geographyCode: "SSM", base: 2.3, trend: 0.02, noise: 0.3 },

  // Health services by type — special-cased below

  // Post-secondary attainment (%)
  { indicatorSlug: "post-secondary-attainment", geographyCode: "SSM", base: 58.5, trend: 0.5, noise: 0.4 },
  { indicatorSlug: "post-secondary-attainment", geographyCode: "SUDBURY", base: 62.1, trend: 0.5, noise: 0.4 },
  { indicatorSlug: "post-secondary-attainment", geographyCode: "THUNDER-BAY", base: 61.2, trend: 0.5, noise: 0.4 },
  { indicatorSlug: "post-secondary-attainment", geographyCode: "NORTHERN-ON", base: 60.0, trend: 0.5, noise: 0.3 },
  { indicatorSlug: "post-secondary-attainment", geographyCode: "ON", base: 66.0, trend: 0.5, noise: 0.25 },

  // Annual mean temperature (C-like index)
  { indicatorSlug: "annual-mean-temperature", geographyCode: "SSM", base: 4.2, trend: 0.05, noise: 0.6 },
  { indicatorSlug: "annual-mean-temperature", geographyCode: "SUDBURY", base: 3.7, trend: 0.05, noise: 0.6 },
  { indicatorSlug: "annual-mean-temperature", geographyCode: "THUNDER-BAY", base: 2.8, trend: 0.05, noise: 0.7 },
  { indicatorSlug: "annual-mean-temperature", geographyCode: "NORTH-BAY", base: 3.3, trend: 0.05, noise: 0.6 },
  { indicatorSlug: "annual-mean-temperature", geographyCode: "NORTHERN-ON", base: 3.4, trend: 0.05, noise: 0.4 },

  // Immigrant population (%)
  { indicatorSlug: "immigrant-population", geographyCode: "SSM", base: 5.4, trend: 0.15, noise: 0.1 },
  { indicatorSlug: "immigrant-population", geographyCode: "SUDBURY", base: 6.9, trend: 0.2, noise: 0.1 },
  { indicatorSlug: "immigrant-population", geographyCode: "THUNDER-BAY", base: 10.1, trend: 0.2, noise: 0.1 },
  { indicatorSlug: "immigrant-population", geographyCode: "NORTHERN-ON", base: 7.0, trend: 0.18, noise: 0.08 },
  { indicatorSlug: "immigrant-population", geographyCode: "ON", base: 29.1, trend: 0.3, noise: 0.08 },
];

// Deterministic pseudo-random for reproducible demo data
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
