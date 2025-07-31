#!/bin/bash

# Vercel Deployment Troubleshooter
echo "🔧 AI Website Builder - Vercel Deployment Troubleshooter"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo ""
echo "📋 Pre-deployment Checklist:"
echo ""

# Check if frontend builds successfully
echo "1️⃣  Testing frontend build..."
cd frontend
if npm run build; then
    echo "✅ Frontend builds successfully"
else
    echo "❌ Frontend build failed - fix errors before deploying"
    exit 1
fi
cd ..

# Check if backend builds successfully
echo ""
echo "2️⃣  Testing backend build..."
cd be
if npm run build; then
    echo "✅ Backend builds successfully"
else
    echo "❌ Backend build failed - fix errors before deploying"
    exit 1
fi
cd ..

echo ""
echo "✅ All builds successful! Ready for Vercel deployment."
echo ""
echo "🚀 Next Steps for Vercel:"
echo "========================="
echo ""
echo "FRONTEND DEPLOYMENT:"
echo "1. Go to vercel.com and create NEW PROJECT"
echo "2. Import your GitHub repository"
echo "3. Set Root Directory: 'frontend'"
echo "4. Framework Preset: 'Vite'"
echo "5. Click Deploy"
echo ""
echo "BACKEND DEPLOYMENT:"
echo "1. Create ANOTHER NEW PROJECT on Vercel"
echo "2. Import the SAME GitHub repository"
echo "3. Set Root Directory: 'be'"
echo "4. Framework Preset: 'Other'"
echo "5. Add Environment Variable:"
echo "   GEMINI_API_KEY = AIzaSyDctW3TqbqIuJsNXHToRVS8CSgU2sj46Gw"
echo "6. Click Deploy"
echo ""
echo "⚠️  IMPORTANT: Deploy as TWO SEPARATE PROJECTS, not one!"
echo ""
echo "💡 If deployment gets stuck:"
echo "- Cancel the deployment"
echo "- Check Root Directory is set correctly"
echo "- Make sure you're not deploying the entire repo"
echo "- Deploy frontend and backend separately"
