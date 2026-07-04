#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(import.meta.dirname, "..", "dist");
fs.rmSync(outDir, { recursive: true, force: true });

const syncResult = spawnSync("node", ["scripts/sync-astro-pages.mjs"], {
  stdio: "inherit",
  shell: process.platform === "win32"
});
if ((syncResult.status ?? 1) !== 0) {
  process.exit(syncResult.status ?? 1);
}

const result = spawnSync("npx", ["astro", "build"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: {
    ...process.env,
    ASTRO_TELEMETRY_DISABLED: "1"
  }
});

process.exit(result.status ?? 1);
