import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Mail } from "lucide-react";

export const dynamic = "force-static";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="content-container py-10">
      <Breadcrumbs items={[{ label: "Contact" }]} />
      <div className="mt-6 max-w-2xl">
        <h1 className="font-display text-display-lg font-semibold tracking-tight text-ink-900">
          Contact DATANORTH
        </h1>
        <p className="mt-4 text-ink-600">
          For questions, partnership inquiries, data corrections, or
          accessibility reports, please reach out. A formal contact form will
          be added with the next release.
        </p>
        <div className="mt-8 rounded-lg border border-ink-200 bg-white p-6 shadow-elev-1">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-ink-500">
            <Mail className="h-3.5 w-3.5" aria-hidden />
            Email
          </div>
          <p className="mt-2 text-ink-800">
            Please use the email address provided by your NORDIK Institute or
            DECIDE Research Lab contact.
          </p>
        </div>
      </div>
    </div>
  );
}
