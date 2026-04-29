import Link from "next/link";
import { ArrowRight, Database, MapPin, Sparkles } from "lucide-react";
import { CATEGORY_LIST } from "@/lib/data/categories";
import { INDICATORS } from "@/lib/data/indicators";
import { FEATURED_COMMUNITIES } from "@/lib/data/geographies";

export function Hero() {
  const totalIndicators = INDICATORS.length;
  const totalCategories = CATEGORY_LIST.length;
  const totalCommunities = FEATURED_COMMUNITIES.length;

  return (
    <section className="relative overflow-hidden border-b border-ink-100">
      <div className="absolute inset-0 bg-grid bg-grid-fade" aria-hidden />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          background:
            "radial-gradient(1200px 600px at 80% -20%, rgba(29,86,166,0.12), transparent 60%), radial-gradient(900px 500px at 10% 110%, rgba(4,120,87,0.08), transparent 60%)",
        }}
        aria-hidden
      />

      <div className="content-container relative grid gap-12 py-16 lg:grid-cols-[1.25fr_1fr] lg:py-24">
        <div className="animate-fade-in-slow">
          <div className="inline-flex items-center gap-2 rounded-full border border-nordik-200 bg-nordik-50 px-3 py-1 text-xs font-medium text-nordik-800">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            A public data platform for Northern Ontario
          </div>
          <h1 className="mt-6 font-display text-display-xl font-semibold leading-[1.02] tracking-[-0.03em] text-ink-900">
            Data that makes the&nbsp;
            <span className="relative inline-block whitespace-nowrap">
              <span className="bg-gradient-to-br from-nordik-700 to-nordik-500 bg-clip-text text-transparent">
                North
              </span>
              <svg
                aria-hidden
                viewBox="0 0 200 12"
                className="absolute -bottom-1 left-0 h-2.5 w-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 8 Q 50 2, 100 7 T 198 6"
                  stroke="#2f6fc2"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.55"
                />
              </svg>
            </span>
            &nbsp;legible.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
            DATANORTH brings local indicators across housing, labour, health,
            population, and economy into one trustworthy place — with a focus
            on Sault Ste. Marie and the communities of Northern Ontario.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/explore"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-nordik-700 px-5 text-sm font-medium text-white shadow-elev-2 transition-colors hover:bg-nordik-800"
            >
              Explore the data
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/communities/sault-ste-marie"
              className="inline-flex h-11 items-center gap-2 rounded-md border border-ink-200 bg-white px-5 text-sm font-medium text-ink-800 shadow-elev-1 transition-colors hover:border-ink-300"
            >
              <MapPin className="h-4 w-4" aria-hidden />
              Sault Ste. Marie profile
            </Link>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-ink-200 pt-6">
            <HeroStat label="Indicators" value={totalIndicators} />
            <HeroStat label="Categories" value={totalCategories} />
            <HeroStat label="Communities" value={totalCommunities} />
          </dl>
        </div>

        <HeroViz />
      </div>
    </section>
  );
}

function HeroStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-ink-500">
        {label}
      </dt>
      <dd className="mt-1 num-plate text-2xl text-ink-900">{value}</dd>
    </div>
  );
}

function HeroViz() {
  // Decorative SVG — stylized Northern Ontario "data pulse"
  // Not intended as real data. Communicates the platform's concern.
  const points = [
    { x: 14, y: 78, label: "Kenora" },
    { x: 32, y: 62, label: "Thunder Bay" },
    { x: 58, y: 48, label: "Timmins" },
    { x: 66, y: 68, label: "Sudbury" },
    { x: 72, y: 80, label: "SSM", hero: true },
    { x: 80, y: 54, label: "North Bay" },
  ];
  return (
    <div
      className="relative hidden rounded-xl border border-ink-200 bg-white p-5 shadow-elev-3 lg:block"
      aria-hidden
    >
      <div className="flex items-center justify-between pb-3 text-xs text-ink-500">
        <span className="inline-flex items-center gap-1.5">
          <Database className="h-3.5 w-3.5" />
          Snapshot · Northern Ontario
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider">
          decorative
        </span>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-nordik-50/50">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(rgba(22,66,132,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(22,66,132,0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <svg viewBox="0 0 100 90" className="absolute inset-0 h-full w-full">
          {/* stylized outline suggestion */}
          <path
            d="M6 60 L10 40 L22 30 L36 28 L52 22 L70 24 L88 34 L92 52 L84 72 L66 84 L50 82 L30 80 L16 76 Z"
            fill="rgba(47,111,194,0.06)"
            stroke="rgba(22,66,132,0.35)"
            strokeWidth="0.4"
            strokeDasharray="2 1.5"
          />
          {points.map((p, i) => (
            <g key={p.label}>
              <circle
                cx={p.x}
                cy={p.y}
                r={p.hero ? 2.5 : 1.6}
                fill={p.hero ? "#164284" : "#2f6fc2"}
              />
              {p.hero && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="6"
                  fill="none"
                  stroke="#164284"
                  strokeWidth="0.5"
                  opacity="0.5"
                >
                  <animate
                    attributeName="r"
                    values="2.5;7;2.5"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.6;0;0.6"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              <text
                x={p.x + 3}
                y={p.y + 1.5}
                fontSize="2.2"
                fill="#334155"
                fontFamily="ui-sans-serif, system-ui"
              >
                {p.label}
              </text>
              {i < points.length - 1 && (
                <line
                  x1={p.x}
                  y1={p.y}
                  x2={points[i + 1].x}
                  y2={points[i + 1].y}
                  stroke="rgba(22,66,132,0.25)"
                  strokeWidth="0.3"
                  strokeDasharray="0.8 0.8"
                />
              )}
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { label: "Population", val: "780k", color: "#4f46e5" },
          { label: "Median inc.", val: "$68k", color: "#0369a1" },
          { label: "Unemployment", val: "6.8%", color: "#047857" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-md border border-ink-100 bg-white p-2.5"
          >
            <div className="text-[9px] uppercase tracking-wider text-ink-500">
              {s.label}
            </div>
            <div
              className="mt-0.5 num-plate text-sm"
              style={{ color: s.color }}
            >
              {s.val}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
