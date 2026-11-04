# PropVest Master Startup Script
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   PropVest - Real Estate Investment and Portfolio Platform" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Launching Backend API (Port 5000) and Frontend (Port 4200)..." -ForegroundColor Yellow

$backendScript = Join-Path $PSScriptRoot "start-backend.ps1"
$frontendScript = Join-Path $PSScriptRoot "start-frontend.ps1"

Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$backendScript`""
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$frontendScript`""

Write-Host "Both processes launched in separate windows!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:4200" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:5000" -ForegroundColor Cyan
