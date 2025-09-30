import { 
  Activity, 
  Image, 
  Video, 
  Music, 
  TrendingUp,
  TrendingDown 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const iconMap = {
  activity: Activity,
  image: Image,
  video: Video,
  music: Music,
};

const colorMap = {
  indigo: "text-indigo-400 bg-indigo-500/20",
  violet: "text-violet-400 bg-violet-500/20",
  pink: "text-pink-400 bg-pink-500/20",
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: keyof typeof iconMap;
  color: keyof typeof colorMap;
}

export function StatCard({ title, value, change, icon, color }: StatCardProps) {
  const Icon = iconMap[icon];
  const isPositive = change.startsWith('+');
  
  return (
    <Card className="bg-[#1A1D23] border-white/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn("p-2 rounded-lg", colorMap[color])}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">{title}</p>
              <p className="text-2xl font-semibold text-white">{value}</p>
            </div>
          </div>
          <div className={cn(
            "flex items-center space-x-1 text-sm font-medium",
            isPositive ? "text-emerald-400" : "text-red-400"
          )}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{change}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
