import type { Indicator } from "@/types";

/**
 * INDICATORS
 *
 * Metadata registry for every measurable thing in DATANORTH.
 *
 * IMPORTANT — `isSample: true` means the underlying values are synthetic
 * and illustrative. They are provided so the platform can be reviewed
 * end-to-end, but they are NOT real values and must not be cited. Real
 * values should be loaded via the ingestion pipeline in scripts/ingest/.
 *
 * Real data currently connected:
 *   - labour-market/median-wage-by-occupation (from Statistics Canada NOC, via the current repo)
 *   - health-and-wellbeing/health-services-by-type (from the current repo's health.ts)
 *
 * Everything else is demonstration data until ingested.
 */

export const INDICATORS: Indicator[] = [
  // ---------- Population ----------
  {
    slug: "total-population",
    name: "Total population",
    category: "population",
    description:
      "Total resident population as reported by the Census of Population.",
    unit: "persons",
    higherIsBetter: null,
    source: "Statistics Canada — Census of Population",
    sourceUrl: "https://www12.statcan.gc.ca/census-recensement/",
    methodology:
      "Population counts are from the quinquennial Census of Population. Intercensal years are linearly interpolated for display only.",
    license: "Statistics Canada Open Licence",
    updateFrequency: "Irregular",
    lastUpdated: "2022-02-09",
    featured: true,
    isSample: true,
  },
  {
    slug: "median-age",
    name: "Median age",
    category: "population",
    description:
      "The age that divides the population into two equal-sized groups.",
    unit: "years",
    higherIsBetter: null,
    source: "Statistics Canada — Census of Population",
    sourceUrl: "https://www12.statcan.gc.ca/census-recensement/",
    methodology:
      "Median age is calculated from single-year-of-age distributions in the Census.",
    license: "Statistics Canada Open Licence",
    updateFrequency: "Irregular",
    lastUpdated: "2022-04-27",
    isSample: true,
  },

  // ---------- Economy ----------
  {
    slug: "median-household-income",
    name: "Median household income",
    category: "economy",
    description:
      "The middle value of after-tax household income for all private households.",
    unit: "CAD",
    higherIsBetter: true,
    source: "Statistics Canada — T1 Family File",
    sourceUrl: "https://www150.statcan.gc.ca/",
    methodology:
      "After-tax income is reported in 2020 constant dollars. Households include all private households in the reference geography.",
    license: "Statistics Canada Open Licence",
    updateFrequency: "Annual",
    lastUpdated: "2024-07-15",
    featured: true,
    isSample: true,
  },
  {
    slug: "business-count",
    name: "Active businesses",
    category: "economy",
    description: "Number of active employer businesses by geography.",
    unit: "count",
    higherIsBetter: true,
    source: "Statistics Canada — Business Register",
    sourceUrl: "https://www150.statcan.gc.ca/",
    methodology:
      "Count reflects employer businesses with at least one paid employee during the reference period.",
    license: "Statistics Canada Open Licence",
    updateFrequency: "Annual",
    lastUpdated: "2024-06-01",
    isSample: true,
  },

  // ---------- Labour Market ----------
  {
    slug: "unemployment-rate",
    name: "Unemployment rate",
    category: "labour-market",
    description:
      "The percentage of the labour force aged 15 and over that is unemployed.",
    unit: "%",
    higherIsBetter: false,
    source: "Statistics Canada — Labour Force Survey",
    sourceUrl: "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1410028703",
    methodology:
      "Unemployment rate is calculated as the number of unemployed persons divided by the labour force, aged 15 and over, not seasonally adjusted for small geographies.",
    license: "Statistics Canada Open Licence",
    updateFrequency: "Monthly",
    lastUpdated: "2024-10-04",
    featured: true,
    isSample: true,
  },
  {
    slug: "employment-rate",
    name: "Employment rate",
    category: "labour-market",
    description:
      "Share of the working-age population that is employed.",
    unit: "%",
    higherIsBetter: true,
    source: "Statistics Canada — Labour Force Survey",
    sourceUrl: "https://www150.statcan.gc.ca/",
    methodology:
      "Employment rate is the number of employed persons expressed as a percentage of the working-age population (15+).",
    license: "Statistics Canada Open Licence",
    updateFrequency: "Monthly",
    lastUpdated: "2024-10-04",
    isSample: true,
  },
  {
    slug: "median-wage-by-occupation",
    name: "Median wage by occupation",
    category: "labour-market",
    description:
      "Median annual wage across occupations classified by the National Occupational Classification (NOC).",
    unit: "CAD",
    higherIsBetter: true,
    source: "Statistics Canada — National Occupational Classification wage data",
    sourceUrl: "https://www.statcan.gc.ca/en/subjects/standard/noc/2021/indexV1.0",
    methodology:
      "Median annual wages are reported by 5-digit NOC code. The current dataset shows national medians; regional equivalents can be substituted when available.",
    license: "Statistics Canada Open Licence",
    updateFrequency: "Annual",
    lastUpdated: "2024-01-01",
    featured: true,
    isSample: false, // Real data, migrated from current repo
  },

  // ---------- Housing ----------
  {
    slug: "average-home-price",
    name: "Average home price",
    category: "housing",
    description:
      "Average sale price of residential properties sold during the period.",
    unit: "CAD",
    higherIsBetter: null,
    source: "Canadian Real Estate Association (illustrative)",
    sourceUrl: "https://stats.crea.ca/",
    methodology:
      "Average sale price is computed across all residential property types sold through the MLS system during the reference month.",
    license: "Placeholder — real dataset to be ingested",
    updateFrequency: "Monthly",
    lastUpdated: "2024-09-01",
    featured: true,
    isSample: true,
  },
  {
    slug: "housing-starts",
    name: "Housing starts",
    category: "housing",
    description: "Number of new residential dwellings started during the period.",
    unit: "count",
    higherIsBetter: null,
    source: "CMHC — Housing Starts Survey (illustrative)",
    sourceUrl: "https://www.cmhc-schl.gc.ca/",
    methodology:
      "Housing starts include all new residential construction where at least one foundation footing has been placed.",
    license: "Placeholder — real dataset to be ingested",
    updateFrequency: "Monthly",
    lastUpdated: "2024-09-01",
    isSample: true,
  },

  // ---------- Health & Wellbeing ----------
  {
    slug: "ed-wait-time-average",
    name: "ED average wait time",
    category: "health-and-wellbeing",
    description:
      "Average emergency department wait time at Sault Area Hospital.",
    unit: "days",
    higherIsBetter: false,
    source: "Sault Area Hospital (Luma)",
    sourceUrl:
      "https://sah.on.ca/programs-services/emergency-services/ed-wait-time-clock/",
    methodology:
      "Wait time is the interval between patient registration and initial assessment by a physician, averaged across the most recent period reported by SAH.",
    license: "Attribution required",
    updateFrequency: "Daily",
    lastUpdated: "2024-10-20",
    isSample: true,
  },
  {
    slug: "health-services-by-type",
    name: "Health services by type",
    category: "health-and-wellbeing",
    description:
      "Number of health services in Sault Ste. Marie, grouped by service type.",
    unit: "count",
    higherIsBetter: true,
    source: "Compiled service directory (current repo)",
    sourceUrl: "",
    methodology:
      "Services were compiled by the DATANORTH project team from public directories and verified with the provider where possible.",
    license: "CC BY 4.0 — DATANORTH compilation",
    updateFrequency: "Irregular",
    lastUpdated: "2024-08-15",
    featured: true,
    isSample: false, // Real data, migrated from current repo
  },

  // ---------- Education ----------
  {
    slug: "post-secondary-attainment",
    name: "Post-secondary attainment",
    category: "education",
    description:
      "Share of the population aged 25–64 with a post-secondary credential.",
    unit: "%",
    higherIsBetter: true,
    source: "Statistics Canada — Census of Population",
    sourceUrl: "https://www12.statcan.gc.ca/census-recensement/",
    methodology:
      "Population aged 25–64 with a certificate, diploma, or degree above high school, expressed as a share of the total 25–64 population.",
    license: "Statistics Canada Open Licence",
    updateFrequency: "Irregular",
    lastUpdated: "2022-11-30",
    isSample: true,
  },

  // ---------- Climate & Environment ----------
  {
    slug: "annual-mean-temperature",
    name: "Annual mean temperature",
    category: "climate-and-environment",
    description: "Annual mean daily air temperature.",
    unit: "index",
    higherIsBetter: null,
    source: "Environment and Climate Change Canada (illustrative)",
    sourceUrl: "https://climate.weather.gc.ca/",
    methodology:
      "Annual mean calculated from daily temperature observations at the reference station, reported in degrees Celsius.",
    license: "Placeholder — real dataset to be ingested",
    updateFrequency: "Annual",
    lastUpdated: "2024-01-15",
    isSample: true,
  },

  // ---------- Immigration ----------
  {
    slug: "immigrant-population",
    name: "Immigrant population",
    category: "immigration",
    description:
      "Share of the population who are immigrants (landed or permanent residents).",
    unit: "%",
    higherIsBetter: null,
    source: "Statistics Canada — Census of Population",
    sourceUrl: "https://www12.statcan.gc.ca/census-recensement/",
    methodology:
      "Immigrant population includes all persons who are, or have ever been, landed immigrants or permanent residents in Canada.",
    license: "Statistics Canada Open Licence",
    updateFrequency: "Irregular",
    lastUpdated: "2022-10-26",
    isSample: true,
  },
];

export function getIndicator(slug: string): Indicator | undefined {
  return INDICATORS.find((i) => i.slug === slug);
}

export function getIndicatorsByCategory(category: string): Indicator[] {
  return INDICATORS.filter((i) => i.category === category);
}

export function getFeaturedIndicators(): Indicator[] {
  return INDICATORS.filter((i) => i.featured);
}
