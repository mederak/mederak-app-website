#!/usr/bin/env node

const assert = require("assert");
const matcher = require("../tools/jira-csv-error-matcher.js");

const cases = [
  ["Could not parse date/time format for Due date", "dates", "date-format"],
  ["Field 'summary' is required", "create", "missing-summary"],
  ["Invalid issue type does not exist in this project", "create", "issue-type"],
  ["If you want to import parents you have to define which CSV column maps to Issue Id", "hierarchy", "parent-child"],
  ["Sub-task parent required", "subtasks", "subtasks"],
  ["Cannot find user for assignee", "users", "users"],
  ["Custom field option does not exist", "custom-fields", "custom-fields"],
  ["Priority value does not exist", "custom-fields", "priority-status-options"],
  ["Duplicate issue key already exists", "update", "duplicate-issue-keys"],
  ["Bulk update may overwrite existing issue key values", "update", "bulk-update-risks"],
  ["Invalid CSV separator or quoted newline parse error", "create", "description-newlines"],
  ["Fix Version value does not exist for project", "create", "labels-components-versions"],
  ["No CSV column maps to the required field mapping", "create", "field-mapping"]
];

for (const [text, intent, expected] of cases) {
  const result = matcher.matchJiraCsvImportError(text, intent);
  assert.strictEqual(result.category, expected, `${text} should match ${expected}, got ${result.category}`);
}

const unknown = matcher.matchJiraCsvImportError("This is a very specific tenant message with no known terms", "not-sure");
assert.strictEqual(unknown.matched, false);
assert.strictEqual(unknown.category, "generic");

const empty = matcher.matchJiraCsvImportError("", "create");
assert.strictEqual(empty.matched, false);
assert.strictEqual(empty.category, "empty");

console.log("Jira CSV error matcher tests passed.");
