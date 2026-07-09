\# AGENTS.md — mederak.pl



\## Purpose



This is the public website for Mederak Apps.



It contains:

\- Vendor homepage.

\- App catalogue.

\- Product landing pages.

\- Product documentation.

\- Privacy, terms, security, support and subprocessors pages.



\## URL structure



Use this structure:



\- `/` — vendor homepage.

\- `/apps/` — app catalogue.

\- `/apps/{product-slug}/` — product landing page.

\- `/apps/{product-slug}/docs.html` — product documentation.

\- `/apps/{product-slug}/privacy.html` — product privacy policy.

\- `/apps/{product-slug}/terms.html` — product terms.

\- `/apps/{product-slug}/security.html` — product security page.

\- `/apps/{product-slug}/subprocessors.html` — product subprocessors.

\- `/apps/{product-slug}/support.html` — product support page.



\## Scope rule



Do not edit Forge app source code from this website project.



If a website update reveals a product implementation gap, do not implement the product feature unless the user explicitly asks.



\## Copy rules



Write in clear, professional English for Marketplace-facing pages.



Avoid exaggerated claims.



Prefer:

\- practical,

\- clear,

\- specific,

\- security-conscious,

\- buyer-friendly.



Avoid:

\- hype,

\- unsupported enterprise claims,

\- promises of future features,

\- legal placeholders,

\- visible draft notes.



\## Early access



If the Marketplace listing is not yet public, use early access messaging.



Use:



`support.jira@mederak.pl`



Mention that users should contact from a company email address.



\## Product accuracy



For Excel to Jira Importer & Updater, the website may describe:

\- Excel `.xlsx` import.

\- Creating Jira issues.

\- Updating existing Jira issues from repeated Excel uploads.

\- Importing under a selected parent issue, depending on Jira configuration.

\- Validation before import.

\- Duplicate handling.

\- Atlassian Forge architecture.



Do not describe rollback.



\## Recurring What's new updates



For Excel to Jira Importer & Updater, the source of truth for the public What's new page is:

`/Users/medec/Developer/mederak-apps/products/excel-importer-backlog-for-jira/forge/marketplace_changelog.md`



When the user asks to refresh What's new:

\- Read the latest `marketplace_changelog.md` entry first.

\- Update `/apps/excel-to-jira-importer-updater/whats-new/`.

\- Update the visible landing page teasers in `/apps/excel-to-jira-importer-updater/index.html`.

\- Keep the latest release at the top of the release history and preserve older useful entries below it.

\- Update page metadata such as `dateModified` and Open Graph description when the latest release changes the visible positioning.

\- Rebuild `dist` before handing back if the local preview or deployment output matters.



Write the public changelog in customer-facing language. Summarize repeated internal entries into one clear buyer-friendly change when needed.



Do not show internal release plumbing to customers, including:

\- `Changes included since Marketplace version...`

\- `Included app versions...`

\- internal app-version ranges,

\- stat cards or big numbers that do not explain customer value.



Prefer concrete release notes such as:

\- what users can now do,

\- what became clearer or safer,

\- what was fixed,

\- what workflow became easier.



After editing, run at least:

\- `git diff --check`

\- `npm run build`

\- `npm run verify:dist`

\- `npm run verify:links`
