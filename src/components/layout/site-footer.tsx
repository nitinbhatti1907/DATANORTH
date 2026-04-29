import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const FOOTER_SECTIONS = [
  {
    title: "Data",
    links: [
      { href: "/explore", label: "Explore data" },
      { href: "/categories", label: "All categories" },
      { href: "/communities", label: "Communities" },
      { href: "/indicators", label: "All indicators" },
    ],
  },
  {
    title: "Transparency",
    links: [
      { href: "/methodology", label: "Methodology & sources" },
      { href: "/accessibility", label: "Accessibility" },
      { href: "/acknowledgement", label: "Land acknowledgement" },
    ],
  },
  {
    title: "Project",
    links: [
      { href: "/about", label: "About DATANORTH" },
      { href: "/partners", label: "Partners" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink-200 bg-ink-50/60">
      <div className="content-container py-14">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <Link
              href="/"
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
              A public data platform for Northern Ontario communities, built
              with NORDIK Institute and the DECIDE Research Lab.
            </p>
            <div className="mt-6 flex items-center gap-5">
              <a
                href="https://nordikinstitute.com"
                target="_blank"
                rel="noopener"
                className="text-sm font-medium text-ink-700 link-underline"
              >
                NORDIK Institute
                <ArrowUpRight className="ml-0.5 inline h-3 w-3" />
              </a>
              <a
                href="https://decideresearchlab.org"
                target="_blank"
                rel="noopener"
                className="text-sm font-medium text-ink-700 link-underline"
              >
                DECIDE Research Lab
                <ArrowUpRight className="ml-0.5 inline h-3 w-3" />
              </a>
            </div>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                {section.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-700 hover:text-nordik-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink-200 pt-6 text-xs text-ink-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} DATANORTH. Data is attributed to its
            original sources — see each chart&rsquo;s methodology.
          </p>
          <p className="font-mono">v2.0 · prototype</p>
        </div>
      </div>
    </footer>
  );
}
