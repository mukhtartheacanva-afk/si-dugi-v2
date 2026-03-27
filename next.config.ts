import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Naikin limit jadi 10MB biar PDF aman
    },
  },
  // TAMBAHKAN DI SINI:
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;