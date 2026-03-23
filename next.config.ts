import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/javiersiliacay-portfolio',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
