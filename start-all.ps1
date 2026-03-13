# Academic Compass - Start Both Backend and Frontend
# PowerShell Script for Windows

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Academic Compass - Starting Services" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "[1/2] Starting Backend Server (Port 5000)..." -ForegroundColor Green
Start-Process PowerShell -ArgumentList "-NoExit", "cd '$PSScriptRoot\backend'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host "[2/2] Starting Frontend Server..." -ForegroundColor Green
Start-Process PowerShell -ArgumentList "-NoExit", "cd '$PSScriptRoot'; npm run dev" -WindowStyle Normal

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Services Starting..." -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Backend:  http://localhost:5000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:8080 or http://localhost:8081" -ForegroundColor Yellow

Write-Host "`nPress Ctrl+C in any window to stop that service`n" -ForegroundColor Gray
