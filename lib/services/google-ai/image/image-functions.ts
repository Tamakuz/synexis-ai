import { createGoogleAI, getApiKey, handleAIError } from "../base/ai-utils";
import { PromptEnhancer } from "../../prompt-enhancer";
import {
  ImageGenerationResult,
  PromptSuggestionsResult,
} from "@/lib/types/image-ai";

// Pure functions for image processing
export const processImageParts = (parts: any[]): { imageUrls: string[]; images: any[] } => {
  const imageUrls: string[] = [];
  const images: any[] = [];

  for (const part of parts) {
    if (part.inlineData && part.inlineData.data) {
      const imageData = part.inlineData.data;
      const mimeType = part.inlineData.mimeType || "image/png";
      const dataUrl = `data:${mimeType};base64,${imageData}`;
      
      imageUrls.push(dataUrl);
      images.push({
        image: {
          imageBytes: imageData,
        },
      });
    }
  }

  return { imageUrls, images };
};

export const createFallbackSuggestions = (style?: string) => [
  {
    fullPrompt: `A ${style || "artistic"} portrait of a person in a creative setting`,
    subject: "portrait of a person",
    context: "creative setting",
    style: style || "artistic",
  },
  {
    fullPrompt: `A ${style || "detailed"} landscape with natural elements`,
    subject: "landscape",
    context: "natural elements",
    style: style || "detailed",
  },
  {
    fullPrompt: `A ${style || "modern"} still life composition`,
    subject: "still life composition",
    context: "arranged objects",
    style: style || "modern",
  },
  {
    fullPrompt: `A ${style || "creative"} abstract design with geometric patterns`,
    subject: "abstract design",
    context: "geometric patterns",
    style: style || "creative",
  },
];

export const parsePromptSuggestions = (text: string, style?: string) => {
  try {
    const jsonMatch = text?.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const suggestions = parsed.suggestions || [];

      return suggestions.slice(0, 4).map((s: any) => ({
        fullPrompt: s.fullPrompt || "Creative image prompt",
        subject: s.subject || "Creative subject",
        context: s.context || "Artistic environment",
        style: s.style || style || "Artistic style",
      }));
    }
  } catch (parseError) {
    console.warn("Failed to parse structured response, using fallback:", parseError);
  }
  
  return createFallbackSuggestions(style);
};

// Core image generation functions
export const generateImages = async (
  prompt: string,
  style: string,
  size: string,
  numberOfImages: number = 1
): Promise<ImageGenerationResult> => {
  try {
    const genAI = createGoogleAI({ apiKey: getApiKey() });
    const enhancedPrompt = PromptEnhancer.enhanceForImageGeneration(prompt, style, size);

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: enhancedPrompt,
    });

    const { imageUrls, images } = response.candidates && response.candidates[0]?.content?.parts
      ? processImageParts(response.candidates[0].content.parts)
      : { imageUrls: [], images: [] };

    return {
      success: true,
      data: {
        prompt: enhancedPrompt,
        originalPrompt: prompt,
        style,
        size,
        numberOfImages: imageUrls.length,
        imageUrls,
        images,
      },
    };
  } catch (error) {
    console.error("Google AI image generation error:", error);
    throw new Error("Failed to generate images");
  }
};

export const generatePromptSuggestions = async (style?: string): Promise<PromptSuggestionsResult> => {
  try {
    const genAI = createGoogleAI({ apiKey: getApiKey() });
    const styleContext = style ? ` focusing on ${style} style` : "";

    const structuredPrompt = `Generate 4 creative and diverse image generation prompts${styleContext}. 

For each prompt, provide the full prompt text and break it down into components following this structure:
- Subject: The main object, person, animal, or scenery
- Context: The environment, background, or setting
- Style: The artistic style or technique

Return the response in this exact JSON format:
{
  "suggestions": [
    {
      "fullPrompt": "A watercolor painting of a majestic mountain peak surrounded by morning mist",
      "subject": "majestic mountain peak",
      "context": "surrounded by morning mist",
      "style": "watercolor painting"
    }
  ]
}

Make each prompt diverse in subject, context, and style. Ensure 4 different suggestions.`;

    const structuredResponse = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: structuredPrompt,
    });

    const suggestions = parsePromptSuggestions(structuredResponse.text || "", style);

    return {
      success: true,
      data: {
        suggestions,
      },
    };
  } catch (error) {
    console.error("Google AI prompt suggestion error:", error);
    throw new Error("Failed to generate prompt suggestions");
  }
};

// Error handler
export const handleImageGenerationError = (error: any) => handleAIError(error, "image generation");
