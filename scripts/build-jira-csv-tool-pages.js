#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const problems = require("../tools/jira-csv-import-problems.js");

const root = path.resolve(__dirname, "..");
const marketplaceUrl = "https://marketplace.atlassian.com/apps/3429713184/excel-to-jira-importer-and-updater?hosting=cloud&tab=overview";
const demoUrl = "https://www.youtube.com/watch?v=O7YVRhEy0DE";
const checkerPath = "/tools/jira-csv-excel-readiness-checker/";
const explainerPath = "/tools/jira-csv-import-error-explainer/";

const byId = new Map(problems.map((problem) => [problem.id, problem]));

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function json(value) {
  return JSON.stringify(value);
}

function writeRoute(slug, content) {
  const directory = path.join(root, "tools", slug);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, "index.html"), content);
}

function header(currentUrl, title, description, type = "article", extraJsonLd = "") {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="https://mederak.app${currentUrl}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:type" content="${type}">
    <meta property="og:url" content="https://mederak.app${currentUrl}">
    <meta property="og:image" content="https://mederak.app/assets/mederak-apps-logo.png">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="icon" href="/apps/excel-to-jira-importer-updater/assets/icon.png">
    <link rel="stylesheet" href="/assets/site.css">
    ${extraJsonLd}
    <script src="/assets/site-config.js"></script>
    <script src="/assets/analytics-config.js"></script>
    <script src="/assets/analytics.js" defer></script>
  </head>`;
}

function nav() {
  return `<header class="topbar">
      <nav class="nav" aria-label="Main navigation">
        <a class="brand logo-brand" href="/"><img src="/assets/mederak-apps-logo.png" alt="Mederak Apps"></a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-menu"><span class="menu-icon" aria-hidden="true"><span></span><span></span><span></span></span><span>Menu</span></button>
        <div class="nav-links" id="main-menu">
          <a href="/">Home</a>
          <a href="/apps/">Apps</a>
          <a href="/apps/excel-to-jira-importer-updater/">Excel to Jira Importer &amp; Updater</a>
          <a href="${explainerPath}">CSV error explainer</a>
          <a href="${checkerPath}">Readiness checker</a>
          <a class="button primary" href="${marketplaceUrl}" data-config-url="EXCEL_MARKETPLACE_OVERVIEW_URL">Marketplace</a>
        </div>
      </nav>
    </header>`;
}

function footer() {
  return `<footer class="footer">
      <div class="footer-inner">
        <div>
          <a class="brand logo-brand" href="/"><img src="/assets/mederak-apps-logo.png" alt="Mederak Apps"></a>
          <p>Jira Cloud apps and free browser tools by Mederak Apps. Support: <a href="https://mederak.atlassian.net/servicedesk" data-config-url="SUPPORT_URL">Mederak Apps Service Desk</a></p>
        </div>
        <div class="footer-links">
          <a href="/">Home</a>
          <a href="/apps/">Apps</a>
          <a href="/apps/excel-to-jira-importer-updater/">Excel to Jira Importer &amp; Updater</a>
          <a href="${explainerPath}">CSV error explainer</a>
          <a href="${checkerPath}">Readiness checker</a>
          <a href="/apps/excel-to-jira-importer-updater/security.html">Security</a>
        </div>
      </div>
    </footer>`;
}

function breadcrumb(label, url) {
  return `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Mederak Apps</a> / <a href="/apps/excel-to-jira-importer-updater/">Excel to Jira Importer &amp; Updater</a> / <a href="${explainerPath}">Jira CSV error explainer</a> / ${escapeHtml(label)}</nav>`;
}

function toolNav(activeSlug) {
  const important = [
    ["jira-csv-import-error-explainer", "Error explainer"],
    ["jira-csv-excel-readiness-checker", "Readiness checker"],
    ["jira-csv-import-date-format", "Date format"],
    ["jira-csv-import-parent-child", "Parent-child"],
    ["jira-csv-import-custom-fields", "Custom fields"],
    ["jira-csv-bulk-update-risks", "Bulk update"],
    ["jira-csv-import-field-mapping", "Field mapping"]
  ];
  return `<nav class="resource-nav" aria-label="Free Jira CSV and Excel tools">${important.map(([slug, label]) => `<a href="/tools/${slug}/"${slug === activeSlug ? ' aria-current="page"' : ""}>${escapeHtml(label)}</a>`).join("")}</nav>`;
}

function list(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function relatedLinks(problem) {
  const links = (problem.relatedPages || [])
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((related) => `<a class="guide-link-card" href="/tools/${related.slug}/"><b>${escapeHtml(related.title)}</b><span>${escapeHtml(related.summary)}</span></a>`);
  links.push(`<a class="guide-link-card" href="${checkerPath}"><b>Free Jira CSV and Excel readiness checker</b><span>No Jira access required. Check CSV risk signals and basic workbook metadata locally in your browser.</span></a>`);
  return `<div class="guide-link-grid">${links.join("")}</div>`;
}

function ctaBlock(problem) {
  return `<div class="inline-cta tool-cta">
        <h2>${escapeHtml(problem.ctaHeading)}</h2>
        <p>${escapeHtml(problem.ctaCopy)}</p>
        <div class="hero-actions">
          <a class="button primary" href="${marketplaceUrl}" data-config-url="EXCEL_MARKETPLACE_OVERVIEW_URL" data-analytics-event="marketplace_csv_error_click" data-product="excel-to-jira-importer-updater">View on Atlassian Marketplace</a>
          <a class="button" href="${checkerPath}">Try the free readiness checker</a>
          <a class="button" href="${demoUrl}" data-config-url="EXCEL_DEMO_URL">Watch the short demo</a>
        </div>
      </div>`;
}

function problemPage(problem) {
  const currentUrl = `/tools/${problem.slug}/`;
  const articleJson = `<script type="application/ld+json">${json({
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: problem.h1,
    description: problem.metaDescription,
    author: { "@type": "Organization", name: "Mederak Apps" },
    publisher: { "@type": "Organization", name: "Mederak Apps", url: "https://mederak.app/" },
    mainEntityOfPage: `https://mederak.app${currentUrl}`
  })}</script>`;

  return `${header(currentUrl, problem.metaTitle, problem.metaDescription, "article", articleJson)}
  <body>
    <div class="site-shell">
      ${nav()}
      ${breadcrumb(problem.title, currentUrl)}
      ${toolNav(problem.slug)}
      <main class="content-page seo-page tool-page">
        <span class="eyebrow">Jira CSV import troubleshooting</span>
        <h1>${escapeHtml(problem.h1)}</h1>
        <p class="lead">${escapeHtml(problem.summary)}</p>
        <p class="tool-disclaimer">This is not official Atlassian documentation. Your Jira import wizard and project settings may behave differently. Always review Atlassian's current documentation and your Jira import preview before confirming an import.</p>

        <section>
          <h2>Short explanation</h2>
          <p>Common cause: ${escapeHtml(problem.commonCauses[0])}</p>
          <p>Possible fix: ${escapeHtml(problem.manualFixes[0])}</p>
        </section>

        <section>
          <h2>Common causes</h2>
          ${list(problem.commonCauses)}
        </section>

        <section>
          <h2>How to fix it</h2>
          ${list(problem.manualFixes)}
        </section>

        <section>
          <h2>What to check in Jira</h2>
          ${list(problem.jiraChecks)}
          <p>Check your Jira configuration before importing. Field configuration, workflow, issue type scheme, permissions and import wizard behavior can change the result.</p>
        </section>

        <section>
          <h2>Example</h2>
          <pre class="csv-example"><code>${escapeHtml(problem.example)}</code></pre>
        </section>

        <section>
          <h2>How to avoid this next time</h2>
          ${list(problem.readinessChecks)}
          <p>No Jira access required: the free checker can help identify common spreadsheet risks locally in your browser before you decide whether to install a Jira app.</p>
        </section>

        ${ctaBlock(problem)}

        <section>
          <h2>Related Jira CSV import errors</h2>
          ${relatedLinks(problem)}
        </section>
      </main>
      ${footer()}
    </div>
    <script src="/assets/site.js"></script>
  </body>
</html>
`;
}

function mainPage() {
  const currentUrl = explainerPath;
  const faq = [
    ["Why does Jira CSV import fail?", "Jira CSV import can fail when required fields are missing, values do not match Jira configuration, dates are in an unexpected format, users cannot be resolved, hierarchy references are invalid, or the CSV is parsed differently than expected."],
    ["Why are dates not imported correctly into Jira?", "Dates may fail when the CSV date values do not match the import format or Jira settings. Avoid ambiguous dates and confirm parsed values in Jira's import preview."],
    ["How do I import parent-child relationships into Jira from CSV?", "Parent-child imports usually require valid IDs, keys, issue types and parent references. The exact mapping depends on the Jira import experience and project configuration."],
    ["Why does Jira say a user was not found?", "Jira may not resolve assignees, reporters or user picker values if the CSV uses the wrong identifier, the user lacks project access, or permissions prevent assignment."],
    ["Why does Jira reject custom field values?", "Custom field values must match the field type, context and available options for the target project and issue type."],
    ["Can I update existing Jira issues from CSV?", "Some import workflows can update existing issues when issue keys or identifiers are mapped intentionally. Always review the preview because duplicate keys and empty values can be risky."],
    ["Is CSV the safest way to bulk update Jira issues?", "CSV can work, but it is fragile for bulk updates if fields, empty cells, duplicate keys and mappings are not reviewed carefully before changes are applied."],
    ["How can I check my CSV before importing to Jira?", "Use the free readiness checker to inspect common spreadsheet risk signals locally in your browser, then review Jira's import preview before confirming the import."]
  ];
  const faqJson = `<script type="application/ld+json">${json({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer }
    }))
  })}</script>`;

  return `${header(currentUrl, "Jira CSV Import Error Explainer - Fix Common Import Problems", "Paste a Jira CSV import error and get a plain-English explanation. Learn how to fix date format issues, parent-child mapping, custom fields, users, issue types, duplicate keys, and risky bulk updates.", "website", faqJson)}
  <body>
    <div class="site-shell">
      ${nav()}
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Mederak Apps</a> / <a href="/apps/excel-to-jira-importer-updater/">Excel to Jira Importer &amp; Updater</a> / Jira CSV import error explainer</nav>
      ${toolNav("jira-csv-import-error-explainer")}
      <main>
        <section class="tool-hero">
          <div>
            <span class="eyebrow">Free Jira CSV import tool</span>
            <h1>Jira CSV Import Error Explainer</h1>
            <p class="hero-copy">Paste a Jira CSV import error or warning and get a plain-English explanation with common causes, possible fixes and Jira configuration checks. No Jira access required.</p>
            <p class="tool-disclaimer">This is not official Atlassian documentation. Your Jira import wizard and project settings may behave differently. Always review Atlassian's current documentation and your Jira import preview.</p>
          </div>
          <form class="tool-form" data-error-explainer-form>
            <label for="jira-error-text">Paste your Jira CSV import error or warning</label>
            <textarea id="jira-error-text" rows="8" data-error-text placeholder="Example: Field 'summary' is required, could not parse date, parent issue not found..."></textarea>
            <label for="jira-error-intent">What were you trying to do?</label>
            <select id="jira-error-intent" data-error-intent>
              <option value="create">Create new issues</option>
              <option value="update">Update existing issues</option>
              <option value="subtasks">Import subtasks</option>
              <option value="hierarchy">Import parent-child hierarchy</option>
              <option value="custom-fields">Import custom fields</option>
              <option value="users">Import users / assignees / reporters</option>
              <option value="dates">Import dates</option>
              <option value="not-sure">I am not sure</option>
            </select>
            <button class="button primary" type="submit">Explain this error</button>
            <p class="tool-privacy-note">The matcher runs in your browser. The pasted error is not sent to an API and is not logged by this tool.</p>
          </form>
        </section>

        <section class="section" hidden data-error-result></section>

        <section class="section alt">
          <div class="section-inner">
            <div class="section-heading">
              <span class="eyebrow">Common Jira CSV import errors</span>
              <h2>Choose a problem guide</h2>
              <p>Each guide explains the likely cause, possible fixes, Jira configuration checks and a safer way to prepare the next import.</p>
            </div>
            <div class="guide-link-grid">
              ${problems.map((problem) => `<a class="guide-link-card" href="/tools/${problem.slug}/"><b>${escapeHtml(problem.title)}</b><span>${escapeHtml(problem.summary)}</span></a>`).join("")}
            </div>
          </div>
        </section>

        <section class="section">
          <div class="section-inner split">
            <div>
              <span class="eyebrow">Not ready to install a Jira app yet?</span>
              <h2>Start with the free checker</h2>
              <p>The checker runs locally in your browser and does not upload your CSV/XLSX file. You can identify common spreadsheet risks before deciding whether to install Excel to Jira Importer &amp; Updater.</p>
              <p>The checker is not a replacement for Atlassian's documentation or Jira's import preview. It is a practical preflight step for files that might contain empty summaries, duplicate keys, ambiguous dates or risky update fields.</p>
              <div class="hero-actions">
                <a class="button primary" href="${checkerPath}">Try the free readiness checker</a>
                <a class="button" href="${marketplaceUrl}" data-config-url="EXCEL_MARKETPLACE_OVERVIEW_URL">View on Atlassian Marketplace</a>
                <a class="button" href="${demoUrl}" data-config-url="EXCEL_DEMO_URL">Watch the short demo</a>
              </div>
            </div>
            <div class="tool-side-card">
              <h2>CSV imports are possible, but fragile.</h2>
              <p>Excel to Jira Importer &amp; Updater lets you map real Excel workbooks, clean values, create or update Jira issues, and review every change before Jira is modified.</p>
              <ul>
                <li>Map Excel columns to Jira fields safely.</li>
                <li>Build Jira hierarchy from Excel with preview.</li>
                <li>Review every Jira update before applying changes.</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="section alt" id="faq">
          <div class="section-inner">
            <div class="section-heading">
              <h2>Jira CSV import error FAQ</h2>
            </div>
            <div class="faq-grid">
              ${faq.map(([question, answer]) => `<article class="faq-item"><h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p></article>`).join("")}
            </div>
          </div>
        </section>
      </main>
      ${footer()}
    </div>
    <script src="/tools/jira-csv-import-problems.js"></script>
    <script src="/tools/jira-csv-error-matcher.js"></script>
    <script src="/tools/jira-csv-error-explainer.js"></script>
    <script src="/assets/site.js"></script>
  </body>
</html>
`;
}

function checkerPage() {
  const currentUrl = checkerPath;
  return `${header(currentUrl, "Jira CSV and Excel Readiness Checker - Free Browser Tool", "Check CSV samples for common Jira import risks locally in your browser, including empty summaries, duplicate issue keys and ambiguous dates. XLS/XLSX files get basic local metadata checks.", "website")}
  <body>
    <div class="site-shell">
      ${nav()}
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Mederak Apps</a> / <a href="/apps/excel-to-jira-importer-updater/">Excel to Jira Importer &amp; Updater</a> / Jira CSV and Excel readiness checker</nav>
      ${toolNav("jira-csv-excel-readiness-checker")}
      <main>
        <section class="tool-hero">
          <div>
            <span class="eyebrow">No Jira access required</span>
            <h1>Jira CSV and Excel readiness checker</h1>
            <p class="hero-copy">Check CSV import risk signals before importing into Jira, and run basic local metadata checks for XLS/XLSX files. The checker runs locally in your browser and does not upload your CSV/XLSX file.</p>
            <p class="tool-disclaimer">This is not official Atlassian documentation. Always review Atlassian's current documentation, your Jira configuration and the Jira import preview before confirming changes.</p>
          </div>
          <form class="tool-form" data-readiness-form>
            <label for="readiness-file">Choose a CSV or XLSX file</label>
            <input id="readiness-file" type="file" accept=".csv,.xlsx,.xls,text/csv" data-readiness-file>
            <label for="readiness-text">Or paste a CSV sample</label>
            <textarea id="readiness-text" rows="8" data-readiness-text placeholder="Summary,Issue Type,Due date&#10;Prepare import,Task,2026-07-31"></textarea>
            <button class="button primary" type="submit">Check spreadsheet readiness</button>
            <p class="tool-privacy-note">The selected CSV file or pasted sample is processed by this browser page only. XLS/XLSX files are not parsed by this free checker; only local file metadata is checked. Nothing is uploaded by this checker.</p>
          </form>
        </section>

        <section class="section" hidden data-readiness-result></section>

        <section class="section alt">
          <div class="section-inner split">
            <div>
              <span class="eyebrow">Not ready to install a Jira app yet?</span>
              <h2>Start with the free checker</h2>
              <p>Start with the free checker. It runs locally in your browser and does not upload your CSV/XLSX file. You can identify common spreadsheet risks before deciding whether to install Excel to Jira Importer &amp; Updater.</p>
              <p>The checker looks for practical risk signals such as empty Summary values, duplicate issue keys and ambiguous date-looking values in CSV data. For full workbook mapping, cleanup, validation and Jira review, use the Marketplace app.</p>
            </div>
            <div class="tool-side-card">
              <h2>Need a restricted-environment evaluation?</h2>
              <p>The checker runs locally in your browser and does not upload your CSV/XLSX file. If your organization requires a fully offline desktop version for Windows or macOS, contact us at <a href="mailto:enterprise@mederak.app">enterprise@mederak.app</a>. We may be able to provide a dedicated offline build for evaluation in a restricted environment.</p>
            </div>
          </div>
        </section>

        <section class="section">
          <div class="section-inner split">
            <div>
              <span class="eyebrow">Next step</span>
              <h2>Import real Excel workbooks into Jira with mapping, cleanup and review</h2>
              <p>CSV imports are possible, but fragile. Excel to Jira Importer &amp; Updater lets you map real Excel workbooks, clean values, create or update Jira issues, and review every change before Jira is modified.</p>
              <div class="hero-actions">
                <a class="button primary" href="${marketplaceUrl}" data-config-url="EXCEL_MARKETPLACE_OVERVIEW_URL">View on Atlassian Marketplace</a>
                <a class="button" href="${explainerPath}">Open the error explainer</a>
                <a class="button" href="${demoUrl}" data-config-url="EXCEL_DEMO_URL">Watch the short demo</a>
              </div>
            </div>
            <div class="tool-side-card">
              <h2>Helpful guides</h2>
              <ul>
                <li><a href="/tools/jira-csv-import-date-format/">Jira CSV date format problems</a></li>
                <li><a href="/tools/jira-csv-import-parent-child/">Jira CSV parent-child import problems</a></li>
                <li><a href="/tools/jira-csv-import-custom-fields/">Jira CSV custom field import problems</a></li>
                <li><a href="/tools/jira-csv-bulk-update-risks/">Jira CSV bulk update risks</a></li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      ${footer()}
    </div>
    <script src="/tools/jira-csv-readiness-analyzer.js"></script>
    <script src="/tools/jira-csv-readiness-checker.js"></script>
    <script src="/assets/site.js"></script>
  </body>
</html>
`;
}

writeRoute("jira-csv-import-error-explainer", mainPage());
writeRoute("jira-csv-excel-readiness-checker", checkerPage());
problems.forEach((problem) => writeRoute(problem.slug, problemPage(problem)));
console.log(`Generated ${problems.length + 2} Jira CSV tool routes.`);
