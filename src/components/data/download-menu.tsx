"use client";

import { useState, useRef, useEffect } from "react";
import { Download, FileSpreadsheet, FileText, Link as LinkIcon, Check } from "lucide-react";
import type { ChartDataResponse } from "@/types";
import { downloadCSV, downloadExcel } from "@/lib/download";
import { DEFAULT_LOCALE, getTranslations, type Locale } from "@/lib/i18n";

export function DownloadMenu({
  data,
  locale = DEFAULT_LOCALE,
}: {
  data: ChartDataResponse;
  locale?: Locale;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = getTranslations(locale).chart;

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  async function copyLink() {
    if (typeof window === "undefined") return;
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink-200 bg-white px-3 text-sm font-medium text-ink-700 shadow-elev-1 transition-colors hover:border-ink-300 hover:text-ink-900"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Download className="h-4 w-4" aria-hidden />
        {t.download}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-lg border border-ink-200 bg-white shadow-elev-3 animate-fade-in"
        >
          <button
            type="button"
            onClick={async () => {
              setOpen(false);
              await downloadCSV(data);
            }}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-ink-800 hover:bg-nordik-50"
          >
            <FileText className="h-4 w-4 text-nordik-700" aria-hidden />
            <div>
              <div className="font-medium">{t.downloadCsv}</div>
              <div className="text-xs text-ink-500">
                {t.csvHelp}
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={async () => {
              setOpen(false);
              await downloadExcel(data);
            }}
            className="flex w-full items-center gap-2.5 border-t border-ink-100 px-3 py-2.5 text-left text-sm text-ink-800 hover:bg-nordik-50"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-700" aria-hidden />
            <div>
              <div className="font-medium">{t.downloadExcel}</div>
              <div className="text-xs text-ink-500">
                {t.excelHelp}
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              void copyLink();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2.5 border-t border-ink-100 px-3 py-2.5 text-left text-sm text-ink-800 hover:bg-nordik-50"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-700" aria-hidden />
            ) : (
              <LinkIcon className="h-4 w-4 text-ink-600" aria-hidden />
            )}
            <div>
              <div className="font-medium">
                {copied ? t.linkCopied : t.copyLink}
              </div>
              <div className="text-xs text-ink-500">
                {t.linkHelp}
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
