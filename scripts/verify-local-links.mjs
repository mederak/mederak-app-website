#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || "dist");

const redirectPatterns = [
  /^\/index\.html$/,
  /^\/import-excel-to-jira\.html$/,
  /^\/apps\/excel-to-jira-importer-updater\/import-excel-to-jira\/?$/,
  /^\/apps\/excel-to-jira-importer-updater\/import-excel-to-jira\.html$/,
  /^\/apps\/excel-to-jira-importer-updater\/excel-to-jira-vs-csv-import\.html$/,
  /^\/apps\/excel-to-jira-importer-updater\/jira-csv-import-vs-excel-import\.html$/,
  /^\/apps\/excel-to-jira-importer-updater\/import-epics-stories-subtasks-from-excel\.html$/,
  /^\/apps\/excel-to-jira-importer-updater\/import-epics-stories-subtasks-from-excel-to-jira\.html$/,
  /^\/apps\/excel-to-jira-importer-updater\/update-jira-issues-from-excel\.html$/,
  /^\/apps\/excel-to-jira-importer-updater\/map-excel-columns-to-jira-fields\.html$/,
  /^\/apps\/excel-to-jira-importer-updater\/review-jira-changes-before-import\.html$/,
  /^\/apps\/excel-to-jira-importer-updater\/excel-to-jira-template\.html$/,
  /^\/apps\/excel-to-jira-importer-updater\/fill-excel-from-jira\.html$/
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

function localFileExists(urlPath) {
  const cleanPath = urlPath.split("#")[0].split("?")[0];
  if (!cleanPath.startsWith("/")) return true;
  if (redirectPatterns.some((pattern) => pattern.test(cleanPath))) return true;

  const directPath = path.join(root, cleanPath);
  if (fs.existsSync(directPath)) return true;
  if (cleanPath.endsWith("/") && fs.existsSync(path.join(root, cleanPath, "index.html"))) return true;
  if (!path.extname(cleanPath) && fs.existsSync(path.join(root, cleanPath, "index.html"))) return true;

  return false;
}

const failures = [];

for (const file of walk(root)) {
  const html = fs.readFileSync(file, "utf8");
  const relativeFile = path.relative(root, file).replace(/\\/g, "/");
  const basePath = `/${relativeFile.replace(/index\.html$/, "")}`;

  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
    const href = match[1];
    if (/^(https?:|mailto:|tel:|#|data:)/i.test(href)) continue;

    const resolvedPath = new URL(href, `https://mederak.app${basePath}`).pathname;
    if (!localFileExists(resolvedPath)) failures.push(`${relativeFile} -> ${href} (${resolvedPath})`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Local dist link verification passed.");
