@echo off
echo 🚀 Deploying Bolt Clone to Vercel (FREE)...
echo.

echo 📦 Step 1: Building backend...
cd be
call npm run build

echo.
echo 🌐 Step 2: Deploying backend to Vercel...
echo ⚠️  When prompted:
echo    - Set up and deploy? Y
echo    - Which scope? Choose your account
echo    - Link to existing project? N
echo    - Project name? bolt-backend (or any name you like)
echo    - In which directory is your code located? ./
echo.
pause
call vercel --prod

echo.
echo 📝 Step 3: Setting environment variable...
echo ⚠️  You'll need to add your Gemini API key
echo    Your API key: AIzaSyDctW3TqbqIuJsNXHToRVS8CSgU2sj46Gw
pause
call vercel env add GEMINI_API_KEY
call vercel --prod

echo.
echo 📋 Step 4: Getting backend URL...
call vercel ls
echo.
echo ⚠️  Copy your backend URL (something like https://bolt-backend-xxx.vercel.app)
echo    We'll need it for the frontend deployment
pause

cd ..

echo.
echo 🎨 Step 5: Deploying frontend...
cd frontend

echo.
echo 🌐 Step 6: Deploying frontend to Vercel...
echo ⚠️  When prompted:
echo    - Set up and deploy? Y
echo    - Which scope? Choose your account  
echo    - Link to existing project? N
echo    - Project name? bolt-frontend (or any name you like)
echo    - In which directory is your code located? ./
echo.
pause
call vercel --prod

echo.
echo 📝 Step 7: Setting frontend environment variable...
echo ⚠️  Enter your backend URL when prompted (from Step 4)
pause
call vercel env add VITE_BACKEND_URL
call vercel --prod

echo.
echo ✅ Deployment Complete!
echo.
echo 🎉 Your Bolt Clone is now live on Vercel!
echo    - Backend: Check 'vercel ls' output
echo    - Frontend: Check 'vercel ls' output
echo.
echo 📖 Test it by visiting your frontend URL and creating a simple app!
pause
