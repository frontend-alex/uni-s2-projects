@echo off
setlocal ENABLEDELAYEDEXPANSION

REM 
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start.ps1" %*
if errorlevel 1 (
	echo.
	echo There was an error starting one or more processes.
	pause
)
endlocal
