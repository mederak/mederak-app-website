# Screenshot and media assets to replace manually

The landing page now references real asset filenames in `apps/excel-backlog-importer-for-jira/assets/`.
Temporary image files are present so the page does not break before final screenshots are ready.

## Highest priority assets

Replace these first for the strongest Google Ads landing page:

| File | Recommended size | Format | Where it appears | Capture guidance |
| --- | --- | --- | --- | --- |
| `screen-hero.png` | 1600 x 1060 | PNG/WebP | Hero | Full importer wizard inside Jira Cloud, clean project, realistic data. |
| `showreel_en.mp4` | 1920 x 1080 or 1662 x 966 | MP4 | Video section | 45-75 seconds: upload, worksheet, mapping, validation, preview, report. |
| `screen-column-mapping.png` | 1600 x 1000 | PNG/WebP | Hero mini card, workflow, key screens | Excel columns on one side, Jira fields on the other, several mapped fields. |
| `screen-validation-results.png` | 1600 x 1000 | PNG/WebP | Hero mini card, workflow, key screens | Show a mostly successful validation with a few useful warnings/errors. |
| `screen-import-preview.png` | 1600 x 1000 | PNG/WebP | Visual band, workflow | Show rows that will become Jira issues before the import is run. |
| `screen-import-report.png` | 1600 x 1000 | PNG/WebP | Visual band, workflow | Show completed import results and export/report controls. |

## Rendered dimensions on the current landing page

These are the approximate visible sizes on a standard desktop viewport with the current `1180px` layout. Prepare images at the recommended source sizes above; the browser will scale them down to these display areas.

| Landing page area | Files | Display size before zoom |
| --- | --- | --- |
| Hero main screenshot | `screen-hero.png` | about 665 x 440 px |
| Hero mini screenshots | `screen-upload-workbook.png`, `screen-column-mapping.png`, `screen-validation-results.png` | about 214 x 134 px each |
| Visual band wide screenshot | `screen-import-preview.png` | about 602 x 376 px |
| Visual band small screenshots | `screen-import-report.png`, `screen-import-history.png` | about 294 x 184 px each |
| Workflow cards | `screen-upload-workbook.png`, `screen-worksheet-selection.png`, `screen-column-mapping.png`, `screen-validation-results.png`, `screen-import-preview.png`, `screen-create-update-mode.png`, `screen-import-report.png` | about 581 x 363 px each |
| Key screen cards | `screen-column-mapping.png`, `screen-validation-results.png`, `screen-hierarchy-mapping.png`, `screen-update-existing-issues.png` | about 526 x 329 px each |

On mobile, these same assets render mostly as single-column cards around 330-390 px wide, depending on device width. Keep text and UI controls readable after downscaling to about 526 px wide, because that is the most important repeated product-card size.

## Full screenshot set

These give enough visuals for the current page and future ad variants:

| File | Recommended size | Format | Purpose |
| --- | --- | --- | --- |
| `screen-upload-workbook.png` | 1600 x 1000 | PNG/WebP | Upload XLSX step. |
| `screen-worksheet-selection.png` | 1600 x 1000 | PNG/WebP | Worksheet and header row selection. |
| `screen-column-mapping.png` | 1600 x 1000 | PNG/WebP | Mapping Excel columns to Jira fields. |
| `screen-validation-results.png` | 1600 x 1000 | PNG/WebP | Validation before import. |
| `screen-import-preview.png` | 1600 x 1000 | PNG/WebP | Preview before Jira changes. |
| `screen-create-update-mode.png` | 1600 x 1000 | PNG/WebP | Create or update choice for repeated uploads. |
| `screen-import-report.png` | 1600 x 1000 | PNG/WebP | Post-import report. |
| `screen-import-history.png` | 1600 x 1000 | PNG/WebP | Import history view. |
| `screen-update-existing-issues.png` | 1600 x 1000 | PNG/WebP | Updating matching Jira issues from Excel. |
| `screen-hierarchy-mapping.png` | 1600 x 1000 | PNG/WebP | Structured Epic, Story and Sub-task import setup. |
| `screen-epic-story-subtask-import.png` | 1600 x 1000 | PNG/WebP | Example hierarchy import preview or report. |
| `screen-custom-fields-mapping.png` | 1600 x 1000 | PNG/WebP | Custom field mapping detail for a later section or ad variant. |
| `screen-duplicate-handling.png` | 1600 x 1000 | PNG/WebP | Duplicate handling or repeated upload detection. |
| `og-excel-backlog-importer.png` | 1200 x 630 | PNG/WebP | Open Graph and social sharing image. |

## Optional campaign assets

| File | Recommended size | Format | Purpose |
| --- | --- | --- | --- |
| `workflow-upload-to-preview.gif` | 1600 x 1000 | GIF/WebP animation | Short silent animation for ad landing page tests. |
| `marketplace-card.png` | 1200 x 900 | PNG/WebP | Atlassian Marketplace listing visual when public. |
| `spreadsheet-before.png` | 1400 x 900 | PNG/WebP | Example source workbook before import. |
| `jira-backlog-after.png` | 1400 x 900 | PNG/WebP | Jira backlog after import. |

## Capture rules

- Use English UI content and realistic B2B backlog examples.
- Avoid personal data, real client names, production Jira URLs and private issue keys.
- Keep browser chrome minimal or crop to the Jira app surface.
- Prefer light theme screenshots unless the final Marketplace listing uses dark visuals.
- Export sharp PNG/WebP files; avoid JPEG compression for UI text.
- Keep visual density high enough that mapping, validation and reports are readable on desktop.
