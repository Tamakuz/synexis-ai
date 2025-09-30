import { createGoogleAI, getApiKey, handleAIError } from "../base/ai-utils";
import { PromptEnhancer } from "../../prompt-enhancer";
import { TextGenerationResult } from "@/lib/types/image-ai";

// Pure functions for text processing
export const extractJsonFromText = (text: string): any => {
  const jsonMatch = text?.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error("No valid JSON found in response");
};

export const createStructuredPrompt = (prompt: string, schema: string, context?: string): string => {
  return `${prompt}

Please return the response in this exact JSON format:
${schema}

${context ? `Context: ${context}` : ''}`;
};

// Core text generation functions
export const generateText = async (
  prompt: string,
  context?: string
): Promise<TextGenerationResult> => {
  try {
    const genAI = createGoogleAI({ apiKey: getApiKey() });
    const enhancedPrompt = PromptEnhancer.enhanceForTextGeneration(prompt, context);

    const model = (genAI as any).getGenerativeModel({
      model: "gemini-1.5-flash",
    });
    
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      data: {
        generatedText: text,
        prompt: enhancedPrompt,
      },
    };
  } catch (error) {
    console.error("Google AI text generation error:", error);
    throw new Error("Failed to generate text");
  }
};

export const generateTextWithModel = async (
  prompt: string,
  model: string = "gemini-1.5-flash",
  context?: string
): Promise<TextGenerationResult> => {
  try {
    const genAI = createGoogleAI({ apiKey: getApiKey() });
    const enhancedPrompt = context 
      ? PromptEnhancer.enhanceForTextGeneration(prompt, context)
      : prompt;

    const genModel = (genAI as any).getGenerativeModel({ model });
    const result = await genModel.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      data: {
        generatedText: text,
        prompt: enhancedPrompt,
      },
    };
  } catch (error) {
    console.error(`Google AI text generation error with model ${model}:`, error);
    throw new Error(`Failed to generate text with model ${model}`);
  }
};

export const generateStructuredText = async (
  prompt: string,
  schema: string,
  context?: string
): Promise<any> => {
  try {
    const genAI = createGoogleAI({ apiKey: getApiKey() });
    const structuredPrompt = createStructuredPrompt(prompt, schema, context);

    const model = (genAI as any).getGenerativeModel({
      model: "gemini-1.5-flash",
    });
    
    const result = await model.generateContent(structuredPrompt);
    const response = await result.response;
    const text = response.text();

    return extractJsonFromText(text);
  } catch (error) {
    console.error("Google AI structured text generation error:", error);
    throw new Error("Failed to generate structured text");
  }
};

// Higher-order functions for text generation
export const withRetry = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  maxRetries: number = 3
) => async (...args: T): Promise<R> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn(...args);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries) {
        console.warn(`Attempt ${attempt} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  
  throw lastError!;
};

export const withTimeout = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  timeoutMs: number = 30000
) => async (...args: T): Promise<R> => {
  return Promise.race([
    fn(...args),
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

// Composed functions
export const generateTextWithRetryAndTimeout = withRetry(withTimeout(generateText, 30000), 3);
export const generateStructuredTextWithRetryAndTimeout = withRetry(withTimeout(generateStructuredText, 30000), 3);

// Error handler
export const handleTextGenerationError = (error: any) => handleAIError(error, "text generation");
