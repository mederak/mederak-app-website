#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const canonicalOrigin = "https://mederak.app";
const oldDomainPattern = /\b(?:https?:\/\/)?(?:www\.)?mederak\.pl\b/i;
const failures = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function walk(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") {
      continue;
    }

    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function assert(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

function relative(filePath) {
  return path.relative(root, filePath).replace(/\\/g, "/");
}

function extractAttribute(tag, attributeName) {
  const match = tag.match(new RegExp(`${attributeName}\\s*=\\s*["']([^"']+)["']`, "i"));
  return match ? match[1] : "";
}

function collectJsonValues(value) {
  if (Array.isArray(value)) {
    return value.flatMap(collectJsonValues);
  }

  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectJsonValues);
  }

  return typeof value === "string" ? [value] : [];
}

function normalizeHtml(text) {
  return text.replace(/\s+/g, " ").trim();
}

function getTitle(content) {
  const match = content.match(/<title>([\s\S]*?)<\/title>/i);
  return match ? normalizeHtml(match[1]) : "";
}

function getMetaDescription(content) {
  for (const tag of content.matchAll(/<meta\s+[^>]*>/gi)) {
    const name = extractAttribute(tag[0], "name").toLowerCase();
    if (name === "description") {
      return extractAttribute(tag[0], "content").trim();
    }
  }

  return "";
}

function getJsonLdBlocks(content, file) {
  const blocks = [];

  for (const script of content.matchAll(/<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const jsonText = script[1].trim();
    try {
      blocks.push(JSON.parse(jsonText));
    } catch (error) {
      failures.push(`${file} has invalid JSON-LD: ${error.message}`);
    }
  }

  return blocks;
}

function jsonLdTypes(value) {
  if (Array.isArray(value)) {
    return value.flatMap(jsonLdTypes);
  }

  if (value && typeof value === "object") {
    const ownType = value["@type"];
    const nestedTypes = Object.values(value).flatMap(jsonLdTypes);
    return ownType ? [ownType, ...nestedTypes] : nestedTypes;
  }

  return [];
}

const sitemapFiles = walk(root).filter((file) => path.basename(file) === "sitemap.xml");
for (const sitemapFile of sitemapFiles) {
  const file = relative(sitemapFile);
  const content = fs.readFileSync(sitemapFile, "utf8");
  assert(!oldDomainPattern.test(content), `${file} contains mederak.pl`);

  for (const match of content.matchAll(/<loc>([^<]+)<\/loc>/gi)) {
    assert(
      match[1].startsWith(`${canonicalOrigin}/`),
      `${file} has non-canonical sitemap URL: ${match[1]}`
    );
  }
}

assert(
  read("robots.txt").includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`),
  "robots.txt must point to https://mederak.app/sitemap.xml"
);

const rootSitemap = read("sitemap.xml");
assert(
  rootSitemap.includes(`${canonicalOrigin}/apps/excel-to-jira-importer-updater/`),
  "sitemap.xml must include the Excel to Jira product page"
);
assert(
  rootSitemap.includes(`${canonicalOrigin}/import-excel-to-jira/`),
  "sitemap.xml must include the Excel to Jira guide page"
);

const keyCanonicals = new Map([
  ["index.html", `${canonicalOrigin}/`],
  ["apps/index.html", `${canonicalOrigin}/apps/`],
  ["apps/project-overview-status-hub-for-jira/index.html", `${canonicalOrigin}/apps/project-overview-status-hub-for-jira/`],
  ["apps/excel-to-jira-importer-updater/index.html", `${canonicalOrigin}/apps/excel-to-jira-importer-updater/`],
  ["import-excel-to-jira/index.html", `${canonicalOrigin}/import-excel-to-jira/`],
  ["apps/worklog-rollup-for-jira/index.html", `${canonicalOrigin}/apps/worklog-rollup-for-jira/`],
]);

for (const [file, expectedCanonical] of keyCanonicals) {
  const content = read(file);
  const canonical = content.match(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i);
  assert(Boolean(canonical), `${file} is missing rel=canonical`);
  if (canonical) {
    assert(
      extractAttribute(canonical[0], "href") === expectedCanonical,
      `${file} canonical should be ${expectedCanonical}`
    );
  }
}

const htmlFiles = walk(root).filter((file) => file.endsWith(".html"));
const indexableHtmlFiles = htmlFiles.filter((file) => !relative(file).startsWith("google"));
const titles = new Map();
const descriptions = new Map();

for (const htmlFile of htmlFiles) {
  const file = relative(htmlFile);
  const content = fs.readFileSync(htmlFile, "utf8");

  for (const tag of content.matchAll(/<(?:link|meta)\s+[^>]*(?:rel=["']canonical["']|property=["']og:url["']|name=["']twitter:url["'])[^>]*>/gi)) {
    assert(!oldDomainPattern.test(tag[0]), `${file} has old-domain SEO tag: ${tag[0]}`);
  }

  for (const link of content.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi)) {
    assert(!oldDomainPattern.test(link[1]), `${file} has old-domain internal link: ${link[1]}`);
  }

  for (const data of getJsonLdBlocks(content, file)) {
    const values = collectJsonValues(data);
    const oldValue = values.find((value) => oldDomainPattern.test(value));
    assert(!oldValue, `${file} has old-domain JSON-LD value: ${oldValue}`);
  }
}

for (const htmlFile of indexableHtmlFiles) {
  const file = relative(htmlFile);
  const content = fs.readFileSync(htmlFile, "utf8");
  const title = getTitle(content);
  const description = getMetaDescription(content);
  const h1Count = Array.from(content.matchAll(/<h1\b/gi)).length;

  assert(Boolean(title), `${file} is missing a title tag`);
  assert(Boolean(description), `${file} is missing a meta description`);
  assert(h1Count === 1, `${file} must have exactly one H1, found ${h1Count}`);

  if (title) {
    const existing = titles.get(title) || [];
    existing.push(file);
    titles.set(title, existing);
  }

  if (description) {
    const existing = descriptions.get(description) || [];
    existing.push(file);
    descriptions.set(description, existing);
  }
}

for (const [title, files] of titles) {
  assert(files.length === 1, `duplicate title "${title}" in ${files.join(", ")}`);
}

for (const [description, files] of descriptions) {
  assert(files.length === 1, `duplicate meta description "${description}" in ${files.join(", ")}`);
}

for (const file of ["apps/excel-to-jira-importer-updater/index.html", "import-excel-to-jira/index.html"]) {
  const content = read(file);
  const types = getJsonLdBlocks(content, file).flatMap(jsonLdTypes);
  assert(types.includes("FAQPage"), `${file} must include FAQPage JSON-LD`);
  assert(types.includes("VideoObject"), `${file} must include VideoObject JSON-LD`);
}

const htaccess = read(".htaccess");
assert(
  /RewriteCond\s+%\{HTTP_HOST\}\s+\^\(www\\\.\)\?mederak\\\.pl\$/i.test(htaccess),
  ".htaccess must match both mederak.pl and www.mederak.pl hosts"
);
assert(
  /RewriteRule\s+\^\(\.\*\)\$\s+https:\/\/mederak\.app\/\$1\s+\[R=301,L,NE\]/i.test(htaccess),
  ".htaccess must 301 redirect old-domain paths to https://mederak.app/$1"
);

if (failures.length > 0) {
  console.error("SEO domain verification failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("SEO domain verification passed.");
