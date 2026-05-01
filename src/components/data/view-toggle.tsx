"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { LayoutGrid, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

export function CategoryViewToggle({
  current,
  accent,
}: {
  current: "indicators" | "dashboard";
  accent: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function setView(v: "indicators" | "dashboard") {
    const next = new URLSearchParams(params?.toString() ?? "");
    if (v === "dashboard") next.set("view", "dashboard");
    else next.delete("view");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div
      role="tablist"
      aria-label="View mode"
      className="inline-flex rounded-lg border border-ink-200 bg-white p-1 shadow-elev-1"
    >
      <button
        role="tab"
        aria-selected={current === "indicators"}
        onClick={() => setView("indicators")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
          current === "indicators"
            ? "text-white shadow-elev-1"
            : "text-ink-600 hover:bg-ink-50 hover:text-ink-900",
        )}
        style={
          current === "indicators" ? { backgroundColor: accent } : undefined
        }
      >
        <LayoutGrid className="h-4 w-4" aria-hidden />
        Indicators
      </button>
      <button
        role="tab"
        aria-selected={current === "dashboard"}
        onClick={() => setView("dashboard")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
          current === "dashboard"
            ? "text-white shadow-elev-1"
            : "text-ink-600 hover:bg-ink-50 hover:text-ink-900",
        )}
        style={
          current === "dashboard" ? { backgroundColor: accent } : undefined
        }
      >
        <LayoutDashboard className="h-4 w-4" aria-hidden />
        Dashboard
      </button>
    </div>
  );
}