#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { getHtmlPages, isHtmlAliasWithCleanRoute } from "../src/lib/legacy-pages.mjs";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "dist");
const ignoredDirectories = new Set([".astro", ".git", "dist", "node_modules", "public", "scripts", "src"]);
const ignoredFiles = new Set([
  ".DS_Store",
  ".deploy-secrets.json",
  ".gitkeep",
  ".gitignore",
  "AGENTS.md",
  "README.md",
  "astro.config.mjs",
  "package.json",
  "package-lock.json"
]);

function relative(filePath) {
  return path.relative(root, filePath).replace(/\\/g, "/");
}

function shouldCopy(filePath, entry) {
  if (entry.isDirectory()) return !ignoredDirectories.has(entry.name);
  if (!entry.isFile()) return false;
  if (ignoredFiles.has(entry.name)) return false;
  if (entry.name.endsWith(".md")) return false;
  if (entry.name.endsWith(".html") && !entry.name.startsWith("google")) return false;
  return true;
}

function copyPublicFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const source = path.join(directory, entry.name);
    if (!shouldCopy(source, entry)) continue;

    const destination = path.join(outDir, relative(source));
    if (entry.isDirectory()) {
      copyPublicFiles(source);
      continue;
    }

    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
  }
}

function copyLegacyHtmlAliases() {
  for (const page of getHtmlPages().filter((candidate) => isHtmlAliasWithCleanRoute(candidate.relativeFile))) {
    const destination = path.join(outDir, page.relativeFile);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(page.file, destination);
  }
}

fs.mkdirSync(outDir, { recursive: true });
copyPublicFiles(root);
copyLegacyHtmlAliases();
fs.rmSync(path.join(outDir, ".astro"), { recursive: true, force: true });
fs.rmSync(path.join(outDir, ".gitkeep"), { force: true });
console.log("Copied static assets into dist.");
