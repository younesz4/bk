# VS Code Extension Folder Fix Script
# This script helps fix VS Code after deleting the extensions folder

Write-Host "=== VS Code Extension Fix Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if VS Code is running
$vscodeProcesses = Get-Process -Name "Code" -ErrorAction SilentlyContinue
if ($vscodeProcesses) {
    Write-Host "WARNING: VS Code is currently running!" -ForegroundColor Yellow
    Write-Host "Please close VS Code completely before running this script." -ForegroundColor Yellow
    Write-Host ""
    $response = Read-Host "Do you want to close VS Code now? (y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        Stop-Process -Name "Code" -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        Write-Host "VS Code closed." -ForegroundColor Green
    } else {
        Write-Host "Please close VS Code manually and run this script again." -ForegroundColor Red
        exit
    }
}

Write-Host "Step 1: Clearing VS Code caches..." -ForegroundColor Yellow

# Clear workspace storage
if (Test-Path "$env:APPDATA\Code\User\workspaceStorage") {
    Remove-Item -Recurse -Force "$env:APPDATA\Code\User\workspaceStorage" -ErrorAction SilentlyContinue
    Write-Host "  ✓ Workspace storage cleared" -ForegroundColor Green
}

# Clear cached extensions
if (Test-Path "$env:APPDATA\Code\CachedExtensions") {
    Remove-Item -Recurse -Force "$env:APPDATA\Code\CachedExtensions" -ErrorAction SilentlyContinue
    Write-Host "  ✓ Cached extensions cleared" -ForegroundColor Green
}

# Clear cached VSIX files
if (Test-Path "$env:APPDATA\Code\CachedExtensionVSIXs") {
    Remove-Item -Recurse -Force "$env:APPDATA\Code\CachedExtensionVSIXs" -ErrorAction SilentlyContinue
    Write-Host "  ✓ Cached VSIX files cleared" -ForegroundColor Green
}

# Clear logs
if (Test-Path "$env:APPDATA\Code\logs") {
    Remove-Item -Recurse -Force "$env:APPDATA\Code\logs" -ErrorAction SilentlyContinue
    Write-Host "  ✓ Logs cleared" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 2: Checking extensions folder..." -ForegroundColor Yellow

# Check for extensions folder locations
$extensionsPath1 = "$env:USERPROFILE\.vscode\extensions"
$extensionsPath2 = "$env:APPDATA\Code\User\extensions"

if (Test-Path $extensionsPath1) {
    Write-Host "  Found extensions folder at: $extensionsPath1" -ForegroundColor Cyan
    if ((Get-ChildItem $extensionsPath1 -ErrorAction SilentlyContinue | Measure-Object).Count -eq 0) {
        Write-Host "  ✓ Folder exists but is empty (this is fine)" -ForegroundColor Green
    } else {
        Write-Host "  ✓ Folder contains extensions" -ForegroundColor Green
    }
} else {
    Write-Host "  Creating extensions folder at: $extensionsPath1" -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $extensionsPath1 -Force | Out-Null
    Write-Host "  ✓ Extensions folder created" -ForegroundColor Green
}

if (Test-Path $extensionsPath2) {
    Write-Host "  Found extensions folder at: $extensionsPath2" -ForegroundColor Cyan
} else {
    Write-Host "  Creating extensions folder at: $extensionsPath2" -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $extensionsPath2 -Force | Out-Null
    Write-Host "  ✓ Extensions folder created" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 3: Clearing extension host processes..." -ForegroundColor Yellow
Get-Process -Name "Code" -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -eq "" } | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "  ✓ Extension host processes cleared" -ForegroundColor Green

Write-Host ""
Write-Host "=== Fix Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart VS Code" -ForegroundColor White
Write-Host "2. The service worker error should be gone" -ForegroundColor White
Write-Host "3. Reinstall any extensions you need from the Extensions marketplace" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

