import * as ImageFunctions from "./image/image-functions";
import * as VideoFunctions from "./video/video-functions";
import * as TextFunctions from "./text/text-functions";

export const AI = {
  // Image functions
  image: {
    generate: ImageFunctions.generateImages,
    generatePromptSuggestions: ImageFunctions.generatePromptSuggestions,
    handleError: ImageFunctions.handleImageGenerationError,
  },
  
  // Video functions
  video: {
    generate: VideoFunctions.generateVideoComplete,
    start: VideoFunctions.startVideoGeneration,
    poll: VideoFunctions.pollVideoGeneration,
    download: VideoFunctions.downloadAndConvertVideo,
    checkStatus: VideoFunctions.checkVideoGenerationStatus,
    generatePromptSuggestions: VideoFunctions.generateVideoPromptSuggestions,
    handleError: VideoFunctions.handleVideoGenerationError,
  },
  
  // Text functions
  text: {
    generate: TextFunctions.generateText,
    generateWithModel: TextFunctions.generateTextWithModel,
    generateStructured: TextFunctions.generateStructuredText,
    generateWithRetry: TextFunctions.generateTextWithRetryAndTimeout,
    generateStructuredWithRetry: TextFunctions.generateStructuredTextWithRetryAndTimeout,
    handleError: TextFunctions.handleTextGenerationError,
  },
};

export default AI;
