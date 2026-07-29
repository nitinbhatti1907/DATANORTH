import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { FEATURED_COMMUNITIES, getGeography } from "@/lib/data/geographies";
import { formatNumber } from "@/lib/format";
import { getRequestLocale } from "@/lib/server/locale";
import {
  getTranslations,
  localizePath,
  translateGeography,
} from "@/lib/i18n";
import { ArrowUpRight, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Communities",
  description: "Browse Northern Ontario communities.",
};

const COPY = {
  en: {
    heading: "Communities",
    intro:
      "Explore local indicators for communities across Northern Ontario. Sault Ste. Marie is the project's primary geography; other communities are included as data availability permits.",
    primary: "Primary",
    community: "Community",
    population: "Population",
    note:
      "Population reported from the 2021 Census of Population for the corresponding census subdivision. Additional communities, First Nations reserves, and unorganized territories will be added as data is ingested.",
  },
  fr: {
    heading: "Communautes",
    intro:
      "Explorez les indicateurs locaux des communautes du Nord de l'Ontario. Sault Ste. Marie est la geographie principale du projet; d'autres communautes sont incluses selon la disponibilite des donnees.",
    primary: "Principale",
    community: "Communaute",
    population: "Population",
    note:
      "La population provient du Recensement de la population de 2021 pour la subdivision de recensement correspondante. D'autres communautes, reserves des Premieres Nations et territoires non organises seront ajoutes au fur et a mesure de l'integration des donnees.",
  },
} as const;

function slug(code: string) {
  return (
    getGeography(code)
      ?.name.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/\./g, "") ?? code.toLowerCase()
  );
}

export default async function CommunitiesPage() {
  const locale = await getRequestLocale();
  const nav = getTranslations(locale).nav;
  const copy = COPY[locale];

  return (
    <div className="content-container py-10">
      <Breadcrumbs items={[{ label: nav.communities }]} locale={locale} />
      <div className="mt-6 max-w-2xl">
        <h1 className="font-display text-display-lg font-semibold tracking-tight text-ink-900">
          {copy.heading}
        </h1>
        <p className="mt-3 text-ink-600">{copy.intro}</p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger">
        {FEATURED_COMMUNITIES.map((code) => {
          const baseGeography = getGeography(code);
          if (!baseGeography) return null;
          const g = translateGeography(baseGeography, locale);
          const isPrimary = code === "SSM";
          return (
            <Link
              key={code}
              href={localizePath(`/communities/${slug(code)}`, locale)}
              className="group relative rounded-lg border border-ink-200 bg-white p-6 shadow-elev-1 transition-all hover:-translate-y-0.5 hover:border-nordik-200 hover:shadow-elev-3"
            >
              {isPrimary && (
                <span className="absolute right-4 top-4 rounded-full bg-nordik-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-nordik-800">
                  {copy.primary}
                </span>
              )}
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-ink-500">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {copy.community}
              </div>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink-900">
                {g.name}
              </h2>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-ink-500">
                    {copy.population}
                  </div>
                  <div className="num-plate mt-1 text-2xl text-ink-900">
                    {g.population != null ? formatNumber(g.population) : "-"}
                  </div>
                </div>
                <ArrowUpRight
                  className="h-4 w-4 text-ink-400 transition-colors group-hover:text-nordik-700"
                  aria-hidden
                />
              </div>
            </Link>
          );
        })}
      </div>

      <p className="mt-10 text-xs text-ink-500">{copy.note}</p>
    </div>
  );
}
