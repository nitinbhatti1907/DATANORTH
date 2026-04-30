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

export type ChartShape = "timeseries" | "composition";

export interface Category {
  slug: CategorySlug;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  accent: string;
  image: string;
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
  lastUpdated: string;
  featured?: boolean;
  isSample?: boolean;
  shape?: ChartShape;
  compositionCategories?: string[];
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

export interface CompositionValue {
  indicatorSlug: string;
  geographyCode: string;
  year: number;
  label: string;
  value: number;
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

export interface CompositionSeries {
  geographyCode: string;
  geographyName: string;
  year: number;
  parts: Array<{ label: string; value: number }>;
}

export interface ChartDataResponse {
  indicator: Indicator;
  shape: ChartShape;
  series?: ChartSeries[];
  composition?: CompositionSeries[];
  filters: {
    geographies: string[];
    yearFrom?: number;
    yearTo?: number;
  };
  generatedAt: string;
}

export interface CommunityProfile {
  geography: Geography;
  highlights: Array<{
    indicatorSlug: string;
    latestValue: number;
    previousValue?: number;
    year: number;
  }>;
}

export interface JobRow {
  noc: string;
  occupation: string;
  medianWage: number;
}

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