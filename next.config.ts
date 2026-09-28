import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A static site: every page is generated at build time (ADR 0023).
  output: "export",
};

export default nextConfig;
