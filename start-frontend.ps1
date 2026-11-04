# PropVest Frontend Startup Script
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Starting PropVest Angular SaaS Dashboard Frontend" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

Set-Location -Path (Join-Path $PSScriptRoot "frontend")
Write-Host "Angular server starting on http://localhost:4200" -ForegroundColor Yellow
npm start
