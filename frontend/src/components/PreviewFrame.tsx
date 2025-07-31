import { WebContainer } from '@webcontainer/api';
import { useEffect, useState, useCallback } from 'react';
import { FileItem } from '../types';

interface PreviewFrameProps {
  files: FileItem[];
  webContainer: WebContainer | undefined;
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const main = useCallback(async () => {
    if (!webContainer) {
      console.log("WebContainer not ready yet");
      return;
    }

    if (files.length === 0) {
      console.log("No files to mount yet");
      return;
    }

    if (isProcessing || hasStarted) {
      console.log("Already processing or started...");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log("Files available:", files.length);
      
      // Check if package.json exists
      const hasPackageJson = files.some(file => 
        file.name === 'package.json' || 
        (file.children && file.children.some(child => child.name === 'package.json'))
      );
      
      if (!hasPackageJson) {
        console.log("No package.json found, skipping npm commands");
        setIsProcessing(false);
        return;
      }

      console.log("Starting npm install...");
      const installProcess = await webContainer.spawn('npm', ['install']);

      installProcess.output.pipeTo(new WritableStream({
        write(data) {
          console.log("npm install:", data);
        }
      }));

      // Wait for install to complete
      const installExitCode = await installProcess.exit;
      console.log(`npm install completed with exit code: ${installExitCode}`);

      if (installExitCode !== 0) {
        console.error("npm install failed");
        setError("npm install failed");
        setIsProcessing(false);
        return;
      }

      console.log("Starting dev server...");
      const devProcess = await webContainer.spawn('npm', ['run', 'dev']);

      devProcess.output.pipeTo(new WritableStream({
        write(data) {
          console.log("Dev server output:", data);
        }
      }));

      // Wait for `server-ready` event
      webContainer.on('server-ready', (port, url) => {
        console.log("Server ready on port:", port, "URL:", url);
        setUrl(url);
        setIsProcessing(false);
        setHasStarted(true);
      });

      // Set timeout to avoid hanging
      setTimeout(() => {
        if (!url && isProcessing) {
          console.log("Timeout waiting for server");
          setError("Server startup timeout");
          setIsProcessing(false);
        }
      }, 30000); // 30 second timeout

    } catch (error) {
      console.error("Error in PreviewFrame:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      setIsProcessing(false);
    }
  }, [webContainer, files, isProcessing, hasStarted, url]);

  useEffect(() => {
    if (webContainer && files.length > 0 && !hasStarted) {
      main();
    }
  }, [webContainer, files, main, hasStarted])
  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {error && (
        <div className="text-center text-red-400">
          <p className="mb-2">Error: {error}</p>
          <p className="text-sm">Try refreshing the page</p>
        </div>
      )}
      {!url && !error && (
        <div className="text-center">
          <p className="mb-2">
            {isProcessing ? "Starting development server..." : "Loading WebContainer..."}
          </p>
          <p className="text-sm text-gray-500">
            {files.length > 0 ? `${files.length} files ready` : "Waiting for files..."}
          </p>
        </div>
      )}
      {url && <iframe width={"100%"} height={"100%"} src={url} />}
    </div>
  );
}