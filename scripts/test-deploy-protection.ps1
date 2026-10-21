$ErrorActionPreference = 'Stop'
$source = Join-Path $PSScriptRoot 'deploy-ftp.ps1'
$tokens = $null; $errors = $null
$ast = [System.Management.Automation.Language.Parser]::ParseFile($source, [ref]$tokens, [ref]$errors)
if ($errors.Count) { throw ($errors | Out-String) }
# Load definitions without invoking deployment or reading credentials.
foreach ($definition in $ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.FunctionDefinitionAst] }, $false)) {
    . ([scriptblock]::Create($definition.Extent.Text))
}
$assignment = $ast.Find({ param($n) $n -is [System.Management.Automation.Language.AssignmentStatementAst] -and $n.Left.Extent.Text -eq '$ProtectedRemoteDirectory' }, $false)
. ([scriptblock]::Create($assignment.Extent.Text))
function Assert($condition, $message) { if (-not $condition) { throw $message } }
$protectedCases = @('/www/ogrod-pelen-ciepla', '/www/ogrod-pelen-ciepla/', '/www/ogrod-pelen-ciepla/private/registrations.txt', '/www//ogrod-pelen-ciepla', '/WWW/OGROD-PELEN-CIEPLA/a', '/www/x/../ogrod-pelen-ciepla/a', '/www/%6fgrod-pelen-ciepla/a', '/www/%256fgrod-pelen-ciepla/a', '\www\ogrod-pelen-ciepla\a')
foreach ($path in $protectedCases) { Assert (Test-ProtectedRemotePath $path) "Unprotected variant: $path" }
foreach ($path in @('/www/ogrod-pelen-ciepla-other', '/www/ogrod-pelen-ciepla.txt', '/www/other/ogrod-pelen-ciepla', '/www/apps', '/www/ogrod-pelen-ciepla/../apps')) {
    Assert (-not (Test-ProtectedRemotePath $path)) "Wrong boundary: $path"
}
foreach ($path in @('/', '/www', '/www/')) {
    Assert (Test-ProtectedRemotePath $path -IncludeAncestors) "Ancestor unprotected: $path"
    Assert (-not (Test-ProtectedRemotePath $path)) "Ancestor reads blocked: $path"
}
$credential = New-Object System.Net.NetworkCredential('fixture', 'fixture')
foreach ($path in $protectedCases) {
    foreach ($method in @('LIST','NLST','RETR','STOR','APPE','DELE','RMD','MKD','RENAME')) {
        $blocked = $false
        try { $null = New-FtpRequest -RemotePath $path -Method $method -Credential $credential }
        catch { $blocked = $_.Exception.Message -like 'FTP operation blocked*' }
        Assert $blocked "Request not blocked: $method $path"
    }
}
foreach ($path in @('/', '/www')) {
    foreach ($method in @('DELE','RMD','RENAME')) {
        $blocked = $false
        try { $null = New-FtpRequest -RemotePath $path -Method $method -Credential $credential }
        catch { $blocked = $_.Exception.Message -like 'FTP operation blocked*' }
        Assert $blocked "Ancestor operation not blocked: $method $path"
    }
}
$script:visited = @()
function Get-FtpListDetails {
    param($RemotePath, $Credential)
    $script:visited += $RemotePath
    if ($RemotePath -eq '/www') { return @('protected','sibling') }
    if ($RemotePath -eq '/www/ogrod-pelen-ciepla-other') { return @('file') }
    throw "Unexpected traversal: $RemotePath"
}
function ConvertFrom-FtpListLine {
    param($Line)
    switch ($Line) {
        protected { @{Name='ogrod-pelen-ciepla';IsDirectory=$true;Size=0} }
        sibling { @{Name='ogrod-pelen-ciepla-other';IsDirectory=$true;Size=0} }
        file { @{Name='index.html';IsDirectory=$false;Size=1} }
    }
}
$tree = @(Get-RemoteTree -RemotePath '/www' -Credential $credential)
Assert ($tree.Count -eq 2) 'Protected entry included or sibling lost'
Assert (($script:visited -join ',') -eq '/www,/www/ogrod-pelen-ciepla-other') 'Protected tree traversed'
Assert (@(Get-RemoteTree -RemotePath '/www/ogrod-pelen-ciepla' -Credential $credential).Count -eq 0) 'Direct protected traversal returned entries'
# Local files under the protected subtree must never enter the upload plan.
$BuildRoot = Join-Path ([IO.Path]::GetTempPath()) ('deploy-protection-' + [guid]::NewGuid())
$RemoteRoot='/www'; $ExcludedDirectories=@(); $ExcludedFiles=@(); $ExcludedExtensions=@(); $ExcludedPathPrefixes=@()
try {
    $null = New-Item -ItemType Directory -Path "$BuildRoot/ogrod-pelen-ciepla/private", "$BuildRoot/ogrod-pelen-ciepla-other" -Force
    Set-Content "$BuildRoot/ogrod-pelen-ciepla/private/fixture.txt" 'synthetic test fixture'
    Set-Content "$BuildRoot/ogrod-pelen-ciepla-other/index.html" 'synthetic sibling'
    $files = @(Get-LocalDeployFiles)
    Assert ($files.Count -eq 1 -and $files[0].RelativePath -eq 'ogrod-pelen-ciepla-other/index.html') 'Upload filtering failed'
}
finally { Remove-Item -LiteralPath $BuildRoot -Recurse -Force }
Write-Host 'PASS: protected path boundaries, all FTP operations, ancestor deletion, traversal pruning and upload filtering; no network or credentials accessed.'
