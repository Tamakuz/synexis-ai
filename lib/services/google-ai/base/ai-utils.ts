import { GoogleGenAI } from "@google/genai";

// Types
export interface AIConfig {
  apiKey: string;
}

export interface AIError {
  message: string;
  details: string;
}

// Core utilities
export const createGoogleAI = (config: AIConfig): GoogleGenAI => {
  if (!config.apiKey) {
    throw new Error("NEXT_PUBLIC_GOOGLE_AI_API_KEY environment variable is not set");
  }
  
  return new GoogleGenAI({
    apiKey: config.apiKey,
  });
};

export const getApiKey = (): string => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("AI service is not properly configured. Please check API keys.");
  }
  return apiKey;
};

export const validateApiKey = (): void => {
  getApiKey(); // Will throw if not valid
};

// Error handling utilities
export const handleAIError = (error: any, operation: string): AIError => {
  const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
  console.error(`${operation} error:`, errorMessage);

  let userMessage = `Failed to ${operation.toLowerCase()}`;
  if (errorMessage.includes("API key")) {
    userMessage = "AI service is not properly configured. Please check API keys.";
  } else if (errorMessage.includes("quota") || errorMessage.includes("limit")) {
    userMessage = "Service quota exceeded. Please try again later.";
  } else if (errorMessage.includes("network") || errorMessage.includes("timeout")) {
    userMessage = "Network error. Please check your connection and try again.";
  }

  return {
    message: userMessage,
    details: errorMessage
  };
};

// Async utilities
export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxAttempts) {
        await delay(delayMs * attempt);
      }
    }
  }
  
  throw lastError!;
};

// Functional composition utilities
export const pipe = <T>(...fns: Array<(arg: T) => T>) => (value: T): T =>
  fns.reduce((acc, fn) => fn(acc), value);

export const compose = <T>(...fns: Array<(arg: T) => T>) => (value: T): T =>
  fns.reduceRight((acc, fn) => fn(acc), value);
