(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./jira-csv-import-problems.js"));
  } else {
    root.JiraCsvErrorMatcher = factory(root.JIRA_CSV_IMPORT_PROBLEMS || []);
  }
}(typeof self !== "undefined" ? self : this, function (problems) {
  var intentBoosts = {
    "create": ["missing-summary", "issue-type", "field-mapping"],
    "update": ["bulk-update-risks", "duplicate-issue-keys", "field-mapping"],
    "subtasks": ["subtasks", "parent-child", "issue-type"],
    "hierarchy": ["parent-child", "subtasks", "issue-type"],
    "custom-fields": ["custom-fields", "field-mapping", "priority-status-options"],
    "users": ["users"],
    "dates": ["date-format"]
  };

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[._:;()[\]{}"']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function scorePattern(text, pattern) {
    var normalizedPattern = normalize(pattern);
    if (!normalizedPattern || text.indexOf(normalizedPattern) === -1) return 0;
    return 10 + Math.min(12, normalizedPattern.length / 3);
  }

  function matchJiraCsvImportError(rawText, intent) {
    var text = normalize(rawText);
    var selectedIntent = normalize(intent);
    if (!text) {
      return {
        matched: false,
        category: "empty",
        problem: null,
        confidence: 0,
        matchedPatterns: []
      };
    }

    var boosted = intentBoosts[selectedIntent] || [];
    var best = null;

    problems.forEach(function (problem) {
      var matchedPatterns = [];
      var score = 0;

      (problem.patterns || []).forEach(function (pattern) {
        var patternScore = scorePattern(text, pattern);
        if (patternScore > 0) {
          score += patternScore;
          matchedPatterns.push(pattern);
        }
      });

      if (boosted.indexOf(problem.id) !== -1) {
        score += 3;
      }

      if (!best || score > best.score) {
        best = { problem: problem, score: score, matchedPatterns: matchedPatterns };
      }
    });

    if (!best || best.score <= 0 || !best.matchedPatterns.length) {
      return {
        matched: false,
        category: "generic",
        problem: null,
        confidence: 0,
        matchedPatterns: []
      };
    }

    return {
      matched: true,
      category: best.problem.id,
      problem: best.problem,
      confidence: Math.min(0.98, Number((best.score / 42).toFixed(2))),
      matchedPatterns: best.matchedPatterns
    };
  }

  function findProblemById(id) {
    return problems.find(function (problem) {
      return problem.id === id;
    }) || null;
  }

  return {
    problems: problems,
    matchJiraCsvImportError: matchJiraCsvImportError,
    findProblemById: findProblemById
  };
}));
