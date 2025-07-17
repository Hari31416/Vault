#!/bin/bash

# MyTools Setup Script
# This script helps set up the MyTools MERN stack application

echo "🚀 MyTools Setup Script"
echo "======================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v14 or higher) first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Check if MongoDB is running (optional check)
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB is available"
else
    echo "⚠️  MongoDB not found locally. Make sure MongoDB is running or use MongoDB Atlas."
fi

echo ""
echo "📦 Installing Dependencies..."
echo ""

# Install backend dependencies
echo "🔧 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..

# Install frontend dependencies
echo "🎨 Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..

echo ""
echo "✅ Installation completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Set up your environment variables:"
echo "   - Copy backend/.env.example to backend/.env (if exists)"
echo "   - Copy frontend/.env.example to frontend/.env (if exists)"
echo "   - Update MongoDB URI and JWT secret in backend/.env"
echo ""
echo "2. Start the application:"
echo "   - Backend: cd backend && npm run dev"
echo "   - Frontend: cd frontend && npm start"
echo ""
echo "3. Access the application at http://localhost:3000"
echo ""
echo "🎉 Happy coding!"
