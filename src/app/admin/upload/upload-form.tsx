"use client";

import { useMemo, useState } from "react";
import { Download, FileCheck, RefreshCw, Upload } from "lucide-react";
import { CATEGORY_LIST } from "@/lib/data/categories";
import type { Indicator } from "@/types";

type PreviewRow = {
  indicator_slug: string;
  geography_code: string;
  year: number;
  value: number;
  label?: string;
};

type ProcessSummary = {
  filesProcessed: number;
  rawRowsRead: number;
  candidateRows: number;
  processedRows: number;
  skippedRows: number;
  exactDuplicateRows: number;
  conflictRows: number;
  geographies: string[];
  years: number[];
};

type UploadState =
  | { status: "idle" }
  | { status: "working"; message: string; progress?: number }
  | {
      status: "valid";
      rowCount: number;
      preview: PreviewRow[];
      warnings?: string[];
    }
  | {
      status: "processed";
      rowCount: number;
      preview: PreviewRow[];
      warnings: string[];
      summary?: ProcessSummary;
    }
  | { status: "success"; message: string }
  | { status: "error"; message: string; errors?: string[] };

type ImportMode = "replace" | "extend";

type RawProcessResponse = {
  csv?: string;
  filename?: string;
  rowCount?: number;
  preview?: PreviewRow[];
  warnings?: string[];
  summary?: ProcessSummary;
  error?: string;
  errors?: string[];
};

export function UploadForm({ indicators }: { indicators: Indicator[] }) {
  const [categorySlug, setCategorySlug] = useState("");
  const [indicatorSlug, setIndicatorSlug] = useState("");
  const [importMode, setImportMode] = useState<ImportMode>("extend");
  const [sourceUrl, setSourceUrl] = useState("");
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const [processedCsv, setProcessedCsv] = useState("");
  const [processedFilename, setProcessedFilename] = useState("");
  const [hasImportFile, setHasImportFile] = useState(false);

  const filteredIndicators = useMemo(() => {
    if (!categorySlug) return [];
    return indicators.filter((indicator) => indicator.category === categorySlug);
  }, [categorySlug, indicators]);

  const selectedIndicator = useMemo(
    () => indicators.find((indicator) => indicator.slug === indicatorSlug),
    [indicatorSlug, indicators],
  );

  const validationSucceeded = state.status === "valid";

  function updateCategory(value: string) {
    setCategorySlug(value);
    setIndicatorSlug("");
    setSourceUrl("");
    resetProcessedFile();
    resetImportValidation();
  }

  function updateIndicator(value: string) {
    setIndicatorSlug(value);
    setSourceUrl("");
    resetProcessedFile();
    resetImportValidation();
  }

  function updateImportMode(value: ImportMode) {
    setImportMode(value);
    resetImportValidation();
  }

  function updateImportFile(files: FileList | null) {
    setHasImportFile(Boolean(files?.length));
    resetImportValidation();
  }

  function resetImportValidation() {
    setState({ status: "idle" });
  }

  function resetProcessedFile() {
    setProcessedCsv("");
    setProcessedFilename("");
  }

  async function processRawFiles() {
    if (!categorySlug || !indicatorSlug) {
      setState({
        status: "error",
        message: "Select a category and indicator before processing raw files.",
      });
      return;
    }

    const form = document.querySelector<HTMLFormElement>("#admin-raw-process-form");
    if (!form) return;
    const formData = new FormData(form);
    const rawPath = String(formData.get("rawPath") ?? "").trim();
    if (rawPath) {
      formData.delete("files");
      formData.set("rawPath", rawPath);
    }
    formData.set("category", categorySlug);
    formData.set("indicatorSlug", indicatorSlug);

    setState({ status: "working", message: "Processing raw files...", progress: 0 });
    const progressTimer = window.setInterval(() => {
      setState((current) => {
        if (current.status !== "working" || current.progress == null) {
          return current;
        }
        const nextProgress =
          current.progress < 50
            ? current.progress + 10
            : current.progress < 80
              ? current.progress + 5
              : current.progress + 2;
        return {
          ...current,
          progress: Math.min(nextProgress, 95),
        };
      });
    }, 700);

    let json: RawProcessResponse = {};
    try {
      const res = await fetch("/api/admin/uploads/process", {
        method: "POST",
        body: formData,
      });
      json = await res.json();

      window.clearInterval(progressTimer);

      if (!res.ok) {
        setState({
          status: "error",
          message: json.error ?? "Raw file processing failed.",
          errors: json.errors,
        });
        return;
      }

      setState({
        status: "working",
        message: "Finalizing processed file...",
        progress: 100,
      });
    } catch (error) {
      window.clearInterval(progressTimer);
      setState({
        status: "error",
        message:
          error instanceof Error ? error.message : "Raw file processing failed.",
      });
      return;
    }

    setProcessedCsv(json.csv ?? "");
    setProcessedFilename(json.filename ?? `${indicatorSlug}_processed.csv`);
    setState({
      status: "processed",
      rowCount: json.rowCount ?? 0,
      preview: json.preview ?? [],
      warnings: json.warnings ?? [],
      summary: json.summary,
    });
  }

  async function submit(mode: "validate" | "ingest") {
    if (!categorySlug || !indicatorSlug) {
      setState({
        status: "error",
        message: "Select a category and indicator before importing data.",
      });
      return;
    }

    const form = document.querySelector<HTMLFormElement>("#admin-upload-form");
    if (!form) return;
    const formData = new FormData(form);
    formData.set("mode", mode);
    formData.set("category", categorySlug);
    formData.set("indicatorSlug", indicatorSlug);
    formData.set("importMode", importMode);
    formData.set("sourceUrl", sourceUrl.trim());

    setState({
      status: "working",
      message: mode === "validate" ? "Validating processed file..." : "Importing data...",
    });
    const res = await fetch("/api/admin/uploads", {
      method: "POST",
      body: formData,
    });
    const json = await res.json();

    if (!res.ok) {
      setState({
        status: "error",
        message: json.error ?? "Upload validation failed.",
        errors: json.errors,
      });
      return;
    }

    if (mode === "validate") {
      setState({
        status: "valid",
        rowCount: json.rowCount,
        preview: json.preview ?? [],
        warnings: json.warnings,
      });
      return;
    }

    setState({
      status: "success",
      message: `Imported ${json.upload?.rowCount ?? 0} rows using ${importMode} mode.`,
    });
  }

  function downloadProcessedCsv() {
    if (!processedCsv) return;
    downloadTextFile(processedFilename, processedCsv);
  }

  async function downloadCurrentBackup() {
    if (!indicatorSlug) {
      setState({
        status: "error",
        message: "Select an indicator before downloading a backup.",
      });
      return;
    }

    const res = await fetch(
      `/api/admin/uploads?action=backup&indicatorSlug=${encodeURIComponent(indicatorSlug)}`,
    );
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setState({
        status: "error",
        message: json.error ?? "Could not download current indicator backup.",
      });
      return;
    }

    const csv = await res.text();
    downloadTextFile(`${indicatorSlug}_current_backup.csv`, csv);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.55fr]">
      <div className="space-y-6">
        <section className="rounded-lg border border-ink-200 bg-white p-5 shadow-elev-1">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <select
                name="category"
                value={categorySlug}
                onChange={(event) => updateCategory(event.target.value)}
                className="field-control"
              >
                <option value="">Select category</option>
                {CATEGORY_LIST.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Indicator">
              <select
                name="indicatorSlug"
                value={indicatorSlug}
                onChange={(event) => updateIndicator(event.target.value)}
                className="field-control"
                disabled={!categorySlug}
              >
                <option value="">
                  {categorySlug ? "Select indicator" : "Select category first"}
                </option>
                {filteredIndicators.map((indicator) => (
                  <option key={indicator.slug} value={indicator.slug}>
                    {indicator.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          {selectedIndicator ? (
            <p className="mt-3 text-sm text-ink-600">
              Selected indicator:{" "}
              <span className="font-medium text-ink-900">{selectedIndicator.name}</span>
              {selectedIndicator.sourceUrl ? (
                <>
                  {" "}
                  Current source:{" "}
                  <a
                    href={selectedIndicator.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-nordik-700 hover:text-nordik-800"
                  >
                    open link
                  </a>
                </>
              ) : null}
            </p>
          ) : null}
        </section>

        <form
          id="admin-raw-process-form"
          className="rounded-lg border border-ink-200 bg-white p-5 shadow-elev-1"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight text-ink-900">
                1. Prepare raw data
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">
                Upload source files first. The processor creates a standardized CSV
                with the columns required by DATANORTH.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void processRawFiles()}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md border border-ink-200 bg-white px-4 text-sm font-medium text-ink-800 shadow-elev-1 hover:border-ink-300 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!categorySlug || !indicatorSlug}
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              Process
            </button>
          </div>
          <div className="mt-5">
            <Field label="Raw CSV or Excel files">
              <input
                name="files"
                type="file"
                accept=".csv,.xlsx,.xls"
                multiple
                className="field-control"
              />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Local raw folder path">
              <input
                name="rawPath"
                type="text"
                placeholder="Add File Path Here..."
                className="field-control"
              />
            </Field>
          </div>
          <div className="mt-4 rounded-md border border-ink-200 bg-ink-50 p-4 text-sm text-ink-700">
            For normal files, use file upload. For very large local raw files,
            paste the folder path so the server can read them directly without
            the browser upload size limit.
          </div>
          {processedCsv ? (
            <button
              type="button"
              onClick={downloadProcessedCsv}
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-ink-900 px-4 text-sm font-medium text-white shadow-elev-1 hover:bg-ink-800"
            >
              <Download className="h-4 w-4" aria-hidden />
              Download processed CSV
            </button>
          ) : null}
        </form>

        <form
          id="admin-upload-form"
          className="rounded-lg border border-ink-200 bg-white p-5 shadow-elev-1"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight text-ink-900">
                2. Import processed data
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">
                Validate the cleaned file, download the current indicator backup,
                then choose how the import should affect current data.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void downloadCurrentBackup()}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md border border-ink-200 bg-white px-4 text-sm font-medium text-ink-800 shadow-elev-1 hover:border-ink-300 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!indicatorSlug}
            >
              <Download className="h-4 w-4" aria-hidden />
              Backup
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Upload mode">
              <select
                name="importMode"
                value={importMode}
                onChange={(event) => updateImportMode(event.target.value as ImportMode)}
                className="field-control"
              >
                <option value="extend">Extend current data</option>
                <option value="replace">Replace current data</option>
              </select>
            </Field>
            <Field label="Processed CSV or Excel file">
              <input
                name="file"
                type="file"
                accept=".csv,.xlsx,.xls"
                required
                className="field-control"
                onChange={(event) => updateImportFile(event.target.files)}
              />
            </Field>
          </div>

          <div className="mt-5 rounded-md border border-ink-200 bg-ink-50 p-4 text-sm text-ink-700">
            Required columns: <code>geography_code</code>, <code>year</code>,{" "}
            <code>value</code>. Optional columns: <code>indicator_slug</code>,{" "}
            <code>label</code>, <code>quarter</code>, <code>month</code>,{" "}
            <code>confidence_low</code>, <code>confidence_high</code>,{" "}
            <code>is_forecast</code>, <code>model_id</code>.
          </div>

          <div className="mt-5">
            <Field label="Source URL">
              <input
                name="sourceUrl"
                type="url"
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
                placeholder="https://..."
                className="field-control"
                disabled={!validationSucceeded}
              />
            </Field>
            <p className="mt-2 text-sm text-ink-500">
              Validate the file first, then paste the official source link to
              save it on the chart footer and methodology section. Leave this
              blank to keep the current source link.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => void submit("validate")}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-ink-200 bg-white px-4 text-sm font-medium text-ink-800 shadow-elev-1 hover:border-ink-300 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!categorySlug || !indicatorSlug || !hasImportFile}
            >
              <FileCheck className="h-4 w-4" aria-hidden />
              Validate file
            </button>
            <button
              type="button"
              onClick={() => void submit("ingest")}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-nordik-700 px-4 text-sm font-medium text-white shadow-elev-1 hover:bg-nordik-800 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!validationSucceeded}
            >
              <Upload className="h-4 w-4" aria-hidden />
              Import to database
            </button>
          </div>
        </form>
      </div>

      <aside className="rounded-lg border border-ink-200 bg-white p-5 shadow-elev-1">
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink-900">
          Upload status
        </h2>
        <Status state={state} />
      </aside>
    </div>
  );
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function Status({ state }: { state: UploadState }) {
  if (state.status === "idle") {
    return (
      <p className="mt-3 text-sm leading-relaxed text-ink-600">
        Select a category and indicator, then process raw files or import a
        reviewed processed file.
      </p>
    );
  }
  if (state.status === "working") {
    return (
      <div className="mt-3">
        <p className="text-sm text-ink-600">{state.message}</p>
        {state.progress != null ? <ProgressBar value={state.progress} /> : null}
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <div className="mt-3 text-sm text-rose-800">
        <p className="font-medium">{state.message}</p>
        {state.errors?.length ? (
          <ul className="mt-3 list-disc space-y-1 pl-5">
            {state.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }
  if (state.status === "success") {
    return <p className="mt-3 text-sm font-medium text-emerald-700">{state.message}</p>;
  }
  return (
    <div className="mt-3">
      <p className="text-sm font-medium text-emerald-700">
        {state.status === "processed" ? "Processed file" : "Valid file"}:{" "}
        {state.rowCount} rows
      </p>
      {state.status === "processed" && state.summary ? (
        <ProcessSummaryBlock summary={state.summary} />
      ) : null}
      {state.warnings?.length ? (
        <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <p className="font-medium">Warnings</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {state.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="text-left text-ink-500">
              <th className="border-b border-ink-200 py-2 pr-3">Indicator</th>
              <th className="border-b border-ink-200 py-2 pr-3">Geo</th>
              <th className="border-b border-ink-200 py-2 pr-3">Year</th>
              <th className="border-b border-ink-200 py-2 pr-3">Value</th>
            </tr>
          </thead>
          <tbody>
            {state.preview.map((row, index) => (
              <tr key={`${row.indicator_slug}-${row.geography_code}-${row.year}-${index}`}>
                <td className="border-b border-ink-100 py-2 pr-3">
                  {row.indicator_slug}
                </td>
                <td className="border-b border-ink-100 py-2 pr-3">
                  {row.geography_code}
                </td>
                <td className="border-b border-ink-100 py-2 pr-3">{row.year}</td>
                <td className="border-b border-ink-100 py-2 pr-3">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  const rounded = Math.round(value);
  return (
    <div className="mt-3" aria-live="polite">
      <div className="mb-1 flex items-center justify-between text-xs text-ink-500">
        <span>Processing progress</span>
        <span>{rounded}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ink-100">
        <div
          className="h-full rounded-full bg-nordik-700 transition-all duration-500 ease-out"
          style={{ width: `${rounded}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-ink-500">{100 - rounded}% remaining</p>
    </div>
  );
}

function ProcessSummaryBlock({ summary }: { summary: ProcessSummary }) {
  return (
    <dl className="mt-3 grid grid-cols-2 gap-2 rounded-md border border-ink-200 bg-ink-50 p-3 text-xs text-ink-700">
      <SummaryItem label="Files" value={summary.filesProcessed} />
      <SummaryItem label="Raw rows" value={summary.rawRowsRead} />
      <SummaryItem label="Candidates" value={summary.candidateRows} />
      <SummaryItem label="Processed" value={summary.processedRows} />
      <SummaryItem label="Skipped" value={summary.skippedRows} />
      <SummaryItem label="Duplicates" value={summary.exactDuplicateRows} />
      <div className="col-span-2">
        <dt className="font-medium uppercase tracking-wide text-ink-500">Geographies</dt>
        <dd className="mt-1 break-words text-ink-900">
          {summary.geographies.length ? summary.geographies.join(", ") : "None"}
        </dd>
      </div>
      <div className="col-span-2">
        <dt className="font-medium uppercase tracking-wide text-ink-500">Years</dt>
        <dd className="mt-1 break-words text-ink-900">
          {summary.years.length ? summary.years.join(", ") : "None"}
        </dd>
      </div>
    </dl>
  );
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="font-medium uppercase tracking-wide text-ink-500">{label}</dt>
      <dd className="mt-1 font-medium text-ink-900">{value}</dd>
    </div>
  );
}
