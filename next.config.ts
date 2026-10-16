import type { NextConfig } from "next";

// En GitHub Pages el sitio vive en /<repo>. En local se sirve desde la raíz.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  // cacheComponents / partialPrefetching requieren servidor (PPR): incompatibles con export.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
