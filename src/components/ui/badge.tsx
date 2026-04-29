import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "brand" | "sample" | "forecast" | "success" | "warn";

const VARIANTS: Record<Variant, string> = {
  default: "bg-ink-100 text-ink-700 border-ink-200",
  brand: "bg-nordik-50 text-nordik-800 border-nordik-100",
  sample: "bg-amber-50 text-amber-800 border-amber-200",
  forecast: "bg-violet-50 text-violet-800 border-violet-200",
  success: "bg-emerald-50 text-emerald-800 border-emerald-200",
  warn: "bg-rose-50 text-rose-800 border-rose-200",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}
