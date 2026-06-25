[CmdletBinding()]
param(
    [switch]$SaveCredential,
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$FtpHost = "ftp.cluster100.hosting.ovh.net"
$FtpPort = 21
$FtpUser = "lgngvco"
$RemoteRoot = "/www"
$CredentialTarget = "mederak.pl FTP"
$DeploySecretsPath = Join-Path $ProjectRoot ".deploy-secrets.json"

$ExcludedDirectories = @(".git")
$ExcludedFiles = @("AGENTS.md", "README.md", ".gitignore", ".deploy-secrets.json", ".DS_Store", "MARKETING_REFRESH_NOTES.md")
$ExcludedPathPrefixes = @("scripts/")
$ExcludedExtensions = @(".md")
$EnsuredRemoteDirectories = New-Object "System.Collections.Generic.HashSet[string]" ([StringComparer]::OrdinalIgnoreCase)

Add-Type -Language CSharp -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public static class NativeCredentialManager
{
    private const int CRED_TYPE_GENERIC = 1;
    private const int CRED_PERSIST_LOCAL_MACHINE = 2;

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    private struct CREDENTIAL
    {
        public int Flags;
        public int Type;
        public string TargetName;
        public string Comment;
        public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten;
        public int CredentialBlobSize;
        public IntPtr CredentialBlob;
        public int Persist;
        public int AttributeCount;
        public IntPtr Attributes;
        public string TargetAlias;
        public string UserName;
    }

    [DllImport("advapi32.dll", EntryPoint = "CredReadW", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool CredRead(string target, int type, int reservedFlag, out IntPtr credentialPtr);

    [DllImport("advapi32.dll", EntryPoint = "CredWriteW", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool CredWrite(ref CREDENTIAL userCredential, int flags);

    [DllImport("advapi32.dll", EntryPoint = "CredFree", SetLastError = true)]
    private static extern bool CredFree(IntPtr credentialPtr);

    public static void Write(string target, string userName, string password)
    {
        byte[] passwordBytes = Encoding.Unicode.GetBytes(password);
        if (passwordBytes.Length > 512)
        {
            throw new ArgumentOutOfRangeException("password", "Credential Manager password blob is too large.");
        }

        IntPtr passwordPtr = Marshal.AllocCoTaskMem(passwordBytes.Length);
        try
        {
            Marshal.Copy(passwordBytes, 0, passwordPtr, passwordBytes.Length);
            CREDENTIAL credential = new CREDENTIAL();
            credential.Type = CRED_TYPE_GENERIC;
            credential.TargetName = target;
            credential.UserName = userName;
            credential.CredentialBlob = passwordPtr;
            credential.CredentialBlobSize = passwordBytes.Length;
            credential.Persist = CRED_PERSIST_LOCAL_MACHINE;

            if (!CredWrite(ref credential, 0))
            {
                throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error());
            }
        }
        finally
        {
            Marshal.FreeCoTaskMem(passwordPtr);
        }
    }

    public static string ReadPassword(string target)
    {
        IntPtr credentialPtr;
        if (!CredRead(target, CRED_TYPE_GENERIC, 0, out credentialPtr))
        {
            throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error());
        }

        try
        {
            CREDENTIAL credential = (CREDENTIAL)Marshal.PtrToStructure(credentialPtr, typeof(CREDENTIAL));
            if (credential.CredentialBlob == IntPtr.Zero || credential.CredentialBlobSize == 0)
            {
                return "";
            }

            return Marshal.PtrToStringUni(credential.CredentialBlob, credential.CredentialBlobSize / 2);
        }
        finally
        {
            CredFree(credentialPtr);
        }
    }
}
"@

function ConvertFrom-SecureStringToPlainText {
    param([Parameter(Mandatory = $true)][securestring]$SecureString)

    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureString)
    try {
        [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
    }
    finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
}

function Save-DeployCredential {
    $securePassword = Read-Host "FTP password for $FtpUser@$FtpHost" -AsSecureString
    $plainPassword = ConvertFrom-SecureStringToPlainText -SecureString $securePassword
    try {
        [NativeCredentialManager]::Write($CredentialTarget, $FtpUser, $plainPassword)
    }
    finally {
        if ($null -ne $plainPassword) {
            $plainPassword = $null
        }
    }

    Write-Host "Saved FTP password in Windows Credential Manager target '$CredentialTarget'."
}

function Get-DeployCredential {
    if (Test-Path -LiteralPath $DeploySecretsPath) {
        $secretConfig = Get-Content -LiteralPath $DeploySecretsPath -Raw | ConvertFrom-Json
        $passwordProperty = $secretConfig.PSObject.Properties["ftpPassword"]
        if ($null -eq $passwordProperty -or [string]::IsNullOrWhiteSpace([string]$passwordProperty.Value)) {
            throw "Missing 'ftpPassword' in .deploy-secrets.json."
        }

        $password = [string]$passwordProperty.Value
        if ($password -eq "PUT_FTP_PASSWORD_HERE") {
            throw "Replace PUT_FTP_PASSWORD_HERE in .deploy-secrets.json before deploying."
        }

        $userProperty = $secretConfig.PSObject.Properties["ftpUser"]
        if ($null -ne $userProperty -and -not [string]::IsNullOrWhiteSpace([string]$userProperty.Value) -and [string]$userProperty.Value -ne $FtpUser) {
            throw ".deploy-secrets.json ftpUser '$($userProperty.Value)' does not match configured FTP user '$FtpUser'."
        }

        return New-Object System.Net.NetworkCredential($FtpUser, $password)
    }

    try {
        $password = [NativeCredentialManager]::ReadPassword($CredentialTarget)
    }
    catch {
        throw "FTP password is not saved. Run '.\scripts\deploy-ftp.ps1 -SaveCredential' once from the repository root."
    }

    New-Object System.Net.NetworkCredential($FtpUser, $password)
}

function Assert-CleanGitState {
    Push-Location $ProjectRoot
    try {
        & git diff --check
        if ($LASTEXITCODE -ne 0) {
            throw "git diff --check failed."
        }

        $status = & git status --porcelain
        if ($LASTEXITCODE -ne 0) {
            throw "git status failed."
        }

        if ($status) {
            throw "Working tree is not clean. Commit or stash changes before deploy."
        }
    }
    finally {
        Pop-Location
    }
}

function ConvertTo-FtpUri {
    param([Parameter(Mandatory = $true)][string]$RemotePath)

    $path = $RemotePath.TrimStart("/")
    "ftp://$FtpHost`:$FtpPort/$path"
}

function New-FtpRequest {
    param(
        [Parameter(Mandatory = $true)][string]$RemotePath,
        [Parameter(Mandatory = $true)][string]$Method,
        [Parameter(Mandatory = $true)][System.Net.NetworkCredential]$Credential
    )

    $request = [System.Net.FtpWebRequest]::Create((ConvertTo-FtpUri -RemotePath $RemotePath))
    $request.Credentials = $Credential
    $request.Method = $Method
    $request.UsePassive = $true
    $request.UseBinary = $true
    $request.KeepAlive = $false
    $request.Timeout = 30000
    $request.ReadWriteTimeout = 30000
    $request
}

function Invoke-FtpNoContent {
    param(
        [Parameter(Mandatory = $true)][string]$RemotePath,
        [Parameter(Mandatory = $true)][string]$Method,
        [Parameter(Mandatory = $true)][System.Net.NetworkCredential]$Credential
    )

    $request = New-FtpRequest -RemotePath $RemotePath -Method $Method -Credential $Credential
    $response = $request.GetResponse()
    $response.Close()
}

function Test-FtpDirectory {
    param(
        [Parameter(Mandatory = $true)][string]$RemotePath,
        [Parameter(Mandatory = $true)][System.Net.NetworkCredential]$Credential
    )

    try {
        Invoke-FtpNoContent -RemotePath $RemotePath -Method ([System.Net.WebRequestMethods+Ftp]::ListDirectory) -Credential $Credential
        $true
    }
    catch [System.Net.WebException] {
        $false
    }
}

function Ensure-FtpDirectory {
    param(
        [Parameter(Mandatory = $true)][string]$RemotePath,
        [Parameter(Mandatory = $true)][System.Net.NetworkCredential]$Credential
    )

    $parts = $RemotePath.Trim("/").Split([char[]]@("/"), [StringSplitOptions]::RemoveEmptyEntries)
    $current = ""
    foreach ($part in $parts) {
        $current = "$current/$part"
        if ($EnsuredRemoteDirectories.Contains($current)) {
            continue
        }

        if ($DryRun) {
            if (-not (Test-FtpDirectory -RemotePath $current -Credential $Credential)) {
                Write-Host "DRY create directory $current"
            }
        }
        else {
            try {
                Invoke-FtpNoContent -RemotePath $current -Method ([System.Net.WebRequestMethods+Ftp]::MakeDirectory) -Credential $Credential
                Write-Host "Created directory $current"
            }
            catch [System.Net.WebException] {
                if (-not (Test-FtpDirectory -RemotePath $current -Credential $Credential)) {
                    throw
                }
            }
        }

        [void]$EnsuredRemoteDirectories.Add($current)
    }
}

function Get-FtpListDetails {
    param(
        [Parameter(Mandatory = $true)][string]$RemotePath,
        [Parameter(Mandatory = $true)][System.Net.NetworkCredential]$Credential
    )

    $request = New-FtpRequest -RemotePath $RemotePath -Method ([System.Net.WebRequestMethods+Ftp]::ListDirectoryDetails) -Credential $Credential
    try {
        $response = $request.GetResponse()
        try {
            $stream = $response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            try {
                $reader.ReadToEnd() -split "`r?`n" | Where-Object { $_.Trim().Length -gt 0 }
            }
            finally {
                $reader.Close()
            }
        }
        finally {
            $response.Close()
        }
    }
    catch [System.Net.WebException] {
        @()
    }
}

function ConvertFrom-FtpListLine {
    param([Parameter(Mandatory = $true)][string]$Line)

    if ($Line -match "^(?<type>[d-])[rwx-]{9}\s+\d+\s+\S+\s+\S+\s+(?<size>\d+)\s+\w+\s+\d+\s+[\d:]{4,5}\s+(?<name>.+)$") {
        return [pscustomobject]@{
            Name = $Matches.name
            IsDirectory = $Matches.type -eq "d"
            Size = [int64]$Matches.size
        }
    }

    if ($Line -match "^(?<date>\d{2}-\d{2}-\d{2})\s+(?<time>\d{2}:\d{2}[AP]M)\s+(?<dir><DIR>)?\s*(?<size>\d+)?\s+(?<name>.+)$") {
        return [pscustomobject]@{
            Name = $Matches.name
            IsDirectory = $Matches.dir -eq "<DIR>"
            Size = if ($Matches.size) { [int64]$Matches.size } else { 0 }
        }
    }

    throw "Cannot parse FTP listing line: $Line"
}

function Get-RemoteTree {
    param(
        [Parameter(Mandatory = $true)][string]$RemotePath,
        [Parameter(Mandatory = $true)][System.Net.NetworkCredential]$Credential
    )

    $items = @()
    foreach ($line in (Get-FtpListDetails -RemotePath $RemotePath -Credential $Credential)) {
        $entry = ConvertFrom-FtpListLine -Line $line
        if ($entry.Name -eq "." -or $entry.Name -eq "..") {
            continue
        }

        $childPath = "$RemotePath/$($entry.Name)" -replace "/+", "/"
        $items += [pscustomobject]@{
            Path = $childPath
            Name = $entry.Name
            IsDirectory = $entry.IsDirectory
            Size = $entry.Size
        }

        if ($entry.IsDirectory) {
            $items += Get-RemoteTree -RemotePath $childPath -Credential $Credential
        }
    }

    $items
}

function Get-RelativeDeployPath {
    param([Parameter(Mandatory = $true)][string]$FullName)

    $root = $ProjectRoot.ProviderPath.TrimEnd("\", "/") + [System.IO.Path]::DirectorySeparatorChar
    if (-not $FullName.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)) {
        throw "Path '$FullName' is not below project root '$root'."
    }

    $FullName.Substring($root.Length).Replace("\", "/")
}

function Get-LocalDeployFiles {
    Get-ChildItem -LiteralPath $ProjectRoot -Recurse -File -Force |
        Where-Object {
            $relative = Get-RelativeDeployPath -FullName $_.FullName
            $topDirectory = $relative.Split("/")[0]
            if ($ExcludedDirectories -contains $topDirectory) { return $false }
            if ($ExcludedFiles -contains $_.Name) { return $false }
            if ($ExcludedExtensions -contains $_.Extension) { return $false }
            foreach ($prefix in $ExcludedPathPrefixes) {
                if ($relative.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase)) { return $false }
            }
            $true
        } |
        ForEach-Object {
            $relative = Get-RelativeDeployPath -FullName $_.FullName
            $relativeDirectory = [System.IO.Path]::GetDirectoryName($relative)
            if ([string]::IsNullOrWhiteSpace($relativeDirectory)) {
                $remoteDirectory = $RemoteRoot
            }
            else {
                $remoteDirectory = "$RemoteRoot/$($relativeDirectory.Replace("\", "/"))" -replace "/+", "/"
            }

            [pscustomobject]@{
                FullName = $_.FullName
                RelativePath = $relative
                RemotePath = "$RemoteRoot/$relative" -replace "/+", "/"
                RemoteDirectory = $remoteDirectory
                Length = $_.Length
            }
        }
}

function Send-FtpFile {
    param(
        [Parameter(Mandatory = $true)][string]$LocalPath,
        [Parameter(Mandatory = $true)][string]$RemotePath,
        [Parameter(Mandatory = $true)][System.Net.NetworkCredential]$Credential
    )

    $request = New-FtpRequest -RemotePath $RemotePath -Method ([System.Net.WebRequestMethods+Ftp]::UploadFile) -Credential $Credential
    $fileStream = [System.IO.File]::OpenRead($LocalPath)
    try {
        $request.ContentLength = $fileStream.Length
        $requestStream = $request.GetRequestStream()
        try {
            $fileStream.CopyTo($requestStream)
        }
        finally {
            $requestStream.Close()
        }
    }
    finally {
        $fileStream.Close()
    }

    $response = $request.GetResponse()
    $response.Close()
}

function Invoke-Deploy {
    Assert-CleanGitState

    $credential = Get-DeployCredential
    Ensure-FtpDirectory -RemotePath $RemoteRoot -Credential $credential

    $localFiles = @(Get-LocalDeployFiles)
    $localRemotePaths = New-Object "System.Collections.Generic.HashSet[string]" ([StringComparer]::OrdinalIgnoreCase)
    foreach ($file in $localFiles) {
        [void]$localRemotePaths.Add($file.RemotePath)
    }

    $remoteItems = @(Get-RemoteTree -RemotePath $RemoteRoot -Credential $credential)
    $remoteFiles = @($remoteItems | Where-Object { -not $_.IsDirectory })
    $remoteDirectories = @($remoteItems | Where-Object { $_.IsDirectory } | Sort-Object { $_.Path.Length } -Descending)

    foreach ($remoteFile in $remoteFiles) {
        if (-not $localRemotePaths.Contains($remoteFile.Path)) {
            if ($DryRun) {
                Write-Host "DRY delete file $($remoteFile.Path)"
            }
            else {
                Invoke-FtpNoContent -RemotePath $remoteFile.Path -Method ([System.Net.WebRequestMethods+Ftp]::DeleteFile) -Credential $credential
                Write-Host "Deleted file $($remoteFile.Path)"
            }
        }
    }

    $remoteFileSizes = @{}
    foreach ($remoteFile in $remoteFiles) {
        $remoteFileSizes[$remoteFile.Path] = $remoteFile.Size
    }

    foreach ($file in $localFiles) {
        if ($file.RemoteDirectory -ne $RemoteRoot) {
            Ensure-FtpDirectory -RemotePath $file.RemoteDirectory -Credential $credential
        }

        $needsUpload = -not $remoteFileSizes.ContainsKey($file.RemotePath) -or $remoteFileSizes[$file.RemotePath] -ne $file.Length
        if ($needsUpload) {
            if ($DryRun) {
                Write-Host "DRY upload $($file.RelativePath)"
            }
            else {
                Send-FtpFile -LocalPath $file.FullName -RemotePath $file.RemotePath -Credential $credential
                Write-Host "Uploaded $($file.RelativePath)"
            }
        }
    }

    foreach ($remoteDirectory in $remoteDirectories) {
        $hasLocalFileBelow = $false
        foreach ($path in $localRemotePaths) {
            if ($path.StartsWith("$($remoteDirectory.Path)/", [StringComparison]::OrdinalIgnoreCase)) {
                $hasLocalFileBelow = $true
                break
            }
        }

        if (-not $hasLocalFileBelow) {
            if ($DryRun) {
                Write-Host "DRY delete directory $($remoteDirectory.Path)"
            }
            else {
                Invoke-FtpNoContent -RemotePath $remoteDirectory.Path -Method ([System.Net.WebRequestMethods+Ftp]::RemoveDirectory) -Credential $credential
                Write-Host "Deleted directory $($remoteDirectory.Path)"
            }
        }
    }

    Write-Host "Deploy complete."
}

if ($SaveCredential) {
    Save-DeployCredential
    return
}

Invoke-Deploy
