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

const keyCanonicals = new Map([
  ["index.html", `${canonicalOrigin}/`],
  ["apps/index.html", `${canonicalOrigin}/apps/`],
  ["apps/project-overview-status-hub-for-jira/index.html", `${canonicalOrigin}/apps/project-overview-status-hub-for-jira/`],
  ["apps/excel-to-jira-importer-updater/index.html", `${canonicalOrigin}/apps/excel-to-jira-importer-updater/`],
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
for (const htmlFile of htmlFiles) {
  const file = relative(htmlFile);
  const content = fs.readFileSync(htmlFile, "utf8");

  for (const tag of content.matchAll(/<(?:link|meta)\s+[^>]*(?:rel=["']canonical["']|property=["']og:url["']|name=["']twitter:url["'])[^>]*>/gi)) {
    assert(!oldDomainPattern.test(tag[0]), `${file} has old-domain SEO tag: ${tag[0]}`);
  }

  for (const script of content.matchAll(/<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const jsonText = script[1].trim();
    try {
      const data = JSON.parse(jsonText);
      const values = collectJsonValues(data);
      const oldValue = values.find((value) => oldDomainPattern.test(value));
      assert(!oldValue, `${file} has old-domain JSON-LD value: ${oldValue}`);
    } catch (error) {
      failures.push(`${file} has invalid JSON-LD: ${error.message}`);
    }
  }
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
