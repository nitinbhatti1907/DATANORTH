"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { DataTable } from "@/components/data/data-table";
import { Badge } from "@/components/ui/badge";
import { JOB_ROWS } from "@/lib/data/jobs";
import { CATEGORIES } from "@/lib/data/categories";
import type { JobRow } from "@/types";
import { formatCurrency } from "@/lib/format";
import {
  localeFromPath,
  localizePath,
  translateCategory,
} from "@/lib/i18n";

export default function JobsPage() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const category = translateCategory(CATEGORIES["labour-market"], locale);
  const copy =
    locale === "fr"
      ? {
          title: "Salaire median par profession",
          occupation: "Profession",
          wageHeader: "Salaire annuel median (CAD)",
          real: "Donnees reelles",
          intro:
            "professions classees selon la Classification nationale des professions (CNP), avec salaire annuel median. Triez, filtrez et telechargez le jeu de donnees ci-dessous.",
          search: "Rechercher une CNP ou une profession...",
          sourceLabel: "Source.",
          source:
            "Statistique Canada - donnees salariales de la Classification nationale des professions. Les valeurs sont des medianes nationales; les equivalents regionaux seront substitues lorsqu'ils seront disponibles. Donnees migrees depuis l'ancien prototype DATANORTH.",
        }
      : {
          title: "Median wage by occupation",
          occupation: "Occupation",
          wageHeader: "Median annual wage (CAD)",
          real: "Real data",
          intro:
            "occupations classified by the National Occupational Classification (NOC), with median annual wage. Sort, filter, and download the dataset below.",
          search: "Search NOC or occupation...",
          sourceLabel: "Source.",
          source:
            "Statistics Canada - National Occupational Classification wage data. Values are national medians; regional equivalents will be substituted as they become available. Data migrated from the prior DATANORTH prototype.",
        };

  const columns = useMemo<ColumnDef<JobRow>[]>(
    () => [
      {
        accessorKey: "noc",
        header: "NOC",
        cell: ({ getValue }) => (
          <span className="font-mono text-xs text-ink-600">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "occupation",
        header: copy.occupation,
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "medianWage",
        header: copy.wageHeader,
        cell: ({ getValue }) => (
          <span className="num-plate tabular-nums">
            {formatCurrency(getValue<number>())}
          </span>
        ),
      },
    ],
    [copy.occupation, copy.wageHeader],
  );

  return (
    <div className="content-container py-10">
      <Breadcrumbs
        items={[
          {
            href: localizePath("/categories/labour-market", locale),
            label: category.name,
          },
          { label: copy.title },
        ]}
        locale={locale}
      />

      <header className="mt-6 max-w-3xl">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: "#047857" }}
            aria-hidden
          />
          <span className="text-xs font-medium uppercase tracking-wider text-ink-500">
            {category.name}
          </span>
          <Badge variant="success">{copy.real}</Badge>
        </div>
        <h1 className="mt-2 font-display text-display-lg font-semibold tracking-tight text-ink-900">
          {copy.title}
        </h1>
        <p className="mt-3 text-ink-600">
          {JOB_ROWS.length} {copy.intro}
        </p>
      </header>

      <div className="mt-8">
        <DataTable
          columns={columns}
          data={JOB_ROWS}
          searchPlaceholder={copy.search}
          downloadFilename="datanorth_median-wage-by-occupation"
          initialPageSize={25}
          locale={locale}
        />
      </div>

      <div className="mt-6 rounded-lg border border-ink-200 bg-ink-50/50 p-5 text-sm text-ink-600">
        <strong className="text-ink-800">{copy.sourceLabel}</strong>{" "}
        {copy.source}
      </div>
    </div>
  );
}
