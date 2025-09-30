export interface GeneratedImage {
  image: {
    imageBytes: string;
  };
}

export interface ImageGenerationResponse {
  generatedImages: GeneratedImage[];
}

export interface ImageGenerationResult {
  success: boolean;
  data: {
    prompt: string;
    originalPrompt: string;
    style: string;
    size: string;
    numberOfImages: number;
    imageUrls: string[];
    images: GeneratedImage[];
  };
}

export interface TextGenerationResult {
  success: boolean;
  data: {
    generatedText: string;
    prompt: string;
  };
}

export interface ImageGenerationRequest {
  prompt: string;
  style: string;
  size: string;
  numberOfImages?: number;
  model?: string;
}

export interface PromptSuggestion {
  fullPrompt: string;
  subject: string;
  context: string;
  style: string;
}

export interface PromptSuggestionsResult {
  success: boolean;
  data: {
    suggestions: PromptSuggestion[];
  };
}
