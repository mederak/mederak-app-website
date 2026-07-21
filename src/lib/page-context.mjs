import { canonicalRoutes, excelResourceLinks, portalToolkitResourceLinks, products, site, toolResourceLinks } from "../data/site-structure.mjs";

const pageLabels = new Map([
  ["/", "Home"],
  ["/apps/", "Apps"],
  ["/trust-center.html", "Trust center"],
  ["/service-level-agreement.html", "Service level agreement"],
  ["/import-excel-to-jira/", "Import Excel to Jira"],
  ["/apps/customer-portal-toolkit-for-jsm/docs.html", "Documentation"],
  ["/apps/customer-portal-toolkit-for-jsm/widgets.html", "Widget reference"],
  ["/apps/customer-portal-toolkit-for-jsm/troubleshooting.html", "Troubleshooting"],
  ["/apps/customer-portal-toolkit-for-jsm/privacy.html", "Privacy"],
  ["/apps/customer-portal-toolkit-for-jsm/terms.html", "Terms"],
  ["/apps/customer-portal-toolkit-for-jsm/security.html", "Security"],
  ["/apps/customer-portal-toolkit-for-jsm/data-processing.html", "Data processing"],
  ["/apps/customer-portal-toolkit-for-jsm/subprocessors.html", "Subprocessors"],
  ["/apps/customer-portal-toolkit-for-jsm/data-residency.html", "Data residency"],
  ["/apps/customer-portal-toolkit-for-jsm/ai-transparency.html", "AI transparency"],
  ["/apps/customer-portal-toolkit-for-jsm/support.html", "Support"],
  ["/apps/customer-portal-toolkit-for-jsm/incident-response.html", "Incident response"],
  ["/apps/customer-portal-toolkit-for-jsm/uninstall-data-deletion.html", "Uninstall and data deletion"],
  ["/apps/customer-portal-toolkit-for-jsm/service-level-agreement.html", "Service level agreement"],
  ["/apps/excel-to-jira-importer-updater/docs.html", "User guide"],
  ["/apps/excel-to-jira-importer-updater/privacy.html", "Privacy"],
  ["/apps/excel-to-jira-importer-updater/terms.html", "Terms"],
  ["/apps/excel-to-jira-importer-updater/security.html", "Security"],
  ["/apps/excel-to-jira-importer-updater/subprocessors.html", "Sub-processors"],
  ["/apps/excel-to-jira-importer-updater/support.html", "Support"],
  ["/apps/excel-to-jira-importer-updater/data-processing.html", "Data processing"],
  ["/apps/excel-to-jira-importer-updater/update-jira-issues-from-excel/", "Update Jira issues from Excel"],
  ["/apps/excel-to-jira-importer-updater/jira-csv-import-vs-excel-import/", "CSV import vs Excel import"],
  ["/apps/excel-to-jira-importer-updater/import-epics-stories-subtasks-from-excel-to-jira/", "Import hierarchy from Excel"],
  ["/apps/excel-to-jira-importer-updater/map-excel-columns-to-jira-fields/", "Field mapping"],
  ["/apps/excel-to-jira-importer-updater/review-jira-changes-before-import/", "Review Jira changes"],
  ["/apps/excel-to-jira-importer-updater/excel-to-jira-template/", "Template"],
  ["/apps/excel-to-jira-importer-updater/fill-excel-from-jira/", "Fill Excel from Jira"],
  ["/apps/project-overview-status-hub-for-jira/docs.html", "User guide"],
  ["/apps/project-overview-status-hub-for-jira/privacy.html", "Privacy"],
  ["/apps/project-overview-status-hub-for-jira/terms.html", "Terms"],
  ["/apps/project-overview-status-hub-for-jira/security.html", "Security"],
  ["/apps/project-overview-status-hub-for-jira/subprocessors.html", "Sub-processors"],
  ["/apps/project-overview-status-hub-for-jira/support.html", "Support"],
  ["/apps/project-overview-status-hub-for-jira/data-processing.html", "Data processing"],
  ["/apps/project-overview-status-hub-for-jira/incident-response.html", "Incident response"],
  ["/apps/project-overview-status-hub-for-jira/service-level-agreement.html", "Service level agreement"],
  ["/apps/worklog-rollup-for-jira/docs.html", "User guide"],
  ["/apps/worklog-rollup-for-jira/privacy.html", "Privacy"],
  ["/apps/worklog-rollup-for-jira/terms.html", "Terms"],
  ["/apps/worklog-rollup-for-jira/security.html", "Security"],
  ["/apps/worklog-rollup-for-jira/subprocessors.html", "Sub-processors"],
  ["/apps/worklog-rollup-for-jira/support.html", "Support"],
  ["/apps/worklog-rollup-for-jira/data-processing.html", "Data processing"],
  ["/tools/jira-csv-excel-readiness-checker/", "Jira CSV and Excel readiness checker"],
  ["/tools/jira-csv-import-error-explainer/", "Jira CSV import error explainer"],
  ["/tools/jira-csv-import-date-format/", "Jira CSV date format problems"],
  ["/tools/jira-csv-import-parent-child/", "Jira CSV parent-child import problems"],
  ["/tools/jira-csv-import-custom-fields/", "Jira CSV custom field problems"],
  ["/tools/jira-csv-import-users-assignee-reporter/", "Jira CSV user import problems"],
  ["/tools/jira-csv-import-issue-type/", "Jira CSV issue type problems"],
  ["/tools/jira-csv-import-priority-status-options/", "Jira CSV priority and status problems"],
  ["/tools/jira-csv-bulk-update-risks/", "Jira CSV bulk update risks"],
  ["/tools/jira-csv-import-duplicate-issue-keys/", "Jira CSV duplicate issue keys"],
  ["/tools/jira-csv-import-empty-summary/", "Jira CSV empty summary errors"],
  ["/tools/jira-csv-import-field-mapping/", "Jira CSV field mapping problems"],
  ["/tools/jira-csv-import-subtasks/", "Jira CSV sub-task problems"],
  ["/tools/jira-csv-import-description-newlines/", "Jira CSV description newline problems"],
  ["/tools/jira-csv-import-labels-components-versions/", "Jira CSV labels, components and versions"]
]);

function normalizeRoute(route) {
  if (route === "/index.html") return "/";
  return route;
}

function productForRoute(route) {
  return Object.values(products).find((product) => route.startsWith(`/apps/${product.slug}/`)) || null;
}

function pageTitleFromRoute(route) {
  if (pageLabels.has(route)) return pageLabels.get(route);
  if (route.startsWith("/tools/")) {
    return route
      .replace(/^\/tools\//, "")
      .replace(/\/$/, "")
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  return "Page";
}

function sectionForRoute(route, product) {
  if (route.startsWith("/tools/")) return "tool";
  if (product) return "product";
  if (route === "/" || route === "/apps/" || route.endsWith(".html")) return "vendor";
  return "vendor";
}

function breadcrumbsForRoute(route, product) {
  if (route === "/") return [];
  if (route === "/apps/") return [{ label: site.name, href: "/" }, { label: "Apps" }];
  if (route.startsWith("/tools/")) {
    const label = pageTitleFromRoute(route);
    const items = [
      { label: site.name, href: "/" },
      { label: products["excel-to-jira-importer-updater"].name, href: products["excel-to-jira-importer-updater"].home }
    ];
    if (route !== "/tools/jira-csv-import-error-explainer/") {
      items.push({ label: "Jira CSV error explainer", href: "/tools/jira-csv-import-error-explainer/" });
    }
    items.push({ label });
    return items;
  }
  if (product) {
    const items = [{ label: site.name, href: "/" }, { label: "Apps", href: "/apps/" }];
    if (route === product.home) {
      items.push({ label: product.name });
    } else {
      items.push({ label: product.name, href: product.home }, { label: pageTitleFromRoute(route) });
    }
    return items;
  }
  return [{ label: site.name, href: "/" }, { label: pageTitleFromRoute(route) }];
}

function resourceLinksForRoute(route, product) {
  if (route.startsWith("/tools/")) return { label: "Free Jira CSV and Excel tools", links: toolResourceLinks };
  if (product?.slug === "customer-portal-toolkit-for-jsm") {
    return { label: "Customer Portal Toolkit resources", links: portalToolkitResourceLinks };
  }
  if (product?.slug === "excel-to-jira-importer-updater" || route === "/import-excel-to-jira/") {
    return { label: "Excel to Jira resources", links: excelResourceLinks };
  }
  return null;
}

export function canonicalPathForRoute(route) {
  const normalizedRoute = normalizeRoute(route);
  return canonicalRoutes.get(normalizedRoute) || normalizedRoute;
}

export function createPageContext(page) {
  const route = normalizeRoute(page.route);
  const canonicalPath = canonicalPathForRoute(route);
  const product = productForRoute(route) || (route === "/import-excel-to-jira/" ? products["excel-to-jira-importer-updater"] : null);
  const section = sectionForRoute(route, product);
  const isErrorPage = ["/403.html", "/404.html", "/500.html"].includes(route);

  return {
    route,
    canonicalPath,
    canonicalUrl: `${site.origin}${canonicalPath}`,
    product,
    section,
    title: pageTitleFromRoute(canonicalPath),
    breadcrumbs: breadcrumbsForRoute(canonicalPath, product),
    resourceNav: resourceLinksForRoute(canonicalPath, product),
    favicon: product?.favicon || site.favicon,
    stylesheet: isErrorPage || route === "/" ? "/assets/home.css" : product?.stylesheet || "/assets/site.css",
    configScript: route.startsWith("/tools/") || route === "/import-excel-to-jira/"
      ? "/assets/site-config.js"
      : product?.localConfig || "",
    siteScript: product?.script || "/assets/site.js",
    noindex: isErrorPage
  };
}
