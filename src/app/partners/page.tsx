import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const dynamic = "force-static";

export const metadata = { title: "Partners" };

export default function PartnersPage() {
  return (
    <div className="content-container py-10">
      <Breadcrumbs items={[{ label: "Partners" }]} />
      <div className="mt-6 max-w-2xl">
        <h1 className="font-display text-display-lg font-semibold tracking-tight text-ink-900">
          Partners
        </h1>
        <p className="mt-4 text-ink-600">
          DATANORTH is developed in partnership with the following organizations.
        </p>

        <ul className="mt-8 space-y-4">
          <PartnerRow
            name="NORDIK Institute"
            url="https://nordikinstitute.com"
            blurb="Northern Ontario Research, Development, Ideas and Knowledge — a community-based research institute at Algoma University."
          />
          <PartnerRow
            name="DECIDE Research Lab"
            url="https://decideresearchlab.org"
            blurb="Research and development partner focused on data-driven decision tools for communities and organizations."
          />
        </ul>

        <p className="mt-10 text-sm text-ink-500">
          Interested in partnering? Get in touch through the{" "}
          <Link href="/contact" className="text-nordik-700 link-underline">
            contact page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function PartnerRow({
  name,
  url,
  blurb,
}: {
  name: string;
  url: string;
  blurb: string;
}) {
  return (
    <li className="rounded-lg border border-ink-200 bg-white p-5 shadow-elev-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-display text-xl font-semibold tracking-tight text-ink-900">
            {name}
          </div>
          <p className="mt-1 text-sm text-ink-600">{blurb}</p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1 text-sm font-medium text-nordik-700 link-underline"
        >
          Visit
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>
    </li>
  );
}
