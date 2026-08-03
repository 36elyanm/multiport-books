import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;

// Makes Cloudflare bindings (env vars, etc.) available when running the
// regular `next dev` server, so local dev matches the deployed Worker.
// No-op when not running under Wrangler. Dynamic import (not top-level
// await) so this stays safe regardless of how Next loads this config file.
if (process.env.NODE_ENV === "development") {
  import("@opennextjs/cloudflare").then(({ initOpenNextCloudflareForDev }) => {
    initOpenNextCloudflareForDev();
  });
}
