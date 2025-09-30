"use client";

import { useState } from "react";
import {
  VideoPromptSuggestionsResult,
  VideoPromptSuggestion,
} from "@/lib/types/video-ai";

export function useVideoPromptSuggestions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<VideoPromptSuggestion[]>([]);

  const generateSuggestions = async (style?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = style
        ? `/api/video-prompt-suggestions?style=${encodeURIComponent(style)}`
        : "/api/video-prompt-suggestions";

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate video suggestions");
      }

      const data: VideoPromptSuggestionsResult = await response.json();
      setSuggestions(data.data.suggestions);
      return data.data.suggestions;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuggestions([]);
    setIsLoading(false);
  };

  return {
    generateSuggestions,
    isLoading,
    error,
    suggestions,
    reset,
  };
}
