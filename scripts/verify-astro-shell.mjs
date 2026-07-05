#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || "dist");
const expectedPages = [
  "index.html",
  "apps/index.html",
  "apps/excel-to-jira-importer-updater/index.html",
  "tools/jira-csv-excel-readiness-checker/index.html"
];

function walk(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(fullPath));
    if (entry.isFile() && entry.name.endsWith(".html") && !entry.name.startsWith("google")) files.push(fullPath);
  }

  return files;
}

function count(source, pattern) {
  return source.match(pattern)?.length || 0;
}

const failures = [];

for (const page of expectedPages) {
  if (!fs.existsSync(path.join(root, page))) failures.push(`${page}: missing generated page`);
}

for (const file of walk(root)) {
  const relative = path.relative(root, file).replace(/\\/g, "/");
  const html = fs.readFileSync(file, "utf8");
  const isErrorPage = ["403.html", "404.html", "500.html"].includes(relative);

  if (count(html, /<header\b[^>]*class=["'][^"']*\btopbar\b/gi) !== 1) failures.push(`${relative}: expected one site header`);
  if (count(html, /<footer\b[^>]*class=["'][^"']*\bfooter\b/gi) !== 1) failures.push(`${relative}: expected one site footer`);
  if (count(html, /<link\b[^>]*rel=["']canonical["']/gi) !== 1) failures.push(`${relative}: expected one canonical link`);
  if (count(html, /id=["']main-menu["']/gi) !== 1) failures.push(`${relative}: expected one main menu`);
  if (html.includes("localhost")) failures.push(`${relative}: contains localhost`);
  if (!isErrorPage && /<meta\b[^>]*name=["']robots["'][^>]*noindex/i.test(html)) failures.push(`${relative}: unexpected noindex`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Astro shell verification passed (${walk(root).length} HTML pages).`);
