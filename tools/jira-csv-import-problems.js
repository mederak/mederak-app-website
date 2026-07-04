(function (root, factory) {
  var problems = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = problems;
  } else {
    root.JIRA_CSV_IMPORT_PROBLEMS = problems;
  }
}(typeof self !== "undefined" ? self : this, function () {
  var marketplaceUrl = "https://marketplace.atlassian.com/apps/3429713184/excel-to-jira-importer-and-updater?hosting=cloud&tab=overview";
  var appCtaCopy = "CSV imports are possible, but fragile. Excel to Jira Importer & Updater lets you map real Excel workbooks, clean values, create or update Jira issues, and review every change before Jira is modified.";

  return [
    {
      id: "date-format",
      slug: "jira-csv-import-date-format",
      title: "Jira CSV Import Date Format Problems",
      h1: "Jira CSV import date format problems - how to fix",
      metaTitle: "Jira CSV Import Date Format Problems - How to Fix",
      metaDescription: "Learn common causes and possible fixes when Jira CSV import rejects dates, skips date values, or cannot parse date and date/time formats.",
      summary: "Jira CSV date import can fail or skip values when CSV date values do not match the expected import or Jira date format.",
      patterns: ["date format", "invalid date", "could not parse date", "malformed date", "date/time format"],
      commonCauses: [
        "The CSV uses more than one date format in the same column.",
        "The import wizard expects a different date or date/time pattern.",
        "Dates such as 01/02/2026 are ambiguous across regions.",
        "Excel exported dates differently from the values shown in the workbook."
      ],
      manualFixes: [
        "Use one consistent date format across the whole column.",
        "Avoid ambiguous dates such as 01/02/2026.",
        "Check the date format selected in the import wizard and Jira settings.",
        "Use Jira's import preview to confirm parsed date values before continuing."
      ],
      jiraChecks: [
        "Date and date/time fields available for the target project and issue type.",
        "The date format selected in the Jira import wizard.",
        "Project locale and Jira date settings that may affect parsing."
      ],
      example: "Summary,Due date\nRenew supplier contract,2026-07-31\nPrepare release notes,2026-08-14",
      readinessChecks: ["One date format per column", "No ambiguous day/month values", "Date fields mapped deliberately"],
      ctaHeading: "Preview Excel date values before importing to Jira",
      ctaCopy: appCtaCopy,
      marketplaceUrl: marketplaceUrl,
      relatedPages: ["field-mapping", "custom-fields", "bulk-update-risks"]
    },
    {
      id: "missing-summary",
      slug: "jira-csv-import-empty-summary",
      title: "Jira CSV Import Empty Summary Errors",
      h1: "Jira CSV import Summary is required - how to fix",
      metaTitle: "Jira CSV Import Summary Is Required - How to Fix",
      metaDescription: "Fix common Jira CSV import errors when Summary is required, required fields are empty, headers are wrong, or fields are not mapped.",
      summary: "Jira issues need a summary or title, and your project may require additional fields before an issue can be created.",
      patterns: ["summary is required", "field 'summary' is required", "required field", "cannot create issue without summary"],
      commonCauses: [
        "Some rows have an empty Summary value.",
        "The header row was not detected correctly.",
        "The Summary column was not mapped to Jira Summary.",
        "The target project requires additional fields beyond Summary."
      ],
      manualFixes: [
        "Check empty Summary values in the CSV.",
        "Confirm the correct header row and delimiter.",
        "Map the Summary column explicitly.",
        "Fill required fields for every row or adjust the target project configuration."
      ],
      jiraChecks: [
        "Required fields for the selected project and issue type.",
        "Field configuration and screen configuration.",
        "Jira import preview warnings for unmapped or empty required fields."
      ],
      example: "Summary,Issue Type,Description\nPrepare onboarding checklist,Task,Create a first draft\n,Bug,This row will likely fail",
      readinessChecks: ["No blank Summary cells", "Correct header row", "Required Jira fields mapped"],
      ctaHeading: "Import real Excel workbooks into Jira with mapping, cleanup and review",
      ctaCopy: appCtaCopy,
      marketplaceUrl: marketplaceUrl,
      relatedPages: ["field-mapping", "issue-type", "custom-fields"]
    },
    {
      id: "issue-type",
      slug: "jira-csv-import-issue-type",
      title: "Jira CSV Import Issue Type Errors",
      h1: "Jira CSV import issue type errors - how to fix",
      metaTitle: "Jira CSV Import Issue Type Problems - How to Fix",
      metaDescription: "Understand Jira CSV import issue type errors, invalid issue type values, missing issue type mapping, and project issue type configuration checks.",
      summary: "The issue type value must match an issue type available in the target project and must be mapped correctly.",
      patterns: ["issue type", "invalid issue type", "issue type does not exist", "issue type is required", "no issue type field mapping"],
      commonCauses: [
        "The CSV contains values that do not exist in the target project.",
        "Values have extra spaces or inconsistent casing.",
        "Sub-task values are mixed with standard issue type values.",
        "The issue type column is missing or not mapped."
      ],
      manualFixes: [
        "Normalize values such as Task, Bug, Story and Sub-task.",
        "Check which issue types are available in the target project.",
        "Map the issue type column intentionally.",
        "Separate sub-task imports if the import flow requires a parent reference."
      ],
      jiraChecks: [
        "Project issue type scheme.",
        "Issue type values accepted by the CSV import wizard.",
        "Whether sub-tasks are enabled and available in the project."
      ],
      example: "Summary,Issue Type\nFix login redirect,Bug\nWrite onboarding page,Task\nAdd password reset tests,Sub-task",
      readinessChecks: ["Issue type values normalized", "Issue type column mapped", "Sub-task rows have parents"],
      ctaHeading: "Import real Excel workbooks into Jira with mapping, cleanup and review",
      ctaCopy: appCtaCopy,
      marketplaceUrl: marketplaceUrl,
      relatedPages: ["subtasks", "parent-child", "field-mapping"]
    },
    {
      id: "parent-child",
      slug: "jira-csv-import-parent-child",
      title: "Jira CSV Parent-Child Import Problems",
      h1: "Jira CSV parent-child import problems - how to fix",
      metaTitle: "Jira CSV Parent-Child Import Problems - How to Fix",
      metaDescription: "Troubleshoot Jira CSV parent-child import problems, parent issue mapping, issue IDs, parent references, hierarchy import, and parent not found warnings.",
      summary: "Parent-child imports depend on correctly mapped ID, key, type and parent fields, plus valid references that Jira can resolve.",
      patterns: ["parent", "issue id", "parent issue", "you have to define which csv column maps to issue id", "if you want to import parents", "parent not found"],
      commonCauses: [
        "Parent references do not match any existing issue or imported row.",
        "Issue IDs are not unique inside the CSV.",
        "Parent and child rows use issue types that Jira does not allow together.",
        "The required ID, key or parent columns are not mapped as expected."
      ],
      manualFixes: [
        "Check that parent references exist or are included in the import.",
        "Make every temporary issue ID unique.",
        "Confirm sub-tasks have valid parent rows.",
        "Map parent fields exactly as expected by your Jira import experience."
      ],
      jiraChecks: [
        "Hierarchy settings for the selected project.",
        "Whether parent issues already exist or must be imported first.",
        "Jira import wizard requirements for Issue Id and Parent fields."
      ],
      example: "Issue Id,Parent Id,Issue Type,Summary\nEPIC-1,,Epic,Checkout improvements\nSTORY-1,EPIC-1,Story,Guest checkout\nSUB-1,STORY-1,Sub-task,Add form validation",
      readinessChecks: ["Unique row IDs", "Valid parent references", "Hierarchy allowed by Jira configuration"],
      ctaHeading: "Build Jira hierarchy from Excel with preview",
      ctaCopy: appCtaCopy,
      marketplaceUrl: marketplaceUrl,
      relatedPages: ["subtasks", "issue-type", "duplicate-issue-keys"]
    },
    {
      id: "subtasks",
      slug: "jira-csv-import-subtasks",
      title: "Jira CSV Import Sub-task Problems",
      h1: "Jira CSV import sub-task problems - how to fix",
      metaTitle: "Jira CSV Import Sub-task Problems - How to Fix",
      metaDescription: "Fix common Jira CSV import sub-task errors involving parent required warnings, subtask issue types, parent references, and import order.",
      summary: "Sub-tasks usually need a valid parent issue and the correct issue type before Jira can import them.",
      patterns: ["sub-task", "subtask", "sub task", "parent required"],
      commonCauses: [
        "Sub-task rows do not include a parent reference.",
        "The parent issue is not included in the import and does not already exist.",
        "The issue type value does not match the Jira sub-task type.",
        "The target project does not allow the intended sub-task relationship."
      ],
      manualFixes: [
        "Add parent references for every sub-task row.",
        "Import parent issues first or include them in the same structured import.",
        "Normalize the sub-task issue type value.",
        "Check Jira's preview for parent resolution warnings."
      ],
      jiraChecks: [
        "Whether sub-tasks are enabled.",
        "Available sub-task issue types.",
        "Parent issue visibility and permissions."
      ],
      example: "Parent Key,Issue Type,Summary\nPROJ-123,Sub-task,Write edge case tests\nPROJ-123,Sub-task,Update field labels",
      readinessChecks: ["Every sub-task has a parent", "Parent key exists or is imported", "Sub-task type is valid"],
      ctaHeading: "Build Jira hierarchy from Excel with preview",
      ctaCopy: appCtaCopy,
      marketplaceUrl: marketplaceUrl,
      relatedPages: ["parent-child", "issue-type", "field-mapping"]
    },
    {
      id: "users",
      slug: "jira-csv-import-users-assignee-reporter",
      title: "Jira CSV Import User, Assignee and Reporter Errors",
      h1: "Jira CSV import user, assignee and reporter errors - how to fix",
      metaTitle: "Jira CSV Import User, Assignee and Reporter Problems - How to Fix",
      metaDescription: "Understand Jira CSV import user not found errors for assignees, reporters, user picker fields, permissions, emails, usernames, and account IDs.",
      summary: "Jira may not resolve users if CSV values do not match users available to the site or project, or if the import expects a different identifier.",
      patterns: ["assignee", "reporter", "user not found", "user does not exist", "cannot find user", "user picker"],
      commonCauses: [
        "The CSV mixes emails, display names, account IDs or old usernames.",
        "The user does not have access to the Jira site or project.",
        "The importing user cannot assign issues to the named user.",
        "A user picker custom field expects a different value format."
      ],
      manualFixes: [
        "Choose one user identifier format and keep it consistent.",
        "Check whether the users exist and have project access.",
        "Verify assignment and reporter permissions.",
        "Use Jira's import preview to see which rows fail user resolution."
      ],
      jiraChecks: [
        "Project browse and assign permissions.",
        "User availability in Jira Cloud.",
        "User picker field context and accepted value format."
      ],
      example: "Summary,Assignee,Reporter\nReview onboarding flow,alex@example.com,pm@example.com",
      readinessChecks: ["Consistent user identifier format", "Users available in Jira", "Permissions checked"],
      ctaHeading: "Import real Excel workbooks into Jira with mapping, cleanup and review",
      ctaCopy: appCtaCopy,
      marketplaceUrl: marketplaceUrl,
      relatedPages: ["custom-fields", "field-mapping", "bulk-update-risks"]
    },
    {
      id: "custom-fields",
      slug: "jira-csv-import-custom-fields",
      title: "Jira CSV Custom Field Import Problems",
      h1: "Jira CSV custom field import problems - how to fix",
      metaTitle: "Jira CSV Custom Field Import Problems - How to Fix",
      metaDescription: "Troubleshoot Jira CSV custom field import errors including field does not exist, invalid values, missing options, cascading selects, and multi-select fields.",
      summary: "Custom field values must match the field type and available options in the target Jira configuration.",
      patterns: ["custom field", "field does not exist", "option does not exist", "value is not valid", "cascading select", "multi-select"],
      commonCauses: [
        "The custom field is not available for the target project or issue type.",
        "Select values do not exactly match configured options.",
        "Multi-select values use a separator Jira does not interpret as intended.",
        "Cascading select values are missing the parent or child option."
      ],
      manualFixes: [
        "Check field context and project availability.",
        "Match option names, casing and whitespace exactly.",
        "Confirm formatting for multi-value fields.",
        "Preview the import before making Jira changes."
      ],
      jiraChecks: [
        "Custom field context.",
        "Project and issue type field configuration.",
        "Allowed options for select, multi-select and cascading select fields."
      ],
      example: "Summary,Customer tier,Regions\nRenew platform contract,Enterprise,\"EU, US\"",
      readinessChecks: ["Field exists in target context", "Options match Jira", "Multi-values formatted deliberately"],
      ctaHeading: "Map Excel columns to Jira fields safely",
      ctaCopy: appCtaCopy,
      marketplaceUrl: marketplaceUrl,
      relatedPages: ["priority-status-options", "field-mapping", "labels-components-versions"]
    },
    {
      id: "priority-status-options",
      slug: "jira-csv-import-priority-status-options",
      title: "Jira CSV Priority, Status and Option Value Errors",
      h1: "Jira CSV priority, status and option value errors - how to fix",
      metaTitle: "Jira CSV Priority and Status Option Problems - How to Fix",
      metaDescription: "Fix Jira CSV import warnings when priority, status, resolution, option, or select-list values do not exist or are not valid.",
      summary: "Select-like values must match existing Jira options and workflow or status configuration.",
      patterns: ["priority", "status", "resolution", "option", "value does not exist", "invalid value"],
      commonCauses: [
        "The CSV value has different casing or trailing spaces.",
        "The option exists in another project but not the target project.",
        "The status is not valid for issue creation or the current workflow.",
        "Resolution values are mapped when they should be left empty for open issues."
      ],
      manualFixes: [
        "Normalize casing and remove trailing spaces.",
        "Make sure options exist in the target Jira configuration.",
        "Avoid mapping workflow status unless the import method supports it.",
        "Check the preview for invalid option warnings."
      ],
      jiraChecks: [
        "Priority scheme and project options.",
        "Workflow statuses available for the issue type.",
        "Resolution values and whether they are appropriate for the import."
      ],
      example: "Summary,Priority,Status\nFix payment retry,High,To Do",
      readinessChecks: ["Options exist in Jira", "No trailing spaces", "Workflow values reviewed"],
      ctaHeading: "Map Excel columns to Jira fields safely",
      ctaCopy: appCtaCopy,
      marketplaceUrl: marketplaceUrl,
      relatedPages: ["custom-fields", "field-mapping", "bulk-update-risks"]
    },
    {
      id: "duplicate-issue-keys",
      slug: "jira-csv-import-duplicate-issue-keys",
      title: "Jira CSV Duplicate Issue Key and Issue ID Problems",
      h1: "Jira CSV duplicate issue keys and issue IDs - how to fix",
      metaTitle: "Jira CSV Duplicate Issue Key Problems - How to Fix",
      metaDescription: "Understand Jira CSV import duplicate issue key and issue ID warnings, skipped existing issues, accidental update behavior, and uniqueness checks.",
      summary: "Duplicate keys or IDs can cause skipped rows, conflicts, or unintended update behavior.",
      patterns: ["duplicate", "issue key", "issue id", "already exists", "skipped because they already exist"],
      commonCauses: [
        "The file contains repeated Issue Key or Issue Id values.",
        "A create import includes keys that already exist in Jira.",
        "A file intended for updates is being used as a create import.",
        "Temporary hierarchy IDs are reused across rows."
      ],
      manualFixes: [
        "Decide whether the file is meant to create or update issues.",
        "Ensure keys and IDs are unique where Jira expects uniqueness.",
        "Remove accidental duplicate rows before import.",
        "Map identifiers only when you intentionally need them."
      ],
      jiraChecks: [
        "Whether the selected import method creates or updates issues.",
        "Issue keys already existing in the target Jira site.",
        "Duplicate handling in the import preview."
      ],
      example: "Issue Key,Summary\nPROJ-100,Update pricing copy\nPROJ-100,Duplicate row that needs review",
      readinessChecks: ["No accidental duplicate keys", "Create/update mode understood", "Identifier mapping intentional"],
      ctaHeading: "Review every Jira update before applying changes",
      ctaCopy: appCtaCopy,
      marketplaceUrl: marketplaceUrl,
      relatedPages: ["bulk-update-risks", "parent-child", "field-mapping"]
    },
    {
      id: "bulk-update-risks",
      slug: "jira-csv-bulk-update-risks",
      title: "Jira CSV Bulk Update Risks",
      h1: "Jira CSV bulk update risks - how to avoid accidental changes",
      metaTitle: "Jira CSV Bulk Update Risks - Review Before Updating",
      metaDescription: "Learn why Jira CSV bulk updates can be risky when issue keys, duplicates, empty values, and mapped fields are not reviewed before confirming changes.",
      summary: "CSV files with issue keys may be treated as update-like workflows depending on the import method. Empty values and duplicate keys can be risky.",
      patterns: ["update existing", "bulk update", "issue key", "overwrite", "skipped"],
      commonCauses: [
        "The CSV includes issue keys that match existing Jira issues.",
        "Empty cells are mapped to fields that should not be changed.",
        "Duplicate keys point multiple rows at the same issue.",
        "The preview is skipped or reviewed too quickly."
      ],
      manualFixes: [
        "Check duplicates, empty values and mapped fields before confirming.",
        "Use a small sample first when possible.",
        "Avoid mapping fields that should not be changed.",
        "Export or document current values before a large update."
      ],
      jiraChecks: [
        "Import method and whether it updates existing issues.",
        "Fields selected for update.",
        "Rows skipped or matched in Jira's preview."
      ],
      example: "Issue Key,Summary,Priority\nPROJ-100,Clarify invoice validation,High\nPROJ-101,,Medium",
      readinessChecks: ["Update fields reviewed", "Empty cells checked", "Duplicate issue keys removed"],
      ctaHeading: "Review every Jira update before applying changes",
      ctaCopy: appCtaCopy,
      marketplaceUrl: marketplaceUrl,
      relatedPages: ["duplicate-issue-keys", "field-mapping", "date-format"]
    },
    {
      id: "description-newlines",
      slug: "jira-csv-import-description-newlines",
      title: "Jira CSV Description, Comma and New Line Problems",
      h1: "Jira CSV description, comma and new line problems - how to fix",
      metaTitle: "Jira CSV Description New Line and Quoting Problems - How to Fix",
      metaDescription: "Fix Jira CSV import parsing problems caused by commas, quotes, new lines, separators, invalid CSV formatting, and multiline descriptions.",
      summary: "CSV values containing commas or line breaks may need quoting. Excel may hide these issues until the import preview parses columns differently.",
      patterns: ["quote", "quoted", "comma", "newline", "new line", "invalid csv", "parse", "separator"],
      commonCauses: [
        "Description values contain commas but are not quoted.",
        "Multiline text is exported in a way the parser does not expect.",
        "The file uses a different separator than the import wizard expects.",
        "Quotes inside text are not escaped correctly."
      ],
      manualFixes: [
        "Use a proper CSV export instead of manual copy-paste.",
        "Quote text fields that contain commas or line breaks.",
        "Preview parsed columns before import.",
        "Consider simplifying multiline descriptions before importing."
      ],
      jiraChecks: [
        "CSV delimiter selected in the import flow.",
        "Column preview after parsing.",
        "Description field mapping and text formatting."
      ],
      example: "Summary,Description\nLogin error,\"Steps:\n1. Open login\n2. Enter password\nExpected: user signs in\"",
      readinessChecks: ["Parsed columns previewed", "Text fields quoted", "Delimiter checked"],
      ctaHeading: "Import real Excel workbooks into Jira with mapping, cleanup and review",
      ctaCopy: appCtaCopy,
      marketplaceUrl: marketplaceUrl,
      relatedPages: ["field-mapping", "custom-fields", "missing-summary"]
    },
    {
      id: "labels-components-versions",
      slug: "jira-csv-import-labels-components-versions",
      title: "Jira CSV Labels, Components and Versions Problems",
      h1: "Jira CSV labels, components and versions problems - how to fix",
      metaTitle: "Jira CSV Labels Components and Versions Problems - How to Fix",
      metaDescription: "Troubleshoot Jira CSV import errors for labels, components, fix versions, affects versions, separators, casing, whitespace, and project-specific options.",
      summary: "Multi-value fields and project-specific options can require exact formatting and existing options.",
      patterns: ["labels", "components", "fix version", "version", "affects version"],
      commonCauses: [
        "Components or versions do not exist in the target project.",
        "Multiple values use a separator Jira does not interpret correctly.",
        "Labels contain unexpected spaces or casing differences.",
        "Fix Version and Affects Version are mixed up."
      ],
      manualFixes: [
        "Check existing project components and versions.",
        "Normalize casing and whitespace.",
        "Confirm the separator for multi-value fields.",
        "Preview how Jira parses multiple labels or versions."
      ],
      jiraChecks: [
        "Project components.",
        "Project versions.",
        "Field mapping for Labels, Components, Fix Version and Affects Version."
      ],
      example: "Summary,Labels,Components,Fix Version\nPolish CSV import,\"migration, csv\",Importer,2026.7",
      readinessChecks: ["Components exist", "Versions exist", "Multi-value separators reviewed"],
      ctaHeading: "Map Excel columns to Jira fields safely",
      ctaCopy: appCtaCopy,
      marketplaceUrl: marketplaceUrl,
      relatedPages: ["custom-fields", "priority-status-options", "field-mapping"]
    },
    {
      id: "field-mapping",
      slug: "jira-csv-import-field-mapping",
      title: "Jira CSV Import Field Mapping Problems",
      h1: "Jira CSV import field mapping problems - how to fix",
      metaTitle: "Jira CSV Import Field Mapping Problems - How to Fix",
      metaDescription: "Fix Jira CSV import field mapping problems involving wrong headers, unmapped columns, required fields, custom fields, issue type mapping, and preview checks.",
      summary: "Field mapping problems happen when Jira cannot connect CSV columns to the Jira fields needed for the selected project and issue type.",
      patterns: ["field mapping", "mapping", "unmapped", "map field", "csv column", "column maps"],
      commonCauses: [
        "The header row is wrong or shifted.",
        "Important columns are not mapped.",
        "Two columns appear to represent the same Jira field.",
        "The selected project or issue type changes which fields are available."
      ],
      manualFixes: [
        "Confirm the header row and delimiter.",
        "Map required Jira fields deliberately.",
        "Remove columns you do not intend to import or update.",
        "Use the preview to verify final field values."
      ],
      jiraChecks: [
        "Fields available for the target project and issue type.",
        "Required fields in the target field configuration.",
        "Jira preview of mapped and unmapped columns."
      ],
      example: "Summary,Issue Type,Priority,Due date\nPrepare pilot import,Task,Medium,2026-07-31",
      readinessChecks: ["Header row confirmed", "Required fields mapped", "Unused columns ignored"],
      ctaHeading: "Map Excel columns to Jira fields safely",
      ctaCopy: appCtaCopy,
      marketplaceUrl: marketplaceUrl,
      relatedPages: ["custom-fields", "issue-type", "missing-summary"]
    }
  ];
}));
