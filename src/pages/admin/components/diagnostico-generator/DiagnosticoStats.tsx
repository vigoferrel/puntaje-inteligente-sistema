
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { DiagnosticTest } from "@/types/diagnostic";
import { BarChartHorizontal, BookOpenCheck, Users, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DiagnosticoStatsProps {
  diagnostics: DiagnosticTest[];
  totalUsers?: number;
  totalCompletions?: number;
  loading: boolean;
}

export const DiagnosticoStats = ({
  diagnostics,
  totalUsers = 0,
  totalCompletions = 0,
  loading
}: DiagnosticoStatsProps) => {
  // Calculate stats
  const totalDiagnostics = diagnostics.length;
  const averageQuestions = totalDiagnostics > 0
    ? Math.round(diagnostics.reduce((sum, diag) => sum + (diag.questions?.length || 0), 0) / totalDiagnostics)
    : 0;
  
  // Format date for "last 7 days" calculation
  const lastWeekDate = new Date();
  lastWeekDate.setDate(lastWeekDate.getDate() - 7);
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-7 w-1/3 mb-2" />
              <Skeleton className="h-9 w-1/4 mb-3" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Diagnósticos Totales"
        value={totalDiagnostics}
        icon={<BookOpenCheck className="h-5 w-5 text-primary" />}
      />
      <StatCard
        title="Promedio de Ejercicios"
        value={averageQuestions}
        icon={<BarChartHorizontal className="h-5 w-5 text-primary" />}
      />
      <StatCard
        title="Usuarios Activos"
        value={totalUsers}
        icon={<Users className="h-5 w-5 text-primary" />}
        trend={{ value: 12, positive: true }}
      />
      <StatCard
        title="Diagnósticos Completados"
        value={totalCompletions}
        icon={<Calendar className="h-5 w-5 text-primary" />}
        trend={{ value: 8, positive: true }}
      />
    </div>
  );
};
