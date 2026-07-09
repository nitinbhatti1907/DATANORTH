import { requireAdminSession } from "@/lib/server/admin-auth";
import {
  getGeographiesRepository,
  getIndicatorsRepository,
} from "@/lib/server/data-repository";
import { UploadForm } from "./upload-form";

export default async function AdminUploadPage() {
  await requireAdminSession();
  const [indicators, geographies] = await Promise.all([
    getIndicatorsRepository(),
    getGeographiesRepository(),
  ]);

  return (
    <div>
      <div className="mb-6 max-w-2xl">
        <h2 className="font-display text-display-sm font-semibold tracking-tight text-ink-900">
          Upload indicator data
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          Upload CSV or Excel files into the versioned Postgres data model.
          Revised values archive older current records rather than overwriting
          them.
        </p>
      </div>
      <UploadForm indicators={indicators} geographies={geographies} />
    </div>
  );
}
