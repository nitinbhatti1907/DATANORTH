import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Target } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { CategoryCard } from "@/components/cards/category-card";
import { KPIStrip, type KPITileData } from "@/components/data/kpi-strip";
import { CATEGORY_LIST } from "@/lib/data/categories";
import { getFeaturedIndicators } from "@/lib/data/indicators";
import { getLatestValue } from "@/lib/query";

export const dynamic = "force-static";

export default function HomePage() {
  const featured = getFeaturedIndicators();
  const tiles: KPITileData[] = featured
    .flatMap<KPITileData>((ind) => {
      const latest = getLatestValue(ind.slug, "SSM");
      if (!latest) return [];
      return [
        {
          indicator: ind,
          latest: latest.value,
          previous: latest.previous,
          latestYear: latest.year,
          href: `/indicators/${ind.slug}?geo=SSM`,
        },
      ];
    })
    .slice(0, 4);

  return (
    <>
      <Hero />

      {/* CATEGORY GRID */}
      <section className="content-container py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-nordik-700">
              Browse the data
            </div>
            <h2 className="mt-2 font-display text-display-md font-semibold tracking-tight text-ink-900">
              Explore by category
            </h2>
            <p className="mt-2 max-w-xl text-ink-600">
              Every category contains indicators you can filter by community,
              view as a chart or table, and download with full attribution.
            </p>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-nordik-700 link-underline"
          >
            All categories
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger">
          {CATEGORY_LIST.map((c, i) => (
            <CategoryCard key={c.slug} category={c} priority={i < 4} />
          ))}
        </div>
      </section>

      {/* KPI SNAPSHOT */}
      <section className="border-y border-ink-100 bg-ink-50/60">
        <div className="content-container py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-nordik-700">
                Sault Ste. Marie · latest
              </div>
              <h2 className="mt-2 font-display text-display-md font-semibold tracking-tight text-ink-900">
                A snapshot of the community
              </h2>
            </div>
            <Link
              href="/communities/sault-ste-marie"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-nordik-700 link-underline"
            >
              Full community profile
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-8">
            <KPIStrip tiles={tiles} />
          </div>
          <p className="mt-4 text-xs text-ink-500">
            Values marked <span className="font-medium text-amber-800">sample</span> are synthetic demonstration data. Real values will be ingested from Statistics Canada, CMHC, CIHI, and partner sources.
          </p>
        </div>
      </section>

      {/* VALUE PROPOSITION TRIAD */}
      <section className="content-container py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-3">
          <ValueCard
            icon={Target}
            title="Built for decision-makers"
            body="Community planners, service providers, and local governments can quickly see what's happening in their region and how it compares to the North."
          />
          <ValueCard
            icon={FileText}
            title="Every number cites its source"
            body="Source, methodology, and last-updated date live on every chart. Download the underlying data as CSV or Excel with one click."
          />
          <ValueCard
            icon={BookOpen}
            title="Designed for research"
            body="Compare geographies, filter by time, and export exactly what's on screen — with attribution included in every export file."
          />
        </div>
      </section>

      {/* PARTNERS STRIP */}
      <section className="border-t border-ink-100 bg-white">
        <div className="content-container py-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-xs font-medium uppercase tracking-wider text-ink-500">
              In partnership with
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <a
                href="https://nordikinstitute.com"
                target="_blank"
                rel="noopener"
                className="font-display text-xl font-semibold text-ink-800 hover:text-nordik-700"
              >
                NORDIK Institute
              </a>
              <span className="h-5 w-px bg-ink-200" aria-hidden />
              <a
                href="https://decideresearchlab.org"
                target="_blank"
                rel="noopener"
                className="font-display text-xl font-semibold text-ink-800 hover:text-nordik-700"
              >
                DECIDE Research Lab
              </a>
            </div>
            <p className="max-w-2xl text-sm text-ink-600">
              DATANORTH serves the communities of Northern Ontario. It is not
              affiliated with Statistics Canada or any government agency; data
              is cited from each original source.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function ValueCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-ink-200 bg-white p-6 shadow-elev-1">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-nordik-50 text-nordik-700">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink-900">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">{body}</p>
    </div>
  );
}
