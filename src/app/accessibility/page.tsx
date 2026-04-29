import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata = { title: "Accessibility" };

export default function AccessibilityPage() {
  return (
    <div className="content-container py-10">
      <Breadcrumbs items={[{ label: "Accessibility" }]} />
      <div className="mt-6 max-w-2xl">
        <h1 className="font-display text-display-lg font-semibold tracking-tight text-ink-900">
          Accessibility
        </h1>
        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-700">
          <p>
            DATANORTH is built with accessibility as a first-class concern.
            We target WCAG 2.1 AA conformance: sufficient colour contrast,
            full keyboard navigation, visible focus states, semantic markup,
            and respect for <code>prefers-reduced-motion</code>. Every chart
            offers a table view for users who prefer tabular data over
            graphical representations.
          </p>
          <p>
            If you find something inaccessible, please let us know through the{" "}
            <Link href="/contact" className="text-nordik-700 link-underline">
              contact page
            </Link>
            . We treat accessibility issues as bugs, not requests.
          </p>
        </div>
      </div>
    </div>
  );
}
