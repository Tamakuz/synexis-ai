"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidePanel } from "@/components/image-generator/side-panel";
import { ErrorDisplay } from "@/components/image-generator/error-display";
import { useImageGeneration } from "@/lib/hooks/use-image-generation";
import { aiService, AIModel } from "@/lib/services/ai-service";
import { 
  Image as ImageIcon, 
  Download, 
  Heart, 
  Share2,
  Sparkles,
  Copy
} from "lucide-react";

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("realistic");
  const [selectedSize, setSelectedSize] = useState("1024x1024");
  const [selectedModel, setSelectedModel] = useState<AIModel>("google-gemini");
  
  const { generateImage, isGenerating, error, result, reset } = useImageGeneration();

  const styles = [
    { id: "realistic", name: "Realistic", description: "Photorealistic images" },
    { id: "artistic", name: "Artistic", description: "Painterly and creative" },
    { id: "anime", name: "Anime", description: "Japanese animation style" },
    { id: "digital", name: "Digital Art", description: "Modern digital artwork" },
  ];

  const sizes = [
    { id: "512x512", name: "Square (512×512)", aspect: "1:1" },
    { id: "1024x1024", name: "Large Square (1024×1024)", aspect: "1:1" },
    { id: "1024x768", name: "Landscape (1024×768)", aspect: "4:3" },
    { id: "768x1024", name: "Portrait (768×1024)", aspect: "3:4" },
  ];

  const models = aiService.getAvailableModels();

  const sampleImages = [
    { id: 1, url: "/api/placeholder/400/400", prompt: "A futuristic city at sunset", likes: 24 },
    { id: 2, url: "/api/placeholder/400/400", prompt: "Magical forest with glowing trees", likes: 18 },
    { id: 3, url: "/api/placeholder/400/400", prompt: "Abstract geometric patterns", likes: 31 },
    { id: 4, url: "/api/placeholder/400/400", prompt: "Cyberpunk street scene", likes: 42 },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    try {
      await generateImage({
        prompt,
        style: selectedStyle,
        size: selectedSize,
        numberOfImages: 1,
        model: selectedModel
      });
    } catch (error) {
      // Error is handled by the hook
      console.error('Generation failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1115]">
      <Navbar 
        title="Image Generator" 
        subtitle="Create stunning AI-generated images from text prompts"
      />
      
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1">
            <SidePanel 
              prompt={prompt}
              setPrompt={setPrompt}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
              styles={styles}
              selectedStyle={selectedStyle}
              onStyleSelect={setSelectedStyle}
              sizes={sizes}
              selectedSize={selectedSize}
              onSizeSelect={setSelectedSize}
              models={models}
              selectedModel={selectedModel}
              onModelSelect={setSelectedModel}
            />
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Generation Result */}
            {error ? (
              <ErrorDisplay 
                error={error}
                onRetry={handleGenerate}
                title="Image Generation Failed"
              />
            ) : (
              <Card className="bg-[#1A1D23] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Generated Image
                    {(result || error) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={reset}
                        className="text-gray-400 hover:text-white"
                      >
                        Clear
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-gray-800/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600 overflow-hidden relative">
                    {isGenerating ? (
                      <div className="text-center">
                        <div className="relative mb-4">
                          <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                          <Sparkles size={48} className="text-indigo-400 animate-spin mx-auto relative z-10" />
                        </div>
                        <p className="text-white font-medium mb-2">Generating your image...</p>
                        <p className="text-gray-400 text-sm mb-4">This may take a moment</p>
                        <div className="w-48 h-1 bg-gray-700 rounded-full mx-auto overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    ) : result && result.data.imageUrls && result.data.imageUrls.length > 0 ? (
                      <div className="w-full h-full relative group">
                        <img 
                          src={result.data.imageUrls[0]} 
                          alt={result.data.originalPrompt}
                          className="w-full h-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                          onError={(e) => {
                            console.error('Image failed to load:', e);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        {/* Image overlay with prompt */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-end">
                          <div className="p-4 w-full">
                            <p className="text-white text-sm font-medium line-clamp-2">
                              {result.data.originalPrompt}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon size={48} className="text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">Your generated image will appear here</p>
                        <p className="text-gray-500 text-sm mt-2">Enter a prompt and click generate to start</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      disabled={!result || !result.data.imageUrls.length} 
                      className="flex-1"
                      onClick={() => {
                        if (result && result.data.imageUrls.length > 0) {
                          try {
                            const link = document.createElement('a');
                            link.href = result.data.imageUrls[0];
                            link.download = `synexis-generated-${result.data.style}-${Date.now()}.png`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          } catch (error) {
                            console.error('Download failed:', error);
                            // Fallback: open in new tab
                            window.open(result.data.imageUrls[0], '_blank');
                          }
                        }
                      }}
                    >
                      <Download size={16} className="mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" disabled={!result}>
                      <Heart size={16} />
                    </Button>
                    <Button variant="outline" disabled={!result}>
                      <Share2 size={16} />
                    </Button>
                  </div>

                  {/* Generation Info */}
                  {result && result.data.imageUrls.length > 0 && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-gray-800/30 to-gray-700/30 rounded-lg border border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={14} className="text-indigo-400" />
                        <p className="text-xs text-gray-400 font-medium">Generation Details</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500">Style</p>
                          <p className="text-sm text-gray-300 font-medium capitalize">{result.data.style}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Size</p>
                          <p className="text-sm text-gray-300 font-medium">{result.data.size}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-gray-500">Original Prompt</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(result.data.originalPrompt);
                              // You could add a toast notification here
                            }}
                            className="text-gray-400 hover:text-white p-1 h-6"
                          >
                            <Copy size={12} />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{result.data.originalPrompt}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Recent Generations */}
            <Card className="bg-[#1A1D23] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Recent Generations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {sampleImages.map((image) => (
                    <div key={image.id} className="group relative">
                      <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center">
                          <ImageIcon size={32} className="text-gray-500" />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <Download size={16} />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Heart size={16} />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-white text-sm font-medium truncate">{image.prompt}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Heart size={12} className="text-red-400" />
                          <span className="text-gray-400 text-xs">{image.likes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
