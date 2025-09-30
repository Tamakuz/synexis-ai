export interface VideoPromptSuggestion {
  fullPrompt: string;
  subject: string;
  action: string;
  setting: string;
  style: string;
}

export interface VideoPromptSuggestionsResult {
  success: boolean;
  data: {
    suggestions: VideoPromptSuggestion[];
  };
}

export interface VideoGenerationRequest {
  prompt: string;
  negativePrompt?: string;
  style: string;
  duration: string;
  aspectRatio: "16:9" | "9:16";
  personGeneration?: "allow_all" | "allow_adult" | "dont_allow";
  model?: string;
}

export interface VideoGenerationResult {
  success: boolean;
  data: {
    prompt: string;
    originalPrompt: string;
    negativePrompt?: string;
    style: string;
    duration: string;
    aspectRatio: string;
    personGeneration?: string;
    videoUrl: string;
    operationId?: string;
    status: "generating" | "completed" | "failed";
  };
}

export interface VideoGenerationStatus {
  success: boolean;
  data: {
    operationId: string;
    status: "generating" | "completed" | "failed";
    videoUrl?: string;
    error?: string;
  };
}
