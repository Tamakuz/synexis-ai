import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Image, 
  Video, 
  Music, 
  FileText, 
  Code, 
  BarChart3 
} from "lucide-react";
import { aiToolsData } from "@/lib/dummy-data";

const iconMap = {
  image: Image,
  video: Video,
  music: Music,
  fileText: FileText,
  code: Code,
  barChart3: BarChart3,
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[#0F1115]">
      <Navbar 
        title="AI Tools" 
        subtitle="Explore our collection of AI-powered generation tools"
      />
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiToolsData.map((tool, index) => {
            const Icon = iconMap[tool.icon as keyof typeof iconMap];
            
            return (
              <Card key={index} className="bg-[#1A1D23] border-white/10 hover:border-indigo-500/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                        <Icon size={20} />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{tool.title}</CardTitle>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {tool.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 mb-4">
                    {tool.description}
                  </CardDescription>
                  {tool.title === "Image Generator" ? (
                    <Link href="/tools/image-generator">
                      <Button className="w-full">
                        Try Now
                      </Button>
                    </Link>
                  ) : tool.title === "Video Generator" ? (
                    <Link href="/tools/video-generator">
                      <Button className="w-full">
                        Try Now
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      className="w-full" 
                      variant="outline"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
