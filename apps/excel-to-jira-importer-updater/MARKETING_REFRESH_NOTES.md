# Excel to Jira Importer & Updater - marketing refresh notes

Last reviewed: 2026-05-22

## Current product story

Excel to Jira Importer & Updater should be positioned as a controlled workflow for recurring Excel-to-Jira handovers, not only as a basic file importer.

The strongest story is:

> Turn real business Excel backlogs into reviewed Jira changes.

The product helps project managers, business analysts, Scrum Masters, delivery teams and Jira admins move client handovers, workshop outputs, estimates and reviewed scope spreadsheets into Jira Cloud without rebuilding those files as CSV or manually copying rows.

## Product capabilities to communicate

- Import Excel backlog workbooks into existing Jira Cloud projects.
- Support modern `.xlsx` workbooks and legacy `.xls` workbooks.
- Select worksheet and header row before mapping.
- Map Excel columns to Jira fields.
- Reuse the same Excel source column across multiple Jira fields.
- Create new Jira issues from selected valid rows.
- Update matching existing Jira issues during repeat uploads.
- Restore saved setup for recurring file structures, including sheet, header row, field mappings, transformations, Description Builder settings, duplicate settings, estimate settings and locale/date settings.
- Build Jira Description from multiple Excel columns with Description Builder.
- Append unmapped workbook context to Description while excluding common technical import columns.
- Extract dates, IDs, names or fragments from source cells with Advanced value transformation.
- Use regex extraction with preview, result templates and explicit date input formats.
- Validate required fields, issue types, user picker values, dates, date-times, time estimates, custom field values, duplicate identity and sub-task parent references before import.
- Handle practical Jira field families including text, paragraph/ADF, number, date/date-time, select, multi-select, user picker, multi-user picker, labels-like fields, priority, components, fix versions, security level, sprint IDs and Assets object identifiers.
- Map time tracking fields with original estimate and optional remaining estimate.
- Detect duplicates and support repeat imports with stable row identity.
- Let users choose when to import every valid row as new work.
- Preview row-level results before Jira changes are made.
- Export import reports as CSV or JSON.
- Use Atlassian Forge and Jira permissions, with no separate vendor-hosted backend for backlog data.
- Avoid storing full Excel workbook files.

## Marketing priorities

1. Excel-first workflow

   Buyers should quickly understand that the app works with the workbook they already receive from clients, analysts or business teams. The page should not only say "no CSV conversion"; it should say the workflow preserves the handover file as the source of review.

2. Repeat imports and updates

   This is a high-value use case. Many backlogs change after review. The app should be presented as a way to reuse setup, identify matching rows and update Jira with validation instead of creating duplicates.

3. Smart mapping for real spreadsheets

   Description Builder and Advanced value transformation are the clearest differentiators. They solve the practical problem of messy spreadsheet columns that contain multiple pieces of useful information.

4. Validation before Jira changes

   The app should repeatedly emphasize row-level preview, validation and selected-row import before creating or updating Jira issues.

5. Security-conscious Forge architecture

   Keep the security message practical: Forge app, Jira Cloud permissions, current-user operations, no full workbook storage, no separate vendor-hosted backlog backend.

6. Custom field depth without overpromising

   Mention supported field families, but keep wording precise. Avoid claiming every possible custom field or a full migration platform.

## Claims to avoid

- Do not describe rollback on public website pages.
- Do not describe the product as a full ETL platform, formula engine, spreadsheet automation engine or migration suite.
- Do not claim support for every Jira custom field.
- Do not promise future features.
- Do not overstate hierarchy import until the visible product flow and screenshots confirm the exact supported behavior.
- Use cautious hierarchy language: parent issue support, sub-task validation and hierarchy-aware planning depending on Jira configuration.

## Recommended website updates

### Vendor homepage

- Update the Excel product card from a basic "XLSX rows into Jira" message to recurring Excel backlog handovers, reusable setup, Description Builder, value transformations and validation.
- Update the vendor hero copy to mention controlled Excel backlog imports and repeat Jira updates.

### App catalogue

- Rewrite the Excel to Jira Importer & Updater card to include `.xlsx` and `.xls`, reusable setup, Description Builder, transformations, duplicate handling, update mode and reports.

### Product landing page

- Reframe the hero around importing and updating Jira issues from real Excel backlogs.
- Add a visible feature band for:
  - Description Builder,
  - Advanced value transformation,
  - saved setup and repeat imports,
  - validation and reports.
- Add placeholder visual slots for new screenshots:
  - Description Builder,
  - Advanced value transformation with regex preview,
  - saved setup restore,
  - update mode / duplicate handling.
- Replace the old "Feature set" chip list with a cleaner, accurate capability list.
- Remove duplicated "Duplicate handling" chip.
- Keep hierarchy wording careful and configuration-dependent.

### Documentation

Add or expand sections for:

- Supported file formats.
- Description Builder.
- Advanced value transformations.
- Date and date-time handling.
- User picker values.
- Time tracking.
- Supported Jira field families.
- Saved setup and repeat imports.
- Duplicate handling.
- Update existing issues.
- Reports.
- Troubleshooting for regex, date format, user lookup, duplicate identity and unsupported custom fields.

### SEO pages

- `update-jira-issues-from-excel.html`: make it a stronger repeat-import page covering saved setup, row identity, mapped-field updates, validation and reports.
- `excel-to-jira-vs-csv-import.html`: add smart mapping, Description Builder, value extraction and repeat imports as comparison points.
- `import-epics-stories-subtasks-from-excel.html`: keep cautious hierarchy wording. Focus on parent issue references, sub-task validation, issue type hierarchy and Jira configuration.

### Security, support and data processing

- Add regex transformation safety limits to the security page.
- Add transformation/preview data handling to the data processing page.
- Update support instructions to request import ID, project key, issue type names, sanitized mapping and screenshots instead of raw confidential workbooks.

## Placeholder assets to create later

- `assets/placeholder-description-builder.png`
- `assets/placeholder-advanced-transformations.png`
- `assets/placeholder-saved-setup.png`
- `assets/placeholder-update-mode.png`

Until final screenshots are available, the website can use styled HTML placeholders rather than broken image references.
