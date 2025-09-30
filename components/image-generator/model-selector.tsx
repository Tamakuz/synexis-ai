"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, ChevronDown, Check } from "lucide-react";
import { AIModel } from "@/lib/services/ai-service";

interface ModelOption {
  id: AIModel;
  name: string;
  description: string;
  provider: string;
  icon: string;
}

interface ModelSelectorProps {
  models: ModelOption[];
  selectedModel: AIModel;
  onModelSelect: (model: AIModel) => void;
}

export function ModelSelector({ models, selectedModel, onModelSelect }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedModelData = models.find(model => model.id === selectedModel);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Card className="bg-[#1A1D23] border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Bot size={20} className="text-violet-400" />
          AI Engine
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full justify-between bg-gray-800/50 border-white/10 text-white hover:bg-gray-700/50"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedModelData?.icon}</span>
              <span className="font-medium">{selectedModelData?.name}</span>
            </div>
            <ChevronDown 
              size={16} 
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            />
          </Button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 z-10 mt-2 bg-[#1A1D23] border border-white/10 rounded-lg shadow-2xl overflow-hidden">
              {models.map((model) => (
                <Button
                  key={model.id}
                  variant="ghost"
                  onClick={() => {
                    onModelSelect(model.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-4 h-auto justify-start text-left rounded-none border-b border-white/5 last:border-b-0 transition-all duration-200 ${
                    selectedModel === model.id
                      ? "bg-violet-500/20 text-white"
                      : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="text-xl">{model.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{model.name}</p>
                        {selectedModel === model.id && (
                          <Check size={16} className="text-violet-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        {model.description}
                      </p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
