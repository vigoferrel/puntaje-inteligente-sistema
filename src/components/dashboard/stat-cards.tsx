
import React from "react";
import { StatCard } from "@/components/stat-card";
import { BookOpen, CalendarDays, CheckCircle, Hourglass } from "lucide-react";

interface StatCardsProps {
  loading: boolean;
  completedExercises: number;
  accuracyPercentage: number;
  totalTimeMinutes: number;
}

export const StatCards = ({ 
  loading,
  completedExercises,
  accuracyPercentage,
  totalTimeMinutes
}: StatCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
