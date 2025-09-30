"use client";

import React, { useState, useCallback } from "react";
import {
  VideoGenerationRequest,
  VideoGenerationResult,
} from "@/lib/types/video-ai";

export function useVideoGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VideoGenerationResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  const generateVideo = useCallback(async (request: VideoGenerationRequest) => {
    setIsGenerating(true);
    setError(null);
    setResult(null);
    setProgress(0);
    setStatusMessage("Starting video generation...");

    try {
      console.log("Sending video generation request...");
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 90) {
            const increment = Math.random() * 5 + 1;
            const newProgress = Math.min(prev + increment, 90);
            
            // Update status message based on progress
            if (newProgress < 20) {
              setStatusMessage("Initializing video generation...");
            } else if (newProgress < 50) {
              setStatusMessage("Processing video content...");
            } else if (newProgress < 80) {
              setStatusMessage("Rendering video frames...");
            } else {
              setStatusMessage("Finalizing video...");
            }
            
            return newProgress;
          }
          return prev;
        });
      }, 2000);

      const response = await fetch("/api/video-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate video");
      }

      const result: VideoGenerationResult = await response.json();
      
      console.log("Video generation completed successfully!");
      
      setProgress(100);
      setStatusMessage("Video generated successfully!");
      setResult(result);
      setIsGenerating(false);

      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      setIsGenerating(false);
      setStatusMessage("generation failed");
      
      console.error("Video generation error:", errorMessage);
      
      throw err;
    }
  }, []);

  const cancelGeneration = useCallback(() => {
    setIsGenerating(false);
    setStatusMessage("Generation cancelled");
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setResult(null);
    setIsGenerating(false);
    setProgress(0);
    setStatusMessage("");
  }, []);

  const retry = useCallback(() => {
    if (result?.data.originalPrompt) {
      const request: VideoGenerationRequest = {
        prompt: result.data.originalPrompt,
        style: result.data.style,
        duration: result.data.duration,
        aspectRatio: result.data.aspectRatio as "16:9" | "9:16",
        negativePrompt: result.data.negativePrompt,
        personGeneration: result.data.personGeneration as "allow_all" | "allow_adult" | "dont_allow",
      };
      
      return generateVideo(request);
    }
  }, [result, generateVideo]);

  return {
    generateVideo,
    cancelGeneration,
    retry,
    reset,
    isGenerating,
    error,
    result,
    progress,
    statusMessage,
  };
}
