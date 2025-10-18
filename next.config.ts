import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove output config - Standard SKU supports SSR
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
