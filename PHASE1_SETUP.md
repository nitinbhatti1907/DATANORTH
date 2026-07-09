# DATANORTH Phase 1 Setup

This copy is prepared for the Phase 1 plan: Vercel hosting, Supabase Postgres,
Clerk-protected admin pages, and versioned CSV/Excel uploads.

## Environment Variables

Create `.env.local` for local work and set the same values in Vercel:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgres://postgres:[password]@[host]:6543/postgres
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
ADMIN_UPLOADS_ENABLED=false
```

Keep `ADMIN_UPLOADS_ENABLED=false` until the database is migrated, seeded, and
Clerk access is confirmed.

## Database

The schema lives in `src/db/schema.ts`.

Recommended first setup:

```bash
npm install
npm run db:push
npm run db:seed
```

`db:seed` loads the current indicator metadata, geographies, and fallback sample
values into Supabase. Real uploads can then replace current values through the
admin upload flow.

## Admin Upload Format

The upload endpoint accepts `.csv`, `.xlsx`, and `.xls`.

Required columns:

- `indicator_slug`
- `geography_code`
- `year`
- `value`

Optional columns:

- `label` for composition indicators
- `quarter`
- `month`
- `confidence_low`
- `confidence_high`
- `is_forecast`
- `model_id`

When a new row matches an existing current row by indicator, geography, year,
and label, the existing row is marked `is_current=false` and the new row becomes
current. Older values remain available in the database for audit history.

## Deployment

This copy removes Netlify config and adds `vercel.json`. Deploy from GitHub to
Vercel with the same environment variables configured in the Vercel project.
