import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  basePath: '/javiersiliacay-portfolio',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
