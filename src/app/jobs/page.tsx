"use client";

import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { DataTable } from "@/components/data/data-table";
import { Badge } from "@/components/ui/badge";
import { JOB_ROWS } from "@/lib/data/jobs";
import type { JobRow } from "@/types";
import { formatCurrency } from "@/lib/format";

export default function JobsPage() {
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
        header: "Occupation",
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "medianWage",
        header: "Median annual wage (CAD)",
        cell: ({ getValue }) => (
          <span className="num-plate tabular-nums">
            {formatCurrency(getValue<number>())}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="content-container py-10">
      <Breadcrumbs
        items={[
          { href: "/categories/labour-market", label: "Labour Market" },
          { label: "Median wage by occupation" },
        ]}
      />

      <header className="mt-6 max-w-3xl">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: "#047857" }}
            aria-hidden
          />
          <span className="text-xs font-medium uppercase tracking-wider text-ink-500">
            Labour Market
          </span>
          <Badge variant="success">Real data</Badge>
        </div>
        <h1 className="mt-2 font-display text-display-lg font-semibold tracking-tight text-ink-900">
          Median wage by occupation
        </h1>
        <p className="mt-3 text-ink-600">
          {JOB_ROWS.length} occupations classified by the National Occupational
          Classification (NOC), with median annual wage. Sort, filter, and
          download the dataset below.
        </p>
      </header>

      <div className="mt-8">
        <DataTable
          columns={columns}
          data={JOB_ROWS}
          searchPlaceholder="Search NOC or occupation…"
          downloadFilename="datanorth_median-wage-by-occupation"
          initialPageSize={25}
        />
      </div>

      <div className="mt-6 rounded-lg border border-ink-200 bg-ink-50/50 p-5 text-sm text-ink-600">
        <strong className="text-ink-800">Source.</strong> Statistics Canada —
        National Occupational Classification wage data. Values are national
        medians; regional equivalents will be substituted as they become
        available. Data migrated from the prior DATANORTH prototype.
      </div>
    </div>
  );
}
