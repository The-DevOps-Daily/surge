import type { NextConfig } from "next";
import withPWA from "next-pwa";

const config = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})({
  output: "standalone",
  turbopack: {},
} satisfies NextConfig);

export default config;
