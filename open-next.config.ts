import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Kept minimal on purpose: this site has no ISR/revalidation needs, so no
// R2/KV incremental-cache binding is configured. Add one later (see
// https://opennext.js.org/cloudflare/caching) if that changes.
export default defineCloudflareConfig();
