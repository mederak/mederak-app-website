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

function findBlock(source, pattern, closingTag, fromIndex = 0) {
  const start = source.slice(fromIndex).search(pattern);
  if (start < 0) return null;

  const absoluteStart = fromIndex + start;
  const end = source.indexOf(closingTag, absoluteStart);
  if (end < 0) return null;

  return {
    start: absoluteStart,
    end: end + closingTag.length,
    html: source.slice(absoluteStart, end + closingTag.length)
  };
}

function splitBodyModules(bodyInner) {
  const header = findBlock(bodyInner, /<header\b[^>]*class=["'][^"']*\btopbar\b/i, "</header>");
  const main = findBlock(bodyInner, /<main\b/i, "</main>", header ? header.end : 0);
  const footer = findBlock(bodyInner, /<footer\b[^>]*class=["'][^"']*\bfooter\b/i, "</footer>", main ? main.end : 0);
  const lightbox = footer
    ? findBlock(bodyInner, /<div\b[^>]*class=["'][^"']*\blightbox\b[^"']*["'][^>]*id=["']image-lightbox["']/i, "</div>", footer.end)
    : null;

  const navStart = header ? header.end : 0;
  const navEnd = main ? main.start : navStart;
  const navArea = bodyInner.slice(navStart, navEnd);
  const breadcrumb = findBlock(navArea, /<nav\b[^>]*class=["'][^"']*\bbreadcrumb\b/i, "</nav>");
  const resourceNav = findBlock(navArea, /<nav\b[^>]*class=["'][^"']*\bresource-nav\b/i, "</nav>");

  return {
    beforeHeader: header ? bodyInner.slice(0, header.start) : bodyInner,
    header: header?.html || "",
    afterHeaderBeforeMain: header && main ? bodyInner.slice(header.end, main.start) : "",
    breadcrumb: breadcrumb?.html || "",
    resourceNav: resourceNav?.html || "",
    main: main?.html || "",
    betweenMainAndFooter: main && footer ? bodyInner.slice(main.end, footer.start) : "",
    footer: footer?.html || "",
    afterFooterBeforeLightbox: footer ? bodyInner.slice(footer.end, lightbox ? lightbox.start : footer.end) : "",
    lightbox: lightbox?.html || "",
    afterLightbox: lightbox ? bodyInner.slice(lightbox.end) : footer ? bodyInner.slice(footer.end) : "",
  };
}

function splitLegacyHtml(html) {
  const headStart = html.indexOf("<head>");
  const headEnd = html.indexOf("</head>", headStart);
  const bodyStart = html.indexOf("<body", headEnd);
  const bodyOpenEnd = html.indexOf(">", bodyStart);
  const bodyEnd = html.lastIndexOf("</body>");

  if (headStart < 0 || headEnd < 0 || bodyStart < 0 || bodyOpenEnd < 0 || bodyEnd < 0) {
    throw new Error("Cannot split legacy HTML document.");
  }

  const bodyInner = html.slice(bodyOpenEnd + 1, bodyEnd);

  return {
    beforeHead: html.slice(0, headStart),
    head: html.slice(headStart, headEnd + "</head>".length),
    betweenHeadAndBody: html.slice(headEnd + "</head>".length, bodyStart),
    bodyOpen: html.slice(bodyStart, bodyOpenEnd + 1),
    ...splitBodyModules(bodyInner),
    afterBody: html.slice(bodyEnd),
  };
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

export function getLegacyPage(relativeFile) {
  const page = getHtmlPages().find((candidate) => candidate.relativeFile === relativeFile);
  if (!page) {
    throw new Error(`No legacy HTML page found for file: ${relativeFile}`);
  }

  const html = fs.readFileSync(page.file, "utf8");
  return {
    ...page,
    html,
    modules: splitLegacyHtml(html)
  };
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

export function isHtmlAliasWithCleanRoute(relativeFile) {
  if (!relativeFile.endsWith(".html") || relativeFile.endsWith("/index.html")) return false;
  const cleanRouteFile = relativeFile.replace(/\.html$/, "/index.html");
  return fs.existsSync(path.join(projectRoot, cleanRouteFile));
}
