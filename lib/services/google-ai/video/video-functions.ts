import { GoogleGenAI } from "@google/genai";
import { createGoogleAI, getApiKey, handleAIError, delay } from "../base/ai-utils";
import {
  VideoGenerationRequest,
  VideoGenerationResult,
  VideoGenerationStatus,
  VideoPromptSuggestionsResult,
} from "@/lib/types/video-ai";

// Types
interface VideoOperation {
  operation: any;
  enhancedPrompt: string;
  negativePrompt: string;
  modelName: string;
}

interface ModelConfig {
  "synexis-ultra": string;
  "synexis-pro": string;
}

// Constants
const MODEL_MAPPING: ModelConfig = {
  "synexis-ultra": "veo-3.0-generate-001",
  "synexis-pro": "veo-2.0-generate-001"
};

const STYLE_ENHANCEMENTS = {
  cinematic: "cinematic lighting, professional cinematography, film grain, shallow depth of field",
  realistic: "photorealistic, natural lighting, documentary style, authentic movement",
  anime: "anime style, vibrant colors, stylized animation, smooth motion",
  artistic: "artistic composition, creative lighting, stylized visuals, expressive movement",
  abstract: "abstract visuals, experimental cinematography, creative transitions, artistic flow",
} as const;

const NEGATIVE_PROMPTS = {
  cinematic: "amateur lighting, handheld shakiness, poor composition",
  realistic: "cartoonish, anime style, exaggerated expressions, unrealistic physics",
  anime: "photorealistic, live action, documentary style",
  artistic: "generic composition, boring visuals, lack of creativity",
  abstract: "literal representation, conventional cinematography",
} as const;

// Pure functions for prompt enhancement
export const enhanceVideoPrompt = (prompt: string, style: string): string => {
  const enhancement = STYLE_ENHANCEMENTS[style as keyof typeof STYLE_ENHANCEMENTS] || STYLE_ENHANCEMENTS.cinematic;
  return `${prompt}. ${enhancement}. High quality video, smooth motion, professional production value.`;
};

export const generateNegativePrompt = (style: string): string => {
  const baseNegative = "low quality, blurry, pixelated, distorted, glitchy, artifacts, watermark, text overlay, logo";
  const specific = NEGATIVE_PROMPTS[style as keyof typeof NEGATIVE_PROMPTS] || "";
  return `${baseNegative}, ${specific}`;
};

export const getModelConfig = (model?: string) => {
  const selectedModel = MODEL_MAPPING[model as keyof typeof MODEL_MAPPING] || "veo-3.0-generate-001";
  const modelName = model === "synexis-pro" ? "Synexis Pro (Veo 2)" : "Synexis Ultra (Veo 3)";
  return { selectedModel, modelName };
};

// Core video generation functions
export const startVideoGeneration = async (request: VideoGenerationRequest): Promise<VideoOperation> => {
  try {
    const genAI = createGoogleAI({ apiKey: getApiKey() });
    
    const enhancedPrompt = enhanceVideoPrompt(request.prompt, request.style);
    const negativePrompt = request.negativePrompt || generateNegativePrompt(request.style);
    const { selectedModel, modelName } = getModelConfig(request.model);
    
    console.log(`Starting video generation with ${modelName}...`);

    const operation = await genAI.models.generateVideos({
      model: selectedModel,
      prompt: enhancedPrompt,
      config: {
        numberOfVideos: 1,
        aspectRatio: request.aspectRatio,
        durationSeconds: parseInt(request.duration) || 8,
        personGeneration: request.personGeneration || "allow_all",
        negativePrompt: negativePrompt,
      },
    });

    return {
      operation,
      enhancedPrompt,
      negativePrompt,
      modelName
    };
  } catch (error) {
    console.error("Error starting video generation:", error);
    throw error;
  }
};

export const pollVideoGeneration = async (
  operation: any, 
  maxPolls: number = 150
): Promise<any> => {
  try {
    const genAI = createGoogleAI({ apiKey: getApiKey() });
    let currentOperation = operation;
    let pollCount = 0;

    console.log("Video generation started, polling for completion...");

    while (!currentOperation.done && pollCount < maxPolls) {
      console.log(`Video ${currentOperation.name} has not been generated yet. Check again in 10 seconds...`);
      await delay(10000); // Wait 10 seconds
      pollCount++;

      currentOperation = await genAI.operations.getVideosOperation({
        operation: currentOperation,
      });
    }

    if (!currentOperation.done) {
      throw new Error("Video generation timed out after 25 minutes");
    }

    if (!currentOperation.response || !currentOperation.response.generatedVideos) {
      throw new Error("Video generation failed - no video in response");
    }

    return currentOperation;
  } catch (error) {
    console.error("Error polling video generation:", error);
    throw error;
  }
};

export const downloadAndConvertVideo = async (videoUri: string): Promise<string> => {
  try {
    if (!videoUri) {
      throw new Error("No video URI provided");
    }

    console.log(`Downloading video from: ${videoUri}`);

    const videoResponse = await fetch(`${videoUri}&key=${getApiKey()}`);

    if (!videoResponse.ok) {
      throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }

    const videoBuffer = await videoResponse.arrayBuffer();
    const base64Video = Buffer.from(videoBuffer).toString("base64");
    const videoData = `data:video/mp4;base64,${base64Video}`;

    console.log("Video downloaded and converted to base64 successfully");
    return videoData;
  } catch (error) {
    console.error("Error downloading and converting video:", error);
    throw error;
  }
};

// Composed functions
export const generateVideoComplete = async (request: VideoGenerationRequest): Promise<VideoGenerationResult> => {
  try {
    // Step 1: Start video generation
    const { operation, enhancedPrompt, negativePrompt, modelName } = await startVideoGeneration(request);

    // Step 2: Poll for completion
    const completedOperation = await pollVideoGeneration(operation);

    // Step 3: Extract video details
    const generatedVideo = completedOperation.response.generatedVideos[0];
    const videoUri = generatedVideo?.video?.uri;

    if (!videoUri) {
      throw new Error("No video URI received from AI service");
    }

    console.log(`Video has been generated: ${videoUri}`);

    // Step 4: Download and convert video
    const videoData = await downloadAndConvertVideo(videoUri);

    // Return success response
    return {
      success: true,
      data: {
        videoUrl: videoData,
        prompt: enhancedPrompt,
        originalPrompt: request.prompt,
        style: request.style,
        aspectRatio: request.aspectRatio,
        duration: request.duration,
        personGeneration: request.personGeneration,
        status: "completed"
      }
    };
  } catch (error) {
    console.error("Complete video generation error:", error);
    throw error;
  }
};

export const checkVideoGenerationStatus = async (operationId: string): Promise<VideoGenerationStatus> => {
  try {
    const genAI = createGoogleAI({ apiKey: getApiKey() });
    const operationRef = { name: operationId, _fromAPIResponse: true } as any;
    
    const operation = await genAI.operations.getVideosOperation({ 
      operation: operationRef 
    });

    if (operation.done) {
      if (operation.response && operation.response.generatedVideos) {
        const videoFile = operation.response.generatedVideos[0].video;
        const videoUrl = videoFile?.uri || `/api/videos/${operationId}`;
        
        console.log("Video generation completed successfully:", videoUrl);
        
        return {
          success: true,
          data: {
            operationId,
            status: "completed",
            videoUrl,
          },
        };
      } else {
        return {
          success: true,
          data: {
            operationId,
            status: "failed",
            error: "Video generation failed",
          },
        };
      }
    } else {
      return {
        success: true,
        data: {
          operationId,
          status: "generating",
        },
      };
    }
  } catch (error) {
    console.error("Error checking video generation status:", error);
    return {
      success: false,
      data: {
        operationId,
        status: "failed",
        error: "Failed to check generation status",
      },
    };
  }
};

export const generateVideoPromptSuggestions = async (style?: string): Promise<VideoPromptSuggestionsResult> => {
  try {
    const genAI = createGoogleAI({ apiKey: getApiKey() });
    const styleContext = style ? ` focusing on ${style} style` : "";

    const structuredPrompt = `Generate 4 creative and diverse video generation prompts${styleContext}. 

For each prompt, provide the full prompt text and break it down into components following this structure:
- Subject: The main object, person, animal, or character in the video
- Action: What is happening or the movement/activity taking place
- Setting: The environment, location, or background where the action occurs
- Style: The visual style, cinematography, or artistic technique

Return the response in this exact JSON format:
{
  "suggestions": [
    {
      "fullPrompt": "A majestic eagle soaring through misty mountain peaks at golden hour with cinematic camera movements",
      "subject": "majestic eagle",
      "action": "soaring through misty mountain peaks",
      "setting": "mountain peaks at golden hour",
      "style": "cinematic camera movements"
    }
  ]
}

Make each prompt diverse in subject, action, setting, and style. Focus on dynamic movement and visual storytelling suitable for video generation. Ensure 4 different suggestions.`;

    const structuredResponse = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: structuredPrompt,
    });

    const structuredText = structuredResponse.text;

    try {
      const jsonMatch = structuredText?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const suggestions = parsed.suggestions || [];

        return {
          success: true,
          data: {
            suggestions: suggestions.slice(0, 4).map((s: any) => ({
              fullPrompt: s.fullPrompt || "Creative video prompt",
              subject: s.subject || "Creative subject",
              action: s.action || "Dynamic movement",
              setting: s.setting || "Cinematic environment",
              style: s.style || style || "Cinematic style",
            })),
          },
        };
      }
    } catch (parseError) {
      console.warn("Failed to parse structured video response, using fallback:", parseError);
    }

    throw new Error("Failed to parse AI response for video prompt suggestions");
  } catch (error) {
    console.error("Google AI video prompt suggestion error:", error);
    throw new Error("Failed to generate video prompt suggestions");
  }
};

// Error handler
export const handleVideoGenerationError = (error: any) => handleAIError(error, "video generation");
