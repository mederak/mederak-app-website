\# mederak.app



Public website for Mederak Apps.



\## Structure

\- `/` — vendor homepage

\- `/apps/` — app catalogue

\- `/apps/excel-to-jira-importer-updater/` — product page

\- `/apps/{app}/docs.html` — app documentation

\- `/apps/{app}/privacy.html` — app privacy policy

\- `/apps/{app}/terms.html` — app terms

\- `/apps/{app}/security.html` — app security page



\## Rule

This repository contains public website files only. Forge app source code is stored under:

`../../apps/`

## Deployment

The website is built with Astro as static output and then mirror-uploaded from
`dist/` to `/www` on the FTP server.

Save the FTP password once in Windows Credential Manager:

```powershell
.\scripts\deploy-ftp.ps1 -SaveCredential
```

Build and verify the static site locally:

```powershell
npm run build
node scripts/verify-seo-domain.js dist
```

Deploy the committed website state:

```powershell
.\scripts\deploy-ftp.ps1
```

The deploy script runs `git diff --check`, requires a clean working tree,
builds `dist/`, validates the generated SEO surface, and uploads only the
generated static files.

`/www/ogrod-pelen-ciepla` is managed separately and protected by the deploy script.
Its subtree is not traversed, uploaded to, overwritten or deleted. Destructive
operations on its ancestors are blocked too. Keep this protection when reverting
website content. Run `pwsh -NoProfile -File scripts/test-deploy-protection.ps1`
to check protection without network access.

## SEO verification

Verify that `https://mederak.app` is the canonical and sitemap domain:

```powershell
node scripts/verify-seo-domain.js
```
