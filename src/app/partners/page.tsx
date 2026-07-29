import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import Link from "next/link";
import Image from "next/image";
import { getRequestLocale } from "@/lib/server/locale";
import { localizePath } from "@/lib/i18n";
import { ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = { title: "Partners" };

const COPY = {
  en: {
    breadcrumb: "Partners",
    heading: "Partners",
    intro:
      "DATANORTH is developed by NORDIK Institute. The platform exists to collect, organize, analyze, and share vital community data for Northern Ontario.",
    lead: "Lead organization",
    body1:
      "A community-based research institute at Algoma University in Sault Ste. Marie. NORDIK conducts applied research and community-engaged scholarship across Northern Ontario, with a focus on community development, social innovation, and evidence-based decision-making.",
    body2:
      "NORDIK leads DATANORTH as part of its long-term commitment to making local data accessible, usable, and accountable for the communities it serves.",
    visit: "Visit nordikinstitute.com",
    interested: "Interested in partnering? Get in touch through the",
    contact: "contact page",
  },
  fr: {
    breadcrumb: "Partenaires",
    heading: "Partenaires",
    intro:
      "DATANORTH est developpe par NORDIK Institute. La plateforme existe pour collecter, organiser, analyser et partager des donnees communautaires essentielles pour le Nord de l'Ontario.",
    lead: "Organisation responsable",
    body1:
      "Un institut de recherche communautaire a Algoma University a Sault Ste. Marie. NORDIK mene de la recherche appliquee et engagee avec les communautes du Nord de l'Ontario, avec un accent sur le developpement communautaire, l'innovation sociale et la prise de decision fondee sur des preuves.",
    body2:
      "NORDIK dirige DATANORTH dans le cadre de son engagement a long terme a rendre les donnees locales accessibles, utilisables et responsables pour les communautes qu'il sert.",
    visit: "Visiter nordikinstitute.com",
    interested: "Vous souhaitez devenir partenaire? Communiquez avec nous par la",
    contact: "page de contact",
  },
} as const;

export default async function PartnersPage() {
  const locale = await getRequestLocale();
  const copy = COPY[locale];

  return (
    <div className="content-container py-10">
      <Breadcrumbs items={[{ label: copy.breadcrumb }]} locale={locale} />
      <div className="mt-6 max-w-3xl">
        <h1 className="font-display text-display-lg font-semibold tracking-tight text-ink-900">
          {copy.heading}
        </h1>
        <p className="mt-4 text-ink-600">{copy.intro}</p>
      </div>

      <div className="mt-10 w-full overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-elev-2">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
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
                {copy.lead}
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

          <div className="flex flex-col justify-between p-8 lg:p-10">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
                NORDIK Institute
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-700">
                {copy.body1}
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-700">
                {copy.body2}
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="https://nordikinstitute.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-nordik-700 px-4 py-2 text-sm font-medium text-white shadow-elev-1 transition-colors hover:bg-nordik-800"
              >
                {copy.visit}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-10 text-sm text-ink-500">
        {copy.interested}{" "}
        <Link
          href={localizePath("/contact", locale)}
          className="text-nordik-700 link-underline"
        >
          {copy.contact}
        </Link>
        .
      </p>
    </div>
  );
}
