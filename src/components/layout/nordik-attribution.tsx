import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Subtle NORDIK Institute attribution.
 * Used in header (compact), footer (with tagline), and inline on pages.
 */
export function NordikAttribution({
  variant = "inline",
  className,
}: {
  variant?: "compact" | "inline" | "stacked";
  className?: string;
}) {
  if (variant === "compact") {
    return (
      <Link
        href="https://nordikinstitute.com"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group inline-flex items-center gap-2 text-xs text-ink-500 transition-colors hover:text-ink-700",
          className,
        )}
        aria-label="Visit NORDIK Institute"
      >
        <span>In partnership with</span>
        <Image
          src="/images/logos/nordik.png"
          alt="NORDIK Institute"
          width={1620}
          height={376}
          className="h-5 w-auto opacity-80 transition-opacity group-hover:opacity-100"
        />
      </Link>
    );
  }

  if (variant === "stacked") {
    return (
      <div className={cn("flex flex-col items-start gap-2", className)}>
        <span className="text-xs uppercase tracking-wider text-ink-500">
          In partnership with
        </span>
        <Link
          href="https://nordikinstitute.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block transition-opacity hover:opacity-80"
          aria-label="Visit NORDIK Institute"
        >
          <Image
            src="/images/logos/nordik.png"
            alt="NORDIK Institute"
            width={1620}
            height={376}
            className="h-10 w-auto"
          />
        </Link>
      </div>
    );
  }

  // inline (default)
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-sm text-ink-600">In partnership with</span>
      <Link
        href="https://nordikinstitute.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block transition-opacity hover:opacity-80"
        aria-label="Visit NORDIK Institute"
      >
        <Image
          src="/images/logos/nordik.png"
          alt="NORDIK Institute"
          width={1620}
          height={376}
          className="h-8 w-auto"
        />
      </Link>
    </div>
  );
}