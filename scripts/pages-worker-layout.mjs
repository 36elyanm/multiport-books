// Cloudflare Pages (classic, git-connected) doesn't read wrangler.jsonc's
// `main` field the way Workers does. For a dynamic ("Advanced Mode") Pages
// deployment it instead looks for `_worker.js` (a file, or a directory with
// an `index.js` entrypoint) at the root of the build output directory.
//
// OpenNext's `.open-next/worker.js` isn't self-contained — it has relative
// imports into sibling folders (.build/, cloudflare/, middleware/,
// server-functions/, etc). So this copies the whole non-assets part of the
// OpenNext output into `.open-next/assets/_worker.js/` as a directory,
// with worker.js renamed to the index.js entrypoint Pages expects.
import { cp, rename, readdir, rm } from "fs/promises";
import path from "path";

const ROOT = path.join(process.cwd(), ".open-next");
const ASSETS_DIR = path.join(ROOT, "assets");
const WORKER_DIR = path.join(ASSETS_DIR, "_worker.js");

async function main() {
  await rm(WORKER_DIR, { recursive: true, force: true });

  const entries = await readdir(ROOT, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "assets") continue;
    const src = path.join(ROOT, entry.name);
    const dest = path.join(WORKER_DIR, entry.name);
    await cp(src, dest, { recursive: true });
  }

  await rename(path.join(WORKER_DIR, "worker.js"), path.join(WORKER_DIR, "index.js"));
  console.log(`Assembled Pages worker directory at ${path.relative(process.cwd(), WORKER_DIR)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
