import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="content-container py-24 text-center">
      <div className="inline-block rounded-full bg-nordik-50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-nordik-800">
        404
      </div>
      <h1 className="mt-6 font-display text-display-xl font-semibold tracking-tight text-ink-900">
        We couldn&rsquo;t find that page.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-ink-600">
        The link you followed may be broken, or the page may have moved.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2 rounded-md bg-nordik-700 px-5 text-sm font-medium text-white shadow-elev-2 transition-colors hover:bg-nordik-800"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to home
        </Link>
      </div>
    </div>
  );
}
