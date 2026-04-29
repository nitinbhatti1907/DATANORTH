import type { Category, CategorySlug } from "@/types";

export const CATEGORIES: Record<CategorySlug, Category> = {
  population: {
    slug: "population",
    name: "Population",
    shortName: "Population",
    description: "Who lives in Northern Ontario and how it's changing.",
    longDescription:
      "Demographic indicators including population counts, age structure, household size, migration, and growth rates across the North.",
    accent: "#4f46e5",
    image: "/images/categories/population.jpg",
  },
  housing: {
    slug: "housing",
    name: "Housing",
    shortName: "Housing",
    description: "Affordability, availability, and conditions of housing.",
    longDescription:
      "Indicators covering ownership rates, rental affordability, average prices, housing starts, and core housing need.",
    accent: "#b45309",
    image: "/images/categories/land.jpg",
  },
  "health-and-wellbeing": {
    slug: "health-and-wellbeing",
    name: "Health & Wellbeing",
    shortName: "Health",
    description: "Health outcomes, services, and the determinants of wellbeing.",
    longDescription:
      "Physical and mental health indicators, healthcare access, wait times, service availability, and social determinants of health.",
    accent: "#be123c",
    image: "/images/categories/major-cities.jpg",
  },
  "labour-market": {
    slug: "labour-market",
    name: "Labour Market",
    shortName: "Labour",
    description: "Employment, wages, and occupational trends.",
    longDescription:
      "Employment and unemployment rates, median wages across occupations, labour force participation, and job vacancy data.",
    accent: "#047857",
    image: "/images/categories/primary-industry.jpg",
  },
  education: {
    slug: "education",
    name: "Education",
    shortName: "Education",
    description: "Educational attainment and learning outcomes.",
    longDescription:
      "Graduation rates, post-secondary enrolment, early learning indicators, and adult education participation.",
    accent: "#6d28d9",
    image: "/images/categories/indigenous.jpg",
  },
  economy: {
    slug: "economy",
    name: "Economy",
    shortName: "Economy",
    description: "Income, industries, and economic activity.",
    longDescription:
      "Median household income, GDP, business counts, industry composition, and economic growth indicators.",
    accent: "#0369a1",
    image: "/images/categories/primary-industry.jpg",
  },
  "climate-and-environment": {
    slug: "climate-and-environment",
    name: "Climate & Environment",
    shortName: "Climate",
    description: "Weather patterns, climate trends, and environmental quality.",
    longDescription:
      "Temperature trends, precipitation, air and water quality, and environmental monitoring data.",
    accent: "#15803d",
    image: "/images/categories/lakes-and-water.jpg",
  },
  immigration: {
    slug: "immigration",
    name: "Immigration",
    shortName: "Immigration",
    description: "Newcomer settlement and population change.",
    longDescription:
      "Immigrant population, recent arrivals, country of origin, and settlement service indicators.",
    accent: "#0f766e",
    image: "/images/categories/major-cities.jpg",
  },
  "community-services": {
    slug: "community-services",
    name: "Community Services",
    shortName: "Services",
    description: "Social services, infrastructure, and community supports.",
    longDescription:
      "Availability of community programs, social services, recreation facilities, and public infrastructure.",
    accent: "#c2410c",
    image: "/images/categories/land.jpg",
  },
  weather: {
    slug: "weather",
    name: "Weather",
    shortName: "Weather",
    description: "Seasonal weather data and extreme events.",
    longDescription:
      "Historical weather data, temperature normals, snowfall, precipitation, and extreme weather events.",
    accent: "#0891b2",
    image: "/images/categories/lakes-and-water.jpg",
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES[slug as CategorySlug];
}
