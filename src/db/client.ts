import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Database = ReturnType<typeof drizzle<typeof schema>>;

let cachedClient: postgres.Sql | undefined;
let cachedDb: Database | undefined;

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url || url.includes("[password]") || url.includes("[host]")) {
    return null;
  }

  try {
    new URL(url);
    return url;
  } catch {
    return null;
  }
}

export function hasDatabaseConfig() {
  return Boolean(getDatabaseUrl());
}

export function getDb() {
  const url = getDatabaseUrl();
  if (!url) {
    throw new Error("DATABASE_URL is not configured with a valid Postgres URL.");
  }

  if (!cachedClient) {
    cachedClient = postgres(url, {
      max: 1,
      prepare: false,
    });
  }

  if (!cachedDb) {
    cachedDb = drizzle(cachedClient, { schema });
  }

  return cachedDb;
}
