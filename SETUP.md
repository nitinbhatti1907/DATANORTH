# DATANORTH — local setup guide

Run the DATANORTH v2 platform on your computer in under five minutes.

---

## 1. Prerequisites

You need **Node.js 18.18 or later**. Node 20 LTS is recommended.

Check your version:

```bash
node --version
```

If you don't have Node, install it one of these ways:

**macOS (recommended — using Homebrew)**
```bash
brew install node@20
```

**macOS / Linux (recommended — using nvm)**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# Restart your terminal
nvm install 20
nvm use 20
```

**Windows**
- Download from https://nodejs.org/ (choose the LTS installer)
- Or install with `winget`: `winget install OpenJS.NodeJS.LTS`

You also need **npm** (comes bundled with Node) or **pnpm** (faster, optional):
```bash
npm install -g pnpm
```

---

## 2. Unzip the project

```bash
# From wherever you downloaded it, extract the ZIP
cd ~/Downloads          # or wherever you saved it
unzip datanorth-v2.zip  # macOS / Linux
# Windows: right-click the ZIP → "Extract All…"

cd datanorth-v2
```

---

## 3. Install dependencies

```bash
npm install
```

This will install about ~600 MB of packages into `node_modules/`. First install usually takes 2–4 minutes depending on your connection.

If you prefer pnpm:
```bash
pnpm install
```

If you see peer-dependency warnings about React 19, that's expected — Next.js 15 ships with React 19 RC. Safe to ignore.

---

## 4. (Optional) Set up environment variables

The app runs fine without any environment configuration. If you want to customize:

```bash
cp .env.example .env.local
```

Then open `.env.local` in your editor and edit values. Everything in the template is optional for local development.

---

## 5. Run the dev server

```bash
npm run dev
```

You should see output like:

```
  ▲ Next.js 15.0.3
  - Local:        http://localhost:3000
  - Ready in 1.8s
```

Open **http://localhost:3000** in your browser. The homepage should load.

---

## 6. Try the key flows

The fastest way to see the platform working end-to-end:

1. **Homepage** → scroll through the category grid, see the KPI snapshot
2. Click into **Housing** (or any category) → see the category landing page with featured KPIs and indicator cards
3. Click into **Average home price** → the full indicator detail page
4. On that page:
   - Click the **Bar / Table** toggles at the top-right of the chart
   - Add a second geography (e.g. Sudbury) using the filter chips
   - Adjust the year range
   - Click **Download → CSV** — open the downloaded file and you'll see the provenance header, then the rows
   - Click **Download → Excel** — open it and you'll see a **Data** sheet plus a **Methodology** sheet
5. Visit `/jobs` — the full 517-row NOC wage dataset with sort, filter, and download
6. Visit `/communities/sault-ste-marie` — the primary community profile

---

## 7. Build for production

To verify the production build compiles cleanly:

```bash
npm run build
npm run start
```

This runs Next.js in production mode at `http://localhost:3000`.

---

## Troubleshooting

**"Error: Cannot find module 'next/...'" on first run**
Delete `node_modules` and `package-lock.json`, then re-install:
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port 3000 is already in use**
```bash
npm run dev -- -p 3001
```

**"sharp" installation fails on Apple Silicon**
```bash
npm install --platform=darwin --arch=arm64 sharp
```

**TypeScript complains about missing types**
```bash
npm run typecheck
```
If this shows errors, share the output and we can help.

**Fonts show as fallback / the first load is slow**
The first request to Google Fonts is slow on cold start. Subsequent loads are cached. In production, Next.js self-hosts the fonts automatically.

**Charts don't render**
ECharts is client-only and imported dynamically. Make sure JavaScript is enabled in your browser. Try a hard refresh (`Cmd+Shift+R` on macOS, `Ctrl+Shift+R` elsewhere).

**"Module parse failed: Unexpected character '@'" or similar**
You're likely on Node 16 or older. Upgrade to Node 18.18+.

---

## Recommended next steps after it's running

1. **Rename** the app name, metadata URL, and partner links if you want to host it under a specific domain — edit `src/app/layout.tsx` and `.env.local`.
2. **Swap in real data** one indicator at a time. See the `isSample: true` flag in `src/lib/data/indicators.ts` — flip it to `false` only after the values in `src/lib/data/values.ts` are replaced with ingested real values.
3. **Deploy**. The project is compatible with Vercel (one-click), Cloud Run (Docker), or any Node-compatible host. If you want to continue on Google Cloud Run like the current prototype, the Dockerfile in the root of the prior repo is easy to adapt — ask for a Next.js-compatible version and I'll produce it.

---

## Useful commands

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run start      # Run production build locally
npm run lint       # Lint with ESLint
npm run typecheck  # Type-check without emitting
npm run format     # Format with Prettier
```

---

## Getting help

If something doesn't work:

1. Copy the full error output (from the terminal and/or the browser console)
2. Note your Node version (`node --version`) and OS
3. Share both — the project is small enough that most issues are diagnosable in one exchange
