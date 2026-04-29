# DATANORTH — v2

A public data platform for Northern Ontario.

Built with NORDIK Institute and the DECIDE Research Lab.

---

## What this release contains

**Tech stack**

- Next.js 15 (App Router) + TypeScript
- TailwindCSS 3 + custom design system (tokens, typography, motion)
- Apache ECharts for charts, TanStack Table for tables, TanStack Query for data
- Framer Motion, lucide-react, Fraunces + Inter + JetBrains fonts

**What works today**

- A premium, institutional homepage with hero, category grid, KPI snapshot, and partners strip
- 10 categories, each with its own landing page, accent color, and imagery
- 13 indicators with full metadata (source, methodology, license, update cadence)
- Per-indicator detail pages with:
  - Interactive ECharts line/bar/table toggle
  - URL-synced geography and year filters
  - **Chart-level CSV and Excel download, respecting active filters** (with a methodology sheet in the Excel export and a provenance README block in the CSV)
- Community profile pages (Sault Ste. Marie is the primary geography, plus Sudbury, Thunder Bay, North Bay, Timmins, Kenora)
- A real 517-row Statistics Canada NOC wage dataset, live at `/jobs`, with sort / filter / download built in
- A real Sault Ste. Marie health services dataset (87 entries) exposed via `/api/health-services`
- Explore page with search + category filter
- Methodology, About, Partners, Contact, Accessibility, Land Acknowledgement, and a 404 page
- SEO: proper metadata, OpenGraph, sitemap, robots
- Accessibility: skip-link, focus rings, `prefers-reduced-motion`, semantic HTML, table views of every chart

**What's sample data vs. real data**

- Two indicators carry **real data** migrated from the prior prototype:
  - `median-wage-by-occupation` (Statistics Canada NOC)
  - `health-services-by-type` (compiled SSM service directory)
- All other indicators carry **synthetic demonstration values** calibrated to realistic orders of magnitude so the UI can be reviewed end-to-end. Every chart, indicator card, and CSV/Excel export that includes sample data is clearly marked. Replace with ingested real values before citing.

---

## Quick start

See [`SETUP.md`](./SETUP.md) for detailed step-by-step instructions, including prerequisites and troubleshooting. Short version:

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template (optional for local dev)
cp .env.example .env.local

# 3. Run the dev server
npm run dev

# 4. Open http://localhost:3000
```

Requires Node.js 18.18 or later.

---

## Project structure

```
datanorth-v2/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout, fonts, metadata
│   │   ├── page.tsx                  # Homepage
│   │   ├── globals.css               # Design tokens + base styles
│   │   ├── not-found.tsx             # 404
│   │   ├── sitemap.ts                # Auto sitemap
│   │   ├── categories/
│   │   │   ├── page.tsx              # Categories index
│   │   │   └── [slug]/page.tsx       # Category detail
│   │   ├── indicators/
│   │   │   ├── page.tsx              # All indicators
│   │   │   └── [slug]/page.tsx       # Indicator detail (chart + filters + download)
│   │   ├── communities/
│   │   │   ├── page.tsx              # Communities index
│   │   │   └── [slug]/page.tsx       # Community profile
│   │   ├── explore/page.tsx          # Search & filter
│   │   ├── jobs/page.tsx             # Full NOC wage dataset (real data)
│   │   ├── methodology/page.tsx
│   │   ├── about/page.tsx
│   │   ├── partners/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── accessibility/page.tsx
│   │   ├── acknowledgement/page.tsx
│   │   └── api/                      # API routes
│   │       ├── chart-data/route.ts
│   │       ├── indicators/route.ts
│   │       ├── geographies/route.ts
│   │       └── health-services/route.ts
│   ├── components/
│   │   ├── layout/                   # Site header, footer, breadcrumbs
│   │   ├── home/                     # Home-specific (hero)
│   │   ├── data/                     # ChartPanel, FilterBar, DownloadMenu, KPI, DataTable
│   │   ├── cards/                    # CategoryCard, IndicatorCard
│   │   ├── ui/                       # Primitives (button, card, badge, controls)
│   │   └── providers.tsx             # React Query provider
│   ├── lib/
│   │   ├── data/                     # Categories, geographies, indicators, values, jobs, health
│   │   ├── download.ts               # CSV + Excel export with provenance
│   │   ├── format.ts                 # Number/date/unit formatters
│   │   ├── query.ts                  # In-memory chart data lookup
│   │   └── utils.ts                  # cn() classname merger
│   └── types/
│       └── index.ts                  # All shared types
├── public/
│   ├── images/
│   │   ├── categories/               # Category card imagery (from prior repo)
│   │   ├── hero/                     # Home hero imagery
│   │   └── logos/                    # Partner logos
│   ├── favicon.svg
│   └── robots.txt
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── postcss.config.mjs
├── .env.example
├── .gitignore
├── README.md
└── SETUP.md
```

---

## Chart-data download — how it works

Every `ChartPanel` renders a **Download** button that reflects exactly what the user sees on screen.

- The same `queryChartData()` function feeds both the chart and the download, so the export is guaranteed to match the view
- CSV exports include a multi-line provenance block at the top: indicator, source, methodology, license, active filters, export timestamp, and a clear **sample data** warning if the indicator is synthetic
- Excel exports write the data to a **Data** sheet and write provenance into a separate **Methodology** sheet
- Filenames are slugified: `datanorth_<indicator>_<geography>_<date>.csv`

---

## Ready for the future

**URL-synced filters.** Every indicator page encodes its geography and year range in the URL query string. A link to a specific view is a shareable artefact.

**Forecast-ready data model.** The `IndicatorValue` type already includes `isForecast`, `confidenceLow`, `confidenceHigh`, and `modelId`. The ECharts configuration in `ChartPanel` is structured to render a dashed line and shaded band for any point with `isForecast: true` — this is the visual contract for future ML outputs.

**Swappable data layer.** The UI reads from `lib/data/` and `lib/query.ts`. To move to Postgres later, replace the contents of `lib/query.ts` with real DB calls — nothing else changes.

**Two API routes already live.** `/api/chart-data`, `/api/indicators`, `/api/geographies`, and `/api/health-services` are real routes, not static exports. The same shapes the UI consumes are returned by the API, so a mobile app or partner integration can use them directly.

---

## What's deliberately **not** in this build

These were scoped to later phases in the audit and are not yet built:

- Postgres + Drizzle ORM (uses in-memory data for now)
- Python FastAPI ML service (the data model is forecast-ready; no forecasts are shipped)
- MapLibre geographic choropleth
- Bilingual EN/FR content (the metadata has `locale: "en_CA"`; `next-intl` is not yet wired)
- The AI chat ("NIA") from the prior prototype
- Scraping of live ED wait time from Sault Area Hospital
- Compare-mode side-by-side small multiples (the individual chart supports multiple geographies, but a dedicated compare page is a later phase)
- Data story / insights pages (MDX-driven)

Each of these has a clean addition path. See the audit document for the phased plan.

---

## License & data

Source code is © 2025 DATANORTH / NORDIK Institute contributors. Data is attributed to its original sources; see each chart's methodology panel for per-source licensing.
