import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export const dynamic = "force-static";

export const metadata = { title: "Partners" };

export default function PartnersPage() {
  return (
    <div className="content-container py-10">
      <Breadcrumbs items={[{ label: "Partners" }]} />
      <div className="mt-6 max-w-3xl">
        <h1 className="font-display text-display-lg font-semibold tracking-tight text-ink-900">
          Partners
        </h1>
        <p className="mt-4 text-ink-600">
          DATANORTH is developed by NORDIK Institute. The platform exists to
          collect, organize, analyze, and share vital community data for
          Northern Ontario.
        </p>
      </div>

      <div className="mt-10 w-full overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-elev-2">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          {/* Left: Logo block with brand gradient */}
          <div
            className="relative flex flex-col justify-between p-8 lg:p-10"
            style={{
              background:
                "linear-gradient(135deg, #164284 0%, #1a4f99 50%, #2563a8 100%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.4) 0%, transparent 50%)",
              }}
              aria-hidden
            />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/95 backdrop-blur-sm">
                Lead organization
              </div>
              <div className="mt-6 rounded-xl bg-white p-6 shadow-elev-2">
                <Image
                  src="/images/logos/nordik.png"
                  alt="NORDIK Institute"
                  width={1620}
                  height={376}
                  className="h-16 w-auto"
                  priority
                />
              </div>
            </div>
            <div className="relative mt-8">
              <p className="text-sm leading-relaxed text-white/90">
                Northern Ontario Research, Development, Ideas and Knowledge
              </p>
            </div>
          </div>

          {/* Right: Description */}
          <div className="flex flex-col justify-between p-8 lg:p-10">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
                NORDIK Institute
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-700">
                A community-based research institute at Algoma University in
                Sault Ste. Marie. NORDIK conducts applied research and
                community-engaged scholarship across Northern Ontario, with a
                focus on community development, social innovation, and
                evidence-based decision-making.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-700">
                NORDIK leads DATANORTH as part of its long-term commitment to
                making local data accessible, usable, and accountable for the
                communities it serves.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="https://nordikinstitute.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-nordik-700 px-4 py-2 text-sm font-medium text-white shadow-elev-1 transition-colors hover:bg-nordik-800"
              >
                Visit nordikinstitute.com
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-10 text-sm text-ink-500">
        Interested in partnering? Get in touch through the{" "}
        <Link href="/contact" className="text-nordik-700 link-underline">
          contact page
        </Link>
        .
      </p>
    </div>
  );
}