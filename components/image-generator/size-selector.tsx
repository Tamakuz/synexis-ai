"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface SizeOption {
  id: string;
  name: string;
  aspect: string;
}

interface SizeSelectorProps {
  sizes: SizeOption[];
  selectedSize: string;
  onSizeSelect: (sizeId: string) => void;
}

export function SizeSelector({ sizes, selectedSize, onSizeSelect }: SizeSelectorProps) {
  const selectedSizeObj = sizes.find(size => size.id === selectedSize) || sizes[0];
  
  return (
    <Card className="bg-[#1A1D23] border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Image Size</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span>{selectedSizeObj.name}</span>
              <Badge variant="outline" className="text-xs">
                {selectedSizeObj.aspect}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] bg-[#1A1D23] border-white/10 text-white">
            {sizes.map((size) => (
              <DropdownMenuItem 
                key={size.id} 
                onClick={() => onSizeSelect(size.id)}
                className="flex items-center justify-between p-3 focus:bg-indigo-500/20"
              >
                <div>
                  <div className="font-medium">{size.name}</div>
                  <Badge variant="outline" className="text-xs mt-1">
                    {size.aspect}
                  </Badge>
                </div>
                {selectedSize === size.id && (
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
