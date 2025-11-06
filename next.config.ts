import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true, // avoids next/image optimization server
  },
  trailingSlash: true, // optional: ensure folders for each route (e.g., /about/index.html)
};

export default nextConfig;
