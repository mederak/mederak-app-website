(function () {
  "use strict";

  var matcher = window.JiraCsvErrorMatcher;
  if (!matcher) return;

  var form = document.querySelector("[data-error-explainer-form]");
  var textarea = document.querySelector("[data-error-text]");
  var intent = document.querySelector("[data-error-intent]");
  var result = document.querySelector("[data-error-result]");
  if (!form || !textarea || !result) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var match = matcher.matchJiraCsvImportError(textarea.value, intent ? intent.value : "");
    renderResult(match);
    trackCategory(match.category);
  });

  function renderResult(match) {
    if (!textarea.value.trim()) {
      result.innerHTML = [
        '<div class="tool-result-card">',
        "<h2>Paste an error or warning first</h2>",
        "<p>Paste the text Jira showed in the CSV import preview or import result, then run the explainer. The text stays in this browser page.</p>",
        "</div>"
      ].join("");
      result.removeAttribute("hidden");
      return;
    }

    if (!match.matched || !match.problem) {
      result.innerHTML = [
        '<div class="tool-result-card">',
        "<span class=\"eyebrow\">No exact rule matched</span>",
        "<h2>Start with the import preview and field mapping</h2>",
        "<p>Common cause: the pasted message does not match a known rule yet, or it depends on your Jira project configuration. Check required fields, issue types, field mapping, dates, users and duplicate issue keys before confirming the import.</p>",
        "<p>Possible fix: review Atlassian's current documentation, check your Jira configuration, and use the import preview to see which rows and fields Jira parsed.</p>",
        '<div class="hero-actions"><a class="button primary" href="/tools/jira-csv-excel-readiness-checker/">Try the free readiness checker</a><a class="button" href="/tools/jira-csv-import-error-explainer/">See common errors</a></div>',
        "</div>"
      ].join("");
      result.removeAttribute("hidden");
      return;
    }

    var problem = match.problem;
    var marketplaceUrl = (window.MEDERAK_PRODUCT_CONFIG && window.MEDERAK_PRODUCT_CONFIG.EXCEL_MARKETPLACE_OVERVIEW_URL) || problem.marketplaceUrl;
    result.innerHTML = [
      '<div class="tool-result-card">',
      '<span class="eyebrow">Likely category: ' + escapeHtml(problem.title) + '</span>',
      "<h2>" + escapeHtml(problem.summary) + "</h2>",
      "<p><strong>Common cause:</strong> " + escapeHtml(problem.commonCauses[0]) + "</p>",
      "<p><strong>Possible fix:</strong> " + escapeHtml(problem.manualFixes[0]) + "</p>",
      "<p><strong>Check your Jira configuration:</strong> " + escapeHtml(problem.jiraChecks[0]) + "</p>",
      '<p class="tool-disclaimer">Your Jira import wizard and project settings may behave differently. Always review Atlassian\'s current documentation and your Jira import preview.</p>',
      '<div class="hero-actions">',
      '<a class="button primary" href="/tools/' + encodeURIComponent(problem.slug) + '/">Open the full guide</a>',
      '<a class="button" href="/tools/jira-csv-excel-readiness-checker/">Try the free readiness checker</a>',
      '<a class="button" href="' + escapeHtml(marketplaceUrl) + '">Try it for free</a>',
      "</div>",
      "</div>"
    ].join("");
    result.removeAttribute("hidden");
  }

  function trackCategory(category) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "jira_csv_error_explainer_match", {
      event_category: "tool",
      error_category: category || "generic"
    });
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
}());
