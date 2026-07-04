(function () {
  "use strict";

  var form = document.querySelector("[data-readiness-form]");
  var fileInput = document.querySelector("[data-readiness-file]");
  var pasteInput = document.querySelector("[data-readiness-text]");
  var result = document.querySelector("[data-readiness-result]");
  var analyzer = window.JiraCsvReadinessAnalyzer;
  if (!form || !result || !analyzer) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var file = fileInput && fileInput.files ? fileInput.files[0] : null;
    if (file) {
      readFile(file);
    } else {
      renderChecks(analyzer.analyzeText(pasteInput ? pasteInput.value : "", ""));
    }
  });

  function readFile(file) {
    var name = file.name || "";
    if (/\.xlsx?$/i.test(name)) {
      renderChecks(analyzer.analyzeWorkbookMetadata(file));
      return;
    }

    var reader = new FileReader();
    reader.onload = function () {
      renderChecks(analyzer.analyzeText(String(reader.result || ""), name));
    };
    reader.readAsText(file);
  }

  function renderChecks(checks) {
    result.innerHTML = checks.map(function (check) {
      return [
        '<article class="readiness-check readiness-check-' + check.status + '">',
        "<b>" + escapeHtml(check.title) + "</b>",
        "<p>" + escapeHtml(check.text) + "</p>",
        "</article>"
      ].join("");
    }).join("");
    result.removeAttribute("hidden");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
}());
