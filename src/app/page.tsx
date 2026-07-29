import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Target } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { CategoryCard } from "@/components/cards/category-card";
import { KPIStrip, type KPITileData } from "@/components/data/kpi-strip";
import { CATEGORY_LIST } from "@/lib/data/categories";
import { getRequestLocale } from "@/lib/server/locale";
import { getIndicatorsRepository } from "@/lib/server/data-repository";
import { getTranslations, localizePath, translateCategory } from "@/lib/i18n";
import { getLatestValue } from "@/lib/query";

export const dynamic = "force-dynamic";

const HOME_COPY = {
  en: {
    browseEyebrow: "Browse the data",
    categoryHeading: "Explore by category",
    categoryBody:
      "Every category contains indicators you can filter by community, view as a chart or table, and download with full attribution.",
    allCategories: "All categories",
    snapshotEyebrow: "Sault Ste. Marie - latest",
    snapshotHeading: "A snapshot of the community",
    fullProfile: "Full community profile",
    sampleNoteStart: "Values marked",
    sampleNoteEnd:
      "are synthetic demonstration data. Real values will be ingested from Statistics Canada, CMHC, CIHI, and partner sources.",
    cards: [
      {
        title: "Built for decision-makers",
        body: "Community planners, service providers, and local governments can quickly see what's happening in their region and how it compares to the North.",
      },
      {
        title: "Every number cites its source",
        body: "Source, methodology, and last-updated date live on every chart. Download the underlying data as CSV or Excel with one click.",
      },
      {
        title: "Designed for research",
        body: "Compare geographies, filter by time, and export exactly what's on screen - with attribution included in every export file.",
      },
    ],
    developedBy: "Developed by",
    partnerNote:
      "DATANORTH serves the communities of Northern Ontario. It is not affiliated with Statistics Canada or any government agency; data is cited from each original source.",
  },
  fr: {
    browseEyebrow: "Parcourir les donnees",
    categoryHeading: "Explorer par categorie",
    categoryBody:
      "Chaque categorie contient des indicateurs que vous pouvez filtrer par communaute, afficher en graphique ou en tableau, et telecharger avec attribution complete.",
    allCategories: "Toutes les categories",
    snapshotEyebrow: "Sault Ste. Marie - plus recent",
    snapshotHeading: "Un apercu de la communaute",
    fullProfile: "Profil complet de la communaute",
    sampleNoteStart: "Les valeurs marquees",
    sampleNoteEnd:
      "sont des donnees de demonstration synthetiques. Les valeurs reelles seront integrees a partir de Statistique Canada, de la SCHL, de l'ICIS et de sources partenaires.",
    cards: [
      {
        title: "Concu pour les decideurs",
        body: "Les planificateurs communautaires, fournisseurs de services et administrations locales peuvent rapidement voir ce qui se passe dans leur region et comment elle se compare au Nord.",
      },
      {
        title: "Chaque chiffre cite sa source",
        body: "La source, la methodologie et la date de mise a jour figurent sur chaque graphique. Les donnees sous-jacentes se telechargent en CSV ou Excel en un clic.",
      },
      {
        title: "Concu pour la recherche",
        body: "Comparez les geographies, filtrez dans le temps et exportez exactement ce qui est affiche, avec l'attribution incluse dans chaque fichier.",
      },
    ],
    developedBy: "Developpe par",
    partnerNote:
      "DATANORTH sert les communautes du Nord de l'Ontario. La plateforme n'est pas affiliee a Statistique Canada ni a un organisme gouvernemental; les donnees sont citees depuis chaque source originale.",
  },
} as const;

export default async function HomePage() {
  const locale = await getRequestLocale();
  const common = getTranslations(locale).common;
  const copy = HOME_COPY[locale];
  const categories = CATEGORY_LIST.map((category) =>
    translateCategory(category, locale),
  );
  const featured = (await getIndicatorsRepository(locale)).filter(
    (indicator) => indicator.featured,
  );
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
          href: localizePath(`/indicators/${ind.slug}`, locale, "?geo=SSM"),
        },
      ];
    })
    .slice(0, 4);

  return (
    <>
      <Hero locale={locale} />

      <section className="content-container py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-nordik-700">
              {copy.browseEyebrow}
            </div>
            <h2 className="mt-2 font-display text-display-md font-semibold tracking-tight text-ink-900">
              {copy.categoryHeading}
            </h2>
            <p className="mt-2 max-w-xl text-ink-600">
              {copy.categoryBody}
            </p>
          </div>
          <Link
            href={localizePath("/categories", locale)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-nordik-700 link-underline"
          >
            {copy.allCategories}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger">
          {categories.map((c, i) => (
            <CategoryCard
              key={c.slug}
              category={c}
              priority={i < 4}
              locale={locale}
            />
          ))}
        </div>
      </section>

      <section className="border-y border-ink-100 bg-ink-50/60">
        <div className="content-container py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-nordik-700">
                {copy.snapshotEyebrow}
              </div>
              <h2 className="mt-2 font-display text-display-md font-semibold tracking-tight text-ink-900">
                {copy.snapshotHeading}
              </h2>
            </div>
            <Link
              href={localizePath("/communities/sault-ste-marie", locale)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-nordik-700 link-underline"
            >
              {copy.fullProfile}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-8">
            <KPIStrip tiles={tiles} locale={locale} />
          </div>
          <p className="mt-4 text-xs text-ink-500">
            {copy.sampleNoteStart}{" "}
            <span className="font-medium text-amber-800">{common.sample}</span>{" "}
            {copy.sampleNoteEnd}
          </p>
        </div>
      </section>

      <section className="content-container py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-3">
          <ValueCard
            icon={Target}
            title={copy.cards[0].title}
            body={copy.cards[0].body}
          />
          <ValueCard
            icon={FileText}
            title={copy.cards[1].title}
            body={copy.cards[1].body}
          />
          <ValueCard
            icon={BookOpen}
            title={copy.cards[2].title}
            body={copy.cards[2].body}
          />
        </div>
      </section>

      <section className="border-t border-ink-100 bg-white">
        <div className="content-container py-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-xs font-medium uppercase tracking-wider text-ink-500">
              {copy.developedBy}
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
            </div>
            <p className="max-w-2xl text-sm text-ink-600">
              {copy.partnerNote}
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
