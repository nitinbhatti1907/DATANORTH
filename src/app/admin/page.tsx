import Link from "next/link";
import { AlertCircle, ArrowUpRight, CheckCircle2, Database } from "lucide-react";
import { requireAdminSession } from "@/lib/server/admin-auth";
import { getIndicatorsRepository } from "@/lib/server/data-repository";
import { CATEGORY_LIST } from "@/lib/data/categories";
import { hasDatabaseConfig } from "@/db/client";

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();
  const indicators = await getIndicatorsRepository();
  const hasDb = hasDatabaseConfig();

  return (
    <div className="space-y-8">
      <SetupNotice mode={session.mode} hasDb={hasDb} />

      <div className="grid gap-4 md:grid-cols-3">
        <StatusTile
          label="Database"
          value={hasDb ? "Configured" : "Not configured"}
          good={hasDb}
        />
        <StatusTile
          label="Authentication"
          value={session.mode === "authenticated" ? "Clerk active" : "Setup mode"}
          good={session.mode === "authenticated"}
        />
        <StatusTile
          label="Uploads"
          value={process.env.ADMIN_UPLOADS_ENABLED === "true" ? "Enabled" : "Locked"}
          good={process.env.ADMIN_UPLOADS_ENABLED === "true"}
        />
      </div>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-display-sm font-semibold tracking-tight text-ink-900">
              Category readiness
            </h2>
            <p className="mt-2 text-sm text-ink-600">
              Phase 1 tracks which categories are still sample-backed and which
              are ready for real database values.
            </p>
          </div>
          <Link
            href="/admin/upload"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-nordik-700 link-underline"
          >
            Upload data
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_LIST.map((category) => {
            const categoryIndicators = indicators.filter(
              (indicator) => indicator.category === category.slug,
            );
            const real = categoryIndicators.filter((indicator) => !indicator.isSample).length;
            const sample = categoryIndicators.length - real;
            return (
              <div
                key={category.slug}
                className="rounded-lg border border-ink-200 bg-white p-5 shadow-elev-1"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div
                      className="text-xs font-medium uppercase tracking-wider"
                      style={{ color: category.accent }}
                    >
                      {category.shortName}
                    </div>
                    <h3 className="mt-1 text-lg font-semibold text-ink-900">
                      {category.name}
                    </h3>
                  </div>
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: category.accent }}
                    aria-hidden
                  />
                </div>
                <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-ink-500">
                      Total
                    </dt>
                    <dd className="num-plate mt-1 text-xl text-ink-900">
                      {categoryIndicators.length}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-ink-500">
                      Real
                    </dt>
                    <dd className="num-plate mt-1 text-xl text-emerald-700">
                      {real}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-ink-500">
                      Sample
                    </dt>
                    <dd className="num-plate mt-1 text-xl text-amber-700">
                      {sample}
                    </dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SetupNotice({
  mode,
  hasDb,
}: {
  mode: "setup" | "authenticated";
  hasDb: boolean;
}) {
  if (mode === "authenticated" && hasDb) return null;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div>
        <div className="font-semibold">Phase 1 setup mode</div>
        <p className="mt-1 leading-relaxed">
          Configure Supabase `DATABASE_URL`, Clerk keys, and set
          `ADMIN_UPLOADS_ENABLED=true` before publishing upload access to staff.
          Until then, the public site keeps using the local fallback dataset.
        </p>
      </div>
    </div>
  );
}

function StatusTile({
  label,
  value,
  good,
}: {
  label: string;
  value: string;
  good: boolean;
}) {
  const Icon = good ? CheckCircle2 : Database;
  return (
    <div className="rounded-lg border border-ink-200 bg-white p-5 shadow-elev-1">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-medium uppercase tracking-wider text-ink-500">
          {label}
        </div>
        <Icon
          className={good ? "h-4 w-4 text-emerald-700" : "h-4 w-4 text-ink-400"}
          aria-hidden
        />
      </div>
      <div className="mt-2 text-lg font-semibold text-ink-900">{value}</div>
    </div>
  );
}
