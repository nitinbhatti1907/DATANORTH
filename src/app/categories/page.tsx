import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CategoryCard } from "@/components/cards/category-card";
import { CATEGORY_LIST } from "@/lib/data/categories";

export const dynamic = "force-static";

export const metadata = {
  title: "Categories",
  description: "Browse every topic DATANORTH tracks.",
};

export default function CategoriesPage() {
  return (
    <div className="content-container py-10">
      <Breadcrumbs items={[{ label: "Categories" }]} />
      <div className="mt-6 max-w-2xl">
        <div className="text-xs font-medium uppercase tracking-wider text-nordik-700">
          Topics
        </div>
        <h1 className="mt-2 font-display text-display-lg font-semibold tracking-tight text-ink-900">
          Browse by category
        </h1>
        <p className="mt-3 text-ink-600">
          Each category groups indicators on a shared theme. Click a card to
          see the indicators, see trends, compare communities, and download
          underlying data.
        </p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger">
        {CATEGORY_LIST.map((c, i) => (
          <CategoryCard key={c.slug} category={c} priority={i < 4} />
        ))}
      </div>
    </div>
  );
}
