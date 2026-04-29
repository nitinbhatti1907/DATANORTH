export type CategorySlug =
  | "population"
  | "housing"
  | "health-and-wellbeing"
  | "labour-market"
  | "education"
  | "economy"
  | "climate-and-environment"
  | "immigration"
  | "community-services"
  | "weather";

export type GeographyType = "region" | "district" | "csd" | "province";

export interface Category {
  slug: CategorySlug;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  accent: string; // hex
  image: string; // /public path
}

export interface Geography {
  code: string;
  name: string;
  type: GeographyType;
  parentCode?: string;
  population?: number;
}

export interface Indicator {
  slug: string;
  name: string;
  category: CategorySlug;
  description: string;
  unit: "CAD" | "%" | "persons" | "count" | "index" | "years" | "days";
  higherIsBetter: boolean | null;
  source: string;
  sourceUrl: string;
  methodology: string;
  license: string;
  updateFrequency:
    | "Annual"
    | "Quarterly"
    | "Monthly"
    | "Weekly"
    | "Daily"
    | "Irregular";
  lastUpdated: string; // ISO date
  featured?: boolean;
  isSample?: boolean; // true = synthetic data for demonstration
}

export interface IndicatorValue {
  indicatorSlug: string;
  geographyCode: string;
  year: number;
  quarter?: number;
  month?: number;
  value: number;
  confidenceLow?: number;
  confidenceHigh?: number;
  isForecast?: boolean;
  modelId?: string;
}

export interface ChartDataPoint {
  year: number;
  value: number | null;
  confidenceLow?: number;
  confidenceHigh?: number;
  isForecast?: boolean;
}

export interface ChartSeries {
  geographyCode: string;
  geographyName: string;
  points: ChartDataPoint[];
}

export interface ChartDataResponse {
  indicator: Indicator;
  series: ChartSeries[];
  filters: {
    geographies: string[];
    yearFrom?: number;
    yearTo?: number;
  };
  generatedAt: string;
}

// Community profile snapshot
export interface CommunityProfile {
  geography: Geography;
  highlights: Array<{
    indicatorSlug: string;
    latestValue: number;
    previousValue?: number;
    year: number;
  }>;
}

// Job data (from existing repo)
export interface JobRow {
  noc: string;
  occupation: string;
  medianWage: number;
}

// Health service (from existing repo)
export interface HealthService {
  id: string;
  name: string;
  address: string;
  category: string;
  subCategory: string;
  coords: [number, number];
  phone?: string;
  website?: string;
  services?: string[];
  hours?: string;
  context?: string;
  icon?: string;
  color?: string;
}