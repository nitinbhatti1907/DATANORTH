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

  // Census Divisions (Districts) in Northern Ontario
  {
    code: "NE-ON",
    name: "Northeastern Ontario",
    type: "region",
    parentCode: "NORTHERN-ON",
  },
  {
    code: "NW-ON",
    name: "Northwestern Ontario",
    type: "region",
    parentCode: "NORTHERN-ON",
  },

  // Key communities (Census Subdivisions — approximate populations)
  {
    code: "SSM",
    name: "Sault Ste. Marie",
    type: "csd",
    parentCode: "NE-ON",
    population: 76731, // 2021 Census
  },
  {
    code: "SUDBURY",
    name: "Greater Sudbury",
    type: "csd",
    parentCode: "NE-ON",
    population: 166004,
  },
  {
    code: "THUNDER-BAY",
    name: "Thunder Bay",
    type: "csd",
    parentCode: "NW-ON",
    population: 108843,
  },
  {
    code: "NORTH-BAY",
    name: "North Bay",
    type: "csd",
    parentCode: "NE-ON",
    population: 52662,
  },
  {
    code: "TIMMINS",
    name: "Timmins",
    type: "csd",
    parentCode: "NE-ON",
    population: 41145,
  },
  {
    code: "KENORA",
    name: "Kenora",
    type: "csd",
    parentCode: "NW-ON",
    population: 14967,
  },
  {
    code: "ELLIOT-LAKE",
    name: "Elliot Lake",
    type: "csd",
    parentCode: "NE-ON",
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
