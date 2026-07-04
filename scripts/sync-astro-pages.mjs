#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { getHtmlPages, isHtmlAliasWithCleanRoute } from "../src/lib/legacy-pages.mjs";

const root = path.resolve(import.meta.dirname, "..");
const pagesRoot = path.join(root, "src", "pages");
const componentPath = path.join(root, "src", "components", "legacy", "LegacyDocument.astro");

function toImportPath(fromDirectory, targetFile) {
  let relativePath = path.relative(fromDirectory, targetFile).replace(/\\/g, "/");
  if (!relativePath.startsWith(".")) relativePath = `./${relativePath}`;
  return relativePath;
}

function wrapperPathFor(relativeFile) {
  if (relativeFile === "index.html") return path.join(pagesRoot, "index.astro");
  if (relativeFile.endsWith("/index.html")) {
    return path.join(pagesRoot, relativeFile.slice(0, -"index.html".length), "index.astro");
  }
  return path.join(pagesRoot, relativeFile.replace(/\.html$/, ".astro"));
}

fs.rmSync(pagesRoot, { recursive: true, force: true });

const pages = getHtmlPages().filter((page) => !isHtmlAliasWithCleanRoute(page.relativeFile));

for (const page of pages) {
  const wrapperPath = wrapperPathFor(page.relativeFile);
  const wrapperDirectory = path.dirname(wrapperPath);
  const componentImport = toImportPath(wrapperDirectory, componentPath);
  const content = `---\nimport LegacyDocument from \"${componentImport}\";\n\nconst pagePath = ${JSON.stringify(page.relativeFile)};\n---\n<LegacyDocument pagePath={pagePath} />\n`;

  fs.mkdirSync(wrapperDirectory, { recursive: true });
  fs.writeFileSync(wrapperPath, content);
}

console.log(`Synced ${pages.length} Astro page wrappers.`);
