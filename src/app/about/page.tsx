import Link from "next/link";
import Image from "next/image";
import { CountUp } from "@/components/ui/count-up";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { TeamSection } from "@/components/team/team-section";
import { getRequestLocale } from "@/lib/server/locale";
import { localizePath } from "@/lib/i18n";
import {
  ArrowRight,
  ArrowUpRight,
  Database,
  BarChart3,
  Share2,
  Compass,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About DATANORTH",
  description: "The purpose, partners, and long-term vision of DATANORTH.",
};

const STATS = [
  { label: "Indicators", labelFr: "Indicateurs", value: "53" },
  { label: "Categories", labelFr: "Categories", value: "10" },
  { label: "Communities", labelFr: "Communautes", value: "7" },
  { label: "Data sources", labelFr: "Sources de donnees", value: "5+" },
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

const PILLARS_FR = [
  {
    icon: Database,
    title: "Collecter",
    description:
      "Nous reunissons des donnees communautaires essentielles provenant de sources fiables - Statistique Canada, SCHL et organismes locaux - dans un seul endroit.",
    accent: "#164284",
  },
  {
    icon: BarChart3,
    title: "Analyser",
    description:
      "Les indicateurs sont organises, normalises et presentes sous forme de graphiques interactifs que chacun peut explorer, filtrer et comparer.",
    accent: "#b45309",
  },
  {
    icon: Share2,
    title: "Partager",
    description:
      "Chaque graphique peut etre telecharge en CSV ou Excel avec attribution complete de la source. Les donnees sont a vous pour les utiliser, les citer et construire dessus.",
    accent: "#047857",
  },
  {
    icon: Compass,
    title: "Soutenir les decisions",
    description:
      "Les communautes, organismes et chercheurs utilisent DATANORTH pour cerner les besoins, voir les ecarts et planifier avec des donnees probantes.",
    accent: "#6d28d9",
  },
];

const COPY = {
  en: {
    breadcrumb: "About",
    eyebrow: "About the project",
    heroPrefix: "A community data platform for",
    heroHighlight: "Northern Ontario",
    heroBody:
      "DATANORTH brings local indicators across population, housing, health, labour, economy, education, and environment into one trustworthy place - with a focus on Sault Ste. Marie and the rural and small communities of the North.",
    why: "Why we exist",
    whyHeading: "Local data, when you need it, in a form you can use.",
    whyP1:
      "Communities, organizations, and local decision-makers often cannot find localized data quickly enough to use it. Information is scattered across federal portals, provincial dashboards, paywalled reports, and PDFs.",
    whyP2:
      "DATANORTH exists to bridge that gap: to collect, organize, analyze, and share vital data so that communities across Northern Ontario can identify needs, see gaps in services, recognize opportunities, and make decisions backed by evidence.",
    principleLabel: "Our principle",
    principleTitle: "Open by default",
    principleBody:
      "Every chart cites its source. Every dataset is downloadable. Every methodology is documented. We don't hide behind proprietary dashboards - we publish the indicators so you can verify, cite, and build on them.",
    readMethodology: "Read our methodology",
    whatWeDo: "What we do",
    whatHeading: "From scattered statistics to community insight.",
    whatBody:
      "DATANORTH is built around four practices that turn public data into community understanding.",
    who: "Who builds it",
    developed: "Developed by NORDIK Institute.",
    leadOrg: "Lead organization",
    nordikBody:
      "A community-based research institute at Algoma University in Sault Ste. Marie. NORDIK conducts applied research and community-engaged scholarship across Northern Ontario, with a focus on community development, social innovation, and evidence-based decision-making.",
    datanorthProject:
      "DATANORTH is a NORDIK project: a long-term commitment to making local data accessible, usable, and accountable.",
    visit: "Visit nordikinstitute.com",
    partners: "All partners",
    next: "What's next",
    roadmap: "The roadmap.",
    now: "Now",
    nowTitle: "Indicators & data",
    nextPhase: "Next",
    nextTitle: "Comparison tools",
    later: "Later",
    laterTitle: "Forecasts",
    ctaHeading: "Start exploring the data.",
    ctaBody:
      "Browse indicators by category, drill into communities, compare trends, and download what you need.",
    explore: "Explore data",
    browse: "Browse categories",
  },
  fr: {
    breadcrumb: "A propos",
    eyebrow: "A propos du projet",
    heroPrefix: "Une plateforme de donnees communautaires pour le",
    heroHighlight: "Nord de l'Ontario",
    heroBody:
      "DATANORTH rassemble des indicateurs locaux sur la population, le logement, la sante, le travail, l'economie, l'education et l'environnement dans un seul espace fiable, avec un accent sur Sault Ste. Marie et les communautes rurales et petites du Nord.",
    why: "Pourquoi nous existons",
    whyHeading: "Des donnees locales, au moment voulu, dans une forme utilisable.",
    whyP1:
      "Les communautes, les organismes et les decideurs locaux ne trouvent souvent pas assez rapidement des donnees localisees pour les utiliser. L'information est dispersee entre portails federaux, tableaux de bord provinciaux, rapports payants et PDF.",
    whyP2:
      "DATANORTH existe pour combler cet ecart : collecter, organiser, analyser et partager des donnees essentielles afin que les communautes du Nord de l'Ontario puissent cerner les besoins, voir les lacunes de services, reconnaitre les occasions et prendre des decisions fondees sur des preuves.",
    principleLabel: "Notre principe",
    principleTitle: "Ouvert par defaut",
    principleBody:
      "Chaque graphique cite sa source. Chaque jeu de donnees est telechargeable. Chaque methodologie est documentee. Nous ne cachons pas les donnees derriere des tableaux de bord proprietaires : nous publions les indicateurs pour que vous puissiez les verifier, les citer et les reutiliser.",
    readMethodology: "Lire notre methodologie",
    whatWeDo: "Ce que nous faisons",
    whatHeading: "Des statistiques dispersees a l'intelligence communautaire.",
    whatBody:
      "DATANORTH repose sur quatre pratiques qui transforment les donnees publiques en comprehension communautaire.",
    who: "Qui le construit",
    developed: "Developpe par NORDIK Institute.",
    leadOrg: "Organisation responsable",
    nordikBody:
      "Un institut de recherche communautaire a Algoma University a Sault Ste. Marie. NORDIK mene de la recherche appliquee et engagee avec les communautes du Nord de l'Ontario, avec un accent sur le developpement communautaire, l'innovation sociale et la prise de decision fondee sur des preuves.",
    datanorthProject:
      "DATANORTH est un projet de NORDIK : un engagement a long terme a rendre les donnees locales accessibles, utilisables et responsables.",
    visit: "Visiter nordikinstitute.com",
    partners: "Tous les partenaires",
    next: "La suite",
    roadmap: "La feuille de route.",
    now: "Maintenant",
    nowTitle: "Indicateurs et donnees",
    nextPhase: "Ensuite",
    nextTitle: "Outils de comparaison",
    later: "Plus tard",
    laterTitle: "Previsions",
    ctaHeading: "Commencez a explorer les donnees.",
    ctaBody:
      "Parcourez les indicateurs par categorie, ouvrez les communautes, comparez les tendances et telechargez ce dont vous avez besoin.",
    explore: "Explorer les donnees",
    browse: "Parcourir les categories",
  },
} as const;

export default async function AboutPage() {
  const locale = await getRequestLocale();
  const copy = COPY[locale];
  const pillars = locale === "fr" ? PILLARS_FR : PILLARS;
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

          <div className="mt-8 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-nordik-200 bg-nordik-50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-nordik-700">
              <Sparkles className="h-3 w-3" aria-hidden />
              {copy.eyebrow}
            </div>
            <h1 className="mt-5 font-display text-display-xl font-semibold leading-[1.02] tracking-tight text-ink-900 lg:text-[3.75rem]">
              {copy.heroPrefix}{" "}
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
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-600 lg:text-xl">
              {copy.heroBody}
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
                  {locale === "fr" ? stat.labelFr : stat.label}
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
              {copy.why}
            </div>
            <h2 className="mt-2 font-display text-display-lg font-semibold leading-[1.05] tracking-tight text-ink-900">
              {copy.whyHeading}
            </h2>
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-700">
              <p>
                {copy.whyP1}
              </p>
              <p>
                {copy.whyP2}
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
                    {copy.principleLabel}
                  </div>
                  <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink-900">
                    {copy.principleTitle}
                  </h3>
                </div>
              </div>
              <p className="mt-5 text-[15px] leading-relaxed text-ink-700">
                {copy.principleBody}
              </p>
              <Link
                href={localizePath("/methodology", locale)}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-nordik-700 link-underline"
              >
                {copy.readMethodology}
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
              {copy.whatWeDo}
            </div>
            <h2 className="mt-2 font-display text-display-lg font-semibold leading-[1.05] tracking-tight text-ink-900">
              {copy.whatHeading}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
              {copy.whatBody}
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => {
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
            {copy.who}
          </div>
          <h2 className="mt-2 font-display text-display-lg font-semibold leading-[1.05] tracking-tight text-ink-900">
            {copy.developed}
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
                  {copy.leadOrg}
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
                  {copy.nordikBody}
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-700">
                  {copy.datanorthProject}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="https://nordikinstitute.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-nordik-700 px-4 py-2 text-sm font-medium text-white shadow-elev-1 transition-colors hover:bg-nordik-800"
                >
                  {copy.visit}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
                <Link
                  href={localizePath("/partners", locale)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-nordik-700 link-underline"
                >
                  {copy.partners}
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
                {copy.next}
              </div>
              <h2 className="mt-2 font-display text-display-lg font-semibold leading-[1.05] tracking-tight text-ink-900">
                {copy.roadmap}
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
                        {copy.now}
                      </div>
                      <div className="mt-0.5 text-sm font-medium text-ink-800">
                        {copy.nowTitle}
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
                        {copy.nextPhase}
                      </div>
                      <div className="mt-0.5 text-sm font-medium text-ink-800">
                        {copy.nextTitle}
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
                        {copy.later}
                      </div>
                      <div className="mt-0.5 text-sm font-medium text-ink-800">
                        {copy.laterTitle}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <RoadmapItem
                phase={copy.now}
                title={
                  locale === "fr"
                    ? "Elargir le catalogue d'indicateurs"
                    : "Expand the indicator catalogue"
                }
                description={
                  locale === "fr"
                    ? "Davantage d'indicateurs dans chaque categorie, avec des donnees reelles integrees depuis les sources citees."
                    : "More indicators across every category, with real data ingested from cited sources."
                }
              />
              <RoadmapItem
                phase={copy.nextPhase}
                title={
                  locale === "fr"
                    ? "Outils de comparaison communautaire"
                    : "Community-comparison tools"
                }
                description={
                  locale === "fr"
                    ? "Vues de comparaison cote a cote entre communautes, regions et periodes."
                    : "Side-by-side comparison views across communities, regions, and time periods."
                }
              />
              <RoadmapItem
                phase={copy.later}
                title={
                  locale === "fr"
                    ? "Previsions et projections"
                    : "Forecasts and projections"
                }
                description={
                  locale === "fr"
                    ? "Projections generees par modele avec intervalles de confiance, basees sur les series historiques existantes. Elles seront visuellement distinctes des valeurs observees."
                    : "Model-generated projections with confidence bands, built on the existing historical series. Visually distinct from observed values."
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ TEAM ============ */}
      <section className="content-container py-16 lg:py-20">
        <TeamSection locale={locale} />
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
                {copy.ctaHeading}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-white/85">
                {copy.ctaBody}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={localizePath("/explore", locale)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-white px-5 py-3 text-sm font-semibold text-nordik-800 shadow-elev-2 transition-transform hover:-translate-y-0.5 hover:shadow-elev-3"
                >
                  {copy.explore}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href={localizePath("/categories", locale)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
                >
                  {copy.browse}
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
