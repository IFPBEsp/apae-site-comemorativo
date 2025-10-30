import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  basePath: "/apae-site-comemorativo",
  output: "standalone",
};

export default nextConfig;
