
import React from "react";
import { StatCard } from "@/components/stat-card";
import { BookOpen, CalendarDays, CheckCircle, Hourglass } from "lucide-react";

interface StatCardItem {
  title: string;
  value: string | number;
  description: string;
  trend: string;
  trendValue: string;
}

interface StatCardsProps {
  loading: boolean;
  stats: StatCardItem[];
  className?: string;
  completedExercises?: number;
  accuracyPercentage?: number;
  totalTimeMinutes?: number;
}

export const StatCards = ({ 
  loading,
  stats,
  className,
  completedExercises,
  accuracyPercentage,
  totalTimeMinutes
}: StatCardsProps) => {
  // If stats are provided, use them
  if (stats && stats.length > 0) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className || ''}`}>
        {stats.map((stat, index) => (
          <StatCard 
            key={index}
            title={stat.title} 
            value={loading ? "..." : stat.value} 
            icon={getIconForStat(stat.title)}
            trend={{
              value: parseInt(stat.trendValue), 
              positive: stat.trend === "up"
            }}
          />
        ))}
      </div>
    );
  }

  // Legacy usage
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className || ''}`}>
      <StatCard 
        title="Ejercicios Completados" 
        value={loading ? "..." : completedExercises} 
        icon={<CheckCircle className="h-5 w-5 text-stp-primary" />}
        trend={{ value: 12, positive: true }}
      />
      <StatCard 
        title="Precisión" 
        value={`${loading ? "..." : accuracyPercentage}%`} 
        icon={<BookOpen className="h-5 w-5 text-stp-primary" />}
        trend={{ value: 5, positive: true }}
      />
      <StatCard 
        title="Tiempo de Estudio" 
        value={`${loading ? "..." : totalTimeMinutes} min`} 
        icon={<Hourglass className="h-5 w-5 text-stp-primary" />}
        trend={{ value: 8, positive: true }}
      />
      <StatCard 
        title="Días Consecutivos" 
        value="3" 
        icon={<CalendarDays className="h-5 w-5 text-stp-primary" />}
        trend={{ value: 2, positive: true }}
      />
    </div>
  );
};

// Helper function to get icon based on stat title
function getIconForStat(title: string) {
  switch (title.toLowerCase()) {
    case "ejercicios completados":
      return <CheckCircle className="h-5 w-5 text-stp-primary" />;
    case "precisión":
      return <BookOpen className="h-5 w-5 text-stp-primary" />;
    case "tiempo de estudio":
      return <Hourglass className="h-5 w-5 text-stp-primary" />;
    case "días consecutivos":
      return <CalendarDays className="h-5 w-5 text-stp-primary" />;
    default:
      return <CheckCircle className="h-5 w-5 text-stp-primary" />;
  }
}
