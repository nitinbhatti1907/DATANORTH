import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Indicator } from "@/types";
import { CATEGORIES } from "@/lib/data/categories";
import { getLatestValue } from "@/lib/query";
import { formatUnit, formatDelta } from "@/lib/format";

export function IndicatorCard({
  indicator,
  geographyCode = "SSM",
}: {
  indicator: Indicator;
  geographyCode?: string;
}) {
  const cat = CATEGORIES[indicator.category];
  const latest = getLatestValue(indicator.slug, geographyCode);
  const delta =
    latest && latest.previous != null
      ? formatDelta(latest.value, latest.previous)
      : null;

  return (
    <Link
      href={`/indicators/${indicator.slug}?geo=${geographyCode}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-ink-200 bg-white p-5 shadow-elev-1 transition-all hover:-translate-y-0.5 hover:shadow-elev-3 hover:border-nordik-200"
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ background: cat.accent }}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-medium uppercase tracking-wider text-ink-500">
            {cat.shortName}
          </div>
          <h3 className="mt-1 text-[15px] font-semibold leading-snug text-ink-900">
            {indicator.name}
          </h3>
        </div>
        <ArrowUpRight
          className="h-4 w-4 shrink-0 text-ink-400 transition-colors group-hover:text-nordik-700"
          aria-hidden
        />
      </div>
      {latest ? (
        <div className="mt-4">
          <div className="num-plate text-[1.75rem] leading-none text-ink-900">
            {formatUnit(latest.value, indicator.unit)}
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-ink-500">
            <span>{latest.year}</span>
            {delta && (
              <span
                className={
                  delta.direction === "flat"
                    ? "text-ink-500"
                    : indicator.higherIsBetter == null
                      ? "text-ink-600"
                      : (delta.direction === "up") === indicator.higherIsBetter
                        ? "text-emerald-700"
                        : "text-rose-700"
                }
              >
                {delta.direction === "up" ? "▲" : delta.direction === "down" ? "▼" : "—"}{" "}
                {delta.display}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-4 text-sm text-ink-500">No recent data</div>
      )}
    </Link>
  );
}
