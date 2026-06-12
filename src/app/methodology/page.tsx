import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { INDICATORS } from "@/lib/data/indicators";
import { GEOGRAPHIES } from "@/lib/data/geographies";
import { MethodologyDictionary } from "@/components/methodology/dictionary";
import { HeroAnimation } from "@/components/methodology/hero-animation";
import { CaseStudies } from "@/components/methodology/case-studies";
import { ComparisonMatrix } from "@/components/methodology/comparison-matrix";
import { CountUp } from "@/components/ui/count-up";
import {
  ArrowRight,
  ShieldCheck,
  Quote,
  Mail,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

export const dynamic = "force-static";

export const metadata = {
  title: "Methodology & sources",
  description:
    "How DATANORTH sources its data, what to trust, what to verify, and how to use it for business decisions.",
};

const TOTAL = INDICATORS.length;
const REAL = INDICATORS.filter((i) => !i.isSample).length;
const SAMPLE = TOTAL - REAL;
const REAL_PCT = Math.round((REAL / TOTAL) * 100);
const SIX_MONTHS_AGO = new Date();
SIX_MONTHS_AGO.setMonth(SIX_MONTHS_AGO.getMonth() - 6);
const RECENT = INDICATORS.filter(
  (i) => new Date(i.lastUpdated) > SIX_MONTHS_AGO,
).length;
const COMMUNITY_COUNT = GEOGRAPHIES.filter((g) => g.type === "csd").length;

const SOURCE_GROUPS = (() => {
  const counts = new Map<string, number>();
  for (const i of INDICATORS) {
    const key = i.source.includes("Statistics Canada")
      ? "Statistics Canada"
      : i.source.includes("CMHC")
        ? "CMHC"
        : i.source.includes("Environment and Climate Change")
          ? "ECCC"
          : i.source.includes("CIHI") || i.source.includes("Canadian Institute")
            ? "CIHI"
            : i.source.includes("IESO")
              ? "IESO"
              : i.source.includes("Sault Area Hospital")
                ? "Local"
                : i.source.includes("compiled") || i.source.includes("Compiled")
                  ? "DATANORTH-compiled"
                  : "Other";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
})();

export default function MethodologyPage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-ink-200">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 1200px 600px at 20% 0%, rgba(22,66,132,0.10) 0%, rgba(22,66,132,0.04) 35%, transparent 70%), linear-gradient(180deg, #fafbfc 0%, #ffffff 100%)",
          }}
        />
        <div
          className="absolute inset-0 -z-10 bg-grid bg-grid-fade opacity-50"
          aria-hidden
        />

        <div className="content-container relative py-16 lg:py-20">
          <Breadcrumbs items={[{ label: "Methodology" }]} />

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-nordik-200 bg-nordik-50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-nordik-700">
                <ShieldCheck className="h-3 w-3" aria-hidden />
                How to trust this data
              </div>
              <h1 className="mt-5 font-display text-display-xl font-semibold leading-[1.02] tracking-tight text-ink-900 lg:text-[3.75rem]">
                From scattered data to{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-nordik-700">
                    better decisions
                  </span>
                  <span
                    className="absolute bottom-1 left-0 right-0 -z-0 h-3 bg-nordik-100"
                    aria-hidden
                  />
                </span>
                .
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
                DATANORTH brings public information about Northern Ontario
                into one place — verified, downloadable, and ready to act on.
              </p>
            </div>

            <HeroAnimation />
          </div>
        </div>
      </section>

      {/* ============ DATASET HEALTH ============ */}
      <section className="content-container py-16 lg:py-20">
        <div className="max-w-2xl">
          <div className="text-xs font-medium uppercase tracking-wider text-nordik-700">
            The dataset, at a glance
          </div>
          <h2 className="mt-2 font-display text-display-lg font-semibold leading-[1.05] tracking-tight text-ink-900">
            Is it mature enough for your decision?
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
            A live snapshot of scope, freshness, and provenance.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink-200 bg-ink-200 shadow-elev-1 lg:grid-cols-4">
          <DatasetStat label="Total indicators" value={`${TOTAL}`} />
          <DatasetStat
            label="With real source data"
            value={`${REAL}`}
            hint={`${REAL_PCT}% of catalogue`}
          />
          <DatasetStat
            label="Updated in last 6 mo"
            value={`${RECENT}`}
            hint="rolling window"
          />
          <DatasetStat
            label="Communities covered"
            value={`${COMMUNITY_COUNT}`}
            hint="plus regional rollups"
          />
        </div>

        <div className="mt-6 rounded-xl border border-ink-200 bg-white p-6 shadow-elev-1">
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink-900">
            Where the data comes from
          </h3>
          <div className="mt-5 grid gap-x-8 gap-y-3 md:grid-cols-2">
            {SOURCE_GROUPS.map(([source, n]) => {
              const pct = (n / TOTAL) * 100;
              return (
                <div key={source}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink-800">{source}</span>
                    <span className="font-mono text-xs text-ink-500">
                      {n} · {Math.round(pct)}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full bg-nordik-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {SAMPLE > 0 && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-700"
              aria-hidden
            />
            <div>
              <div className="font-semibold text-amber-900">
                <CountUp value={`${SAMPLE}`} /> of {TOTAL} indicators currently
                use sample data
              </div>
              <p className="mt-1 text-sm text-amber-900/90">
                These preserve realistic orders of magnitude — tagged on every
                chart and export. Do not cite sample values.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ============ CASE STUDIES ============ */}
      <section className="border-y border-ink-200 bg-ink-50/40">
        <div className="content-container py-16 lg:py-20">
          <div className="max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-wider text-nordik-700">
              See it in practice
            </div>
            <h2 className="mt-2 font-display text-display-lg font-semibold leading-[1.05] tracking-tight text-ink-900">
              Three real questions, three answers.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
              Each case shows how three indicators combined produce a
              defensible conclusion.
            </p>
          </div>

          <div className="mt-12">
            <CaseStudies />
          </div>
        </div>
      </section>

      {/* ============ COMPARISON MATRIX ============ */}
      <section className="content-container py-16 lg:py-20">
        <div className="max-w-2xl">
          <div className="text-xs font-medium uppercase tracking-wider text-nordik-700">
            When to use what
          </div>
          <h2 className="mt-2 font-display text-display-lg font-semibold leading-[1.05] tracking-tight text-ink-900">
            DATANORTH vs. the alternatives.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
            Where this platform helps you move fast, and where you should go
            straight to the source.
          </p>
        </div>

        <div className="mt-10">
          <ComparisonMatrix />
        </div>
      </section>

      {/* ============ DATA DICTIONARY ============ */}
      <section className="border-t border-ink-200 bg-ink-50/40">
        <div className="content-container py-16 lg:py-20">
          <div className="max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-wider text-nordik-700">
              Full reference
            </div>
            <h2 className="mt-2 font-display text-display-lg font-semibold leading-[1.05] tracking-tight text-ink-900">
              Data dictionary.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
              Every indicator with its source, license, update cadence, and
              status. Search, filter, and open the live chart.
            </p>
          </div>

          <div className="mt-10">
            <MethodologyDictionary />
          </div>
        </div>
      </section>

      {/* ============ CITATION + ERROR REPORTING ============ */}
      <section className="content-container py-16 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-ink-200 bg-white p-7 shadow-elev-1">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-nordik-50 text-nordik-700">
                <Quote className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink-900">
                  How to cite
                </h3>
                <p className="mt-1.5 text-sm text-ink-600">
                  Cite both DATANORTH and the original source.
                </p>
              </div>
            </div>
            <div className="mt-5 rounded-lg border border-ink-200 bg-ink-50 p-4 font-mono text-xs leading-relaxed text-ink-700">
              NORDIK Institute. ({new Date().getFullYear()}).{" "}
              <span className="italic">DATANORTH</span> [data platform]. Sault
              Ste. Marie, Ontario.{" "}
              <span className="text-nordik-700">
                https://datanorth.ca/[indicator-slug]
              </span>
              . Original source: [as displayed on the chart].
            </div>
          </div>

          <div className="rounded-2xl border border-ink-200 bg-white p-7 shadow-elev-1">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                <Mail className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink-900">
                  Found something wrong?
                </h3>
                <p className="mt-1.5 text-sm text-ink-600">
                  Corrections welcome — the platform improves through
                  feedback.
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-nordik-700 px-4 py-2 text-sm font-medium text-white shadow-elev-1 transition-colors hover:bg-nordik-800"
            >
              Report an issue
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="border-t border-ink-200">
        <div className="content-container py-16 lg:py-20">
          <div
            className="relative overflow-hidden rounded-2xl px-8 py-14 text-center shadow-elev-2 lg:px-16 lg:py-20"
            style={{
              background:
                "linear-gradient(135deg, #0f2e5c 0%, #164284 45%, #1a4f99 100%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4) 0%, transparent 40%)",
              }}
              aria-hidden
            />
            <div className="relative mx-auto max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/95 backdrop-blur-sm">
                <Sparkles className="h-3 w-3" aria-hidden />
                Ready to use it
              </div>
              <h2 className="mt-5 font-display text-display-lg font-semibold tracking-tight text-white lg:text-display-xl">
                Now go make a better decision.
              </h2>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-1.5 rounded-md bg-white px-5 py-3 text-sm font-semibold text-nordik-800 shadow-elev-2 transition-transform hover:-translate-y-0.5 hover:shadow-elev-3"
                >
                  Browse categories
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
                >
                  Explore data
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function DatasetStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="bg-white px-6 py-5 transition-colors hover:bg-nordik-50/40">
      <div className="num-plate font-display text-3xl font-semibold tracking-tight text-ink-900 lg:text-4xl">
        <CountUp value={value} />
      </div>
      <div className="mt-1 text-xs font-medium uppercase tracking-wider text-ink-500">
        {label}
      </div>
      {hint && <div className="mt-0.5 text-[11px] text-ink-400">{hint}</div>}
    </div>
  );
}