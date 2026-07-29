import Link from "next/link";
import { ArrowRight, Database, MapPin, Sparkles } from "lucide-react";
import { CATEGORY_LIST } from "@/lib/data/categories";
import { INDICATORS } from "@/lib/data/indicators";
import { FEATURED_COMMUNITIES } from "@/lib/data/geographies";
import { DEFAULT_LOCALE, localizePath, type Locale } from "@/lib/i18n";

const HERO_COPY = {
  en: {
    eyebrow: "A public data platform for Northern Ontario",
    titleStart: "Data that makes the",
    titleHighlight: "North",
    titleEnd: "legible.",
    intro:
      "DATANORTH brings local indicators across housing, labour, health, population, and economy into one trustworthy place - with a focus on Sault Ste. Marie and the communities of Northern Ontario.",
    explore: "Explore the data",
    profile: "Sault Ste. Marie Profile",
    indicators: "Indicators",
    categories: "Categories",
    communities: "Communities",
    snapshot: "Snapshot - Northern Ontario",
    regionalView: "Regional view",
    mapCaption: "Community coverage map",
    selected: "Primary community",
    connected: "Comparable communities",
    lakeSuperior: "Lake Superior",
    lakeHuron: "Lake Huron",
    population: "Population",
    medianIncome: "Median inc.",
    unemployment: "Unemployment",
  },
  fr: {
    eyebrow: "Une plateforme de donnees publiques pour le Nord de l'Ontario",
    titleStart: "Des donnees qui rendent le",
    titleHighlight: "Nord",
    titleEnd: "lisible.",
    intro:
      "DATANORTH rassemble des indicateurs locaux sur le logement, le travail, la sante, la population et l'economie dans un seul espace fiable, avec un accent sur Sault Ste. Marie et les communautes du Nord de l'Ontario.",
    explore: "Explorer les donnees",
    profile: "Profil de Sault Ste. Marie",
    indicators: "Indicateurs",
    categories: "Categories",
    communities: "Communautes",
    snapshot: "Apercu - Nord de l'Ontario",
    regionalView: "Vue regionale",
    mapCaption: "Carte de couverture communautaire",
    selected: "Communaute principale",
    connected: "Communautes comparables",
    lakeSuperior: "Lac Superieur",
    lakeHuron: "Lac Huron",
    population: "Population",
    medianIncome: "Revenu median",
    unemployment: "Chomage",
  },
} as const;

export function Hero({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const totalIndicators = INDICATORS.length;
  const totalCategories = CATEGORY_LIST.length;
  const totalCommunities = FEATURED_COMMUNITIES.length;
  const copy = HERO_COPY[locale];

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
            {copy.eyebrow}
          </div>
          <h1 className="mt-6 font-display text-display-xl font-semibold leading-[1.02] tracking-[-0.03em] text-ink-900">
            {copy.titleStart}&nbsp;
            <span className="relative inline-block whitespace-nowrap">
              <span className="bg-gradient-to-br from-nordik-700 to-nordik-500 bg-clip-text text-transparent">
                {copy.titleHighlight}
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
            &nbsp;{copy.titleEnd}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
            {copy.intro}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={localizePath("/explore", locale)}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-nordik-700 px-5 text-sm font-medium text-white shadow-elev-2 transition-colors hover:bg-nordik-800"
            >
              {copy.explore}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href={localizePath("/communities/sault-ste-marie", locale)}
              className="inline-flex h-11 items-center gap-2 rounded-md border border-ink-200 bg-white px-5 text-sm font-medium text-ink-800 shadow-elev-1 transition-colors hover:border-ink-300"
            >
              <MapPin className="h-4 w-4" aria-hidden />
              {copy.profile}
            </Link>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-ink-200 pt-6">
            <HeroStat label={copy.indicators} value={totalIndicators} />
            <HeroStat label={copy.categories} value={totalCategories} />
            <HeroStat label={copy.communities} value={totalCommunities} />
          </dl>
        </div>

        <HeroViz locale={locale} />
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

function HeroViz({ locale }: { locale: Locale }) {
  const copy = HERO_COPY[locale];
  const points = [
    { x: 79, y: 104, label: "Kenora", align: "left" },
    { x: 273, y: 224, label: "Thunder Bay", align: "left" },
    { x: 573, y: 216, label: "Timmins", align: "left" },
    { x: 448, y: 358, label: "Sault Ste. Marie", hero: true, align: "right" },
    { x: 520, y: 358, label: "Elliot Lake", align: "left" },
    { x: 586, y: 346, label: "Greater Sudbury", align: "left" },
    { x: 644, y: 366, label: "North Bay", align: "left" },
  ];
  return (
    <div
      className="relative hidden rounded-xl border border-ink-200 bg-white p-5 shadow-elev-3 lg:block"
      aria-hidden
    >
      <div className="flex items-center justify-between pb-3 text-xs text-ink-500">
        <span className="inline-flex items-center gap-1.5">
          <Database className="h-3.5 w-3.5" />
          {copy.snapshot}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider">
          {copy.regionalView}
        </span>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-nordik-100 bg-[#e9f5df]">
        <div
          className="absolute inset-0 opacity-55"
          style={{
            backgroundImage:
              "linear-gradient(rgba(22,66,132,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(22,66,132,0.045) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
        <svg viewBox="0 0 720 520" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="heroMapWater" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#9fd8e6" />
              <stop offset="100%" stopColor="#d1ecf3" />
            </linearGradient>
            <linearGradient id="heroMapLand" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#cdf2d6" />
              <stop offset="55%" stopColor="#e5f6d7" />
              <stop offset="100%" stopColor="#f4f6d6" />
            </linearGradient>
            <filter id="heroMapShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="6"
                floodColor="#164284"
                floodOpacity="0.12"
              />
            </filter>
          </defs>
          <rect width="720" height="520" fill="url(#heroMapWater)" />
          <path
            d="M0 0H720V520H0Z"
            fill="url(#heroMapLand)"
          />
          <path
            d="M0 222C45 202 92 205 130 230C168 255 184 295 224 309C268 324 302 296 340 314C384 334 391 390 436 408C486 428 542 402 592 412C642 423 680 445 720 452V520H0Z"
            fill="url(#heroMapWater)"
            opacity="0.94"
          />
          <path
            d="M0 286C42 274 83 277 119 300C155 323 178 354 218 353C257 351 278 322 317 326C358 330 375 378 416 397C464 419 523 397 570 411C616 426 659 449 720 456V520H0Z"
            fill="#8fc9df"
            opacity="0.72"
          />
          <path
            d="M0 412C48 431 91 438 132 427C174 416 195 381 232 368C272 354 315 371 352 390C398 414 431 443 482 451C546 461 608 431 665 443C690 448 707 457 720 465V520H0Z"
            fill="#b8dce9"
            opacity="0.88"
          />
          <g opacity="0.86">
            <path
              d="M79 104C116 111 139 151 178 164C213 176 240 198 273 224C318 232 371 254 410 292C429 311 438 340 448 358C473 364 497 360 520 358C543 350 563 344 586 346C609 350 627 359 644 366"
              fill="none"
              stroke="#ffffff"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M586 346C583 300 577 253 573 216"
              fill="none"
              stroke="#ffffff"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M79 104C116 111 139 151 178 164C213 176 240 198 273 224C318 232 371 254 410 292C429 311 438 340 448 358C473 364 497 360 520 358C543 350 563 344 586 346C609 350 627 359 644 366"
              fill="none"
              stroke="#8091a6"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M586 346C583 300 577 253 573 216"
              fill="none"
              stroke="#8091a6"
              strokeWidth="2.1"
              strokeLinecap="round"
            />
          </g>

          <text
            x="70"
            y="452"
            fill="#456b86"
            fontSize="13"
            fontFamily="ui-sans-serif, system-ui"
            opacity="0.8"
            fontWeight="600"
          >
            {copy.lakeSuperior}
          </text>
          <text
            x="528"
            y="474"
            fill="#456b86"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui"
            opacity="0.76"
            fontWeight="600"
          >
            {copy.lakeHuron}
          </text>
          <text
            x="316"
            y="118"
            fill="#3f6212"
            fontSize="13"
            fontFamily="ui-sans-serif, system-ui"
            letterSpacing="1.1"
            opacity="0.42"
            fontWeight="700"
          >
            NORTHERN ONTARIO
          </text>
          <g transform="translate(566 42)">
            <rect
              width="84"
              height="32"
              rx="8"
              fill="white"
              fillOpacity="0.82"
              stroke="#d8e2ec"
            />
            <path d="M14 21H64" stroke="#164284" strokeWidth="3" />
            <path d="M14 17V25M64 17V25" stroke="#164284" strokeWidth="2" />
            <text
              x="21"
              y="14"
              fill="#64748b"
              fontSize="9"
              fontFamily="ui-sans-serif, system-ui"
            >
              250 km
            </text>
          </g>
          {points.map((p) => (
            <g key={p.label}>
              {p.hero && (
                <>
                  <circle cx={p.x} cy={p.y} r="25" fill="#164284" opacity="0.08" />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="18"
                    fill="none"
                    stroke="#164284"
                    strokeWidth="1.6"
                    opacity="0.24"
                  >
                    <animate
                      attributeName="r"
                      values="15;31;15"
                      dur="2.8s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.38;0;0.38"
                      dur="2.8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </>
              )}
              <circle cx={p.x} cy={p.y} r={p.hero ? 8.5 : 5.5} fill="white" opacity="0.96" />
              <circle
                cx={p.x}
                cy={p.y}
                r={p.hero ? 6 : 3.8}
                fill={p.hero ? "#164284" : "#2f6fc2"}
              />
              <text
                x={p.align === "right" ? p.x - 12 : p.x + 12}
                y={p.hero ? p.y - 10 : p.y + (p.label === "Elliot Lake" ? 18 : 4)}
                textAnchor={p.align === "right" ? "end" : "start"}
                fontSize={p.hero ? "11" : p.label === "Greater Sudbury" ? "11" : "12"}
                fill="#0f172a"
                fontFamily="ui-sans-serif, system-ui"
                fontWeight="700"
                paintOrder="stroke"
                stroke="#ffffff"
                strokeWidth="5"
                strokeLinejoin="round"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
        <div className="absolute bottom-3 left-3 rounded-md bg-white/88 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider text-ink-500 shadow-sm">
          {copy.mapCaption}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { label: copy.population, val: "780k", color: "#4f46e5" },
          { label: copy.medianIncome, val: "$68k", color: "#0369a1" },
          { label: copy.unemployment, val: "6.8%", color: "#047857" },
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



