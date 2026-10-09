import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: "incremental",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-api.pandascore.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
