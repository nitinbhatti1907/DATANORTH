export default function JobsLoading() {
  return (
    <div className="content-container py-10">
      <div className="h-4 w-64 rounded bg-ink-100" />
      <div className="mt-6 h-4 w-32 rounded bg-ink-100" />
      <div className="mt-3 h-10 w-2/3 rounded bg-ink-100" />
      <div className="mt-4 h-4 w-1/2 rounded bg-ink-100" />
      <div className="mt-8 overflow-hidden rounded-lg border border-ink-200 bg-white shadow-elev-1">
        <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
          <div className="h-6 w-40 rounded bg-ink-100" />
          <div className="flex gap-2">
            <div className="h-9 w-56 rounded bg-ink-100" />
            <div className="h-9 w-20 rounded bg-ink-100" />
            <div className="h-9 w-20 rounded bg-ink-100" />
          </div>
        </div>
        <div className="divide-y divide-ink-100">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex items-center gap-6 px-4 py-3">
              <div className="h-4 w-16 rounded bg-ink-100" />
              <div className="h-4 flex-1 rounded bg-ink-100" />
              <div className="h-4 w-28 rounded bg-ink-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
