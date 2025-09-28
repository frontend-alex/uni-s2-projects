Write-Host "Running database migrations..." -ForegroundColor Green
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
Write-Host "Applying migrations to database..." -ForegroundColor Yellow
dotnet ef database update --project ../Infrastructure --startup-project .

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Migrations applied successfully!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Migration failed!" -ForegroundColor Red
}

Write-Host ""
Read-Host "Press Enter to exit"

