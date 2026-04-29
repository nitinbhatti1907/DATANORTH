import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatUnit, formatDelta } from "@/lib/format";
import type { Indicator } from "@/types";

export interface KPITileData {
  indicator: Indicator;
  latest: number;
  previous?: number;
  latestYear: number;
  href?: string;
}

export function KPITile({ data }: { data: KPITileData }) {
  const delta = data.previous != null
    ? formatDelta(data.latest, data.previous)
    : null;
  const higherIsBetter = data.indicator.higherIsBetter;

  const deltaColor =
    !delta || delta.direction === "flat"
      ? "text-ink-500"
      : higherIsBetter == null
        ? "text-ink-600"
        : (delta.direction === "up") === higherIsBetter
          ? "text-emerald-700"
          : "text-rose-700";

  const DeltaIcon =
    !delta || delta.direction === "flat"
      ? ArrowRight
      : delta.direction === "up"
        ? ArrowUp
        : ArrowDown;

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs font-medium uppercase tracking-wider text-ink-500">
          {data.indicator.name}
        </div>
        {data.indicator.isSample && (
          <span className="whitespace-nowrap rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
            sample
          </span>
        )}
      </div>
      <div className="mt-4 num-plate text-[2.25rem] leading-none text-ink-900">
        {formatUnit(data.latest, data.indicator.unit)}
      </div>
      <div className="mt-auto flex items-center justify-between pt-4 text-xs">
        <span className="text-ink-500">{data.latestYear}</span>
        {delta && (
          <span className={cn("flex items-center gap-1 font-medium", deltaColor)}>
            <DeltaIcon className="h-3 w-3" aria-hidden />
            {delta.display}
            <span className="font-normal text-ink-500"> yoy</span>
          </span>
        )}
      </div>
    </div>
  );

  const base = "group relative rounded-lg border border-ink-200 bg-white p-5 shadow-elev-1 transition-shadow";

  if (data.href) {
    return (
      <a href={data.href} className={cn(base, "hover:shadow-elev-3 hover:border-nordik-200")}>
        {content}
      </a>
    );
  }
  return <div className={base}>{content}</div>;
}

export function KPIStrip({ tiles }: { tiles: KPITileData[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger">
      {tiles.map((t) => (
        <KPITile key={t.indicator.slug + t.latestYear} data={t} />
      ))}
    </div>
  );
}
