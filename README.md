# AI Website Builder 🚀

A full-stack AI-powered code generation tool that creates complete websites from simple text descriptions, built with React, TypeScript, Express, and Google's Gemini AI.

## 🚀 Quick Deploy (FREE)

### Deploy to Vercel (Recommended)

**Backend:**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvaibhavgupta856%2FAI_Website_Builder&project-name=ai-backend&root-directory=be&env=GEMINI_API_KEY&envDescription=Google%20Gemini%20API%20Key&envLink=https%3A%2F%2Faistudio.google.com)

**Frontend:**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvaibhavgupta856%2FAI_Website_Builder&project-name=ai-frontend&root-directory=frontend&env=VITE_BACKEND_URL&envDescription=Backend%20API%20URL&envLink=https%3A%2F%2Fgithub.com%2Fvaibhavgupta856%2FAI_Website_Builder)

### Deploy to Railway + Netlify

**Backend:** [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/ai-backend?referralCode=ai-builder)

**Frontend:** [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/vaibhavgupta856/AI_Website_Builder)

## Features

- 🤖 AI-powered code generation using Google Gemini
- 📁 Interactive file explorer
- 💻 Monaco code editor with syntax highlighting
- 🔄 Real-time preview with WebContainer
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Monaco Editor for code editing
- WebContainer API for in-browser execution
- React Router for navigation

### Backend
- Node.js with Express
- TypeScript
- Google Gemini AI API
- CORS enabled for cross-origin requests

## Prerequisites

- Node.js 18 or higher
- Google Gemini API key ([Get one here](https://aistudio.google.com))

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/vaibhavgupta856/AI_Website_Builder.git
   cd AI_Website_Builder
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Backend (.env in `be/` folder):
   ```bash
   cd be
   cp .env.example .env
   # Edit .env and add your Gemini API key
   ```
   
   Frontend (.env in `frontend/` folder):
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env if needed (defaults to localhost:3000)
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```
   
   This starts both backend (http://localhost:3000) and frontend (http://localhost:5173)

## Manual Development Setup

### Backend
```bash
cd be
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Building for Production

```bash
npm run build:all
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment instructions covering:
- Vercel
- Netlify
- Railway
- Docker
- And more platforms

## Usage

1. Visit the application in your browser
2. Enter a prompt describing what you want to build
3. Watch as the AI generates code files
4. View the generated files in the file explorer
5. Edit code in the Monaco editor
6. See live preview in the WebContainer

## Example Prompts

- "Create a simple React hello world app"
- "Build a todo list with add, delete, and toggle functionality"
- "Make a landing page for a coffee shop with hero section and menu"
- "Create a weather app that shows current conditions"

## API Endpoints

### Backend API

- `POST /template` - Determines project type (React/Node)
- `POST /chat` - Processes AI prompts and generates code

## Project Structure

```
├── be/                     # Backend Express server
│   ├── src/
│   │   ├── index.ts       # Main server file
│   │   ├── prompts.ts     # AI prompts and system instructions
│   │   ├── constants.ts   # Configuration constants
│   │   └── defaults/      # Default project templates
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── types/         # TypeScript types
│   │   └── config.ts      # Frontend configuration
│   ├── package.json
│   └── vite.config.ts
├── DEPLOYMENT.md          # Deployment instructions
└── README.md             # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Troubleshooting

### Common Issues

1. **API Quota Exceeded**: Upgrade your Gemini API plan or wait for quota reset
2. **CORS Errors**: Ensure backend is running and accessible
3. **WebContainer Issues**: Check browser compatibility and clear cache
4. **Build Failures**: Ensure all dependencies are installed

### Getting Help

- Check the [DEPLOYMENT.md](DEPLOYMENT.md) guide
- Review console logs for error details
- Ensure API keys are properly configured
- Verify all dependencies are installed

## Acknowledgments

- Built with modern web technologies and AI
- Uses Google's Gemini AI for code generation
- WebContainer API for in-browser execution
- React ecosystem for the frontend
