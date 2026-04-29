import Link from "next/link";
import { ArrowUpRight, Info, Clock } from "lucide-react";
import type { Indicator } from "@/types";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export function SourceFooter({
  indicator,
  className,
}: {
  indicator: Indicator;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ink-100 px-5 py-3 text-xs text-ink-500 ${className ?? ""}`}
    >
      <div className="flex items-center gap-1.5">
        <Info className="h-3.5 w-3.5" aria-hidden />
        <span>Source:</span>
        {indicator.sourceUrl ? (
          <a
            href={indicator.sourceUrl}
            target="_blank"
            rel="noopener"
            className="font-medium text-ink-700 hover:text-nordik-700"
          >
            {indicator.source}
            <ArrowUpRight className="ml-0.5 inline h-3 w-3" aria-hidden />
          </a>
        ) : (
          <span className="font-medium text-ink-700">{indicator.source}</span>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" aria-hidden />
        <span>Updated {formatDate(indicator.lastUpdated)}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span>{indicator.updateFrequency}</span>
      </div>
      {indicator.isSample && <Badge variant="sample">Sample data</Badge>}
      <Link
        href={`/indicators/${indicator.slug}#methodology`}
        className="ml-auto font-medium text-nordik-700 hover:text-nordik-800"
      >
        Methodology →
      </Link>
    </div>
  );
}
