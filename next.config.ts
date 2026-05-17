import type { NextConfig } from "next";
import withPWA from "next-pwa";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const config = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})({
  output: "standalone",
  turbopack: {},
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  // AI-friendly: any /blog/<slug>.md or /docs/<slug>.md URL returns the raw
  // markdown source for that page. Lets AI agents fetch canonical content
  // without parsing the HTML wrapper.
  async rewrites() {
    return [
      { source: "/blog/:slug.md", destination: "/api/raw/blog/:slug" },
      { source: "/docs/:slug.md", destination: "/api/raw/docs/:slug" },
    ];
  },
} satisfies NextConfig);

export default config;
