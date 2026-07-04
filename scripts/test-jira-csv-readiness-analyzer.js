#!/usr/bin/env node

const assert = require("assert");
const analyzer = require("../tools/jira-csv-readiness-analyzer.js");

function find(checks, title) {
  return checks.find((check) => check.title === title);
}

const checks = analyzer.analyzeText([
  "Issue Key,Summary,Due date,Description",
  "PROJ-1,First task,01/02/2026,\"Line one, with comma\"",
  "PROJ-1,,2026-07-31,Second line"
].join("\n"), "sample.csv");

assert.strictEqual(find(checks, "Summary column").status, "ok");
assert.strictEqual(find(checks, "Empty Summary values").status, "warn");
assert.match(find(checks, "Empty Summary values").text, /1 data row/);
assert.strictEqual(find(checks, "Duplicate issue keys").status, "warn");
assert.match(find(checks, "Duplicate issue keys").text, /1 duplicate/);
assert.strictEqual(find(checks, "Date-looking columns").status, "warn");
assert.match(find(checks, "Date-looking columns").text, /1 ambiguous/);

const parsed = analyzer.parseCsv('Summary,Description\nTask,"Line one\nLine two, with comma"');
assert.deepStrictEqual(parsed, [
  ["Summary", "Description"],
  ["Task", "Line one\nLine two, with comma"]
]);

const missing = analyzer.analyzeText("Title,Type\nTask A,Task", "");
assert.strictEqual(find(missing, "Summary column").status, "warn");

const xlsx = analyzer.analyzeWorkbookMetadata({ size: 11 * 1024 * 1024 });
assert.strictEqual(find(xlsx, "XLSX file selected").status, "info");
assert.match(find(xlsx, "XLSX file selected").text, /checks only basic local file metadata/);
assert.strictEqual(find(xlsx, "File size").status, "warn");

console.log("Jira CSV readiness analyzer tests passed.");
