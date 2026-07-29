"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Languages } from "lucide-react";
import {
  getPathLocale,
  getTranslations,
  LOCALE_COOKIE,
  localizePath,
  type Locale,
} from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = getPathLocale(pathname) ?? locale;
  const search = searchParams?.toString();
  const query = search ? `?${search}` : "";
  const t = getTranslations(currentLocale).nav;

  return (
    <div
      className="inline-flex h-9 items-center rounded-md border border-ink-200 bg-white p-0.5 shadow-elev-1"
      aria-label={t.language}
    >
      <Languages className="ml-2 h-4 w-4 text-ink-500" aria-hidden />
      {(["en", "fr"] as Locale[]).map((targetLocale) => {
        const active = targetLocale === currentLocale;
        const href = localizePath(pathname ?? "/", targetLocale, query);
        return (
          <a
            key={targetLocale}
            href={href}
            onClick={() => {
              document.cookie = `${LOCALE_COOKIE}=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;
            }}
            className={cn(
              "ml-1 inline-flex h-7 min-w-8 items-center justify-center rounded-[6px] px-2 text-xs font-semibold uppercase transition-colors",
              active
                ? "bg-nordik-700 text-white"
                : "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
            )}
            aria-current={active ? "true" : undefined}
            title={targetLocale === "en" ? t.english : t.french}
          >
            {targetLocale}
          </a>
        );
      })}
    </div>
  );
}
