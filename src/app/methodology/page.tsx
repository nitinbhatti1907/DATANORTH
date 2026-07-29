import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { GEOGRAPHIES } from "@/lib/data/geographies";
import { MethodologyDictionary } from "@/components/methodology/dictionary";
import { HeroAnimation } from "@/components/methodology/hero-animation";
import { CaseStudies } from "@/components/methodology/case-studies";
import { ComparisonMatrix } from "@/components/methodology/comparison-matrix";
import { CountUp } from "@/components/ui/count-up";
import { getRequestLocale } from "@/lib/server/locale";
import { getIndicatorsRepository } from "@/lib/server/data-repository";
import { getTranslations, localizePath } from "@/lib/i18n";
import {
  ArrowRight,
  ShieldCheck,
  Quote,
  Mail,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Methodology & sources",
  description:
    "How DATANORTH sources its data, what to trust, what to verify, and how to use it for business decisions.",
};

const COPY = {
  en: {
    breadcrumb: "Methodology",
    heroEyebrow: "How to trust this data",
    heroStart: "From scattered data to",
    heroHighlight: "better decisions",
    heroBody:
      "DATANORTH brings public information about Northern Ontario into one place - verified, downloadable, and ready to act on.",
    datasetEyebrow: "The dataset, at a glance",
    datasetHeading: "Is it mature enough for your decision?",
    datasetBody: "A live snapshot of scope, freshness, and provenance.",
    totalIndicators: "Total indicators",
    realSourceData: "With real source data",
    ofCatalogue: "of catalogue",
    updatedSixMonths: "Updated in last 6 mo",
    rollingWindow: "rolling window",
    communitiesCovered: "Communities covered",
    regionalRollups: "plus regional rollups",
    whereFrom: "Where the data comes from",
    sampleUse: "indicators currently use sample data",
    sampleBody:
      "These preserve realistic orders of magnitude - tagged on every chart and export. Do not cite sample values.",
    practiceEyebrow: "See it in practice",
    practiceHeading: "Three real questions, three answers.",
    practiceBody:
      "Each case shows how three indicators combined produce a defensible conclusion.",
    compareEyebrow: "When to use what",
    compareHeading: "DATANORTH vs. the alternatives.",
    compareBody:
      "Where this platform helps you move fast, and where you should go straight to the source.",
    referenceEyebrow: "Full reference",
    referenceHeading: "Data dictionary.",
    referenceBody:
      "Every indicator with its source, license, update cadence, and status. Search, filter, and open the live chart.",
    citeHeading: "How to cite",
    citeBody: "Cite both DATANORTH and the original source.",
    wrongHeading: "Found something wrong?",
    wrongBody: "Corrections welcome - the platform improves through feedback.",
    reportIssue: "Report an issue",
    ctaEyebrow: "Ready to use it",
    ctaHeading: "Now go make a better decision.",
    browseCategories: "Browse categories",
    exploreData: "Explore data",
  },
  fr: {
    breadcrumb: "Methodologie",
    heroEyebrow: "Comment faire confiance a ces donnees",
    heroStart: "Des donnees dispersees vers de",
    heroHighlight: "meilleures decisions",
    heroBody:
      "DATANORTH rassemble l'information publique sur le Nord de l'Ontario en un seul endroit, verifie, telechargeable et pret a l'action.",
    datasetEyebrow: "Le jeu de donnees, en bref",
    datasetHeading: "Est-il assez mature pour votre decision?",
    datasetBody: "Un apercu en direct de la portee, de la fraicheur et de la provenance.",
    totalIndicators: "Indicateurs totaux",
    realSourceData: "Avec donnees reelles",
    ofCatalogue: "du catalogue",
    updatedSixMonths: "Mis a jour dans les 6 derniers mois",
    rollingWindow: "fenetre mobile",
    communitiesCovered: "Communautes couvertes",
    regionalRollups: "plus regroupements regionaux",
    whereFrom: "D'ou viennent les donnees",
    sampleUse: "indicateurs utilisent actuellement des donnees d'exemple",
    sampleBody:
      "Elles conservent des ordres de grandeur realistes et sont marquees sur chaque graphique et export. Ne citez pas les valeurs d'exemple.",
    practiceEyebrow: "Voir en pratique",
    practiceHeading: "Trois vraies questions, trois reponses.",
    practiceBody:
      "Chaque cas montre comment trois indicateurs combines produisent une conclusion defendable.",
    compareEyebrow: "Quand utiliser quoi",
    compareHeading: "DATANORTH par rapport aux autres options.",
    compareBody:
      "La ou cette plateforme vous aide a avancer vite, et la ou vous devriez aller directement a la source.",
    referenceEyebrow: "Reference complete",
    referenceHeading: "Dictionnaire des donnees.",
    referenceBody:
      "Chaque indicateur avec sa source, sa licence, sa frequence de mise a jour et son statut. Recherchez, filtrez et ouvrez le graphique en direct.",
    citeHeading: "Comment citer",
    citeBody: "Citez a la fois DATANORTH et la source originale.",
    wrongHeading: "Vous avez trouve une erreur?",
    wrongBody: "Les corrections sont bienvenues; la plateforme s'ameliore grace aux commentaires.",
    reportIssue: "Signaler un probleme",
    ctaEyebrow: "Pret a l'utiliser",
    ctaHeading: "Allez maintenant prendre une meilleure decision.",
    browseCategories: "Parcourir les categories",
    exploreData: "Explorer les donnees",
  },
} as const;

const COMMUNITY_COUNT = GEOGRAPHIES.filter((g) => g.type === "csd").length;

const SOURCE_GROUP_LABELS_FR: Record<string, string> = {
  "Statistics Canada": "Statistique Canada",
  Other: "Autre",
  Local: "Local",
  "DATANORTH-compiled": "Compile par DATANORTH",
};

export default async function MethodologyPage() {
  const locale = await getRequestLocale();
  const indicators = await getIndicatorsRepository(locale);
  const copy = COPY[locale];
  const t = getTranslations(locale);
  const total = indicators.length;
  const real = indicators.filter((i) => !i.isSample).length;
  const sample = total - real;
  const realPct = total ? Math.round((real / total) * 100) : 0;
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const recent = indicators.filter(
    (i) => new Date(i.lastUpdated) > sixMonthsAgo,
  ).length;
  const sourceGroups = getSourceGroups(indicators);

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
          <Breadcrumbs items={[{ label: copy.breadcrumb }]} locale={locale} />

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-nordik-200 bg-nordik-50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-nordik-700">
                <ShieldCheck className="h-3 w-3" aria-hidden />
                {copy.heroEyebrow}
              </div>
              <h1 className="mt-5 font-display text-display-xl font-semibold leading-[1.02] tracking-tight text-ink-900 lg:text-[3.75rem]">
                {copy.heroStart}{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-nordik-700">
                    {copy.heroHighlight}
                  </span>
                  <span
                    className="absolute bottom-1 left-0 right-0 -z-0 h-3 bg-nordik-100"
                    aria-hidden
                  />
                </span>
                .
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
                {copy.heroBody}
              </p>
            </div>

            <HeroAnimation locale={locale} />
          </div>
        </div>
      </section>

      {/* ============ DATASET HEALTH ============ */}
      <section className="content-container py-16 lg:py-20">
        <div className="max-w-2xl">
          <div className="text-xs font-medium uppercase tracking-wider text-nordik-700">
            {copy.datasetEyebrow}
          </div>
          <h2 className="mt-2 font-display text-display-lg font-semibold leading-[1.05] tracking-tight text-ink-900">
            {copy.datasetHeading}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
            {copy.datasetBody}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink-200 bg-ink-200 shadow-elev-1 lg:grid-cols-4">
          <DatasetStat label={copy.totalIndicators} value={`${total}`} />
          <DatasetStat
            label={copy.realSourceData}
            value={`${real}`}
            hint={`${realPct}% ${copy.ofCatalogue}`}
          />
          <DatasetStat
            label={copy.updatedSixMonths}
            value={`${recent}`}
            hint={copy.rollingWindow}
          />
          <DatasetStat
            label={copy.communitiesCovered}
            value={`${COMMUNITY_COUNT}`}
            hint={copy.regionalRollups}
          />
        </div>

        <div className="mt-6 rounded-xl border border-ink-200 bg-white p-6 shadow-elev-1">
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink-900">
            {copy.whereFrom}
          </h3>
          <div className="mt-5 grid gap-x-8 gap-y-3 md:grid-cols-2">
            {sourceGroups.map(([source, n]) => {
              const pct = total ? (n / total) * 100 : 0;
              return (
                <div key={source}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink-800">
                      {locale === "fr"
                        ? SOURCE_GROUP_LABELS_FR[source] ?? source
                        : source}
                    </span>
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

        {sample > 0 && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-700"
              aria-hidden
            />
            <div>
              <div className="font-semibold text-amber-900">
                <CountUp value={`${sample}`} />{" "}
                {locale === "fr" ? "sur" : "of"} {total} {copy.sampleUse}
              </div>
              <p className="mt-1 text-sm text-amber-900/90">
                {copy.sampleBody}
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
              {copy.practiceEyebrow}
            </div>
            <h2 className="mt-2 font-display text-display-lg font-semibold leading-[1.05] tracking-tight text-ink-900">
              {copy.practiceHeading}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
              {copy.practiceBody}
            </p>
          </div>

          <div className="mt-12">
            <CaseStudies locale={locale} />
          </div>
        </div>
      </section>

      {/* ============ COMPARISON MATRIX ============ */}
      <section className="content-container py-16 lg:py-20">
        <div className="max-w-2xl">
          <div className="text-xs font-medium uppercase tracking-wider text-nordik-700">
            {copy.compareEyebrow}
          </div>
          <h2 className="mt-2 font-display text-display-lg font-semibold leading-[1.05] tracking-tight text-ink-900">
            {copy.compareHeading}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
            {copy.compareBody}
          </p>
        </div>

        <div className="mt-10">
          <ComparisonMatrix locale={locale} />
        </div>
      </section>

      {/* ============ DATA DICTIONARY ============ */}
      <section className="border-t border-ink-200 bg-ink-50/40">
        <div className="content-container py-16 lg:py-20">
          <div className="max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-wider text-nordik-700">
              {copy.referenceEyebrow}
            </div>
            <h2 className="mt-2 font-display text-display-lg font-semibold leading-[1.05] tracking-tight text-ink-900">
              {copy.referenceHeading}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
              {copy.referenceBody}
            </p>
          </div>

          <div className="mt-10">
            <MethodologyDictionary indicators={indicators} locale={locale} />
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
                  {copy.citeHeading}
                </h3>
                <p className="mt-1.5 text-sm text-ink-600">
                  {copy.citeBody}
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
                  {copy.wrongHeading}
                </h3>
                <p className="mt-1.5 text-sm text-ink-600">
                  {copy.wrongBody}
                </p>
              </div>
            </div>
            <Link
              href={localizePath("/contact", locale)}
              className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-nordik-700 px-4 py-2 text-sm font-medium text-white shadow-elev-1 transition-colors hover:bg-nordik-800"
            >
              {copy.reportIssue}
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
                {copy.ctaEyebrow}
              </div>
              <h2 className="mt-5 font-display text-display-lg font-semibold tracking-tight text-white lg:text-display-xl">
                {copy.ctaHeading}
              </h2>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={localizePath("/categories", locale)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-white px-5 py-3 text-sm font-semibold text-nordik-800 shadow-elev-2 transition-transform hover:-translate-y-0.5 hover:shadow-elev-3"
                >
                  {copy.browseCategories}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href={localizePath("/explore", locale)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
                >
                  {copy.exploreData}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function getSourceGroups(indicators: Array<{ source: string }>) {
  const counts = new Map<string, number>();
  for (const i of indicators) {
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
