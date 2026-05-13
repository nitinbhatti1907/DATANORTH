import Link from "next/link";
import Image from "next/image";
import { CountUp } from "@/components/ui/count-up";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { TeamSection } from "@/components/team/team-section";
import {
  ArrowRight,
  ArrowUpRight,
  Database,
  BarChart3,
  Share2,
  Compass,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-static";

export const metadata = {
  title: "About DATANORTH",
  description: "The purpose, partners, and long-term vision of DATANORTH.",
};

const STATS = [
  { label: "Indicators", value: "53" },
  { label: "Categories", value: "10" },
  { label: "Communities", value: "7" },
  { label: "Data sources", value: "5+" },
];

const PILLARS = [
  {
    icon: Database,
    title: "Collect",
    description:
      "We bring together vital community data from trusted sources — Statistics Canada, CMHC, and local agencies — into one place.",
    accent: "#164284",
  },
  {
    icon: BarChart3,
    title: "Analyze",
    description:
      "Indicators are organized, normalized, and rendered as interactive charts that anyone can explore, filter, and compare.",
    accent: "#b45309",
  },
  {
    icon: Share2,
    title: "Share",
    description:
      "Every chart can be downloaded as CSV or Excel with full source attribution. The data is yours to use, cite, and build on.",
    accent: "#047857",
  },
  {
    icon: Compass,
    title: "Support decisions",
    description:
      "Communities, organizations, and researchers use DATANORTH to identify needs, see gaps, and plan with evidence.",
    accent: "#6d28d9",
  },
];

export default function AboutPage() {
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
          <Breadcrumbs items={[{ label: "About" }]} />

          <div className="mt-8 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-nordik-200 bg-nordik-50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-nordik-700">
              <Sparkles className="h-3 w-3" aria-hidden />
              About the project
            </div>
            <h1 className="mt-5 font-display text-display-xl font-semibold leading-[1.02] tracking-tight text-ink-900 lg:text-[3.75rem]">
              A community data platform for{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-nordik-700">
                  Northern Ontario
                </span>
                <span
                  className="absolute bottom-1 left-0 right-0 -z-0 h-3 bg-nordik-100"
                  aria-hidden
                />
              </span>
              .
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-600 lg:text-xl">
              DATANORTH brings local indicators across population, housing,
              health, labour, economy, education, and environment into one
              trustworthy place — with a focus on Sault Ste. Marie and the
              rural and small communities of the North.
            </p>
          </div>

          {/* Stat strip */}
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink-200 bg-ink-200 shadow-elev-1 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-white px-6 py-5 transition-colors hover:bg-nordik-50/40"
              >
                <div className="num-plate font-display text-3xl font-semibold tracking-tight text-ink-900 lg:text-4xl">
                  <CountUp value={stat.value} />
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-ink-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY WE EXIST ============ */}
      <section className="content-container py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:items-center">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-nordik-700">
              Why we exist
            </div>
            <h2 className="mt-2 font-display text-display-lg font-semibold leading-[1.05] tracking-tight text-ink-900">
              Local data, when you need it, in a form you can use.
            </h2>
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-700">
              <p>
                Communities, organizations, and local decision-makers often
                cannot find localized data quickly enough to use it.
                Information is scattered across federal portals, provincial
                dashboards, paywalled reports, and PDFs.
              </p>
              <p>
                DATANORTH exists to bridge that gap: to collect, organize,
                analyze, and share vital data so that communities across
                Northern Ontario can identify needs, see gaps in services,
                recognize opportunities, and make decisions backed by
                evidence.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-br from-nordik-100 via-transparent to-amber-50/40 blur-2xl" />
            <div className="rounded-xl border border-ink-200 bg-white p-7 shadow-elev-2">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-nordik-100 text-nordik-700">
                  <Sparkles className="h-4 w-4" aria-hidden />
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-ink-500">
                    Our principle
                  </div>
                  <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink-900">
                    Open by default
                  </h3>
                </div>
              </div>
              <p className="mt-5 text-[15px] leading-relaxed text-ink-700">
                Every chart cites its source. Every dataset is downloadable.
                Every methodology is documented. We don&rsquo;t hide behind
                proprietary dashboards — we publish the indicators so you
                can verify, cite, and build on them.
              </p>
              <Link
                href="/methodology"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-nordik-700 link-underline"
              >
                Read our methodology
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHAT WE DO (PILLARS) ============ */}
      <section className="border-y border-ink-200 bg-ink-50/40">
        <div className="content-container py-16 lg:py-20">
          <div className="max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-wider text-nordik-700">
              What we do
            </div>
            <h2 className="mt-2 font-display text-display-lg font-semibold leading-[1.05] tracking-tight text-ink-900">
              From scattered statistics to community insight.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
              DATANORTH is built around four practices that turn public data
              into community understanding.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="group relative overflow-hidden rounded-xl border border-ink-200 bg-white p-6 shadow-elev-1 transition-all hover:-translate-y-1 hover:shadow-elev-3"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-1 transition-all group-hover:h-1.5"
                    style={{ background: pillar.accent }}
                  />
                  <div
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
                    style={{
                      background: `${pillar.accent}15`,
                      color: pillar.accent,
                    }}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-ink-900">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ WHO BUILDS IT ============ */}
      <section className="content-container py-16 lg:py-20">
        <div className="max-w-3xl">
          <div className="text-xs font-medium uppercase tracking-wider text-nordik-700">
            Who builds it
          </div>
          <h2 className="mt-2 font-display text-display-lg font-semibold leading-[1.05] tracking-tight text-ink-900">
            Developed by NORDIK Institute.
          </h2>
        </div>

        <div className="mt-10 w-full overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-elev-2">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            {/* Left: Logo block with brand gradient */}
            <div
              className="relative flex flex-col justify-between p-8 lg:p-10"
              style={{
                background:
                  "linear-gradient(135deg, #164284 0%, #1a4f99 50%, #2563a8 100%)",
              }}
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.4) 0%, transparent 50%)",
                }}
                aria-hidden
              />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/95 backdrop-blur-sm">
                  Lead organization
                </div>
                <div className="mt-6 rounded-xl bg-white p-6 shadow-elev-2">
                  <Image
                    src="/images/logos/nordik.png"
                    alt="NORDIK Institute"
                    width={1620}
                    height={376}
                    className="h-16 w-auto"
                    priority
                  />
                </div>
              </div>
              <div className="relative mt-8">
                <p className="text-sm leading-relaxed text-white/90">
                  Northern Ontario Research, Development, Ideas and Knowledge
                </p>
              </div>
            </div>

            {/* Right: Description */}
            <div className="flex flex-col justify-between p-8 lg:p-10">
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
                  NORDIK Institute
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-700">
                  A community-based research institute at Algoma University in
                  Sault Ste. Marie. NORDIK conducts applied research and
                  community-engaged scholarship across Northern Ontario, with a
                  focus on community development, social innovation, and
                  evidence-based decision-making.
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-700">
                  DATANORTH is a NORDIK project: a long-term commitment to
                  making local data accessible, usable, and accountable.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="https://nordikinstitute.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-nordik-700 px-4 py-2 text-sm font-medium text-white shadow-elev-1 transition-colors hover:bg-nordik-800"
                >
                  Visit nordikinstitute.com
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
                <Link
                  href="/partners"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-nordik-700 link-underline"
                >
                  All partners
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHAT'S NEXT ============ */}
      <section className="border-t border-ink-200 bg-ink-50/40">
        <div className="content-container py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="text-xs font-medium uppercase tracking-wider text-nordik-700">
                What&rsquo;s next
              </div>
              <h2 className="mt-2 font-display text-display-lg font-semibold leading-[1.05] tracking-tight text-ink-900">
                The roadmap.
              </h2>

              {/* Vertical progress visual */}
              <div className="mt-10 hidden lg:block">
                <div className="relative pl-1 pb-1">
                  {/* Vertical gradient track — stops cleanly at the last dot */}
                  <div
                    className="absolute left-3 top-3 w-px"
                    style={{
                      bottom: "20px",
                      background:
                        "linear-gradient(180deg, #164284 0%, #2563a8 50%, #b45309 100%)",
                    }}
                    aria-hidden
                  />

                  <div className="space-y-10">
                    <div className="relative pl-10">
                      <span
                        className="absolute left-0 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-white shadow-elev-1"
                        style={{ background: "#164284" }}
                        aria-hidden
                      >
                        <span className="h-2 w-2 rounded-full bg-white" />
                      </span>
                      <div className="text-xs font-semibold uppercase tracking-wider text-nordik-700">
                        Now
                      </div>
                      <div className="mt-0.5 text-sm font-medium text-ink-800">
                        Indicators & data
                      </div>
                    </div>

                    <div className="relative pl-10">
                      <span
                        className="absolute left-0 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-white shadow-elev-1"
                        style={{ background: "#2563a8" }}
                        aria-hidden
                      >
                        <span className="h-2 w-2 rounded-full bg-white" />
                      </span>
                      <div className="text-xs font-semibold uppercase tracking-wider text-nordik-700">
                        Next
                      </div>
                      <div className="mt-0.5 text-sm font-medium text-ink-800">
                        Comparison tools
                      </div>
                    </div>

                    <div className="relative pl-10">
                      <span
                        className="absolute left-0 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-white shadow-elev-1"
                        style={{ background: "#b45309" }}
                        aria-hidden
                      >
                        <span className="h-2 w-2 rounded-full bg-white" />
                      </span>
                      <div className="text-xs font-semibold uppercase tracking-wider text-nordik-700">
                        Later
                      </div>
                      <div className="mt-0.5 text-sm font-medium text-ink-800">
                        Forecasts
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <RoadmapItem
                phase="Now"
                title="Expand the indicator catalogue"
                description="More indicators across every category, with real data ingested from cited sources."
              />
              <RoadmapItem
                phase="Next"
                title="Community-comparison tools"
                description="Side-by-side comparison views across communities, regions, and time periods."
              />
              <RoadmapItem
                phase="Later"
                title="Forecasts and projections"
                description="Model-generated projections with confidence bands, built on the existing historical series. Visually distinct from observed values."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ TEAM ============ */}
      <section className="content-container py-16 lg:py-20">
        <TeamSection />
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
              <h2 className="font-display text-display-lg font-semibold tracking-tight text-white lg:text-display-xl">
                Start exploring the data.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-white/85">
                Browse indicators by category, drill into communities, compare
                trends, and download what you need.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-1.5 rounded-md bg-white px-5 py-3 text-sm font-semibold text-nordik-800 shadow-elev-2 transition-transform hover:-translate-y-0.5 hover:shadow-elev-3"
                >
                  Explore data
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
                >
                  Browse categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function RoadmapItem({
  phase,
  title,
  description,
}: {
  phase: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative rounded-xl border border-ink-200 bg-white p-6 transition-all hover:border-nordik-200 hover:shadow-elev-2">
      <div className="flex items-start gap-5">
        <div className="shrink-0 rounded-md bg-nordik-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-nordik-700">
          {phase}
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink-900">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

// "use client";