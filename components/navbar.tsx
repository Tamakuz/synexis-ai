"use client";

import { Bell, RefreshCw, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  title: string;
  subtitle?: string;
}

export function Navbar({ title, subtitle }: NavbarProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0F1115]">
      <div>
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        {subtitle && (
          <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <Bell size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <RefreshCw size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <Moon size={20} />
        </Button>
      </div>
    </div>
  );
}
