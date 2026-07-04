#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const vm = require("vm");

function makeElement() {
  return {
    innerHTML: "",
    value: "",
    files: null,
    listeners: {},
    removeAttribute(name) {
      this.removedAttribute = name;
    },
    addEventListener(name, handler) {
      this.listeners[name] = handler;
    }
  };
}

const form = makeElement();
const fileInput = makeElement();
const pasteInput = makeElement();
const result = makeElement();
pasteInput.value = "Issue Key,Summary,Due date\nPROJ-1,First task,01/02/2026\nPROJ-1,,2026-07-31";
fileInput.files = [];

const elements = {
  "[data-readiness-form]": form,
  "[data-readiness-file]": fileInput,
  "[data-readiness-text]": pasteInput,
  "[data-readiness-result]": result
};

const context = {
  window: {},
  document: {
    querySelector(selector) {
      return elements[selector] || null;
    }
  }
};

context.self = context;
vm.createContext(context);
vm.runInContext(fs.readFileSync("tools/jira-csv-readiness-analyzer.js", "utf8"), context);
context.window.JiraCsvReadinessAnalyzer = context.JiraCsvReadinessAnalyzer;
vm.runInContext(fs.readFileSync("tools/jira-csv-readiness-checker.js", "utf8"), context);

assert.strictEqual(typeof form.listeners.submit, "function");
form.listeners.submit({ preventDefault() {} });

assert.strictEqual(result.removedAttribute, "hidden");
assert.match(result.innerHTML, /Empty Summary values/);
assert.match(result.innerHTML, /Duplicate issue keys/);
assert.match(result.innerHTML, /Date-looking columns/);

console.log("Jira CSV readiness checker UI tests passed.");
