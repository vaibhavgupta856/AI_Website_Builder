@echo off
echo 🚀 BOLT CLONE - FREE DEPLOYMENT SCRIPT
echo ========================================
echo.

echo 📋 STEP 1: Login to Vercel
echo Run this command and follow the browser login:
echo   vercel login
echo.
pause

echo 📦 STEP 2: Deploy Backend
echo.
cd be
echo Current directory: %CD%
echo Building backend...
call npm run build

echo.
echo Deploying backend to Vercel...
echo When prompted:
echo   - Project name: bolt-backend
echo   - Directory: ./
echo   - Settings: Just press Enter for defaults
echo.
call vercel --prod

echo.
echo 🔑 STEP 3: Add API Key to Backend
call vercel env add GEMINI_API_KEY production
echo Enter your API key: AIzaSyDctW3TqbqIuJsNXHToRVS8CSgU2sj46Gw

echo.
echo 🔄 STEP 4: Redeploy Backend with API Key
call vercel --prod

echo.
echo 📋 STEP 5: Get Backend URL
call vercel ls
echo.
echo ⚠️  COPY THE BACKEND URL (like https://bolt-backend-xxx.vercel.app)
echo    You'll need it for the frontend!
echo.
pause

cd ..\frontend

echo.
echo 🎨 STEP 6: Deploy Frontend
echo Current directory: %CD%
echo.
echo Deploying frontend to Vercel...
echo When prompted:
echo   - Project name: bolt-frontend  
echo   - Directory: ./
echo   - Settings: Just press Enter for defaults
echo.
call vercel --prod

echo.
echo 🔗 STEP 7: Connect Frontend to Backend
echo Enter your BACKEND URL when prompted:
call vercel env add VITE_BACKEND_URL production

echo.
echo 🔄 STEP 8: Redeploy Frontend
call vercel --prod

echo.
echo ✅ DEPLOYMENT COMPLETE!
echo ========================
echo.
call vercel ls
echo.
echo 🎉 Your Bolt Clone is now LIVE and FREE!
echo    Test it by visiting your frontend URL above
echo.
echo 💡 Try prompts like:
echo    - "Create a simple React hello world app"
echo    - "Build a todo list with React"
echo    - "Make a landing page for a restaurant"
echo.
pause
