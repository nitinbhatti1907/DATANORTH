import type { Geography } from "@/types";

export const GEOGRAPHIES: Geography[] = [
  // Top level
  { code: "ON", name: "Ontario", type: "province" },
  {
    code: "NORTHERN-ON",
    name: "Northern Ontario",
    type: "region",
    parentCode: "ON",
  },

  // Key communities — all rolled up directly under Northern Ontario
  {
    code: "SSM",
    name: "Sault Ste. Marie",
    type: "csd",
    parentCode: "NORTHERN-ON",
    population: 76731,
  },
  {
    code: "SUDBURY",
    name: "Greater Sudbury",
    type: "csd",
    parentCode: "NORTHERN-ON",
    population: 166004,
  },
  {
    code: "THUNDER-BAY",
    name: "Thunder Bay",
    type: "csd",
    parentCode: "NORTHERN-ON",
    population: 108843,
  },
  {
    code: "NORTH-BAY",
    name: "North Bay",
    type: "csd",
    parentCode: "NORTHERN-ON",
    population: 52662,
  },
  {
    code: "TIMMINS",
    name: "Timmins",
    type: "csd",
    parentCode: "NORTHERN-ON",
    population: 41145,
  },
  {
    code: "KENORA",
    name: "Kenora",
    type: "csd",
    parentCode: "NORTHERN-ON",
    population: 14967,
  },
  {
    code: "ELLIOT-LAKE",
    name: "Elliot Lake",
    type: "csd",
    parentCode: "NORTHERN-ON",
    population: 11372,
  },
];

export function getGeography(code: string): Geography | undefined {
  return GEOGRAPHIES.find((g) => g.code === code);
}

export function getChildGeographies(parentCode: string): Geography[] {
  return GEOGRAPHIES.filter((g) => g.parentCode === parentCode);
}

export const FEATURED_COMMUNITIES = [
  "SSM",
  "SUDBURY",
  "THUNDER-BAY",
  "NORTH-BAY",
  "TIMMINS",
  "KENORA",
];