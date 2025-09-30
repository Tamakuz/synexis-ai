export class PromptEnhancer {
  static enhanceForImageGeneration(prompt: string, style: string, size: string): string {
    let enhancedPrompt = prompt;

    switch (style) {
      case "realistic":
        enhancedPrompt = `Create a highly realistic, photorealistic image of: ${prompt}. Make it look like a professional photograph with natural lighting, sharp details, and natural textures.`;
        break;
      case "artistic":
        enhancedPrompt = `Create an artistic, painterly image of: ${prompt}. Use creative artistic techniques, expressive brush strokes, and vibrant colors in an artistic style.`;
        break;
      case "anime":
        enhancedPrompt = `Create an anime-style image of: ${prompt}. Use Japanese animation aesthetic with clean lines, vibrant colors, and anime character design.`;
        break;
      case "digital":
        enhancedPrompt = `Create a modern digital artwork of: ${prompt}. Use contemporary digital art techniques, clean lines, and modern artistic styles.`;
        break;
      default:
        enhancedPrompt = prompt;
        break;
    }

    // Add quality and technical specifications
    enhancedPrompt += ` High quality, detailed, ${size} aspect ratio.`;

    return enhancedPrompt;
  }

  static enhanceForTextGeneration(prompt: string, context?: string): string {
    if (context) {
      return `${context}\n\n${prompt}`;
    }
    return prompt;
  }
}
