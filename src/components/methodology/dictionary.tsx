"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { INDICATORS } from "@/lib/data/indicators";
import { CATEGORIES } from "@/lib/data/categories";
import { formatDate } from "@/lib/format";
import { ArrowUpRight, ChevronLeft, ChevronRight, Search, X } from "lucide-react";

const ROWS_PER_PAGE = 5;

type SortKey = "name" | "category" | "source" | "lastUpdated";

export function MethodologyDictionary() {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sampleFilter, setSampleFilter] = useState<"all" | "real" | "sample">(
    "all",
  );
  const [sortKey, setSortKey] = useState<SortKey>("category");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever filters or sort change
  useEffect(() => {
    setPage(1);
  }, [query, categoryFilter, sampleFilter, sortKey, sortDir]);

  const filtered = useMemo(() => {
    let rows = INDICATORS.slice();

    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.source.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q),
      );
    }

    if (categoryFilter !== "all") {
      rows = rows.filter((i) => i.category === categoryFilter);
    }

    if (sampleFilter === "real") rows = rows.filter((i) => !i.isSample);
    if (sampleFilter === "sample") rows = rows.filter((i) => i.isSample);

    rows.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "category")
        cmp = a.category.localeCompare(b.category);
      else if (sortKey === "source") cmp = a.source.localeCompare(b.source);
      else if (sortKey === "lastUpdated")
        cmp =
          new Date(a.lastUpdated).getTime() -
          new Date(b.lastUpdated).getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });

    return rows;
  }, [query, categoryFilter, sampleFilter, sortKey, sortDir]);

const setSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(k);
      setSortDir("asc");
    }
  };

  const hasActiveFilter =
    query.trim() || categoryFilter !== "all" || sampleFilter !== "all";

  // Pagination math
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * ROWS_PER_PAGE;
  const endIdx = startIdx + ROWS_PER_PAGE;
  const pageRows = filtered.slice(startIdx, endIdx);

  return (
    <div className="overflow-hidden rounded-xl border border-ink-200 bg-white shadow-elev-1">
      {/* Filter bar */}
      <div className="border-b border-ink-200 bg-ink-50/40 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-500">
              Search
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400"
                aria-hidden
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, source, description…"
                className="block w-full rounded-md border border-ink-200 bg-white py-1.5 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-nordik-400 focus:outline-none focus:ring-2 focus:ring-nordik-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-500">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-md border border-ink-200 bg-white px-3 py-1.5 text-sm text-ink-900 focus:border-nordik-400 focus:outline-none focus:ring-2 focus:ring-nordik-100"
            >
              <option value="all">All categories</option>
              {Object.values(CATEGORIES).map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.shortName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-500">
              Data type
            </label>
            <select
              value={sampleFilter}
              onChange={(e) =>
                setSampleFilter(e.target.value as "all" | "real" | "sample")
              }
              className="rounded-md border border-ink-200 bg-white px-3 py-1.5 text-sm text-ink-900 focus:border-nordik-400 focus:outline-none focus:ring-2 focus:ring-nordik-100"
            >
              <option value="all">All</option>
              <option value="real">Real data only</option>
              <option value="sample">Sample data only</option>
            </select>
          </div>

          {hasActiveFilter && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategoryFilter("all");
                setSampleFilter("all");
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-600 hover:border-ink-300 hover:text-ink-900"
            >
              <X className="h-3 w-3" aria-hidden />
              Clear
            </button>
          )}
        </div>
        <div className="mt-3 text-xs text-ink-500">
          Showing{" "}
          <span className="font-medium text-ink-700">
            {filtered.length === 0
              ? 0
              : `${startIdx + 1}–${Math.min(endIdx, filtered.length)}`}
          </span>{" "}
          of{" "}
          <span className="font-medium text-ink-700">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "indicator" : "indicators"}
          {filtered.length !== INDICATORS.length && (
            <>
              {" "}
              (filtered from {INDICATORS.length})
            </>
          )}
          .
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead className="bg-white">
            <tr>
              <Th onClick={() => setSort("name")} active={sortKey === "name"} dir={sortDir}>
                Indicator
              </Th>
              <Th onClick={() => setSort("category")} active={sortKey === "category"} dir={sortDir}>
                Category
              </Th>
              <Th onClick={() => setSort("source")} active={sortKey === "source"} dir={sortDir}>
                Source
              </Th>
              <Th onClick={() => setSort("lastUpdated")} active={sortKey === "lastUpdated"} dir={sortDir}>
                Last updated
              </Th>
              <th className="border-b border-ink-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
                Frequency
              </th>
              <th className="border-b border-ink-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
                Status
              </th>
              <th className="border-b border-ink-200 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ink-500">
                Open
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-ink-500">
                  No indicators match your filters.
                </td>
              </tr>
            ) : (
              pageRows.map((i) => {
                const cat = CATEGORIES[i.category];
                return (
                  <tr
                    key={i.slug}
                    className="group transition-colors hover:bg-nordik-50/40"
                  >
                    <td className="border-b border-ink-100 px-4 py-3">
                      <div className="font-medium text-ink-900">{i.name}</div>
                      <div className="mt-0.5 line-clamp-1 text-xs text-ink-500">
                        {i.description}
                      </div>
                    </td>
                    <td className="border-b border-ink-100 px-4 py-3 whitespace-nowrap">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{
                          background: `${cat.accent}15`,
                          color: cat.accent,
                        }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: cat.accent }}
                        />
                        {cat.shortName}
                      </span>
                    </td>
                    <td className="border-b border-ink-100 px-4 py-3">
                      <div className="text-sm text-ink-700">{i.source}</div>
                      {i.sourceUrl && (
                        <a
                          href={i.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-0.5 inline-flex items-center gap-0.5 text-xs text-nordik-700 hover:text-nordik-800"
                        >
                          Visit source
                          <ArrowUpRight className="h-3 w-3" aria-hidden />
                        </a>
                      )}
                    </td>
                    <td className="border-b border-ink-100 px-4 py-3 whitespace-nowrap text-xs font-mono text-ink-600">
                      {formatDate(i.lastUpdated)}
                    </td>
                    <td className="border-b border-ink-100 px-4 py-3 whitespace-nowrap text-xs text-ink-600">
                      {i.updateFrequency}
                    </td>
                    <td className="border-b border-ink-100 px-4 py-3 whitespace-nowrap">
                      {i.isSample ? (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
                          Sample
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                          Real
                        </span>
                      )}
                    </td>
                    <td className="border-b border-ink-100 px-4 py-3 text-right">
                      <Link
                        href={`/indicators/${i.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-nordik-700 transition-colors hover:text-nordik-800"
                      >
                        Open
                        <ArrowUpRight className="h-3 w-3" aria-hidden />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > ROWS_PER_PAGE && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-200 bg-ink-50/40 px-4 py-3">
          <div className="text-xs text-ink-500">
            Page{" "}
            <span className="font-medium text-ink-700">{currentPage}</span> of{" "}
            <span className="font-medium text-ink-700">{totalPages}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex h-8 items-center gap-1 rounded-md border border-ink-200 bg-white px-2.5 text-xs font-medium text-ink-700 transition-colors hover:border-ink-300 hover:text-ink-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-ink-200 disabled:hover:text-ink-700"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
              Prev
            </button>
            {getPageNumbers(currentPage, totalPages).map((p, idx) =>
              p === "…" ? (
                <span
                  key={`gap-${idx}`}
                  className="px-1.5 text-xs text-ink-400"
                  aria-hidden
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  aria-current={p === currentPage ? "page" : undefined}
                  className={
                    "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-medium transition-colors " +
                    (p === currentPage
                      ? "bg-nordik-700 text-white shadow-elev-1"
                      : "border border-ink-200 bg-white text-ink-700 hover:border-ink-300 hover:text-ink-900")
                  }
                >
                  {p}
                </button>
              ),
            )}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex h-8 items-center gap-1 rounded-md border border-ink-200 bg-white px-2.5 text-xs font-medium text-ink-700 transition-colors hover:border-ink-300 hover:text-ink-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-ink-200 disabled:hover:text-ink-700"
              aria-label="Next page"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Build a compact page-number list with ellipses for large totals.
 * Examples (current=1, total=10) → [1, 2, 3, …, 10]
 *          (current=5, total=10) → [1, …, 4, 5, 6, …, 10]
 *          (current=10, total=10) → [1, …, 8, 9, 10]
 */
function getPageNumbers(current: number, total: number): Array<number | "…"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: Array<number | "…"> = [1];
  if (current > 3) pages.push("…");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let p = start; p <= end; p++) pages.push(p);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

function Th({
  children,
  onClick,
  active,
  dir,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  dir: "asc" | "desc";
}) {
  return (
    <th className="border-b border-ink-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
      <button
        type="button"
        onClick={onClick}
        className={
          "inline-flex items-center gap-1 transition-colors " +
          (active ? "text-nordik-700" : "hover:text-ink-700")
        }
      >
        {children}
        <span
          className={
            "inline-block text-[10px] transition-opacity " +
            (active ? "opacity-100" : "opacity-30")
          }
        >
          {active ? (dir === "asc" ? "▲" : "▼") : "▲"}
        </span>
      </button>
    </th>
  );
}