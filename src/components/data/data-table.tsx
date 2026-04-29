"use client";

import { useMemo, useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { Input } from "@/components/ui/controls";
import { cn } from "@/lib/utils";

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  title?: string;
  searchPlaceholder?: string;
  downloadFilename?: string;
  initialPageSize?: number;
}

export function DataTable<T>({
  columns,
  data,
  title,
  searchPlaceholder = "Search…",
  downloadFilename = "datanorth-table",
  initialPageSize = 25,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: initialPageSize } },
  });

  const filtered = table.getFilteredRowModel().rows.map((r) => r.original);

  const rows = useMemo(() => table.getRowModel().rows, [table, sorting, globalFilter]);

  async function downloadCSV() {
    const { default: Papa } = await import("papaparse");
    const csv = Papa.unparse(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const today = new Date().toISOString().slice(0, 10);
    triggerDownload(blob, `${downloadFilename}_${today}.csv`);
  }

  async function downloadXLSX() {
    const XLSX = await import("xlsx");
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filtered as object[]);
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    const blob = new Blob([wbout], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const today = new Date().toISOString().slice(0, 10);
    triggerDownload(blob, `${downloadFilename}_${today}.xlsx`);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-ink-200 bg-white shadow-elev-1">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 px-4 py-3">
        {title && (
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink-900">
            {title}
          </h3>
        )}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400"
              aria-hidden
            />
            <Input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-9 w-56 pl-8"
            />
          </div>
          <button
            onClick={() => void downloadCSV()}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink-200 bg-white px-3 text-sm text-ink-700 shadow-elev-1 hover:border-ink-300"
          >
            <Download className="h-3.5 w-3.5" aria-hidden />
            CSV
          </button>
          <button
            onClick={() => void downloadXLSX()}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink-200 bg-white px-3 text-sm text-ink-700 shadow-elev-1 hover:border-ink-300"
          >
            <Download className="h-3.5 w-3.5" aria-hidden />
            Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-ink-50/60">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => {
                  const canSort = h.column.getCanSort();
                  const sortDir = h.column.getIsSorted();
                  return (
                    <th
                      key={h.id}
                      className="border-b border-ink-200 px-4 py-2.5 text-left font-medium text-ink-700"
                    >
                      {h.isPlaceholder ? null : (
                        <button
                          type="button"
                          onClick={h.column.getToggleSortingHandler()}
                          className={cn(
                            "inline-flex items-center gap-1.5",
                            canSort && "cursor-pointer hover:text-ink-900",
                          )}
                          disabled={!canSort}
                        >
                          {flexRender(h.column.columnDef.header, h.getContext())}
                          {canSort &&
                            (sortDir === "asc" ? (
                              <ArrowUp className="h-3 w-3 text-nordik-700" aria-hidden />
                            ) : sortDir === "desc" ? (
                              <ArrowDown className="h-3 w-3 text-nordik-700" aria-hidden />
                            ) : (
                              <ArrowUpDown className="h-3 w-3 text-ink-400" aria-hidden />
                            ))}
                        </button>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-ink-500"
                >
                  No results.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-nordik-50/30">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="border-b border-ink-100 px-4 py-2.5 text-ink-800"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-ink-100 px-4 py-2.5 text-xs text-ink-500">
        <span>
          {filtered.length.toLocaleString()} row
          {filtered.length === 1 ? "" : "s"}
          {globalFilter && ` · filtered by "${globalFilter}"`}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="inline-flex h-7 items-center gap-1 rounded-md border border-ink-200 bg-white px-2 text-ink-700 disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
            Prev
          </button>
          <span className="font-mono">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="inline-flex h-7 items-center gap-1 rounded-md border border-ink-200 bg-white px-2 text-ink-700 disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
