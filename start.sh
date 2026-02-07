#!/bin/bash

# Quick start script for Agentic Recruiter Platform

echo "🤖 Starting Agentic Recruiter Platform..."

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "❌ Error: backend/.env not found"
    echo "Please copy backend/.env.example to backend/.env and add your GOOGLE_API_KEY"
    exit 1
fi

# Check if GOOGLE_API_KEY is set
if grep -q "your_api_key_here" backend/.env; then
    echo "❌ Error: GOOGLE_API_KEY not configured in backend/.env"
    echo "Please add your actual Gemini API key to backend/.env"
    exit 1
fi

# Start backend in background
echo "🚀 Starting backend server..."
cd backend
source .venv/bin/activate 2>/dev/null || echo "Note: Virtual environment not found, using system Python"
uvicorn main:app --reload &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend
echo "🎨 Starting neobrutalist frontend server..."
cd frontend-neo
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Servers started!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5174"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit 0" INT

# Keep script running
wait
