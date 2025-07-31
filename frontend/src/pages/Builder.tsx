import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StepsList } from '../components/StepsList';
import { FileExplorer } from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import { CodeEditor } from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import { Step, FileItem, StepType } from '../types';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parseXml } from '../steps';
import { useWebContainer } from '../hooks/useWebContainer';
import { Loader } from '../components/Loader';
import { ArrowLeft, Send, Sparkles, Code, Eye, Zap, Download } from 'lucide-react';
import JSZip from 'jszip';

type MountStructure = {
  [key: string]: {
    file?: { contents: string };
    directory?: MountStructure;
  };
};

export function Builder() {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{role: "user" | "assistant", content: string;}[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  
  const [steps, setSteps] = useState<Step[]>([]);

  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({status}) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure = [...originalFiles]; // {}
        const finalAnswerRef = currentFileStructure;
  
        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
          const currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
            // final file
            const file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            /// in a folder
            const folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              // create the folder
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }
  
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }

    })

    if (updateHappened) {

      setFiles(originalFiles)
      setSteps(steps => steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }
        
      }))
    }
    console.log(files);
  }, [steps, files]);

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): MountStructure => {
      const mountStructure: MountStructure = {};
  
      const processFile = (file: FileItem, isRootFolder: boolean) => {  
        if (file.type === 'folder') {
          // For folders, create a directory entry
          mountStructure[file.name] = {
            directory: file.children ? 
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              ) 
              : {}
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || ''
              }
            };
          } else {
            // For files, create a file entry with contents
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }
  
        return mountStructure[file.name];
      };
  
      // Process each top-level file/folder
      files.forEach(file => processFile(file, true));
  
      return mountStructure;
    };
  
    const mountStructure = createMountStructure(files);
  
    // Mount the structure if WebContainer is available
    console.log(mountStructure);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webcontainer?.mount(mountStructure as any);
  }, [files, webcontainer]);

  const init = useCallback(async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/template`, {
        prompt: prompt.trim()
      });
      setTemplateSet(true);
      
      const {prompts, uiPrompts} = response.data;
      console.log("Template response:", response.data);
      console.log("UI Prompts:", uiPrompts);

      const initialSteps = parseXml(uiPrompts[0]);
      console.log("Parsed initial steps:", initialSteps);
      
      setSteps(initialSteps.map((x: Step) => ({
        ...x,
        status: "pending"
      })));

      setLoading(true);
      const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
        messages: [...prompts, prompt].map(content => ({
          role: "user",
          content
        }))
      });

      setLoading(false);
      
      console.log("Chat response:", stepsResponse.data.response);
      
      const generatedSteps = parseXml(stepsResponse.data.response);
      console.log("Parsed generated steps:", generatedSteps);

      setSteps(s => [...s, ...generatedSteps.map(x => ({
        ...x,
        status: "pending" as const
      }))]);

      setLlmMessages([...prompts, prompt].map(content => ({
        role: "user",
        content
      })));

      setLlmMessages(x => [...x, {role: "assistant", content: stepsResponse.data.response}]);
    } catch (error: unknown) {
      setLoading(false);
      console.error("Error during initialization:", error);
      
      // Handle API quota errors specifically
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { status: number; data: { message?: string } } };
        if (axiosError.response?.status === 429) {
          const errorData = axiosError.response.data;
          alert(`API Quota Exceeded: ${errorData.message}\n\nThe system has reached its daily API limit. Please try again tomorrow or contact the administrator to upgrade the plan.`);
        } else if (axiosError.response?.status >= 400) {
          const errorData = axiosError.response.data;
          alert(`API Error: ${errorData.message || 'Request failed'}\n\nPlease try again or contact support if the problem persists.`);
        } else {
          alert("Network Error: Unable to connect to the server. Please check your connection and try again.");
        }
      } else {
        alert("Network Error: Unable to connect to the server. Please check your connection and try again.");
      }
    }
  }, [prompt]);

  // Function to download all files as ZIP
  const downloadProject = useCallback(async () => {
    if (files.length === 0) {
      alert('No files to download yet. Please generate some code first!');
      return;
    }

    try {
      const zip = new JSZip();
      
      // Add all files to the ZIP
      files.forEach(file => {
        if (file.type === 'file' && file.content) {
          // Remove leading slash from path for cleaner ZIP structure
          const cleanPath = file.path.startsWith('/') ? file.path.slice(1) : file.path;
          zip.file(cleanPath, file.content);
        }
      });

      // Generate ZIP file
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Create download link
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-website-project-${Date.now()}.zip`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating ZIP file:', error);
      alert('Failed to create ZIP file. Please try again.');
    }
  }, [files]);

  useEffect(() => {
    init();
  }, [init])

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900 to-black"></div>
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-blue-500/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 4}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 glass border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            <div className="h-6 w-px bg-white/20"></div>
            <div className="flex items-center space-x-2">
              <Sparkles className="text-purple-400" size={24} />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Website Builder
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-white/60">
              <Zap size={16} className="text-yellow-400" />
              <span>Building with AI</span>
            </div>
            <button
              onClick={downloadProject}
              className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 btn-glow text-sm"
              disabled={files.length === 0}
            >
              <Download size={16} />
              <span>Download ZIP</span>
            </button>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-sm text-white/60 bg-black/20 px-3 py-1 rounded-full inline-flex items-center">
            <Sparkles size={14} className="mr-2 text-purple-400" />
            Prompt: {prompt}
          </p>
        </div>
      </header>
      
      <div className="relative z-10 flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-12 gap-6 p-6">
          {/* Steps & Input Section */}
          <div className="col-span-3 space-y-4">
            <div className="glass rounded-xl p-4 h-[calc(100vh-12rem)] flex flex-col">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500">
                  <Code size={16} className="text-white" />
                </div>
                <h2 className="font-semibold text-white">Build Steps</h2>
              </div>
              
              <div className="flex-1 overflow-auto mb-4 custom-scrollbar">
                <StepsList
                  steps={steps}
                  currentStep={currentStep}
                  onStepClick={setCurrentStep}
                />
              </div>

              {/* Chat Input */}
              <div className="border-t border-white/10 pt-4">
                {(loading || !templateSet) ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader />
                    <span className="ml-3 text-white/60">Generating your website...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/80">Refine your website:</label>
                    <div className="flex space-x-2">
                      <textarea
                        value={userPrompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ask for changes or improvements..."
                        className="flex-1 px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 resize-none"
                        rows={3}
                      />
                      <button
                        onClick={async () => {
                          const newMessage = {
                            role: "user" as const,
                            content: userPrompt
                          };

                          setLoading(true);
                          const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
                            messages: [...llmMessages, newMessage]
                          });
                          setLoading(false);

                          setLlmMessages(x => [...x, newMessage]);
                          setLlmMessages(x => [...x, {
                            role: "assistant",
                            content: stepsResponse.data.response
                          }]);
                          
                          setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
                            ...x,
                            status: "pending" as const
                          }))]);
                          
                          setPrompt("");
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 flex items-center space-x-2 btn-glow"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* File Explorer */}
          <div className="col-span-3">
            <div className="glass rounded-xl p-4 h-[calc(100vh-12rem)]">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500">
                  <Code size={16} className="text-white" />
                </div>
                <h2 className="font-semibold text-white">Project Files</h2>
              </div>
              <div className="h-[calc(100%-3rem)] overflow-auto">
                <FileExplorer 
                  files={files} 
                  onFileSelect={setSelectedFile}
                />
              </div>
            </div>
          </div>

          {/* Code Editor & Preview */}
          <div className="col-span-6">
            <div className="glass rounded-xl p-4 h-[calc(100vh-12rem)] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                    {activeTab === 'code' ? <Code size={16} className="text-white" /> : <Eye size={16} className="text-white" />}
                  </div>
                  <h2 className="font-semibold text-white">
                    {activeTab === 'code' ? 'Code Editor' : 'Live Preview'}
                  </h2>
                </div>
                <TabView activeTab={activeTab} onTabChange={setActiveTab} />
              </div>
              
              <div className="flex-1 rounded-lg overflow-hidden bg-black/20 border border-white/10">
                {activeTab === 'code' ? (
                  <CodeEditor file={selectedFile} />
                ) : (
                  <PreviewFrame webContainer={webcontainer} files={files} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}