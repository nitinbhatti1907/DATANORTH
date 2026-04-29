import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin workspace root to this folder to silence Next's "multiple lockfiles" warning
  // (it picks up an unrelated yarn.lock from the user's home directory otherwise)
  outputFileTracingRoot: path.join(process.cwd()),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    // Tree-shake heavy packages
    optimizePackageImports: [
      "lucide-react",
      "echarts",
      "echarts-for-react",
      "@tanstack/react-table",
      "framer-motion",
    ],
    // Client-side Router Cache — the critical fix for back-button latency.
    // With these settings, visiting a page once caches it in memory for
    // the session; hitting back returns from cache INSTANTLY and forward
    // navigation to an already-seen page has zero server roundtrip.
    staleTimes: {
      dynamic: 180,
      static: 600,
    },
  },
};

export default nextConfig;
