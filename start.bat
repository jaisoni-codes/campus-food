@echo off
echo Starting Backend Server...
start cmd /k "cd backend && npm start"

echo Starting Admin Dashboard (Fast Data Entry)...
start cmd /k "cd admin-panel && npm run dev"

echo Both servers are starting! The backend will run on port 5000 and the frontend will open in your browser.
pause
