import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { getRequestLocale } from "@/lib/server/locale";
import { Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = { title: "Contact" };

const COPY = {
  en: {
    breadcrumb: "Contact",
    heading: "Contact DATANORTH",
    body:
      "For questions, partnership inquiries, data corrections, or accessibility reports, please reach out. A formal contact form will be added with the next release.",
    email: "Email",
    note: "Please use the email address provided by NORDIK Institute.",
  },
  fr: {
    breadcrumb: "Contact",
    heading: "Contacter DATANORTH",
    body:
      "Pour les questions, demandes de partenariat, corrections de donnees ou signalements d'accessibilite, veuillez nous joindre. Un formulaire de contact officiel sera ajoute dans la prochaine version.",
    email: "Courriel",
    note: "Veuillez utiliser l'adresse courriel fournie par NORDIK Institute.",
  },
} as const;

export default async function ContactPage() {
  const locale = await getRequestLocale();
  const copy = COPY[locale];

  return (
    <div className="content-container py-10">
      <Breadcrumbs items={[{ label: copy.breadcrumb }]} locale={locale} />
      <div className="mt-6 max-w-2xl">
        <h1 className="font-display text-display-lg font-semibold tracking-tight text-ink-900">
          {copy.heading}
        </h1>
        <p className="mt-4 text-ink-600">{copy.body}</p>
        <div className="mt-8 rounded-lg border border-ink-200 bg-white p-6 shadow-elev-1">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-ink-500">
            <Mail className="h-3.5 w-3.5" aria-hidden />
            {copy.email}
          </div>
          <p className="mt-2 text-ink-800">{copy.note}</p>
        </div>
      </div>
    </div>
  );
}
