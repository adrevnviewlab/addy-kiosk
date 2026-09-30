@echo off
setlocal
set "kioskChrome=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%kioskChrome%" set "kioskChrome=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not exist "%kioskChrome%" (
  start "" "%~dp0index.html"
  exit /b
)
set "kioskPage=%~dp0index.html"
set "kioskPage=%kioskPage:\=/%"
start "" "%kioskChrome%" --kiosk --no-first-run --disable-pinch --overscroll-history-navigation=0 --user-data-dir="%~dp0.kiosk-browser" "file:///%kioskPage%"
