import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  DEFAULT_LOCALE,
  getTranslations,
  localizePath,
  type Locale,
} from "@/lib/i18n";

export interface Crumb {
  href?: string;
  label: string;
}

export function Breadcrumbs({
  items,
  locale = DEFAULT_LOCALE,
}: {
  items: Crumb[];
  locale?: Locale;
}) {
  const t = getTranslations(locale).common;
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-ink-500">
        <li>
          <Link href={localizePath("/", locale)} className="hover:text-nordik-700">
            {t.home}
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            {item.href && i < items.length - 1 ? (
              <Link
                href={localizePath(item.href, locale)}
                className="hover:text-nordik-700"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-ink-700">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
