# PropVest Database Setup and Seed Script
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Setting up PropVest PostgreSQL Database via Prisma" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

Set-Location -Path (Join-Path $PSScriptRoot "backend")

Write-Host "1. Starting PostgreSQL service (requires Administrator permissions)..." -ForegroundColor Yellow
try {
    Start-Service -Name "postgresql-x64-18" -ErrorAction SilentlyContinue
    Write-Host "PostgreSQL Service is running." -ForegroundColor Green
} catch {
    Write-Host "Note: If starting the Windows service failed, open an Administrator PowerShell and run: net start postgresql-x64-18" -ForegroundColor Yellow
}

Write-Host "2. Pushing Prisma schema to PostgreSQL database..." -ForegroundColor Yellow
npx prisma db push

Write-Host "3. Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

Write-Host "4. Seeding realistic Indian real estate portfolio demo data..." -ForegroundColor Yellow
npm run seed

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Database initialization completed successfully!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
