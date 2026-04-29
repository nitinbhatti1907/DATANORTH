import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { INDICATORS } from "@/lib/data/indicators";
import { CATEGORIES } from "@/lib/data/categories";
import { formatDate } from "@/lib/format";
import { ArrowUpRight } from "lucide-react";

export const dynamic = "force-static";

export const metadata = {
  title: "Methodology & sources",
  description: "How DATANORTH sources, handles, and updates its data.",
};

export default function MethodologyPage() {
  return (
    <div className="content-container py-10">
      <Breadcrumbs items={[{ label: "Methodology" }]} />
      <div className="mt-6 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <h1 className="font-display text-display-lg font-semibold tracking-tight text-ink-900">
            Methodology &amp; sources
          </h1>
          <div className="mt-6 space-y-6 text-[15px] leading-relaxed text-ink-700">
            <p>
              DATANORTH collects, organizes, and shares data for Northern
              Ontario communities. Every chart on the platform cites its
              original source. Wherever possible, we link back to the
              authoritative source so users can verify, download, and cite
              the data themselves.
            </p>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
              How we handle data
            </h2>
            <p>
              For each indicator we record a definition, a unit, an update
              frequency, a license, and a <em>last updated at source</em> date.
              These are visible under every chart and included in every CSV or
              Excel export. Values are displayed in the unit native to the
              source — we do not re-scale or re-normalize without disclosing
              the transformation.
            </p>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
              Sample data in the current build
            </h2>
            <p>
              This release includes a small number of indicators with real
              values migrated from the prior DATANORTH prototype, and a larger
              number of indicators that currently carry synthetic
              demonstration values. Any indicator with synthetic values is
              clearly tagged{" "}
              <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-800">
                sample
              </span>{" "}
              on the chart, in the export, and on this page. Synthetic values
              preserve realistic orders of magnitude so the platform can be
              reviewed end-to-end — they must not be cited.
            </p>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
              Geography
            </h2>
            <p>
              Where a source reports data at a higher geography than the
              community (for example, at the Census Division level), the
              chart makes this clear in the tooltip and in the indicator
              description.
            </p>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
              Future data
            </h2>
            <p>
              Forecasts and model-generated projections are not currently
              published. When they are added, they will be visually distinct
              from observed values (dashed line, confidence band) and will
              carry the model name, version, and training date. No projection
              will ever be presented as observed data.
            </p>
          </div>
        </div>

        <aside className="rounded-lg border border-ink-200 bg-ink-50/50 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            Source inventory
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {INDICATORS.map((i) => {
              const cat = CATEGORIES[i.category];
              return (
                <li
                  key={i.slug}
                  className="border-b border-ink-200 pb-3 last:border-b-0 last:pb-0"
                >
                  <div
                    className="text-[10px] font-medium uppercase tracking-wider"
                    style={{ color: cat.accent }}
                  >
                    {cat.shortName}
                  </div>
                  <div className="mt-0.5 font-medium text-ink-900">
                    {i.name}
                  </div>
                  <div className="mt-0.5 text-xs text-ink-600">
                    {i.source}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-ink-500">
                    <span>Updated {formatDate(i.lastUpdated)}</span>
                    {i.sourceUrl && (
                      <a
                        href={i.sourceUrl}
                        target="_blank"
                        rel="noopener"
                        className="text-nordik-700 hover:text-nordik-800"
                      >
                        Visit
                        <ArrowUpRight
                          className="ml-0.5 inline h-3 w-3"
                          aria-hidden
                        />
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}
