import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import Link from "next/link";
import { getRequestLocale } from "@/lib/server/locale";
import { localizePath } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata = { title: "Accessibility" };

const COPY = {
  en: {
    title: "Accessibility",
    p1: (
      <>
        DATANORTH is built with accessibility as a first-class concern. We
        target WCAG 2.1 AA conformance: sufficient colour contrast, full
        keyboard navigation, visible focus states, semantic markup, and respect
        for <code>prefers-reduced-motion</code>. Every chart offers a table view
        for users who prefer tabular data over graphical representations.
      </>
    ),
    p2Start: "If you find something inaccessible, please let us know through the",
    contact: "contact page",
    p2End: "We treat accessibility issues as bugs, not requests.",
  },
  fr: {
    title: "Accessibilite",
    p1: (
      <>
        DATANORTH est construit avec l'accessibilite comme priorite. Nous visons
        la conformite WCAG 2.1 AA : contraste de couleur suffisant, navigation
        complete au clavier, etats de focus visibles, balisage semantique et
        respect de <code>prefers-reduced-motion</code>. Chaque graphique offre
        une vue tableau pour les personnes qui preferent les donnees tabulaires
        aux representations graphiques.
      </>
    ),
    p2Start:
      "Si vous trouvez un element inaccessible, veuillez nous le signaler par la",
    contact: "page de contact",
    p2End:
      "Nous traitons les problemes d'accessibilite comme des bogues, pas comme des demandes.",
  },
} as const;

export default async function AccessibilityPage() {
  const locale = await getRequestLocale();
  const copy = COPY[locale];

  return (
    <div className="content-container py-10">
      <Breadcrumbs items={[{ label: copy.title }]} locale={locale} />
      <div className="mt-6 max-w-2xl">
        <h1 className="font-display text-display-lg font-semibold tracking-tight text-ink-900">
          {copy.title}
        </h1>
        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-700">
          <p>{copy.p1}</p>
          <p>
            {copy.p2Start}{" "}
            <Link
              href={localizePath("/contact", locale)}
              className="text-nordik-700 link-underline"
            >
              {copy.contact}
            </Link>
            . {copy.p2End}
          </p>
        </div>
      </div>
    </div>
  );
}
