"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { CATEGORY_LIST } from "@/lib/data/categories";
import type { Geography, Indicator } from "@/types";

type PreviewRow = {
  indicator_slug: string;
  geography_code: string;
  year: number;
  value: number;
  label?: string;
};

type UploadState =
  | { status: "idle" }
  | { status: "working" }
  | { status: "valid"; rowCount: number; preview: PreviewRow[] }
  | { status: "success"; message: string }
  | { status: "error"; message: string; errors?: string[] };

export function UploadForm({
  indicators,
  geographies,
}: {
  indicators: Indicator[];
  geographies: Geography[];
}) {
  const [state, setState] = useState<UploadState>({ status: "idle" });

  async function submit(mode: "validate" | "ingest") {
    const form = document.querySelector<HTMLFormElement>("#admin-upload-form");
    if (!form) return;
    const formData = new FormData(form);
    formData.set("mode", mode);

    setState({ status: "working" });
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
      });
      return;
    }

    setState({
      status: "success",
      message: `Imported ${json.upload?.rowCount ?? 0} rows.`,
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <form
        id="admin-upload-form"
        className="rounded-lg border border-ink-200 bg-white p-5 shadow-elev-1"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category">
            <select name="category" className="field-control">
              <option value="">Select category</option>
              {CATEGORY_LIST.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Indicator default">
            <select name="indicatorSlug" className="field-control">
              <option value="">Use file column</option>
              {indicators.map((indicator) => (
                <option key={indicator.slug} value={indicator.slug}>
                  {indicator.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Geography default">
            <select name="geographyCode" className="field-control">
              <option value="">Use file column</option>
              {geographies.map((geography) => (
                <option key={geography.code} value={geography.code}>
                  {geography.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="CSV or Excel file">
            <input
              name="file"
              type="file"
              accept=".csv,.xlsx,.xls"
              required
              className="field-control"
            />
          </Field>
        </div>

        <div className="mt-5 rounded-md border border-ink-200 bg-ink-50 p-4 text-sm text-ink-700">
          Required columns: <code>indicator_slug</code>,{" "}
          <code>geography_code</code>, <code>year</code>, <code>value</code>.
          Optional columns: <code>label</code>, <code>quarter</code>,{" "}
          <code>month</code>, <code>confidence_low</code>,{" "}
          <code>confidence_high</code>, <code>is_forecast</code>,{" "}
          <code>model_id</code>.
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void submit("validate")}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-ink-200 bg-white px-4 text-sm font-medium text-ink-800 shadow-elev-1 hover:border-ink-300"
          >
            Validate file
          </button>
          <button
            type="button"
            onClick={() => void submit("ingest")}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-nordik-700 px-4 text-sm font-medium text-white shadow-elev-1 hover:bg-nordik-800"
          >
            <Upload className="h-4 w-4" aria-hidden />
            Import to database
          </button>
        </div>
      </form>

      <aside className="rounded-lg border border-ink-200 bg-white p-5 shadow-elev-1">
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink-900">
          Upload status
        </h2>
        <Status state={state} />
      </aside>
    </div>
  );
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
        Choose a file and validate it before importing. Imports are blocked
        until database credentials and `ADMIN_UPLOADS_ENABLED=true` are set.
      </p>
    );
  }
  if (state.status === "working") {
    return <p className="mt-3 text-sm text-ink-600">Working...</p>;
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
        Valid file: {state.rowCount} rows
      </p>
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
