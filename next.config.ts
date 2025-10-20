import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SSR enabled for dynamic routes like [username]
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
