"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import {
  getPathLocale,
  getTranslations,
  localizePath,
  stripLocale,
  type Locale,
} from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { NordikAttribution } from "./nordik-attribution";

const PRIMARY_NAV = [
  { href: "/explore", key: "explore" },
  { href: "/categories", key: "categories" },
  { href: "/communities", key: "communities" },
  { href: "/methodology", key: "methodology" },
  { href: "/about", key: "about" },
] as const;

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const currentLocale = getPathLocale(pathname) ?? locale;
  const currentPath = stripLocale(pathname);
  const [open, setOpen] = useState(false);
  const t = getTranslations(currentLocale).nav;

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/70 bg-white/85 backdrop-blur-md">
      <div className="content-container flex h-16 items-center gap-4">
        <Link
          href={localizePath("/", currentLocale)}
          className="flex items-center gap-2.5 font-display text-[1.35rem] font-semibold tracking-tight text-nordik-800"
          aria-label={t.homeLabel}
        >
          <span className="relative flex h-7 w-7 items-center justify-center">
            <span className="absolute inset-0 rounded-[8px] bg-gradient-to-br from-nordik-500 to-nordik-800" />
            <span className="relative font-mono text-[11px] font-bold text-white">
              DN
            </span>
          </span>
          DATANORTH
        </Link>

        <div
          className="hidden h-6 w-px shrink-0 bg-ink-200 xl:block"
          aria-hidden
        />
        <NordikAttribution variant="compact" className="hidden xl:flex" />

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {PRIMARY_NAV.map((item) => {
            const active =
              currentPath === item.href ||
              currentPath.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={localizePath(item.href, currentLocale)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-nordik-50 text-nordik-800"
                    : "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
                )}
              >
                {t[item.key]}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden lg:block">
          <LanguageSwitcher locale={currentLocale} />
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-700 hover:bg-ink-100 lg:hidden"
          aria-label={t.toggleMenu}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-ink-200 bg-white lg:hidden">
          <nav className="content-container flex flex-col py-3">
            <div className="mb-3 px-3">
              <LanguageSwitcher locale={currentLocale} />
            </div>
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={localizePath(item.href, currentLocale)}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-base font-medium text-ink-700 hover:bg-ink-100"
              >
                {t[item.key]}
              </Link>
            ))}
            <div className="mt-3 border-t border-ink-100 px-3 py-3">
              <NordikAttribution variant="compact" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
