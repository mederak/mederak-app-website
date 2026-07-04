import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const ignoredDirectories = new Set([".git", "dist", "node_modules", "src"]);

function walk(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (ignoredDirectories.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function relative(filePath) {
  return path.relative(projectRoot, filePath).replace(/\\/g, "/");
}

function routeFromHtmlFile(filePath) {
  const file = relative(filePath);
  if (file === "index.html") return "/";
  if (file.endsWith("/index.html")) return `/${file.slice(0, -"index.html".length)}`;
  return `/${file}`;
}

export function getHtmlPages() {
  return walk(projectRoot)
    .filter((file) => file.endsWith(".html"))
    .filter((file) => !path.basename(file).startsWith("google"))
    .map((file) => ({
      route: routeFromHtmlFile(file),
      file,
      relativeFile: relative(file)
    }))
    .sort((a, b) => a.route.localeCompare(b.route));
}

export function readHtmlByRoute(route) {
  const page = getHtmlPages().find((candidate) => candidate.route === route);
  if (!page) {
    throw new Error(`No legacy HTML page found for route: ${route}`);
  }

  return fs.readFileSync(page.file, "utf8");
}

export function outputPathFromRoute(route) {
  if (route === "/") return "index.html";
  if (route.endsWith("/")) return `${route.replace(/^\//, "")}index.html`;
  return route.replace(/^\//, "");
}
