import type { NextConfig } from "next";

/**
 * Local/dev: set NEXT_DIST_DIR=/tmp/patient-conversion-next (see package.json)
 * so iCloud Drive does not corrupt the build cache.
 * Vercel/production: leave unset so output stays in the default `.next`.
 */
const distDir = process.env.NEXT_DIST_DIR?.trim() || undefined;

const nextConfig: NextConfig = {
  ...(distDir ? { distDir } : {}),
  /** App-only projects: segment explorer can corrupt the React Client Manifest (GET / 500). */
  devIndicators: false,
  experimental: {
    devtoolSegmentExplorer: false,
  },
  /** iCloud Drive often lacks reliable native watchers; polling keeps `next dev` stable. */
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
      config.watchOptions = {
        poll: 3000,
        aggregateTimeout: 500,
      };
    }
    return config;
  },
};

export default nextConfig;
