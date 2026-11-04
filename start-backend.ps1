# PropVest Backend Startup Script
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Starting PropVest Node.js / Express REST Backend API" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

Set-Location -Path (Join-Path $PSScriptRoot "backend")
Write-Host "Running on http://localhost:5000" -ForegroundColor Yellow
Write-Host "Health check endpoint: http://localhost:5000/api/health" -ForegroundColor Yellow
npm run dev
