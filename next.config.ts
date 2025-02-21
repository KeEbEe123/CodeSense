import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "13.201.91.147",
        pathname: "/uploads/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // This will skip type checking
  },
  eslint: {
    ignoreDuringBuilds: true, // This disables linting during build
  },
};

export default nextConfig;
