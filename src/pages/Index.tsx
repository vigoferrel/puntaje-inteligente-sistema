
import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { StatCards } from "@/components/dashboard/stat-cards";
import { AIFeatures } from "@/components/dashboard/ai-features";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { FeatureCards } from "@/components/dashboard/feature-cards";
import { DashboardContentGrid } from "@/components/dashboard/dashboard-content-grid";
import { DiagnosticSummary } from "@/components/dashboard/diagnostic-summary";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { fetchDiagnosticTests, fetchDiagnosticResults } from "@/services/diagnostic";
import { useAuth } from "@/contexts/AuthContext";
import { DiagnosticResult } from "@/types/diagnostic";

const Index = () => {
  const {
    user,
    loading,
    searchQuery,
    setSearchQuery,
    stats,
    skillLevels,
    topSkills,
    completedExercises,
    accuracyPercentage,
    totalTimeMinutes
  } = useDashboardStats();

  const { profile } = useAuth();
  const [diagnosticLoading, setDiagnosticLoading] = useState(true);
  const [latestResult, setLatestResult] = useState<DiagnosticResult | undefined>(undefined);
  const [availableDiagnostics, setAvailableDiagnostics] = useState(0);
  const [completedDiagnostics, setCompletedDiagnostics] = useState(0);

  // Cargar datos de diagnóstico para el dashboard
  useEffect(() => {
    const loadDiagnosticData = async () => {
      if (!profile) return;
      
      setDiagnosticLoading(true);
      
      try {
        // Cargar diagnósticos disponibles
        const tests = await fetchDiagnosticTests(profile.id);
        setAvailableDiagnostics(tests.length);
        
        // Contar diagnósticos completados y pendientes
        const completed = tests.filter(t => t.isCompleted).length;
        setCompletedDiagnostics(completed);
        
        // Cargar resultados
        const results = await fetchDiagnosticResults(profile.id);
        
        if (results && results.length > 0) {
          // Ordenar por fecha para obtener el más reciente
          const sortedResults = [...results].sort((a, b) => 
            new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
          );
          
          setLatestResult(sortedResults[0]);
        }
      } catch (error) {
        console.error("Error cargando datos de diagnóstico:", error);
      } finally {
        setDiagnosticLoading(false);
      }
    };
    
    loadDiagnosticData();
  }, [profile]);

  const pendingDiagnostics = Math.max(0, availableDiagnostics - completedDiagnostics);

  return (
    <AppLayout>
      <div className="p-6">
        <WelcomeHeader 
          userName={user?.name} 
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <StatCards
          loading={loading}
          stats={stats}
          completedExercises={completedExercises}
          accuracyPercentage={accuracyPercentage}
          totalTimeMinutes={totalTimeMinutes}
          className="mb-8"
        />

        <DashboardContentGrid 
          loading={loading}
          topSkills={topSkills}
          skillLevels={skillLevels}
          className="mb-8"
        />
        
        {/* Diagnóstico y Recomendaciones */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <DiagnosticSummary 
            loading={diagnosticLoading}
            latestResult={latestResult}
            hasAvailableDiagnostics={availableDiagnostics > 0}
            pendingDiagnostics={pendingDiagnostics}
          />
          <FeatureCards />
        </div>
        
        <AIFeatures />
      </div>
    </AppLayout>
  );
};

export default Index;
