"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LineChartCardProps {
  title: string;
  data: Array<{ day: string; generations: number }>;
}

interface PieChartCardProps {
  title: string;
  data: Array<{ name: string; value: number; fill: string }>;
}

export function LineChartCard({ title, data }: LineChartCardProps) {
  return (
    <Card className="bg-[#1A1D23] border-white/10">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center bg-gray-800/50 rounded-lg">
          <div className="text-center">
            <div className="text-indigo-400 text-lg font-medium mb-2">📊 Chart Placeholder</div>
            <p className="text-gray-400 text-sm">Install recharts to see the line chart</p>
            <div className="mt-4 text-xs text-gray-500">
              Data points: {data.length} days
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PieChartCard({ title, data }: PieChartCardProps) {
  return (
    <Card className="bg-[#1A1D23] border-white/10">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center bg-gray-800/50 rounded-lg">
          <div className="text-center">
            <div className="text-indigo-400 text-lg font-medium mb-2">🥧 Chart Placeholder</div>
            <p className="text-gray-400 text-sm">Install recharts to see the pie chart</p>
            <div className="mt-4 text-xs text-gray-500">
              Categories: {data.length}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.fill }}
              />
              <span className="text-sm text-gray-400">{entry.name}</span>
              <span className="text-sm text-white font-medium">{entry.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
