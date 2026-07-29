import { Check, X, Minus } from "lucide-react";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

const ROWS: Array<{
  question: string;
  datanorth: "yes" | "partial" | "no";
  statcan: "yes" | "partial" | "no";
  generalSearch: "yes" | "partial" | "no";
  note?: string;
}> = [
  {
    question: "See multi-year trends instantly",
    datanorth: "yes",
    statcan: "partial",
    generalSearch: "no",
  },
  {
    question: "Compare communities side-by-side",
    datanorth: "yes",
    statcan: "partial",
    generalSearch: "no",
  },
  {
    question: "Download data as CSV / Excel",
    datanorth: "yes",
    statcan: "yes",
    generalSearch: "no",
  },
  {
    question: "Cite a single primary source",
    datanorth: "partial",
    statcan: "yes",
    generalSearch: "no",
    note: "Cite the original publisher for academic work.",
  },
  {
    question: "Real-time / same-day data",
    datanorth: "no",
    statcan: "no",
    generalSearch: "partial",
  },
  {
    question: "Sub-neighbourhood granularity",
    datanorth: "no",
    statcan: "partial",
    generalSearch: "no",
  },
  {
    question: "Free, no account required",
    datanorth: "yes",
    statcan: "yes",
    generalSearch: "yes",
  },
  {
    question: "Curated for Northern Ontario",
    datanorth: "yes",
    statcan: "no",
    generalSearch: "no",
  },
];

const ROWS_FR: typeof ROWS = [
  {
    question: "Voir instantanement les tendances pluriannuelles",
    datanorth: "yes",
    statcan: "partial",
    generalSearch: "no",
  },
  {
    question: "Comparer les communautes cote a cote",
    datanorth: "yes",
    statcan: "partial",
    generalSearch: "no",
  },
  {
    question: "Telecharger les donnees en CSV / Excel",
    datanorth: "yes",
    statcan: "yes",
    generalSearch: "no",
  },
  {
    question: "Citer une seule source primaire",
    datanorth: "partial",
    statcan: "yes",
    generalSearch: "no",
    note: "Citez l'editeur original pour les travaux universitaires.",
  },
  {
    question: "Donnees en temps reel / du jour meme",
    datanorth: "no",
    statcan: "no",
    generalSearch: "partial",
  },
  {
    question: "Granularite sous-quartier",
    datanorth: "no",
    statcan: "partial",
    generalSearch: "no",
  },
  {
    question: "Gratuit, aucun compte requis",
    datanorth: "yes",
    statcan: "yes",
    generalSearch: "yes",
  },
  {
    question: "Selectionne pour le Nord de l'Ontario",
    datanorth: "yes",
    statcan: "no",
    generalSearch: "no",
  },
];

export function ComparisonMatrix({
  locale = DEFAULT_LOCALE,
}: {
  locale?: Locale;
}) {
  const rows = locale === "fr" ? ROWS_FR : ROWS;
  const copy =
    locale === "fr"
      ? {
          need: "Ce que vous devez faire",
          sourcePortal: "Portail source direct",
          generalSearch: "Recherche web generale",
        }
      : {
          need: "What you need to do",
          sourcePortal: "Source portal direct",
          generalSearch: "General web search",
        };
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-elev-1">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 border-b border-ink-200 bg-white px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
                {copy.need}
              </th>
              <th
                className="border-b border-l border-ink-200 px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider"
                style={{
                  background:
                    "linear-gradient(180deg, #164284 0%, #1a4f99 100%)",
                  color: "white",
                }}
              >
                DATANORTH
              </th>
              <th className="border-b border-l border-ink-200 bg-ink-50/40 px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-ink-600">
                {copy.sourcePortal}
              </th>
              <th className="border-b border-l border-ink-200 bg-ink-50/40 px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-ink-600">
                {copy.generalSearch}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="group">
                <td className="sticky left-0 z-10 border-b border-ink-100 bg-white px-5 py-4 align-top group-hover:bg-nordik-50/30">
                  <div className="text-sm font-medium text-ink-900">
                    {row.question}
                  </div>
                  {row.note && (
                    <div className="mt-0.5 text-[11px] text-ink-500">
                      {row.note}
                    </div>
                  )}
                </td>
                <td className="border-b border-l border-ink-100 bg-nordik-50/40 px-5 py-4 text-center align-top">
                  <Status value={row.datanorth} />
                </td>
                <td className="border-b border-l border-ink-100 px-5 py-4 text-center align-top group-hover:bg-ink-50/40">
                  <Status value={row.statcan} muted />
                </td>
                <td className="border-b border-l border-ink-100 px-5 py-4 text-center align-top group-hover:bg-ink-50/40">
                  <Status value={row.generalSearch} muted />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-ink-200 bg-ink-50/40 px-5 py-3 text-xs text-ink-600">
        <Legend locale={locale} />
      </div>
    </div>
  );
}

function Status({
  value,
  muted = false,
}: {
  value: "yes" | "partial" | "no";
  muted?: boolean;
}) {
  if (value === "yes") {
    return (
      <span
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${muted ? "bg-emerald-50 text-emerald-700" : "bg-emerald-100 text-emerald-700"}`}
      >
        <Check className="h-4 w-4" strokeWidth={2.5} />
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${muted ? "bg-amber-50 text-amber-700" : "bg-amber-100 text-amber-700"}`}
      >
        <Minus className="h-4 w-4" strokeWidth={2.5} />
      </span>
    );
  }
  return (
    <span
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${muted ? "bg-ink-100 text-ink-400" : "bg-rose-50 text-rose-600"}`}
    >
      <X className="h-4 w-4" strokeWidth={2.5} />
    </span>
  );
}

function Legend({ locale }: { locale: Locale }) {
  const copy =
    locale === "fr"
      ? {
          yes: "Concu pour cela",
          partial: "Possible avec un effort supplementaire",
          no: "Non pris en charge",
        }
      : {
          yes: "Built for this",
          partial: "Possible with extra effort",
          no: "Not supported",
        };
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-1.5">
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Check className="h-2.5 w-2.5" strokeWidth={2.5} />
        </span>
        <span>{copy.yes}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <Minus className="h-2.5 w-2.5" strokeWidth={2.5} />
        </span>
        <span>{copy.partial}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <X className="h-2.5 w-2.5" strokeWidth={2.5} />
        </span>
        <span>{copy.no}</span>
      </div>
    </div>
  );
}
