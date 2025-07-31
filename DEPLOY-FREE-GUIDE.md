# 🚀 FREE Deployment Guide - Step by Step

Follow these exact steps to deploy your Bolt Clone for FREE on Vercel:

## Part 1: Deploy Backend (5 minutes)

1. **Open a terminal in the backend directory:**
   ```cmd
   cd "c:\Users\conan\Downloads\bolt.newer-main (1)\bolt.newer-main\be"
   ```

2. **Build the backend:**
   ```cmd
   npm run build
   ```

3. **Deploy to Vercel:**
   ```cmd
   vercel --prod
   ```
   
   **When prompted, answer:**
   - `Set up and deploy?` → **Y**
   - `Which scope?` → Choose your account (usually first option)
   - `Link to existing project?` → **N**
   - `What's your project's name?` → **bolt-backend** (or any name)
   - `In which directory is your code located?` → **./** (just press Enter)

4. **Add your API key:**
   ```cmd
   vercel env add GEMINI_API_KEY
   ```
   
   **When prompted:**
   - `What's the value of GEMINI_API_KEY?` → **AIzaSyCLz5CayaSpMGwvnD4ROpB1rD6776grMI4**
   - `Add to which environments?` → **Production** (press Space, then Enter)

5. **Redeploy with environment variable:**
   ```cmd
   vercel --prod
   ```

6. **Get your backend URL:**
   ```cmd
   vercel ls
   ```
   
   **Copy the URL** (something like: `https://bolt-backend-abc123.vercel.app`)

## Part 2: Deploy Frontend (3 minutes)

1. **Open a new terminal in the frontend directory:**
   ```cmd
   cd "c:\Users\conan\Downloads\bolt.newer-main (1)\bolt.newer-main\frontend"
   ```

2. **Deploy to Vercel:**
   ```cmd
   vercel --prod
   ```
   
   **When prompted, answer:**
   - `Set up and deploy?` → **Y**
   - `Which scope?` → Choose your account (same as before)
   - `Link to existing project?` → **N**
   - `What's your project's name?` → **bolt-frontend** (or any name)
   - `In which directory is your code located?` → **./** (just press Enter)

3. **Add backend URL to frontend:**
   ```cmd
   vercel env add VITE_BACKEND_URL
   ```
   
   **When prompted:**
   - `What's the value of VITE_BACKEND_URL?` → **[PASTE YOUR BACKEND URL FROM STEP 6 ABOVE]**
   - `Add to which environments?` → **Production** (press Space, then Enter)

4. **Redeploy with environment variable:**
   ```cmd
   vercel --prod
   ```

5. **Get your frontend URL:**
   ```cmd
   vercel ls
   ```

## 🎉 You're Done!

Your Bolt Clone is now live and FREE on Vercel!

- **Backend API:** Your backend URL from Part 1, Step 6
- **Frontend App:** Your frontend URL from Part 2, Step 5

## 🧪 Test Your Deployment

1. Visit your frontend URL
2. Enter a prompt like: "Create a simple React hello world app"
3. Watch the magic happen!

## 💰 Cost: $0/month

Both deployments are on Vercel's free tier:
- Generous free usage limits
- Custom domains available
- Automatic HTTPS
- Global CDN

## 🆘 Need Help?

If anything goes wrong:
1. Check that both URLs are accessible
2. Verify environment variables are set: `vercel env ls`
3. Check logs: `vercel logs [your-deployment-url]`

---

**Total time: ~8 minutes**  
**Cost: FREE** ✅
