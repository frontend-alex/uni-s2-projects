
@echo off
REM 
cd /d "%~dp0"

REM 
echo Select an option:
echo   1) Run app
echo   2) Run tests
set /p choice=Enter 1 or 2: 

if "%choice%"=="1" (
    dotnet run --project .\src\CircusProject.App\CircusProject.App.csproj %*
    goto :eof
)

if "%choice%"=="2" (
    dotnet test .\tests\CircusProject.Tests\CircusProject.Tests.csproj --nologo
    goto :eof
)

echo Invalid choice. Exiting.

