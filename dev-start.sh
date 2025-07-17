#!/bin/bash

# MyTools Development Server Script
# Starts both backend and frontend in development mode

echo "🚀 Starting MyTools Development Servers"
echo "======================================"

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Check if required ports are available
echo "🔍 Checking port availability..."
check_port 5000 || echo "   Backend port 5000 is busy"
check_port 3000 || echo "   Frontend port 3000 is busy"

echo ""
echo "Starting development servers..."
echo "Press Ctrl+C to stop all servers"
echo ""

# Start backend in background
echo "🔧 Starting backend server on port 5000..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend in background
echo "🎨 Starting frontend server on port 3000..."
cd ../frontend
npm start &
FRONTEND_PID=$!

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ All servers stopped"
    exit 0
}

# Set up trap to catch Ctrl+C
trap cleanup SIGINT

echo ""
echo "✅ Servers are starting..."
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for both processes
wait
