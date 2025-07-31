#!/bin/bash

# Quick deployment script for Bolt Clone
echo "🚀 Starting Bolt Clone deployment preparation..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing all dependencies..."
npm run install:all

echo "🔨 Building all projects..."
npm run build:all

echo "✅ Build complete! Ready for deployment."
echo ""
echo "Next steps:"
echo "1. For Vercel: Run 'vercel' in both be/ and frontend/ directories"
echo "2. For Railway: Connect your GitHub repo at railway.app"
echo "3. For Netlify: Connect your GitHub repo at netlify.com"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
