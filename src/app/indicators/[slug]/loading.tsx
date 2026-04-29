export default function IndicatorLoading() {
  return (
    <div className="content-container py-10">
      <div className="h-4 w-64 rounded bg-ink-100" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-start">
        <div>
          <div className="h-4 w-20 rounded bg-ink-100" />
          <div className="mt-3 h-10 w-3/4 rounded bg-ink-100" />
          <div className="mt-4 h-4 w-2/3 rounded bg-ink-100" />
        </div>
        <div className="h-36 rounded-lg border border-ink-200 bg-white shadow-elev-1" />
      </div>
      <div className="mt-8 h-20 rounded-lg border border-ink-200 bg-white shadow-elev-1" />
      <div className="mt-6 h-[460px] rounded-lg border border-ink-200 bg-white shadow-elev-1">
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <div className="h-5 w-1/3 rounded bg-ink-100" />
          <div className="h-9 w-40 rounded bg-ink-100" />
        </div>
        <div className="flex h-[360px] items-center justify-center text-sm text-ink-400">
          Loading chart…
        </div>
      </div>
    </div>
  );
}
