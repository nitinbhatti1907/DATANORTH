import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CaseStudy {
  number: string;
  question: string;
  category: string;
  categoryColor: string;
  steps: Array<{
    label: string;
    indicator: string;
    indicatorSlug: string;
    chart: "trend" | "comparison" | "ratio";
  }>;
  insight: string;
  insightHighlight: string;
}

const CASES: CaseStudy[] = [
  {
    number: "01",
    question: "Where should we open a new clinic?",
    category: "Health planning",
    categoryColor: "#047857",
    steps: [
      {
        label: "Start with supply",
        indicator: "Family physicians per 10,000",
        indicatorSlug: "physician-supply",
        chart: "comparison",
      },
      {
        label: "Cross-check demand",
        indicator: "Total population trend",
        indicatorSlug: "total-population",
        chart: "trend",
      },
      {
        label: "Find the gap",
        indicator: "Patients per physician",
        indicatorSlug: "physician-supply",
        chart: "ratio",
      },
    ],
    insight: "communities with the largest gap between population growth and physician supply",
    insightHighlight: "Sault Ste. Marie",
  },
  {
    number: "02",
    question: "Is this community growing or shrinking?",
    category: "Demographic outlook",
    categoryColor: "#164284",
    steps: [
      {
        label: "Population trajectory",
        indicator: "Total population",
        indicatorSlug: "total-population",
        chart: "trend",
      },
      {
        label: "Newcomer activity",
        indicator: "Recent immigrants",
        indicatorSlug: "recent-immigrants",
        chart: "trend",
      },
      {
        label: "Housing demand",
        indicator: "Housing starts",
        indicatorSlug: "housing-starts",
        chart: "comparison",
      },
    ],
    insight: "the difference between a one-year blip and a sustained 5-year pattern",
    insightHighlight: "Sustained growth",
  },
  {
    number: "03",
    question: "Will this community support a new business?",
    category: "Market sizing",
    categoryColor: "#b45309",
    steps: [
      {
        label: "Buying power",
        indicator: "Median household income",
        indicatorSlug: "median-household-income",
        chart: "comparison",
      },
      {
        label: "Workforce strength",
        indicator: "Employment rate",
        indicatorSlug: "employment-rate",
        chart: "trend",
      },
      {
        label: "Competitive density",
        indicator: "Active businesses",
        indicatorSlug: "business-count",
        chart: "comparison",
      },
    ],
    insight: "income, employment, and competition together — never one in isolation",
    insightHighlight: "Triangulate three signals",
  },
];

export function CaseStudies() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {CASES.map((c) => (
        <article
          key={c.number}
          className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-elev-1 transition-all hover:-translate-y-1 hover:shadow-elev-3"
        >
          {/* Accent bar */}
          <div
            className="h-1.5 w-full"
            style={{ background: c.categoryColor }}
          />

          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider">
              <span
                className="rounded-full px-2 py-0.5 text-white"
                style={{ background: c.categoryColor }}
              >
                Case · {c.number}
              </span>
              <span className="text-ink-500">{c.category}</span>
            </div>
            <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink-900">
              {c.question}
            </h3>
          </div>

          {/* Steps */}
          <div className="flex-1 space-y-3 px-6 pb-4">
            {c.steps.map((step, i) => (
              <div
                key={i}
                className="rounded-lg border border-ink-200 bg-ink-50/50 p-3 transition-colors group-hover:bg-white"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
                      Step {i + 1} · {step.label}
                    </div>
                    <div className="mt-0.5 truncate text-sm font-medium text-ink-800">
                      {step.indicator}
                    </div>
                  </div>
                  <MiniChart
                    type={step.chart}
                    accent={c.categoryColor}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Insight */}
          <div
            className="mx-6 mb-6 rounded-lg border-l-2 p-3"
            style={{
              borderLeftColor: c.categoryColor,
              background: `${c.categoryColor}10`,
            }}
          >
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
              Result
            </div>
            <p className="mt-1 text-sm leading-relaxed text-ink-800">
              <span
                className="font-semibold"
                style={{ color: c.categoryColor }}
              >
                {c.insightHighlight}
              </span>{" "}
              — {c.insight}.
            </p>
          </div>

          {/* CTA */}
          <Link
            href={`/indicators/${c.steps[0].indicatorSlug}`}
            className="flex items-center justify-between border-t border-ink-100 px-6 py-3.5 text-xs font-medium text-nordik-700 transition-colors hover:bg-nordik-50/40"
          >
            <span>Try this analysis</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </article>
      ))}
    </div>
  );
}

function MiniChart({
  type,
  accent,
}: {
  type: "trend" | "comparison" | "ratio";
  accent: string;
}) {
  if (type === "trend") {
    return (
      <svg
        viewBox="0 0 80 36"
        className="h-9 w-20 shrink-0"
        aria-hidden
      >
        <path
          d="M 4 28 Q 14 24, 22 22 T 40 14 T 60 10 L 76 6"
          fill="none"
          stroke={accent}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="76" cy="6" r="2.5" fill={accent} />
      </svg>
    );
  }
  if (type === "comparison") {
    return (
      <svg viewBox="0 0 80 36" className="h-9 w-20 shrink-0" aria-hidden>
        {[
          { x: 6, h: 22 },
          { x: 22, h: 14 },
          { x: 38, h: 28 },
          { x: 54, h: 18 },
          { x: 70, h: 10 },
        ].map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={32 - b.h}
            width="8"
            height={b.h}
            rx="1.5"
            fill={accent}
            opacity={0.4 + (i % 3) * 0.2}
          />
        ))}
      </svg>
    );
  }
  // ratio — donut
  return (
    <svg viewBox="0 0 36 36" className="h-9 w-9 shrink-0" aria-hidden>
      <circle
        cx="18"
        cy="18"
        r="14"
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="5"
      />
      <circle
        cx="18"
        cy="18"
        r="14"
        fill="none"
        stroke={accent}
        strokeWidth="5"
        strokeDasharray="60 88"
        strokeLinecap="round"
        transform="rotate(-90 18 18)"
      />
    </svg>
  );
}