import fs from "node:fs";
import path from "node:path";

export const mediaRoots = [
  {
    product: "shared",
    root: "assets",
    purpose: "Vendor-level logos, homepage media, shared CSS and shared JavaScript."
  },
  {
    product: "excel-to-jira-importer-updater",
    root: "apps/excel-to-jira-importer-updater/assets",
    purpose: "Excel to Jira screenshots, docs screenshots, icons, OG images and demo media."
  },
  {
    product: "project-overview-status-hub-for-jira",
    root: "apps/project-overview-status-hub-for-jira/assets",
    purpose: "Project Overview screenshots, Marketplace graphics, icons and hero media."
  },
  {
    product: "worklog-rollup-for-jira",
    root: "apps/worklog-rollup-for-jira/assets",
    purpose: "Worklog Rollup screenshots, mobile screenshots and icons."
  }
];

export const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".svg", ".webp", ".gif"]);

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(fullPath));
    if (entry.isFile()) files.push(fullPath);
  }

  return files;
}

export function getMediaLibrary(projectRoot = process.cwd()) {
  return mediaRoots.flatMap((section) => {
    const rootPath = path.join(projectRoot, section.root);
    return walk(rootPath)
      .filter((file) => imageExtensions.has(path.extname(file).toLowerCase()))
      .map((file) => ({
        ...section,
        path: path.relative(projectRoot, file).replace(/\\/g, "/"),
        name: path.basename(file),
        extension: path.extname(file).toLowerCase()
      }));
  });
}
