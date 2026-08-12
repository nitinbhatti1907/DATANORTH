import { requireAdminSession } from "@/lib/server/admin-auth";
import { getIndicatorsRepository } from "@/lib/server/data-repository";
import { UploadForm } from "./upload-form";

export default async function AdminUploadPage() {
  await requireAdminSession();
  const indicators = await getIndicatorsRepository();

  return (
    <div>
      <div className="mb-6 max-w-2xl">
        <h2 className="font-display text-display-sm font-semibold tracking-tight text-ink-900">
          Manage indicator data
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          Prepare raw source files, validate cleaned data, download indicator
          backups, then replace or extend current records in the versioned
          Postgres data model.
        </p>
      </div>
      <UploadForm indicators={indicators} />
    </div>
  );
}
