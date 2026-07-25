import { headers } from "next/headers";
import { LOCALE_HEADER, normalizeLocale, type Locale } from "@/lib/i18n";

export async function getRequestLocale(): Promise<Locale> {
  const requestHeaders = await headers();
  return normalizeLocale(requestHeaders.get(LOCALE_HEADER));
}
