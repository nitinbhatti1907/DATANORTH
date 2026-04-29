const nf = new Intl.NumberFormat("en-CA");
const pf = new Intl.NumberFormat("en-CA", {
  style: "percent",
  maximumFractionDigits: 1,
});
const cf = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});
const df = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatNumber(n: number | null | undefined) {
  if (n == null || Number.isNaN(n)) return "—";
  return nf.format(n);
}

export function formatCurrency(n: number | null | undefined) {
  if (n == null || Number.isNaN(n)) return "—";
  return cf.format(n);
}

export function formatPercent(n: number | null | undefined) {
  if (n == null || Number.isNaN(n)) return "—";
  return pf.format(n);
}

export function formatCompact(n: number | null | undefined) {
  if (n == null || Number.isNaN(n)) return "—";
  if (Math.abs(n) >= 1_000_000_000)
    return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (Math.abs(n) >= 1_000_000)
    return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (Math.abs(n) >= 10_000)
    return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return nf.format(n);
}

export function formatDate(d: string | Date) {
  return df.format(typeof d === "string" ? new Date(d) : d);
}

export function formatUnit(value: number, unit: string): string {
  switch (unit) {
    case "CAD":
      return formatCurrency(value);
    case "%":
      return formatPercent(value / 100);
    case "persons":
    case "count":
      return formatNumber(value);
    default:
      return `${formatNumber(value)} ${unit}`;
  }
}

export function formatDelta(
  current: number,
  previous: number,
): { display: string; direction: "up" | "down" | "flat" } {
  if (previous === 0 || !Number.isFinite(previous)) {
    return { display: "—", direction: "flat" };
  }
  const delta = (current - previous) / previous;
  const direction = delta > 0.001 ? "up" : delta < -0.001 ? "down" : "flat";
  return {
    display: pf.format(Math.abs(delta)),
    direction,
  };
}
