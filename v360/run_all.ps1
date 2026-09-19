Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
# Open Backend in a new window
Write-Host "Starting Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\run_backend.ps1"

# Open Frontend in a new window
Write-Host "Starting Frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; .\run_frontend.ps1"

Write-Host "Both services are starting in separate windows." -ForegroundColor Yellow
Write-Host "Backend: http://localhost:8000"
Write-Host "Frontend: http://localhost:5173"
