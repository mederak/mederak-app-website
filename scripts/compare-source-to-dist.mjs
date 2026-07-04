#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const ignoredDirectories = new Set([".astro", ".git", "dist", "node_modules", "public", "scripts", "src"]);
const failures = [];

function walk(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function relativeFromRoot(filePath) {
  return path.relative(root, filePath).replace(/\\/g, "/");
}

const htmlFiles = walk(root)
  .filter((file) => file.endsWith(".html"))
  .filter((file) => !path.basename(file).startsWith("google"))
  .map(relativeFromRoot)
  .sort();

for (const relativePath of htmlFiles) {
  const sourcePath = path.join(root, relativePath);
  const builtPath = path.join(dist, relativePath);
  if (!fs.existsSync(builtPath)) {
    failures.push(`${relativePath}: missing in dist`);
    continue;
  }

  const source = fs.readFileSync(sourcePath, "utf8").replace(/\r\n/g, "\n");
  const built = fs.readFileSync(builtPath, "utf8").replace(/\r\n/g, "\n");
  if (source !== built) {
    failures.push(`${relativePath}: source and dist HTML differ`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Source to dist HTML parity passed (${htmlFiles.length} pages).`);
