import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { getRequestLocale } from "@/lib/server/locale";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Land acknowledgement",
};

const COPY = {
  en: {
    title: "Land acknowledgement",
    p1: "DATANORTH operates on the traditional territories of First Nations peoples who have lived on and cared for these lands since time immemorial. We acknowledge the sovereignty of the First Nations, Metis, and Inuit peoples of Northern Ontario and commit to presenting data in a way that respects community data sovereignty and self-determination.",
    p2: "The specific wording and recognition of nations on whose territories the project operates will be developed in consultation with partner communities and the NORDIK Institute, and will be updated here as that work continues.",
  },
  fr: {
    title: "Reconnaissance territoriale",
    p1: "DATANORTH exerce ses activites sur les territoires traditionnels des peuples des Premieres Nations qui vivent sur ces terres et en prennent soin depuis des temps immemoriaux. Nous reconnaissons la souverainete des peuples des Premieres Nations, des Metis et des Inuit du Nord de l'Ontario et nous nous engageons a presenter les donnees d'une maniere qui respecte la souverainete des donnees communautaires et l'autodetermination.",
    p2: "La formulation precise et la reconnaissance des nations sur les territoires desquelles le projet se deroule seront elaborees en consultation avec les communautes partenaires et NORDIK Institute, puis mises a jour ici a mesure que ce travail se poursuit.",
  },
} as const;

export default async function AcknowledgementPage() {
  const locale = await getRequestLocale();
  const copy = COPY[locale];

  return (
    <div className="content-container py-10">
      <Breadcrumbs items={[{ label: copy.title }]} locale={locale} />
      <div className="mt-6 max-w-2xl">
        <h1 className="font-display text-display-lg font-semibold tracking-tight text-ink-900">
          {copy.title}
        </h1>
        <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-ink-700">
          <p>{copy.p1}</p>
          <p>{copy.p2}</p>
        </div>
      </div>
    </div>
  );
}
