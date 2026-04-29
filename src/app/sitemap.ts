import type { MetadataRoute } from "next";
import { CATEGORY_LIST } from "@/lib/data/categories";
import { INDICATORS } from "@/lib/data/indicators";
import { FEATURED_COMMUNITIES, getGeography } from "@/lib/data/geographies";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, priority: 1 },
    { url: `${base}/explore`, lastModified: now, priority: 0.9 },
    { url: `${base}/categories`, lastModified: now, priority: 0.9 },
    { url: `${base}/communities`, lastModified: now, priority: 0.9 },
    { url: `${base}/indicators`, lastModified: now, priority: 0.9 },
    { url: `${base}/jobs`, lastModified: now, priority: 0.7 },
    { url: `${base}/methodology`, lastModified: now, priority: 0.7 },
    { url: `${base}/about`, lastModified: now, priority: 0.6 },
    { url: `${base}/partners`, lastModified: now, priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, priority: 0.5 },
    { url: `${base}/accessibility`, lastModified: now, priority: 0.4 },
    { url: `${base}/acknowledgement`, lastModified: now, priority: 0.4 },
  ];
  for (const c of CATEGORY_LIST) {
    pages.push({
      url: `${base}/categories/${c.slug}`,
      lastModified: now,
      priority: 0.8,
    });
  }
  for (const i of INDICATORS) {
    pages.push({
      url: `${base}/indicators/${i.slug}`,
      lastModified: new Date(i.lastUpdated),
      priority: 0.7,
    });
  }
  for (const code of FEATURED_COMMUNITIES) {
    const g = getGeography(code);
    if (!g) continue;
    const slug = g.name.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "");
    pages.push({
      url: `${base}/communities/${slug}`,
      lastModified: now,
      priority: 0.7,
    });
  }
  return pages;
}
