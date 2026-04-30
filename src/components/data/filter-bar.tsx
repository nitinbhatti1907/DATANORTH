"use client";

import { Select } from "@/components/ui/controls";
import { GEOGRAPHIES } from "@/lib/data/geographies";
import { X } from "lucide-react";

export interface FilterBarValue {
  geographies: string[];
  yearFrom?: number;
  yearTo?: number;
}

export function FilterBar({
  value,
  availableYears,
  showYearRange = true,
  onChange,
}: {
  value: FilterBarValue;
  availableYears: number[];
  showYearRange?: boolean;
  onChange: (update: {
    geographies?: string[];
    yearFrom?: number;
    yearTo?: number;
  }) => void;
}) {
  const toggleGeography = (code: string) => {
    const set = new Set(value.geographies);
    if (set.has(code)) set.delete(code);
    else set.add(code);
    onChange({ geographies: Array.from(set) });
  };

  const selectable = GEOGRAPHIES.filter((g) =>
    ["csd", "region"].includes(g.type),
  );

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border border-ink-200 bg-white p-4 shadow-elev-1">
      <div className="flex-1 min-w-[260px]">
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-500">
          Geography
        </label>
        <div className="flex flex-wrap gap-1.5">
          {selectable.map((g) => {
            const active = value.geographies.includes(g.code);
            return (
              <button
                key={g.code}
                type="button"
                onClick={() => toggleGeography(g.code)}
                className={
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors " +
                  (active
                    ? "border-nordik-600 bg-nordik-700 text-white"
                    : "border-ink-200 bg-white text-ink-700 hover:border-ink-300")
                }
                aria-pressed={active}
              >
                {g.name}
                {active && <X className="h-3 w-3" aria-hidden />}
              </button>
            );
          })}
        </div>
      </div>

      {showYearRange && (
        <>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-500">
              From
            </label>
            <Select
              value={value.yearFrom ?? ""}
              onChange={(e) =>
                onChange({
                  yearFrom: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            >
              <option value="">All</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-500">
              To
            </label>
            <Select
              value={value.yearTo ?? ""}
              onChange={(e) =>
                onChange({
                  yearTo: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            >
              <option value="">All</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
          </div>
        </>
      )}
    </div>
  );
}