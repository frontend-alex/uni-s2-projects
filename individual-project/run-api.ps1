Write-Host "Starting API server..." -ForegroundColor Green
Write-Host ""

# Change to API directory
Set-Location -Path "$PSScriptRoot\src\API"

Write-Host "Building project..." -ForegroundColor Yellow
dotnet build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Please fix the errors first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Starting API server on https://localhost:7000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

dotnet run
