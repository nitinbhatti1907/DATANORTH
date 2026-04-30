import type { ChartDataResponse } from "@/types";

function buildRows(data: ChartDataResponse) {
  const rows: Record<string, string | number | null>[] = [];

  if (data.shape === "composition" && data.composition) {
    for (const series of data.composition) {
      for (const p of series.parts) {
        rows.push({
          indicator: data.indicator.name,
          indicator_slug: data.indicator.slug,
          unit: data.indicator.unit,
          geography_code: series.geographyCode,
          geography: series.geographyName,
          year: series.year,
          category: p.label,
          value: p.value,
        });
      }
    }
    return rows;
  }

  if (data.series) {
    for (const series of data.series) {
      for (const p of series.points) {
        rows.push({
          indicator: data.indicator.name,
          indicator_slug: data.indicator.slug,
          unit: data.indicator.unit,
          geography_code: series.geographyCode,
          geography: series.geographyName,
          year: p.year,
          value: p.value,
          is_forecast: p.isForecast ? "true" : "false",
          confidence_low: p.confidenceLow ?? null,
          confidence_high: p.confidenceHigh ?? null,
        });
      }
    }
  }
  return rows;
}

function buildReadme(data: ChartDataResponse): string[] {
  const filters = data.filters;
  const geos =
    filters.geographies.length > 0 ? filters.geographies.join(", ") : "all";
  const years =
    filters.yearFrom != null && filters.yearTo != null
      ? `${filters.yearFrom}–${filters.yearTo}`
      : "full series";
  return [
    `# ${data.indicator.name}`,
    `# Unit: ${data.indicator.unit}`,
    `# Source: ${data.indicator.source}`,
    `# Methodology: ${data.indicator.methodology}`,
    `# License: ${data.indicator.license}`,
    `# Last updated at source: ${data.indicator.lastUpdated}`,
    `# Data shape: ${data.shape}`,
    `# Filters applied: geography=[${geos}]; years=${years}`,
    `# Exported from DATANORTH at ${data.generatedAt}`,
    data.indicator.isSample
      ? "# NOTE: Values are SAMPLE / synthetic and provided for demonstration only. Do not cite."
      : "# Values are from the cited source.",
    "",
  ];
}

function slugifyFilename(data: ChartDataResponse): string {
  const today = new Date().toISOString().slice(0, 10);
  const geo =
    data.filters.geographies.length > 0
      ? data.filters.geographies.join("-").toLowerCase()
      : "all";
  return `datanorth_${data.indicator.slug}_${geo}_${today}`;
}

export async function downloadCSV(data: ChartDataResponse) {
  const { default: Papa } = await import("papaparse");
  const rows = buildRows(data);
  const csvBody = Papa.unparse(rows, { quotes: true });
  const readme = buildReadme(data).join("\n");
  const full = `${readme}\n${csvBody}\n`;
  const blob = new Blob([full], { type: "text/csv;charset=utf-8" });
  triggerDownload(blob, `${slugifyFilename(data)}.csv`);
}

export async function downloadExcel(data: ChartDataResponse) {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  const dataSheet = XLSX.utils.json_to_sheet(buildRows(data));
  XLSX.utils.book_append_sheet(wb, dataSheet, "Data");

  const meta: Array<[string, string]> = [
    ["Indicator", data.indicator.name],
    ["Indicator slug", data.indicator.slug],
    ["Category", data.indicator.category],
    ["Unit", data.indicator.unit],
    ["Data shape", data.shape],
    ["Source", data.indicator.source],
    ["Source URL", data.indicator.sourceUrl],
    ["Methodology", data.indicator.methodology],
    ["License", data.indicator.license],
    ["Update frequency", data.indicator.updateFrequency],
    ["Last updated at source", data.indicator.lastUpdated],
    ["Exported from", "DATANORTH"],
    ["Exported at", data.generatedAt],
    ["Filters — geographies", data.filters.geographies.join(", ") || "all"],
    [
      "Filters — years",
      data.filters.yearFrom != null && data.filters.yearTo != null
        ? `${data.filters.yearFrom}–${data.filters.yearTo}`
        : "full series",
    ],
    data.indicator.isSample
      ? [
          "NOTE",
          "Values are SAMPLE / synthetic and provided for demonstration only. Do not cite.",
        ]
      : ["", ""],
  ];
  const metaSheet = XLSX.utils.aoa_to_sheet(meta);
  XLSX.utils.book_append_sheet(wb, metaSheet, "Methodology");

  const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  const blob = new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  triggerDownload(blob, `${slugifyFilename(data)}.xlsx`);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}