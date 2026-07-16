import Link from "next/link";

export default function AdminUnauthorizedPage() {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
      <h2 className="font-display text-display-sm font-semibold tracking-tight">
        Admin access required
      </h2>
      <p className="mt-2 max-w-2xl leading-relaxed">
        You are signed in, but your email is not on the DATANORTH admin upload
        allowlist. Ask a project administrator to add your email before uploading
        data files.
      </p>
      <Link
        href="/"
        className="mt-4 inline-flex h-9 items-center rounded-md border border-amber-300 bg-white px-3 font-medium text-amber-950 shadow-elev-1 hover:border-amber-400"
      >
        Return home
      </Link>
    </div>
  );
}
