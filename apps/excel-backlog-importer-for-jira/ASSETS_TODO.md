# Screenshot and media assets

The landing page now uses the real app screenshots generated from:

`D:\work\mederak-products\products\excel-backlog-importer-for-jira\tests\screens`

The imported desktop flow screenshots are `1600 x 1000` and are referenced directly from
`apps/excel-backlog-importer-for-jira/assets/`. Mobile alternates are `390 x 900`.

## Current real flow screenshots

| File | Size | Landing page role |
| --- | --- | --- |
| `screen-01-upload-workbook.png` | 1600 x 1000 | Start screen / importer overview. |
| `step-2-upload-1600x1000.png` | 1600 x 1000 | Upload XLSX workbook. |
| `screen-03-worksheet-selection.png` | 1600 x 1000 | Worksheet and header row selection. |
| `step-4-template-1600x1000.png` | 1600 x 1000 | Column recognition and detected headers. |
| `step-5-mapping-1-1600x1000.png` | 1600 x 1000 | Issue type defaults, parent option and Jira field mapping. |
| `step-6-hierarchy-1600x1000.png` | 1600 x 1000 | Current hierarchy information and duplicate handling settings. |
| `screen-07-validate.png` | 1600 x 1000 | Validation results and selected valid rows before import. |
| `step-8-report-1-1600x1000.png` | 1600 x 1000 | Import report with created issue keys and export actions. |

## Still needed

| File | Recommended size | Purpose |
| --- | --- | --- |
| `screen-hero.png` | 1600 x 1060 or 1600 x 1000 | Dedicated hero graphic when available. Keep it visually close to the real app UI. |
| `og-excel-backlog-importer.png` | 1200 x 630 | Open Graph and social sharing image. |
| `showreel_en.mp4` | 1920 x 1080 or 1662 x 966 | Optional short product tour video. |

## Rendered dimensions on the current landing page

Approximate visible sizes on a standard desktop viewport with the current `1180px` layout:

| Landing page area | Files | Display size before zoom |
| --- | --- | --- |
| Hero main screenshot | `screen-01-upload-workbook.png` now, `screen-hero.png` later | about 665 x 416 px |
| Hero mini screenshots | upload, mapping, validation | about 214 x 134 px each |
| Visual band wide screenshot | worksheet selection | about 602 x 376 px |
| Visual band small screenshots | column recognition, report | about 294 x 184 px each |
| Workflow cards | all 8 real flow screenshots | about 581 x 363 px each |
| Key screen cards | worksheet, mapping, hierarchy/duplicates, validation | about 526 x 329 px each |

On mobile, these assets render mostly as single-column cards around 330-390 px wide, depending on device width.

## Capture rules

- Use real app screens only.
- Keep English UI content and realistic B2B backlog examples.
- Avoid personal data, real client names, production Jira URLs and private issue keys.
- Export sharp PNG/WebP files; avoid JPEG compression for UI text.
- If the app flow changes, update this file and the landing page copy together.
