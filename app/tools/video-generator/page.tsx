"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VideoPromptInput } from "@/components/video-generator/video-prompt-input";
import { useVideoGeneration } from "@/lib/hooks/use-video-generation";
import { VideoGenerationRequest } from "@/lib/types/video-ai";
import { 
  Video, 
  Play, 
  Download, 
  Heart, 
  Share2,
  Sparkles,
  Copy,
  Clock,
  Settings,
  Film,
  X,
  RotateCcw
} from "lucide-react";

export default function VideoGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("cinematic");
  const [selectedDuration, setSelectedDuration] = useState("5");
  const [selectedRatio, setSelectedRatio] = useState<"16:9" | "9:16">("16:9");
  const [selectedPersonGeneration, setSelectedPersonGeneration] = useState<"allow_all" | "allow_adult" | "dont_allow">("allow_all");
  const [selectedModel, setSelectedModel] = useState<"synexis-pro" | "synexis-ultra">("synexis-ultra");
  
  const { 
    generateVideo, 
    cancelGeneration, 
    retry, 
    isGenerating, 
    error, 
    result, 
    progress, 
    statusMessage, 
    reset 
  } = useVideoGeneration();
  

  const styles = [
    { id: "cinematic", name: "Cinematic", description: "Movie-like quality with dramatic lighting", color: "from-amber-500 to-orange-500" },
    { id: "realistic", name: "Realistic", description: "Photorealistic video generation", color: "from-blue-500 to-cyan-500" },
    { id: "artistic", name: "Artistic", description: "Creative and stylized visuals", color: "from-green-500 to-emerald-500" },
    { id: "abstract", name: "Abstract", description: "Non-representational art style", color: "from-violet-500 to-indigo-500" },
  ];

  const models = [
    { 
      id: "synexis-ultra", 
      name: "Synexis Ultra", 
      description: "Latest model with audio, 1080p, 8s duration", 
      features: ["Audio Generation", "1080p Resolution", "8 seconds", "Advanced AI"],
      color: "from-purple-500 to-indigo-500"
    },
    { 
      id: "synexis-pro", 
      name: "Synexis Pro", 
      description: "Stable model, 720p, 5-8s duration", 
      features: ["Silent Video", "720p Resolution", "5-8 seconds", "Reliable"],
      color: "from-blue-500 to-cyan-500"
    },
  ];

  const durations = [
    { id: "3", name: "3 seconds", description: "Quick preview" },
    { id: "5", name: "5 seconds", description: "Standard length" },
    { id: "8", name: "8 seconds", description: "Extended clip" },
    { id: "15", name: "15 seconds", description: "Long form" },
  ];

  const aspectRatios = [
    { id: "16:9" as const, name: "Landscape (16:9)", description: "Widescreen format" },
    { id: "9:16" as const, name: "Portrait (9:16)", description: "Mobile/vertical" },
  ];

  const personGenerationOptions = [
    { id: "allow_all" as const, name: "Allow All", description: "Generate any people" },
    { id: "allow_adult" as const, name: "Adults Only", description: "Only adult people" },
    { id: "dont_allow" as const, name: "No People", description: "Avoid generating people" },
  ];

  const sampleVideos = [
    { 
      id: 1, 
      title: "Sunset over mountains", 
      prompt: "A breathtaking sunset over snow-capped mountains with golden light", 
      duration: "5s",
      style: "Cinematic",
      likes: 42 
    },
    { 
      id: 2, 
      title: "Ocean waves", 
      prompt: "Peaceful ocean waves crashing on a sandy beach at dawn", 
      duration: "10s",
      style: "Realistic",
      likes: 38 
    },
    { 
      id: 3, 
      title: "City lights", 
      prompt: "Futuristic city with neon lights and flying cars at night", 
      duration: "8s",
      style: "Anime",
      likes: 56 
    },
    { 
      id: 4, 
      title: "Forest magic", 
      prompt: "Enchanted forest with glowing particles and mystical creatures", 
      duration: "12s",
      style: "Artistic",
      likes: 29 
    },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    const request: VideoGenerationRequest = {
      prompt: prompt.trim(),
      style: selectedStyle,
      duration: selectedDuration,
      aspectRatio: selectedRatio,
      personGeneration: selectedPersonGeneration,
      model: selectedModel,
    };

    try {
      await generateVideo(request);
    } catch (error) {
      console.error('Video generation failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1115]">
      <Navbar 
        title="Video Generator" 
        subtitle="Create stunning AI-generated videos from text prompts"
      />
      
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Prompt Input */}
            <VideoPromptInput
              prompt={prompt}
              setPrompt={setPrompt}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
              selectedStyle={selectedStyle}
            />

            {/* Model Selection */}
            <Card className="bg-[#1A1D23] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Video size={20} className="text-purple-400" />
                  AI Model
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {models.map((model) => (
                    <div
                      key={model.id}
                      onClick={() => setSelectedModel(model.id as "synexis-pro" | "synexis-ultra")}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedModel === model.id
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${model.color}`}></div>
                            <p className="text-white font-medium">{model.name}</p>
                            {model.id === "synexis-ultra" && (
                              <Badge className="bg-purple-500/20 text-purple-300 text-xs">Latest</Badge>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mb-3">{model.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {model.features.map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-white/20 text-gray-300">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Style Selection */}
            <Card className="bg-[#1A1D23] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Film size={20} className="text-indigo-400" />
                  Style
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {styles.map((style) => (
                    <div
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedStyle === style.id
                          ? "border-indigo-500 bg-indigo-500/10"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${style.color}`}></div>
                            <p className="text-white font-medium">{style.name}</p>
                          </div>
                          <p className="text-gray-400 text-sm mt-1">{style.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Duration & Aspect Ratio */}
            <Card className="bg-[#1A1D23] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings size={20} className="text-indigo-400" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Duration</label>
                  <div className="grid grid-cols-2 gap-2">
                    {durations.map((duration) => (
                      <Button
                        key={duration.id}
                        variant={selectedDuration === duration.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDuration(duration.id)}
                        className="text-xs"
                      >
                        <Clock size={12} className="mr-1" />
                        {duration.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Aspect Ratio</label>
                  <div className="space-y-2">
                    {aspectRatios.map((ratio) => (
                      <Button
                        key={ratio.id}
                        variant={selectedRatio === ratio.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedRatio(ratio.id)}
                        className="w-full justify-start text-xs"
                      >
                        {ratio.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white text-sm font-medium mb-2 block">People Generation</label>
                  <div className="space-y-2">
                    {personGenerationOptions.map((option) => (
                      <Button
                        key={option.id}
                        variant={selectedPersonGeneration === option.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPersonGeneration(option.id)}
                        className="w-full justify-start text-xs"
                      >
                        <div className="text-left">
                          <div>{option.name}</div>
                          <div className="text-xs opacity-70">{option.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Generation Result */}
            <Card className="bg-[#1A1D23] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Generated Video
                  {(result || error) && (
                    <div className="flex gap-2">
                      {error && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={retry}
                          className="text-indigo-400 hover:text-indigo-300"
                        >
                          <RotateCcw size={16} />
                        </Button>
                      )}
                      {isGenerating && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelGeneration}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={16} />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={reset}
                        className="text-gray-400 hover:text-white"
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-800/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600 overflow-hidden relative">
                  {error ? (
                    <div className="text-center">
                      <div className="relative mb-4">
                        <X size={48} className="text-red-400 mx-auto" />
                      </div>
                      <p className="text-red-400 font-medium mb-2">Generation Failed</p>
                      <p className="text-gray-400 text-sm mb-4">{error}</p>
                      <Button onClick={retry} className="bg-red-600 hover:bg-red-700">
                        <RotateCcw size={16} className="mr-2" />
                        Try Again
                      </Button>
                    </div>
                  ) : isGenerating ? (
                    <div className="text-center">
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                        <Sparkles size={48} className="text-indigo-400 animate-spin mx-auto relative z-10" />
                      </div>
                      <p className="text-white font-medium mb-2">{statusMessage}</p>
                      <p className="text-gray-400 text-sm mb-4">This may take several minutes</p>
                      <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-gray-500 text-xs mt-2">{Math.floor(progress)}% complete</p>
                    </div>
                  ) : result && result.data.videoUrl ? (
                    <div className="w-full h-full relative">
                      <video 
                        src={result.data.videoUrl} 
                        controls
                        className="w-full h-full object-contain rounded-lg bg-black"
                        preload="metadata"
                        playsInline
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : result && result.data.status === "completed" && !result.data.videoUrl ? (
                    <div className="text-center">
                      <div className="relative mb-4">
                        <Play size={64} className="text-green-400 mx-auto" />
                      </div>
                      <p className="text-white font-medium mb-2">Video Generated Successfully!</p>
                      <p className="text-gray-400 text-sm mt-2">Processing download...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Video size={48} className="text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">Your generated video will appear here</p>
                      <p className="text-gray-500 text-sm mt-2">Enter a prompt and click generate to start</p>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    disabled={!result?.data.videoUrl} 
                    className="flex-1"
                    onClick={() => {
                      if (result?.data.videoUrl) {
                        // Handle base64 data URL download
                        if (result.data.videoUrl.startsWith('data:video/mp4;base64,')) {
                          const link = document.createElement('a');
                          link.href = result.data.videoUrl;
                          link.download = `synexis-video-${result.data.style}-${Date.now()}.mp4`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        } else {
                          // Handle regular URL download
                          window.open(result.data.videoUrl, '_blank');
                        }
                      }
                    }}
                  >
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" disabled={!result?.data.videoUrl}>
                    <Heart size={16} />
                  </Button>
                  <Button variant="outline" disabled={!result?.data.videoUrl}>
                    <Share2 size={16} />
                  </Button>
                </div>

                {/* Generation Info */}
                {result && result.data.videoUrl && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-gray-800/30 to-gray-700/30 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={14} className="text-indigo-400" />
                      <p className="text-xs text-gray-400 font-medium">Generation Details</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">AI Model</p>
                        <p className="text-sm text-gray-300 font-medium">
                          {(result.data as any).modelName || 
                           (result.data as any).model === "synexis-pro" ? "Synexis Pro" : "Synexis Ultra"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Style</p>
                        <p className="text-sm text-gray-300 font-medium capitalize">{result.data.style}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="text-sm text-gray-300 font-medium">{result.data.duration}s</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Ratio</p>
                        <p className="text-sm text-gray-300 font-medium">{result.data.aspectRatio}</p>
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

            {/* Sample Videos Gallery */}
            <Card className="bg-[#1A1D23] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Sample Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sampleVideos.map((video) => (
                    <div key={video.id} className="group relative">
                      <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg overflow-hidden relative">
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500/10 to-violet-500/10 flex items-center justify-center">
                          <Play size={32} className="text-gray-400" />
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="text-xs">
                            {video.duration}
                          </Badge>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <Play size={16} />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download size={16} />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Heart size={16} />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-white text-sm font-medium">{video.title}</p>
                          <Badge variant="outline" className="text-xs">
                            {video.style}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-xs line-clamp-2 mb-2">{video.prompt}</p>
                        <div className="flex items-center gap-1">
                          <Heart size={12} className="text-red-400" />
                          <span className="text-gray-400 text-xs">{video.likes}</span>
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
