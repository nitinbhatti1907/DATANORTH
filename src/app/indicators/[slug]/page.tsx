import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { IndicatorView } from "@/components/data/indicator-view";
import { getIndicator, INDICATORS } from "@/lib/data/indicators";
import { CATEGORIES } from "@/lib/data/categories";
import {
  getAvailableYearsRepository,
  getIndicatorsRepository,
} from "@/lib/server/data-repository";
import { getRequestLocale } from "@/lib/server/locale";
import {
  getTranslations,
  localizePath,
  translateCategory,
  translateIndicator,
  translateUnit,
} from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { ArrowLeft, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";
export const dynamicParams = false;

export function generateStaticParams() {
  return INDICATORS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ind = getIndicator(slug);
  if (!ind) return { title: "Not found" };
  return { title: ind.name, description: ind.description };
}

// NOTE: searchParams is deliberately NOT read here. Reading searchParams
// on the server opts this route into dynamic rendering on every request.
// The IndicatorView client component reads filter state from the URL itself.
export default async function IndicatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const t = getTranslations(locale);
  const indicators = await getIndicatorsRepository(locale);
  const indicator =
    indicators.find((item) => item.slug === slug) ??
    (getIndicator(slug)
      ? translateIndicator(getIndicator(slug)!, locale)
      : undefined);
  if (!indicator) notFound();

  const category = translateCategory(CATEGORIES[indicator.category], locale);
  const years = await getAvailableYearsRepository(slug);

  return (
    <div className="content-container py-10">
      <Breadcrumbs
        items={[
          { href: localizePath("/categories", locale), label: t.nav.categories },
          {
            href: localizePath(`/categories/${category.slug}`, locale),
            label: category.name,
          },
          { label: indicator.name },
        ]}
        locale={locale}
      />

      <header className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-start">
        <div>
          <div
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider"
            style={{ color: category.accent }}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: category.accent }}
            />
            {category.name}
          </div>
          <h1 className="mt-2 font-display text-display-lg font-semibold leading-[1.05] tracking-tight text-ink-900">
            {indicator.name}
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-600">
            {indicator.description}
          </p>
        </div>
        <aside className="rounded-lg border border-ink-200 bg-white p-5 text-sm shadow-elev-1">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <dt className="text-xs uppercase tracking-wider text-ink-500">
              {t.common.unit}
            </dt>
            <dd className="text-ink-800">
              {translateUnit(indicator.unit, locale)}
            </dd>
            <dt className="text-xs uppercase tracking-wider text-ink-500">
              {t.common.updates}
            </dt>
            <dd className="text-ink-800">{indicator.updateFrequency}</dd>
            <dt className="text-xs uppercase tracking-wider text-ink-500">
              {t.common.lastUpdated}
            </dt>
            <dd className="text-ink-800">{formatDate(indicator.lastUpdated)}</dd>
            <dt className="text-xs uppercase tracking-wider text-ink-500">
              {t.common.source.replace(":", "")}
            </dt>
            <dd className="text-ink-800">{indicator.source}</dd>
          </dl>
        </aside>
      </header>

      {indicator.isSample && (
        <div className="mt-6 flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>
            {locale === "fr"
              ? "Les valeurs affichees pour cet indicateur sont des donnees de demonstration synthetiques. Elles conservent des ordres de grandeur realistes pour permettre l'examen complet de la plateforme, mais elles ne doivent pas etre citees. Des valeurs reelles les remplaceront une fois integrees depuis la source citee."
              : "The values shown for this indicator are synthetic demonstration data. They preserve realistic order of magnitude so the platform can be reviewed end to end, but they must not be cited. Real values will replace them once ingested from the cited source."}
          </p>
        </div>
      )}

      <Suspense fallback={<IndicatorViewFallback />}>
        <IndicatorView
          indicator={indicator}
          availableYears={years}
        />
      </Suspense>

      <section id="methodology" className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-ink-200 bg-white p-6 shadow-elev-1">
          <h2 className="font-display text-xl font-semibold tracking-tight text-ink-900">
            {t.common.methodology}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-700">
            {indicator.methodology}
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-ink-100 pt-5 text-sm">
            <dt className="text-xs uppercase tracking-wider text-ink-500">
              {t.common.license}
            </dt>
            <dd className="text-ink-800">{indicator.license}</dd>
            {indicator.sourceUrl && (
              <>
                <dt className="text-xs uppercase tracking-wider text-ink-500">
                  {t.common.sourceUrl}
                </dt>
                <dd className="truncate">
                  <a
                    href={indicator.sourceUrl}
                    target="_blank"
                    rel="noopener"
                    className="text-nordik-700 hover:text-nordik-800 link-underline"
                  >
                    {indicator.sourceUrl}
                  </a>
                </dd>
              </>
            )}
          </dl>
        </div>

        <div className="rounded-lg border border-ink-200 bg-white p-6 shadow-elev-1">
          <h2 className="font-display text-xl font-semibold tracking-tight text-ink-900">
            {locale === "fr"
              ? "Telecharger les donnees de ce graphique"
              : "Download this chart's data"}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-700">
            {locale === "fr" ? (
              <>
                Utilisez le bouton <strong>Telecharger</strong> du graphique
                ci-dessus pour exporter exactement les series et les geographies
                affichees, avec le filtre d'annees lorsque celui-ci est defini.
                Chaque fichier inclut la source, la methodologie, la licence et
                un horodatage d'exportation afin que les telechargements restent
                attribuables lorsqu'ils sont partages.
              </>
            ) : (
              <>
                Use the <strong>Download</strong> button on the chart above to
                export the exact series and geographies shown, filtered by year
                range where set. Every file includes source, methodology,
                license, and an exported-at timestamp so downloads remain
                attributable when shared.
              </>
            )}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-ink-700">
            <li>
              <span className="font-mono text-xs text-ink-500">.csv</span>{" "}
              {locale === "fr"
                ? "- texte brut; un bloc README au debut consigne les filtres"
                : "- plain-text; a README block at the top records the filters"}
            </li>
            <li>
              <span className="font-mono text-xs text-ink-500">.xlsx</span>{" "}
              {locale === "fr"
                ? "- inclut une feuille Methodologie separee"
                : "- includes a separate Methodology sheet"}
            </li>
          </ul>
        </div>
      </section>

      <div className="mt-10">
        <Link
          href={localizePath(`/categories/${category.slug}`, locale)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-nordik-700 link-underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {locale === "fr" ? "Retour a" : "Back to"} {category.name}
        </Link>
      </div>
    </div>
  );
}

function IndicatorViewFallback() {
  return (
    <>
      <div className="mt-8 h-20 rounded-lg border border-ink-200 bg-white shadow-elev-1" />
      <div className="mt-6 h-[460px] rounded-lg border border-ink-200 bg-white shadow-elev-1" />
    </>
  );
}
