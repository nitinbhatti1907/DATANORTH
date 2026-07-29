import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CategoryCard } from "@/components/cards/category-card";
import { CATEGORY_LIST } from "@/lib/data/categories";
import { getRequestLocale } from "@/lib/server/locale";
import { getTranslations, translateCategory } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Categories",
  description: "Browse every topic DATANORTH tracks.",
};

const COPY = {
  en: {
    topics: "Topics",
    heading: "Browse by category",
    intro:
      "Each category groups indicators on a shared theme. Click a card to see the indicators, see trends, compare communities, and download underlying data.",
  },
  fr: {
    topics: "Sujets",
    heading: "Parcourir par categorie",
    intro:
      "Chaque categorie regroupe des indicateurs autour d'un theme commun. Cliquez sur une carte pour voir les indicateurs, consulter les tendances, comparer les communautes et telecharger les donnees sous-jacentes.",
  },
} as const;

export default async function CategoriesPage() {
  const locale = await getRequestLocale();
  const categories = CATEGORY_LIST.map((category) =>
    translateCategory(category, locale),
  );
  const nav = getTranslations(locale).nav;
  const copy = COPY[locale];

  return (
    <div className="content-container py-10">
      <Breadcrumbs items={[{ label: nav.categories }]} locale={locale} />
      <div className="mt-6 max-w-2xl">
        <div className="text-xs font-medium uppercase tracking-wider text-nordik-700">
          {copy.topics}
        </div>
        <h1 className="mt-2 font-display text-display-lg font-semibold tracking-tight text-ink-900">
          {copy.heading}
        </h1>
        <p className="mt-3 text-ink-600">{copy.intro}</p>
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
    </div>
  );
}
