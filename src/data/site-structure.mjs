export const site = {
  origin: "https://mederak.app",
  name: "Mederak Apps",
  supportUrl: "https://mederak.atlassian.net/servicedesk",
  logo: "/assets/mederak-apps-logo.png",
  favicon: "/assets/favicon.png"
};

export const products = {
  "excel-to-jira-importer-updater": {
    slug: "excel-to-jira-importer-updater",
    shortName: "Excel to Jira",
    name: "Excel to Jira Importer & Updater",
    icon: "/apps/excel-to-jira-importer-updater/assets/icon.png",
    favicon: "/apps/excel-to-jira-importer-updater/assets/favicon.png",
    home: "/apps/excel-to-jira-importer-updater/",
    docs: "/apps/excel-to-jira-importer-updater/docs.html",
    privacy: "/apps/excel-to-jira-importer-updater/privacy.html",
    terms: "/apps/excel-to-jira-importer-updater/terms.html",
    security: "/apps/excel-to-jira-importer-updater/security.html",
    support: "/apps/excel-to-jira-importer-updater/support.html",
    marketplace: "https://marketplace.atlassian.com/apps/3429713184",
    marketplaceOverview: "https://marketplace.atlassian.com/apps/3429713184/excel-to-jira-importer-and-updater?hosting=cloud&tab=overview",
    localConfig: "/apps/excel-to-jira-importer-updater/assets/site-config.js",
    stylesheet: "/apps/excel-to-jira-importer-updater/assets/site.css",
    script: "/apps/excel-to-jira-importer-updater/assets/site.js"
  },
  "project-overview-status-hub-for-jira": {
    slug: "project-overview-status-hub-for-jira",
    shortName: "Project Overview",
    name: "Project Overview & Status Hub",
    icon: "/apps/project-overview-status-hub-for-jira/assets/app-icon.png",
    favicon: "/apps/project-overview-status-hub-for-jira/assets/favicon.png",
    home: "/apps/project-overview-status-hub-for-jira/",
    docs: "/apps/project-overview-status-hub-for-jira/docs.html",
    privacy: "/apps/project-overview-status-hub-for-jira/privacy.html",
    terms: "/apps/project-overview-status-hub-for-jira/terms.html",
    security: "/apps/project-overview-status-hub-for-jira/security.html",
    support: "/apps/project-overview-status-hub-for-jira/support.html",
    marketplace: "https://marketplace.atlassian.com/apps/3665110129",
    stylesheet: "/assets/site.css",
    script: "/assets/site.js"
  },
  "worklog-rollup-for-jira": {
    slug: "worklog-rollup-for-jira",
    shortName: "Worklog Rollup",
    name: "Worklog Rollup for Jira",
    icon: "/apps/worklog-rollup-for-jira/assets/icon.png",
    favicon: "/apps/worklog-rollup-for-jira/assets/favicon.png",
    home: "/apps/worklog-rollup-for-jira/",
    docs: "/apps/worklog-rollup-for-jira/docs.html",
    privacy: "/apps/worklog-rollup-for-jira/privacy.html",
    terms: "/apps/worklog-rollup-for-jira/terms.html",
    security: "/apps/worklog-rollup-for-jira/security.html",
    support: "/apps/worklog-rollup-for-jira/support.html",
    marketplace: "https://marketplace.atlassian.com/apps/883289483",
    localConfig: "/apps/worklog-rollup-for-jira/assets/site-config.js",
    stylesheet: "/apps/worklog-rollup-for-jira/assets/site.css",
    script: "/apps/worklog-rollup-for-jira/assets/site.js"
  }
};

export const excelResourceLinks = [
  { label: "Overview", href: "/apps/excel-to-jira-importer-updater/" },
  { label: "Import", href: "/import-excel-to-jira/" },
  { label: "Update", href: "/apps/excel-to-jira-importer-updater/update-jira-issues-from-excel/" },
  { label: "CSV vs Excel", href: "/apps/excel-to-jira-importer-updater/jira-csv-import-vs-excel-import/" },
  { label: "Hierarchy", href: "/apps/excel-to-jira-importer-updater/import-epics-stories-subtasks-from-excel-to-jira/" },
  { label: "Field mapping", href: "/apps/excel-to-jira-importer-updater/map-excel-columns-to-jira-fields/" },
  { label: "Review", href: "/apps/excel-to-jira-importer-updater/review-jira-changes-before-import/" },
  { label: "Template", href: "/apps/excel-to-jira-importer-updater/excel-to-jira-template/" },
  { label: "Fill from Jira", href: "/apps/excel-to-jira-importer-updater/fill-excel-from-jira/" },
  { label: "User guide", href: "/apps/excel-to-jira-importer-updater/docs.html" },
  { label: "Security", href: "/apps/excel-to-jira-importer-updater/security.html" },
  { label: "Support", href: "/apps/excel-to-jira-importer-updater/support.html" }
];

export const toolResourceLinks = [
  { label: "Error explainer", href: "/tools/jira-csv-import-error-explainer/" },
  { label: "Readiness checker", href: "/tools/jira-csv-excel-readiness-checker/" },
  { label: "Date format", href: "/tools/jira-csv-import-date-format/" },
  { label: "Parent-child", href: "/tools/jira-csv-import-parent-child/" },
  { label: "Custom fields", href: "/tools/jira-csv-import-custom-fields/" },
  { label: "Bulk update", href: "/tools/jira-csv-bulk-update-risks/" },
  { label: "Field mapping", href: "/tools/jira-csv-import-field-mapping/" }
];

export const canonicalRoutes = new Map([
  ["/apps/excel-to-jira-importer-updater/import-excel-to-jira/", "/import-excel-to-jira/"],
  ["/apps/excel-to-jira-importer-updater/import-excel-to-jira.html", "/import-excel-to-jira/"],
  ["/apps/excel-to-jira-importer-updater/excel-to-jira-vs-csv-import.html", "/apps/excel-to-jira-importer-updater/jira-csv-import-vs-excel-import/"],
  ["/apps/excel-to-jira-importer-updater/jira-csv-import-vs-excel-import.html", "/apps/excel-to-jira-importer-updater/jira-csv-import-vs-excel-import/"],
  ["/apps/excel-to-jira-importer-updater/import-epics-stories-subtasks-from-excel.html", "/apps/excel-to-jira-importer-updater/import-epics-stories-subtasks-from-excel-to-jira/"],
  ["/apps/excel-to-jira-importer-updater/import-epics-stories-subtasks-from-excel-to-jira.html", "/apps/excel-to-jira-importer-updater/import-epics-stories-subtasks-from-excel-to-jira/"],
  ["/apps/excel-to-jira-importer-updater/update-jira-issues-from-excel.html", "/apps/excel-to-jira-importer-updater/update-jira-issues-from-excel/"],
  ["/apps/excel-to-jira-importer-updater/map-excel-columns-to-jira-fields.html", "/apps/excel-to-jira-importer-updater/map-excel-columns-to-jira-fields/"],
  ["/apps/excel-to-jira-importer-updater/review-jira-changes-before-import.html", "/apps/excel-to-jira-importer-updater/review-jira-changes-before-import/"],
  ["/apps/excel-to-jira-importer-updater/excel-to-jira-template.html", "/apps/excel-to-jira-importer-updater/excel-to-jira-template/"],
  ["/apps/excel-to-jira-importer-updater/fill-excel-from-jira.html", "/apps/excel-to-jira-importer-updater/fill-excel-from-jira/"]
]);
