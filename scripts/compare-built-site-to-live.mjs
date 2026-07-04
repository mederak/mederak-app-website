#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const origin = "https://mederak.app";
const failures = [];
const differences = [];
const identical = [];

function walk(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function routeFromDistHtml(filePath) {
  const relativePath = path.relative(dist, filePath).replace(/\\/g, "/");
  if (relativePath === "index.html") return "/";
  if (relativePath.endsWith("/index.html")) return `/${relativePath.slice(0, -"index.html".length)}`;
  return `/${relativePath}`;
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 12);
}

function normalizeHtml(value) {
  return value.replace(/\r\n/g, "\n").trim();
}

function firstDifference(a, b) {
  const max = Math.min(a.length, b.length);
  for (let index = 0; index < max; index += 1) {
    if (a[index] !== b[index]) return index;
  }
  return max;
}

const htmlFiles = walk(dist)
  .filter((file) => file.endsWith(".html"))
  .filter((file) => !path.basename(file).startsWith("google"))
  .sort((a, b) => routeFromDistHtml(a).localeCompare(routeFromDistHtml(b)));

for (const file of htmlFiles) {
  const route = routeFromDistHtml(file);
  const url = `${origin}${route}`;
  const local = normalizeHtml(fs.readFileSync(file, "utf8"));

  let response;
  try {
    response = await fetch(url, { redirect: "follow" });
  } catch (error) {
    failures.push(`${route}: fetch failed: ${error.message}`);
    continue;
  }

  const live = normalizeHtml(await response.text());
  const finalUrl = response.url;
  const status = response.status;

  if (status < 200 || status >= 300) {
    failures.push(`${route}: live returned ${status} at ${finalUrl}`);
    continue;
  }

  if (local === live) {
    identical.push(route);
    continue;
  }

  const index = firstDifference(local, live);
  differences.push({
    route,
    finalUrl,
    localHash: sha256(local),
    liveHash: sha256(live),
    localLength: local.length,
    liveLength: live.length,
    firstDifference: index,
    redirected: finalUrl !== url
  });
}

console.log(`Compared ${htmlFiles.length} built HTML pages with ${origin}.`);
console.log(`Identical: ${identical.length}`);
console.log(`Different: ${differences.length}`);
console.log(`Failed: ${failures.length}`);

if (differences.length) {
  console.log("\nDifferences:");
  for (const difference of differences) {
    const redirectNote = difference.redirected ? ` redirectedTo=${difference.finalUrl}` : "";
    console.log(`- ${difference.route}${redirectNote} local=${difference.localHash}/${difference.localLength} live=${difference.liveHash}/${difference.liveLength} firstDiff=${difference.firstDifference}`);
  }
}

if (failures.length) {
  console.log("\nFailures:");
  for (const failure of failures) {
    console.log(`- ${failure}`);
  }
}

if (failures.length) process.exit(1);
