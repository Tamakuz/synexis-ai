import { Navbar } from "@/components/navbar";
import { StatCard } from "@/components/stat-card";
import { LineChartCard, PieChartCard } from "@/components/chart-card";
import { statsData, generationActivityData, contentDistributionData } from "@/lib/dummy-data";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0F1115]">
      <Navbar 
        title="AI Dashboard" 
        subtitle="Track your AI generation statistics and performance"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon as any}
              color={stat.color as any}
            />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LineChartCard 
            title="Generation Activity"
            data={generationActivityData}
          />
          <PieChartCard 
            title="Content Distribution"
            data={contentDistributionData}
          />
        </div>
      </div>
    </div>
  );
}
