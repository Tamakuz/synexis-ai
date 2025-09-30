"use client";

import { PromptInput } from "./prompt-input";
import { StyleSelector } from "./style-selector";
import { SizeSelector } from "./size-selector";
import { ModelSelector } from "./model-selector";
import { AIModel } from "@/lib/services/ai-service";

interface StyleOption {
  id: string;
  name: string;
  description: string;
}

interface SizeOption {
  id: string;
  name: string;
  aspect: string;
}

interface ModelOption {
  id: AIModel;
  name: string;
  description: string;
  provider: string;
  icon: string;
}

interface SidePanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  styles: StyleOption[];
  selectedStyle: string;
  onStyleSelect: (style: string) => void;
  sizes: SizeOption[];
  selectedSize: string;
  onSizeSelect: (size: string) => void;
  models: ModelOption[];
  selectedModel: AIModel;
  onModelSelect: (model: AIModel) => void;
}

export function SidePanel({
  prompt,
  setPrompt,
  isGenerating,
  onGenerate,
  styles,
  selectedStyle,
  onStyleSelect,
  sizes,
  selectedSize,
  onSizeSelect,
  models,
  selectedModel,
  onModelSelect
}: SidePanelProps) {
  return (
    <div className="space-y-6">
      <PromptInput 
        prompt={prompt}
        setPrompt={setPrompt}
        isGenerating={isGenerating}
        onGenerate={onGenerate}
        selectedStyle={selectedStyle}
      />
      <ModelSelector 
        models={models}
        selectedModel={selectedModel}
        onModelSelect={onModelSelect}
      />
      <StyleSelector 
        styles={styles}
        selectedStyle={selectedStyle}
        onStyleSelect={onStyleSelect}
      />
      <SizeSelector 
        sizes={sizes}
        selectedSize={selectedSize}
        onSizeSelect={onSizeSelect}
      />
    </div>
  );
}
