import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  typescript: {
    ignoreBuildErrors: true, // This will skip type checking
  },
  eslint: {
    ignoreDuringBuilds: true, // This disables linting during build
  },
};

export default nextConfig;
