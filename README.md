\# mederak.pl



Public website for Mederak Apps.



\## Structure

\- `/` — vendor homepage

\- `/apps/` — app catalogue

\- `/apps/excel-to-jira-importer-uploader/` — product page

\- `/apps/{app}/docs.html` — app documentation

\- `/apps/{app}/privacy.html` — app privacy policy

\- `/apps/{app}/terms.html` — app terms

\- `/apps/{app}/security.html` — app security page



\## Rule

This repository contains public website files only. Forge app source code is stored under:

`../../apps/`

## Deployment

Deployment is a mirror upload from this repository to `/www` on the FTP server.

Save the FTP password once in Windows Credential Manager:

```powershell
.\scripts\deploy-ftp.ps1 -SaveCredential
```

Deploy the committed website state:

```powershell
.\scripts\deploy-ftp.ps1
```

The deploy script runs `git diff --check` and requires a clean working tree before uploading. It excludes repository metadata, local instructions, README, deploy scripts and local secret files from the public mirror.

