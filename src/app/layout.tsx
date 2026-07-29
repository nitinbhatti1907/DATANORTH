import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getTranslations, type Locale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/server/locale";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: {
    default: "DATANORTH - a public data platform for Northern Ontario",
    template: "%s · DATANORTH",
  },
  description:
    "DATANORTH collects, organizes, and shares vital data for Northern Ontario communities. Explore indicators across population, housing, health, labour, economy, and more - with a focus on Sault Ste. Marie and the North.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    title: "DATANORTH",
    description:
      "A public data platform for Northern Ontario - in partnership with NORDIK Institute.",
    type: "website",
    locale: "en_CA",
  },
  robots: {
    index: true,
    follow: true,
  },
};

function AppChrome({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const t = getTranslations(locale).common;

  return (
    <body className="font-sans text-ink-900 antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-nordik-700 focus:px-4 focus:py-2 focus:text-white"
      >
        {t.skipToMain}
      </a>
      <SiteHeader locale={locale} />
      <main id="main" className="min-h-[calc(100vh-200px)]">
        {children}
      </main>
      <SiteFooter locale={locale} />
    </body>
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getRequestLocale();
  const content = <AppChrome locale={locale}>{children}</AppChrome>;

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${fraunces.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
        <ClerkProvider>{content}</ClerkProvider>
      ) : (
        content
      )}
    </html>
  );
}
