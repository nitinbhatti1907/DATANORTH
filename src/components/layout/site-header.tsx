"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const PRIMARY_NAV = [
  { href: "/explore", label: "Explore Data" },
  { href: "/categories", label: "Categories" },
  { href: "/communities", label: "Communities" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/70 bg-white/85 backdrop-blur-md">
      <div className="content-container flex h-16 items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-[1.35rem] font-semibold tracking-tight text-nordik-800"
          aria-label="DATANORTH — home"
        >
          <span className="relative flex h-7 w-7 items-center justify-center">
            <span className="absolute inset-0 rounded-[8px] bg-gradient-to-br from-nordik-500 to-nordik-800" />
            <span className="relative font-mono text-[11px] font-bold text-white">
              DN
            </span>
          </span>
          DATANORTH
        </Link>

        <nav className="ml-6 hidden flex-1 items-center gap-1 lg:flex">
          {PRIMARY_NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-nordik-50 text-nordik-800"
                    : "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/explore"
            className="hidden items-center gap-1.5 rounded-md border border-ink-200 bg-white px-3 py-1.5 text-sm text-ink-600 hover:border-ink-300 hover:text-ink-900 md:inline-flex"
          >
            <Search className="h-4 w-4" aria-hidden />
            Search
          </Link>
          <Link
            href="/explore"
            className="inline-flex items-center rounded-md bg-nordik-700 px-3.5 py-1.5 text-sm font-medium text-white shadow-elev-1 transition-colors hover:bg-nordik-800"
          >
            Explore data
          </Link>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-700 hover:bg-ink-100 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink-200 bg-white lg:hidden">
          <nav className="content-container flex flex-col py-3">
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-base font-medium text-ink-700 hover:bg-ink-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
