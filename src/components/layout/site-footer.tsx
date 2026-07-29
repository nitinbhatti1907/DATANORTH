"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import {
  getPathLocale,
  getTranslations,
  localizePath,
  type Locale,
} from "@/lib/i18n";
import { NordikAttribution } from "./nordik-attribution";

const FOOTER_SECTIONS = [
  {
    titleKey: "data",
    links: [
      { href: "/explore", labelKey: "explore" },
      { href: "/categories", labelKey: "allCategories" },
      { href: "/communities", labelKey: "communities" },
      { href: "/indicators", labelKey: "allIndicators" },
    ],
  },
  {
    titleKey: "transparency",
    links: [
      { href: "/methodology", labelKey: "methodologySources" },
      { href: "/accessibility", labelKey: "accessibility" },
      { href: "/acknowledgement", labelKey: "landAcknowledgement" },
    ],
  },
  {
    titleKey: "project",
    links: [
      { href: "/about", labelKey: "about" },
      { href: "/partners", labelKey: "partners" },
      { href: "/contact", labelKey: "contact" },
    ],
  },
] as const;

export function SiteFooter({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const currentLocale = getPathLocale(pathname) ?? locale;
  const t = getTranslations(currentLocale).footer;

  return (
    <footer className="mt-24 border-t border-ink-200 bg-ink-50/60">
      <div className="content-container py-14">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <Link
              href={localizePath("/", currentLocale)}
              className="inline-flex items-center gap-2.5 font-display text-[1.35rem] font-semibold tracking-tight text-nordik-800"
            >
              <span className="relative flex h-7 w-7 items-center justify-center">
                <span className="absolute inset-0 rounded-[8px] bg-gradient-to-br from-nordik-500 to-nordik-800" />
                <span className="relative font-mono text-[11px] font-bold text-white">
                  DN
                </span>
              </span>
              DATANORTH
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-600">
              {t.description}
            </p>
            <div className="mt-6">
              <NordikAttribution variant="stacked" />
            </div>
            <div className="mt-5">
              <a
                href="https://nordikinstitute.com"
                target="_blank"
                rel="noopener"
                className="text-sm font-medium text-ink-700 link-underline"
              >
                {t.visitNordik}
                <ArrowUpRight className="ml-0.5 inline h-3 w-3" />
              </a>
            </div>
          </div>
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.titleKey}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                {t.sections[section.titleKey]}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={localizePath(link.href, currentLocale)}
                      className="text-sm text-ink-700 hover:text-nordik-700"
                    >
                      {t.links[link.labelKey]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-ink-200 pt-6 text-xs text-ink-500 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {t.copyright}
          </p>
          <a
            href="https://nordikinstitute.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block transition-opacity hover:opacity-80"
            aria-label="Visit NORDIK Institute"
          >
            <img
              src="/images/logos/nordik.png"
              alt="NORDIK Institute"
              className="h-8 w-auto"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
