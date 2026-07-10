import type { NextConfig } from "next";

/** Keep `.next` off iCloud Drive — synced folders corrupt webpack/RSC manifests. */
const distDir = process.env.NEXT_DIST_DIR?.trim() || "/tmp/patient-conversion-next";

const nextConfig: NextConfig = {
  distDir,
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
