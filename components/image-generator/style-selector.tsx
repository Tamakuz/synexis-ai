"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface StyleOption {
  id: string;
  name: string;
  description: string;
}

interface StyleSelectorProps {
  styles: StyleOption[];
  selectedStyle: string;
  onStyleSelect: (styleId: string) => void;
}

export function StyleSelector({ styles, selectedStyle, onStyleSelect }: StyleSelectorProps) {
  const selectedStyleObj = styles.find(style => style.id === selectedStyle) || styles[0];
  
  return (
    <Card className="bg-[#1A1D23] border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Settings size={20} className="text-indigo-400" />
          Style
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span>{selectedStyleObj.name}</span>
              <span className="text-gray-400 text-sm">▼</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] bg-[#1A1D23] border-white/10 text-white">
            {styles.map((style) => (
              <DropdownMenuItem 
                key={style.id} 
                onClick={() => onStyleSelect(style.id)}
                className="flex flex-col items-start p-3 focus:bg-indigo-500/20"
              >
                <div className="font-medium">{style.name}</div>
                <div className="text-gray-400 text-sm">{style.description}</div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
