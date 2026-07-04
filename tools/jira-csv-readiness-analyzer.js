(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.JiraCsvReadinessAnalyzer = factory();
  }
}(typeof self !== "undefined" ? self : this, function () {
  function analyzeText(text, sourceLabel) {
    var checks = [];
    var rows = parseCsv(text);
    var header = rows[0] || [];
    var lowerHeader = header.map(function (cell) { return cell.trim().toLowerCase(); });
    var summaryIndex = lowerHeader.indexOf("summary");
    var issueKeyIndex = lowerHeader.indexOf("issue key");
    var dateColumns = lowerHeader.map(function (cell, index) {
      return /date|due|start|end/.test(cell) ? index : -1;
    }).filter(function (index) { return index >= 0; });

    checks.push(makeCheck(sourceLabel ? "info" : "info", sourceLabel ? "Local file checked" : "Pasted data checked", "The checker runs in this browser page and does not upload the pasted data or selected file."));

    if (!rows.length || !header.length) {
      checks.push(makeCheck("warn", "No CSV rows detected", "Paste a CSV sample or choose a CSV file to check headers, Summary values, duplicate issue keys and date-looking columns."));
      return checks;
    }

    checks.push(makeCheck(summaryIndex >= 0 ? "ok" : "warn", "Summary column", summaryIndex >= 0 ? "A Summary column was found." : "No Summary header found. Jira issue creation usually requires Summary."));

    if (summaryIndex >= 0) {
      var emptySummaries = rows.slice(1).filter(function (row) {
        return !String(row[summaryIndex] || "").trim();
      }).length;
      checks.push(makeCheck(emptySummaries ? "warn" : "ok", "Empty Summary values", emptySummaries ? emptySummaries + " data row(s) have an empty Summary value." : "No empty Summary values found in the checked rows."));
    }

    if (issueKeyIndex >= 0) {
      var seen = {};
      var duplicates = 0;
      rows.slice(1).forEach(function (row) {
        var key = String(row[issueKeyIndex] || "").trim();
        if (!key) return;
        if (seen[key]) duplicates += 1;
        seen[key] = true;
      });
      checks.push(makeCheck(duplicates ? "warn" : "ok", "Duplicate issue keys", duplicates ? duplicates + " duplicate issue key value(s) found. Review create vs update intent before importing." : "No duplicate issue keys found in the checked rows."));
    } else {
      checks.push(makeCheck("info", "Issue Key column", "No Issue Key column found. That is normal for create-only imports, but updates usually need deliberate matching."));
    }

    if (dateColumns.length) {
      var ambiguousDates = 0;
      dateColumns.forEach(function (columnIndex) {
        rows.slice(1).forEach(function (row) {
          if (/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/.test(String(row[columnIndex] || ""))) {
            ambiguousDates += 1;
          }
        });
      });
      checks.push(makeCheck(ambiguousDates ? "warn" : "ok", "Date-looking columns", ambiguousDates ? ambiguousDates + " ambiguous slash date value(s) found. Prefer one explicit date format." : "No ambiguous slash dates found in date-looking columns."));
    } else {
      checks.push(makeCheck("info", "Date-looking columns", "No obvious date columns found in the header row."));
    }

    return checks;
  }

  function analyzeWorkbookMetadata(file) {
    var fileSize = file && typeof file.size === "number" ? file.size : 0;
    return [
      makeCheck("info", "XLSX file selected", "This free browser checker does not upload the file. It checks only basic local file metadata for XLSX/XLS files. For workbook-level parsing, use the Marketplace app or export a sample sheet to CSV and check it here."),
      makeCheck(fileSize > 10 * 1024 * 1024 ? "warn" : "ok", "File size", fileSize > 10 * 1024 * 1024 ? "Large workbook. Test with a representative sample before a large Jira import." : "File size looks reasonable for an initial review.")
    ];
  }

  function parseCsv(text) {
    var rows = [];
    var row = [];
    var cell = "";
    var inQuotes = false;

    for (var index = 0; index < String(text || "").length; index += 1) {
      var char = text[index];
      var next = text[index + 1];
      if (char === '"' && inQuotes && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        row.push(cell);
        cell = "";
      } else if ((char === "\n" || char === "\r") && !inQuotes) {
        if (char === "\r" && next === "\n") index += 1;
        row.push(cell);
        if (row.some(function (value) { return value.trim(); })) rows.push(row);
        row = [];
        cell = "";
      } else {
        cell += char;
      }
    }

    row.push(cell);
    if (row.some(function (value) { return value.trim(); })) rows.push(row);
    return rows;
  }

  function makeCheck(status, title, text) {
    return { status: status, title: title, text: text };
  }

  return {
    analyzeText: analyzeText,
    analyzeWorkbookMetadata: analyzeWorkbookMetadata,
    parseCsv: parseCsv
  };
}));
