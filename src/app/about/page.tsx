import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export const dynamic = "force-static";

export const metadata = {
  title: "About DATANORTH",
  description: "The purpose, partners, and long-term vision of DATANORTH.",
};

export default function AboutPage() {
  return (
    <div className="content-container py-10">
      <Breadcrumbs items={[{ label: "About" }]} />
      <div className="mt-6 max-w-3xl">
        <h1 className="font-display text-display-lg font-semibold tracking-tight text-ink-900">
          About DATANORTH
        </h1>
        <div className="mt-6 space-y-6 text-[15px] leading-relaxed text-ink-700">
          <p>
            DATANORTH is a community data platform for Northern Ontario. It
            brings local indicators across population, housing, health,
            labour, economy, education, and environment into one trustworthy
            place — with a focus on Sault Ste. Marie and the rural and small
            communities of the North.
          </p>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
            Why this exists
          </h2>
          <p>
            Communities, organizations, and local decision-makers often
            cannot find localized data quickly enough to use it. DATANORTH
            exists to bridge that gap: to collect, organize, analyze, and
            share vital data so that communities can identify needs, see gaps
            in services, recognize opportunities, and make evidence-based
            decisions.
          </p>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
            Who builds it
          </h2>
          <p>
            DATANORTH is developed with{" "}
            <a
              href="https://nordikinstitute.com"
              target="_blank"
              rel="noopener"
              className="text-nordik-700 link-underline"
            >
              NORDIK Institute
            </a>{" "}
            and the{" "}
            <a
              href="https://decideresearchlab.org"
              target="_blank"
              rel="noopener"
              className="text-nordik-700 link-underline"
            >
              DECIDE Research Lab
            </a>
            . It is a community-oriented, non-commercial project.
          </p>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
            What&rsquo;s next
          </h2>
          <p>
            Upcoming releases will expand the indicator set, add
            community-comparison tools, and introduce forecast views built on
            top of the existing historical series. The platform is designed
            so those features can be added without changing how today&rsquo;s
            charts look or behave.
          </p>
        </div>
      </div>
    </div>
  );
}
