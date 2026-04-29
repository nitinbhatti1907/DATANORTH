import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types";
import { getIndicatorsByCategory } from "@/lib/data/indicators";

export function CategoryCard({
  category,
  priority = false,
}: {
  category: Category;
  priority?: boolean;
}) {
  const count = getIndicatorsByCategory(category.slug).length;
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative block overflow-hidden rounded-lg border border-ink-200 bg-white shadow-elev-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elev-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nordik-500 focus-visible:ring-offset-2"
      aria-label={`${category.name} — ${count} indicators`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={category.image}
          alt=""
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 320px"
          className="scale-[1.02] object-cover transition-transform duration-700 group-hover:scale-[1.08]"
        />
        {/* Tinted accent overlay */}
        <div
          className="absolute inset-0 mix-blend-multiply"
          aria-hidden
          style={{
            background: `linear-gradient(165deg, ${category.accent}99 0%, ${category.accent}40 55%, transparent 100%)`,
          }}
        />
        {/* Dark base for legibility */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div
            className="inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/95 backdrop-blur-sm"
            style={{ borderLeft: `2px solid ${category.accent}` }}
          >
            Category
          </div>
          <h3 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight text-white">
            {category.name}
          </h3>
        </div>
      </div>
      <div className="flex items-center justify-between px-5 py-4">
        <p className="pr-4 text-sm leading-snug text-ink-600">
          {category.description}
        </p>
        <div className="flex shrink-0 flex-col items-end gap-0.5">
          <span className="num-plate text-lg leading-none text-ink-900">
            {count}
          </span>
          <span className="text-[10px] uppercase tracking-wide text-ink-500">
            indicators
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-ink-100 px-5 py-3 text-sm text-nordik-700">
        <span className="font-medium">Explore</span>
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden
        />
      </div>
    </Link>
  );
}
