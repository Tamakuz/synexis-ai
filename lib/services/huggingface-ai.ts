import { PromptEnhancer } from "./prompt-enhancer";
import { ImageGenerationResult } from "@/lib/types/image-ai";

class HuggingFaceAIService {
  constructor() {
    if (!process.env.NEXT_PUBLIC_HF_TOKEN) {
      throw new Error("NEXT_PUBLIC_HF_TOKEN environment variable is not set");
    }
  }

  async generateImages(
    prompt: string,
    style: string,
    size: string,
    numberOfImages: number = 1
  ): Promise<ImageGenerationResult> {
    try {
      const enhancedPrompt = PromptEnhancer.enhanceForImageGeneration(
        prompt,
        style,
        size
      );

      const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: enhancedPrompt,
            parameters: {
              num_inference_steps: 20,
              guidance_scale: 7.5,
              width: parseInt(size.split("x")[0]) || 1024,
              height: parseInt(size.split("x")[1]) || 1024,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Hugging Face API error: ${response.status} - ${errorText}`
        );
      }

      const blob = await response.blob();

      // Convert blob to base64
      const buffer = await blob.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const dataUrl = `data:image/png;base64,${base64}`;

      return {
        success: true,
        data: {
          prompt: enhancedPrompt,
          originalPrompt: prompt,
          style,
          size,
          numberOfImages: 1,
          imageUrls: [dataUrl],
          images: [
            {
              image: {
                imageBytes: base64,
              },
            },
          ],
        },
      };
    } catch (error) {
      console.error("Hugging Face AI image generation error:", error);
      throw new Error("Failed to generate images with Hugging Face");
    }
  }
}

// Export singleton instance
export const huggingFaceAIService = new HuggingFaceAIService();
export default huggingFaceAIService;
