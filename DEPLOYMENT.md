# Bolt.js Clone - Deployment Guide

This guide covers deploying both the frontend and backend of your Bolt.js clone to various platforms.

## Project Structure
```
├── be/          # Backend (Express + TypeScript + Gemini AI)
├── frontend/    # Frontend (React + TypeScript + Vite)
```

## Prerequisites
- Node.js 18+ installed
- Gemini API key from Google AI Studio
- Git repository (recommended)

## Backend Deployment Options

### Option 1: Vercel (Recommended for Backend)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to backend directory:
   ```bash
   cd be
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. Set environment variable:
   ```bash
   vercel env add GEMINI_API_KEY
   ```
   Enter your Gemini API key when prompted.

6. Redeploy to apply environment variables:
   ```bash
   vercel --prod
   ```

### Option 2: Railway

1. Visit [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select the `be` folder as the root directory
4. Add environment variable: `GEMINI_API_KEY`
5. Deploy automatically

### Option 3: Render

1. Visit [Render.com](https://render.com)
2. Create a new Web Service
3. Connect your repository
4. Set root directory to `be`
5. Build command: `npm run build`
6. Start command: `npm start`
7. Add environment variable: `GEMINI_API_KEY`

### Option 4: Docker (Any Container Platform)

1. Build Docker image:
   ```bash
   cd be
   docker build -t bolt-backend .
   ```

2. Run locally:
   ```bash
   docker run -p 3000:3000 -e GEMINI_API_KEY=your_api_key bolt-backend
   ```

3. Deploy to any container platform (AWS ECS, Google Cloud Run, etc.)

## Frontend Deployment Options

### Option 1: Vercel (Recommended for Frontend)

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Set environment variable for your deployed backend:
   ```bash
   echo "VITE_BACKEND_URL=https://your-backend-url.vercel.app" > .env
   ```

3. Deploy:
   ```bash
   vercel
   ```

### Option 2: Netlify

1. Visit [Netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Set build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
4. Add environment variable: `VITE_BACKEND_URL=https://your-backend-url`

### Option 3: GitHub Pages

1. Install gh-pages:
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

2. Add to package.json scripts:
   ```json
   "homepage": "https://yourusername.github.io/your-repo-name",
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

## Complete Deployment Steps

### Step 1: Deploy Backend First

1. Choose a backend deployment platform (Vercel recommended)
2. Deploy your backend
3. Note the deployed backend URL (e.g., `https://your-app.vercel.app`)

### Step 2: Configure Frontend

1. Update frontend environment:
   ```bash
   cd frontend
   echo "VITE_BACKEND_URL=https://your-backend-url" > .env
   ```

### Step 3: Deploy Frontend

1. Choose a frontend deployment platform
2. Deploy your frontend
3. Make sure to set the `VITE_BACKEND_URL` environment variable

### Step 4: Test Your Deployment

1. Visit your deployed frontend URL
2. Try creating a simple prompt like "Create a hello world React app"
3. Verify that files are generated and preview works

## Environment Variables

### Backend (.env)
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend (.env)
```
VITE_BACKEND_URL=https://your-backend-url
```

## Troubleshooting

### CORS Issues
If you encounter CORS errors, make sure your backend is configured to accept requests from your frontend domain.

### API Quota Issues
Monitor your Gemini API usage and upgrade your plan if needed.

### Build Failures
Ensure all dependencies are installed and TypeScript compiles successfully before deployment.

## Cost Considerations

- **Vercel**: Free tier available, pay for usage above limits
- **Netlify**: Free tier available for static sites
- **Railway**: $5/month minimum, good for backend services
- **Gemini API**: Free tier with daily limits, pay-per-use above limits

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive configuration
- Consider implementing rate limiting in production
- Monitor API usage and costs regularly

## Scaling Considerations

- For high traffic, consider using a CDN for the frontend
- Backend may need horizontal scaling for many concurrent users
- Database integration may be needed for user sessions/history
- Consider implementing caching for better performance
