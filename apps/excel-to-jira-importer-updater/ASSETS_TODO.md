# Screenshot and media assets

The landing page now uses the real app screenshots generated from:

`D:\work\mederak-products\products\excel-to-jira-importer-updater\tests\screens`

The imported flow screenshots are cropped to a horizontal `1680 x 945` frame and are referenced directly from
`apps/excel-to-jira-importer-updater/assets/`. Do not swap them for portrait mobile-only crops on responsive layouts.

## Current real flow screenshots

| File | Size | Landing page role |
| --- | --- | --- |
| `screen-01-upload-workbook.png` | 1680 x 945 | Start screen / importer overview. |
| `step-2-upload-1600x1000.png` | 1680 x 945 | Upload XLSX workbook. |
| `screen-03-worksheet-selection.png` | 1680 x 945 | Worksheet and header row selection. |
| `step-4-template-1600x1000.png` | 1680 x 945 | Saved setup and selected header row. |
| `step-5-mapping-1-1600x1000.png` | 1680 x 945 | Field mapping and value cleanup setup. |
| `step-6-hierarchy-1600x1000.png` | 1680 x 945 | Repeated import and row identity settings. |
| `screen-07-validate.png` | 1680 x 945 | Validation results and selected valid rows before import. |
| `step-8-report-1-1600x1000.png` | 1680 x 945 | Import report with updated issue keys and export actions. |

## Still needed

| File | Recommended size | Purpose |
| --- | --- | --- |
| `screen-hero.png` | 1680 x 945 | Dedicated hero graphic when available. Keep it visually close to the real app UI. |
| `og-excel-to-jira-importer-updater.png` | 1200 x 630 | Open Graph and social sharing image. |

The product tour is embedded from YouTube: `https://youtu.be/zkGjekxM1pE`.

## Rendered dimensions on the current landing page

Approximate visible sizes on a standard desktop viewport with the current `1180px` layout:

| Landing page area | Files | Display size before zoom |
| --- | --- | --- |
| Hero main screenshot | `screen-01-upload-workbook.png` now, `screen-hero.png` later | about 665 x 416 px |
| Hero mini screenshots | upload, mapping, validation | about 214 x 134 px each |
| Visual band wide screenshot | worksheet selection | about 602 x 376 px |
| Visual band small screenshots | column recognition, report | about 294 x 184 px each |
| Workflow cards | all 8 real flow screenshots | about 581 x 363 px each |
| Key screen cards | worksheet, mapping, repeated imports, validation | about 526 x 296 px each |

On mobile, these assets render mostly as single-column cards around 330-390 px wide, depending on device width.

## Capture rules

- Use real app screens only.
- Keep English UI content and realistic B2B backlog examples.
- Avoid personal data, real client names, production Jira URLs and private issue keys.
- Export sharp PNG/WebP files; avoid JPEG compression for UI text.
- If the app flow changes, update this file and the landing page copy together.
