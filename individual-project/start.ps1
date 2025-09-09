$ErrorActionPreference = 'Stop'

Set-Location -Path $PSScriptRoot

$clientDir = Join-Path $PSScriptRoot 'client'
$serverDir = Join-Path $PSScriptRoot 'server'

if (-not (Test-Path $clientDir)) { throw "Client directory not found: $clientDir" }
if (-not (Test-Path $serverDir)) { throw "Server directory not found: $serverDir" }

$clientCmd = if ($env:CLIENT_START_COMMAND) { $env:CLIENT_START_COMMAND } else { 'pnpm dev' }
$serverCmd = if ($env:SERVER_START_COMMAND) { $env:SERVER_START_COMMAND } else { 'dotnet run' }

Write-Host "Starting client in: $clientDir" -ForegroundColor Cyan
Write-Host "Command: $clientCmd" -ForegroundColor DarkCyan
Start-Process -FilePath "powershell" -WorkingDirectory $clientDir -ArgumentList @(
    "-NoExit",
    "-Command",
    "& { $clientCmd }"
) | Out-Null

Write-Host "Starting server in: $serverDir" -ForegroundColor Cyan
Write-Host "Command: $serverCmd" -ForegroundColor DarkCyan
Start-Process -FilePath "powershell" -WorkingDirectory $serverDir -ArgumentList @(
    "-NoExit",
    "-Command",
    "& { $serverCmd }"
) | Out-Null

Write-Host "Launched client and server in separate PowerShell windows." -ForegroundColor Green
Write-Host "Tip: Set CLIENT_START_COMMAND or SERVER_START_COMMAND env vars to customize commands."


