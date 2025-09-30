"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Settings } from "lucide-react";

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  title?: string;
}

export function ErrorDisplay({ error, onRetry, title = "Error" }: ErrorDisplayProps) {
  const isApiKeyError = error.includes('API key') || error.includes('not configured');
  const isNetworkError = error.includes('fetch') || error.includes('network');

  return (
    <Card className="bg-[#1A1D23] border-red-500/30">
      <CardHeader>
        <CardTitle className="text-red-400 flex items-center gap-2">
          <AlertTriangle size={20} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 font-medium mb-2">
            {isApiKeyError ? 'Configuration Error' : 
             isNetworkError ? 'Connection Error' : 
             'Generation Error'}
          </p>
          <p className="text-gray-300 text-sm mb-3">
            {isApiKeyError 
              ? 'Google AI API key is missing or invalid. Please check your environment configuration.'
              : isNetworkError
              ? 'Unable to connect to the AI service. Please check your internet connection.'
              : error
            }
          </p>
          
          {isApiKeyError && (
            <div className="bg-gray-800/50 p-3 rounded border border-white/10 mt-3">
              <p className="text-xs text-gray-400 mb-2">To fix this:</p>
              <ol className="text-xs text-gray-300 space-y-1 list-decimal list-inside">
                <li>Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google AI Studio</a></li>
                <li>Create a <code className="bg-gray-700 px-1 rounded">.env.local</code> file in your project root</li>
                <li>Add: <code className="bg-gray-700 px-1 rounded">GOOGLE_AI_API_KEY=your_key_here</code></li>
                <li>Restart the development server</li>
              </ol>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {onRetry && (
            <Button 
              variant="outline" 
              onClick={onRetry}
              className="flex-1 border-red-500/30 text-red-400 hover:bg-red-900/20"
            >
              <RefreshCw size={16} className="mr-2" />
              Try Again
            </Button>
          )}
          {isApiKeyError && (
            <Button 
              variant="outline"
              onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')}
              className="flex-1 border-indigo-500/30 text-indigo-400 hover:bg-indigo-900/20"
            >
              <Settings size={16} className="mr-2" />
              Get API Key
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
