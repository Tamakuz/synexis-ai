"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Check, X, Sparkles, Video } from "lucide-react";
import { VideoPromptSuggestion } from "@/lib/types/video-ai";

interface VideoPromptCarouselProps {
  suggestions: VideoPromptSuggestion[];
  isLoading: boolean;
  error: string | null;
  onSelectPrompt: (prompt: string) => void;
  onClose: () => void;
  onRefresh: () => void;
}

export function VideoPromptCarousel({
  suggestions,
  isLoading,
  error,
  onSelectPrompt,
  onClose,
  onRefresh,
}: VideoPromptCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSuggestion = () => {
    setCurrentIndex((prev) => (prev + 1) % suggestions.length);
  };

  const prevSuggestion = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + suggestions.length) % suggestions.length
    );
  };

  const handleSelectPrompt = () => {
    if (suggestions[currentIndex]) {
      onSelectPrompt(suggestions[currentIndex].fullPrompt);
      onClose();
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-[#1A1D23] border-indigo-500/30">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
              <Video size={32} className="text-indigo-400 animate-pulse mx-auto relative z-10" />
            </div>
            <p className="text-white font-medium mb-2">
              Generating creative video prompts...
            </p>
            <p className="text-gray-400 text-sm">This may take a moment</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-[#1A1D23] border-red-500/30">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-400 font-medium mb-2">
              Failed to load video suggestions
            </p>
            <p className="text-gray-400 text-sm mb-4">
              {error.includes("API key")
                ? "AI API key is not configured"
                : error}
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="text-red-400 border-red-500/30 hover:bg-red-900/20"
              >
                Try Again
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400"
              >
                Close
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!suggestions.length) {
    return (
      <Card className="bg-[#1A1D23] border-white/10">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-gray-400 mb-4">No video suggestions available</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={onRefresh}>
                Generate Suggestions
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400"
              >
                Close
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentSuggestion = suggestions[currentIndex];

  return (
    <Card className="bg-[#1A1D23] border-indigo-500/30">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Video size={16} className="text-indigo-400" />
            <span className="text-white font-medium">Video Prompt Suggestions</span>
            <span className="text-gray-400 text-sm">
              {currentIndex + 1} of {suggestions.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={16} />
          </Button>
        </div>

        {/* Carousel Content */}
        <div className="space-y-4">
          {/* Main Prompt */}
          <div className="p-4 bg-gray-800/50 rounded-lg border border-white/10">
            <p className="text-white font-medium mb-3">
              {currentSuggestion.fullPrompt}
            </p>

            {/* Breakdown */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start gap-2">
                <span className="text-indigo-400 text-xs font-medium min-w-[60px]">
                  SUBJECT:
                </span>
                <span className="text-gray-300 text-sm">
                  {currentSuggestion.subject}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-violet-400 text-xs font-medium min-w-[60px]">
                  ACTION:
                </span>
                <span className="text-gray-300 text-sm">
                  {currentSuggestion.action}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 text-xs font-medium min-w-[60px]">
                  SETTING:
                </span>
                <span className="text-gray-300 text-sm">
                  {currentSuggestion.setting}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-pink-400 text-xs font-medium min-w-[60px]">
                  STYLE:
                </span>
                <span className="text-gray-300 text-sm">
                  {currentSuggestion.style}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSuggestion}
              disabled={suggestions.length <= 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft size={16} />
              Previous
            </Button>

            <div className="flex gap-1">
              {suggestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-indigo-400" : "bg-gray-600"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextSuggestion}
              disabled={suggestions.length <= 1}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSelectPrompt}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            >
              <Check size={16} className="mr-2" />
              Select This Prompt
            </Button>
            <Button variant="outline" onClick={onRefresh} className="px-4">
              <Sparkles size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
