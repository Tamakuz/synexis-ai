"use client";

import { useState } from "react";
import {
  ImageGenerationResult,
  ImageGenerationRequest,
} from "@/lib/types/image-ai";

export function useImageGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImageGenerationResult | null>(null);

  const generateImage = async (request: ImageGenerationRequest) => {
    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/image-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...request,
          model: request.model || "google-gemini",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data: ImageGenerationResult = await response.json();
      setResult(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setError(null);
    setResult(null);
    setIsGenerating(false);
  };

  return {
    generateImage,
    isGenerating,
    error,
    result,
    reset,
  };
}
