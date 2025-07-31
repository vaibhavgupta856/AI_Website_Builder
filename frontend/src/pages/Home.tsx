import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Code, Sparkles, ArrowRight, Github, Wand2 } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const examplePrompts = [
    "Create a modern landing page for a tech startup",
    "Build a todo app with drag and drop functionality", 
    "Design a restaurant website with menu and booking",
    "Make a portfolio website for a photographer",
    "Create a dashboard for a fitness tracking app"
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      setIsTyping(true);
      setTimeout(() => {
        navigate('/builder', { state: { prompt } });
      }, 500);
    }
  };

  const fillPrompt = (examplePrompt: string) => {
    setPrompt(examplePrompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
      {/* Animated background gradient */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <div className="w-2 h-2 bg-blue-400 rounded-full opacity-20 animate-pulse" />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="p-6 backdrop-blur-sm bg-black/10 border-b border-white/10">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Wand2 className="w-8 h-8 text-yellow-400 animate-pulse" />
                <div className="absolute inset-0 w-8 h-8 bg-yellow-400 rounded-full blur-lg opacity-20 animate-ping" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Website Builder
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>AI-Powered</span>  
                </div>
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Real-time</span>
                </div>
              </div>
              <a href="https://github.com/vaibhavgupta856/AI_Website_Builder" 
                 className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-105">
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            {/* Hero Section */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" />
                <span className="text-blue-300 font-medium">AI-Powered Development</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Build Websites with
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                  AI Magic ✨
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Transform your ideas into beautiful, functional websites in seconds. 
                Just describe what you want, and watch our AI bring it to life.
              </p>
            </div>

            {/* Input Section */}
            <div className="space-y-8">
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe your dream website... ✨"
                      className="w-full h-32 px-6 py-4 text-lg bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-gray-400 transition-all duration-300 resize-none"
                      disabled={isTyping}
                    />
                    <button
                      type="submit"
                      disabled={!prompt.trim() || isTyping}
                      className="absolute bottom-4 right-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 disabled:hover:scale-100 flex items-center space-x-2"
                    >
                      {isTyping ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <span>Generate</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Example Prompts */}
              <div className="space-y-4">
                <p className="text-gray-400 font-medium">✨ Try these examples:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {examplePrompts.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => fillPrompt(example)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-sm text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 backdrop-blur-sm group"
                    >
                      <span className="group-hover:animate-pulse">{example}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: <Code className="w-8 h-8 text-blue-400" />,
                  title: "Smart Code Generation",
                  description: "AI writes clean, production-ready code tailored to your needs"
                },
                {
                  icon: <Zap className="w-8 h-8 text-yellow-400" />,
                  title: "Lightning Fast",
                  description: "From idea to deployment in minutes, not hours or days"
                },
                {
                  icon: <Sparkles className="w-8 h-8 text-purple-400" />,
                  title: "Modern Design",
                  description: "Beautiful, responsive designs that work on all devices"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:border-white/20"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 backdrop-blur-sm bg-black/10 border-t border-white/10">
          <div className="max-w-6xl mx-auto flex justify-center items-center">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Powered by Google Gemini AI</span>
              <span>•</span>
              <span>Built with React & TypeScript</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}