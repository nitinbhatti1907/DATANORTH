export default function CommunityLoading() {
  return (
    <>
      <section className="border-b border-ink-200 bg-gradient-to-br from-nordik-50 to-white">
        <div className="content-container py-12">
          <div className="h-4 w-56 rounded bg-ink-100" />
          <div className="mt-6 h-4 w-24 rounded bg-ink-100" />
          <div className="mt-3 h-12 w-1/2 rounded bg-ink-100" />
          <div className="mt-4 h-4 w-40 rounded bg-ink-100" />
        </div>
      </section>
      <div className="content-container py-10">
        <div className="h-6 w-48 rounded bg-ink-100" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-36 rounded-lg border border-ink-200 bg-white shadow-elev-1"
            />
          ))}
        </div>
      </div>
      <div className="content-container py-10">
        <div className="h-[460px] rounded-lg border border-ink-200 bg-white shadow-elev-1" />
      </div>
    </>
  );
}
