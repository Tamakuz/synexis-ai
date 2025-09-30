"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2, ImageIcon, Sparkles, Lightbulb } from "lucide-react";
import { usePromptSuggestions } from "@/lib/hooks/use-prompt-suggestions";
import { PromptCarousel } from "./prompt-carousel";

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  selectedStyle?: string;
}

export function PromptInput({ prompt, setPrompt, isGenerating, onGenerate, selectedStyle }: PromptInputProps) {
  const { generateSuggestions, isLoading, suggestions, error } = usePromptSuggestions();
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Remove automatic API call on component mount
  // Suggestions will only be generated when user clicks the lightbulb button

  const handleSelectPrompt = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
    setShowSuggestions(false);
  };

  const handleRefreshSuggestions = () => {
    generateSuggestions(selectedStyle);
  };

  // Show carousel instead of input when suggestions are active
  if (showSuggestions) {
    return (
      <PromptCarousel
        suggestions={suggestions}
        isLoading={isLoading}
        error={error}
        onSelectPrompt={handleSelectPrompt}
        onClose={() => setShowSuggestions(false)}
        onRefresh={handleRefreshSuggestions}
      />
    );
  }

  return (
    <Card className="bg-[#1A1D23] border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wand2 size={20} className="text-indigo-400" />
            Prompt
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowSuggestions(true);
              // Generate suggestions only when user clicks the button
              if (!suggestions.length && !isLoading) {
                generateSuggestions(selectedStyle);
              }
            }}
            className="text-indigo-400 hover:text-indigo-300"
          >
            <Lightbulb size={16} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate... (💡 Click the lightbulb for AI-powered suggestions)"
            className="w-full h-32 p-3 bg-gray-800 border border-white/10 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-xs text-gray-500 mt-2">
            {prompt.length}/500 characters
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={onGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Sparkles size={16} className="animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <ImageIcon size={16} className="mr-2" />
                Generate Image
              </>
            )}
          </Button>
          
          {prompt && (
            <Button 
              variant="outline"
              onClick={() => setPrompt("")}
              disabled={isGenerating}
              className="px-3"
            >
              Clear
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
