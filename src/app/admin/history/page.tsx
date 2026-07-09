import { requireAdminSession } from "@/lib/server/admin-auth";
import { getUploadHistoryRepository } from "@/lib/server/data-repository";
import { hasDatabaseConfig } from "@/db/client";

export default async function AdminHistoryPage() {
  await requireAdminSession();
  const uploads = await getUploadHistoryRepository();

  return (
    <div>
      <div className="mb-6 max-w-2xl">
        <h2 className="font-display text-display-sm font-semibold tracking-tight text-ink-900">
          Upload history
        </h2>
        <p className="mt-2 text-sm text-ink-600">
          Every manual upload and future ETL run is recorded here for audit and
          troubleshooting.
        </p>
      </div>

      {!hasDatabaseConfig() ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
          Connect `DATABASE_URL` to show upload history.
        </div>
      ) : uploads.length === 0 ? (
        <div className="rounded-lg border border-ink-200 bg-white p-8 text-center text-sm text-ink-600 shadow-elev-1">
          No uploads yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-ink-200 bg-white shadow-elev-1">
          <table className="min-w-full text-sm">
            <thead className="bg-ink-50">
              <tr>
                <th className="border-b border-ink-200 px-4 py-2 text-left font-medium text-ink-700">
                  File
                </th>
                <th className="border-b border-ink-200 px-4 py-2 text-left font-medium text-ink-700">
                  Status
                </th>
                <th className="border-b border-ink-200 px-4 py-2 text-left font-medium text-ink-700">
                  Rows
                </th>
                <th className="border-b border-ink-200 px-4 py-2 text-left font-medium text-ink-700">
                  Uploaded by
                </th>
                <th className="border-b border-ink-200 px-4 py-2 text-left font-medium text-ink-700">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((upload) => (
                <tr key={upload.id} className="hover:bg-nordik-50/30">
                  <td className="border-b border-ink-100 px-4 py-2 text-ink-800">
                    {upload.originalFilename ?? upload.filename}
                  </td>
                  <td className="border-b border-ink-100 px-4 py-2 text-ink-800">
                    {upload.status}
                  </td>
                  <td className="border-b border-ink-100 px-4 py-2 text-ink-800">
                    {upload.rowCount}
                  </td>
                  <td className="border-b border-ink-100 px-4 py-2 text-ink-800">
                    {upload.uploadedBy}
                  </td>
                  <td className="border-b border-ink-100 px-4 py-2 text-ink-800">
                    {upload.createdAt.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
