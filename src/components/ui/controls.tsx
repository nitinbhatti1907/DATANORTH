import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-9 appearance-none rounded-md border border-ink-200 bg-white pl-3 pr-8 text-sm text-ink-800 shadow-elev-1 transition-colors hover:border-ink-300 focus-visible:border-nordik-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nordik-200 disabled:opacity-50",
      className,
    )}
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 0.5rem center",
      backgroundSize: "1rem",
    }}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-9 w-full rounded-md border border-ink-200 bg-white px-3 text-sm text-ink-800 shadow-elev-1 placeholder:text-ink-400 transition-colors hover:border-ink-300 focus-visible:border-nordik-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nordik-200 disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md bg-gradient-to-r from-ink-100 via-ink-200 to-ink-100 bg-[length:200%_100%] animate-shimmer",
        className,
      )}
      {...props}
    />
  );
}
