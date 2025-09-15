import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@framework': path.resolve(__dirname, 'Framework/src'),
    };
    return config;
  },
};

export default nextConfig;
