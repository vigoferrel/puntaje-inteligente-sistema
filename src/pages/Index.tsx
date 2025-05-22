
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { WelcomeTour } from "@/components/dashboard/welcome-tour";
import { StatCards } from "@/components/dashboard/stat-cards";
import { SearchBar } from "@/components/dashboard/search-bar";
import { DashboardContentGrid } from "@/components/dashboard/dashboard-content-grid";
import { DiagnosticSummary } from "@/components/dashboard/diagnostic-summary";
import { AIFeatures } from "@/components/dashboard/ai-features";
import { FeatureCards } from "@/components/dashboard/feature-cards";
import { useUserData } from "@/hooks/use-user-data";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAIFeatures } from "@/hooks/use-ai-features";
import { useAuth } from "@/contexts/AuthContext";
import { useDiagnosticHistory } from "@/hooks/diagnostic/results/use-diagnostic-history";
import { useLearningWorkflow } from "@/hooks/use-learning-workflow";
import { useDiagnosticRecommendations } from "@/hooks/use-diagnostic-recommendations";
import { motion } from "framer-motion";
import { DiagnosticResult } from "@/types/diagnostic";
import { fetchDiagnosticTests, fetchDiagnosticResults } from "@/services/diagnostic/fetch-services";

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
  const { currentPhase } = useLearningWorkflow();
  const { nextRecommendedNodeId } = useDiagnosticRecommendations();
  
  const [diagnosticLoading, setDiagnosticLoading] = useState(true);
  const [latestResult, setLatestResult] = useState<DiagnosticResult | undefined>(undefined);
  const [availableDiagnostics, setAvailableDiagnostics] = useState(0);
  const [completedDiagnostics, setCompletedDiagnostics] = useState(0);
  const [showTour, setShowTour] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  // Check if first-time user
  useEffect(() => {
    const firstVisit = localStorage.getItem('firstDashboardVisit') !== 'false';
    if (firstVisit && profile) {
      setIsFirstVisit(true);
      setShowTour(true);
      localStorage.setItem('firstDashboardVisit', 'false');
    }
  }, [profile]);

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
  
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      } 
    }
  };
  
  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <AppLayout>
      {showTour && (
        <WelcomeTour 
          userName={user?.name}
          onComplete={() => setShowTour(false)}
        />
      )}
      
      <motion.div 
        className="p-6"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={itemVariants}>
          <WelcomeHeader 
            userName={user?.name} 
            loading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCards
            loading={loading}
            stats={stats}
            completedExercises={completedExercises}
            accuracyPercentage={accuracyPercentage}
            totalTimeMinutes={totalTimeMinutes}
            className="mb-8"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <DashboardContentGrid 
            loading={loading}
            topSkills={topSkills}
            skillLevels={skillLevels}
            currentPhase={currentPhase}
            nextRecommendedNodeId={nextRecommendedNodeId}
            className="mb-8"
          />
        </motion.div>
        
        {/* Diagnóstico y Recomendaciones */}
        <motion.div variants={itemVariants}>
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <DiagnosticSummary 
              loading={diagnosticLoading}
              latestResult={latestResult}
              hasAvailableDiagnostics={availableDiagnostics > 0}
              pendingDiagnostics={pendingDiagnostics}
            />
            <FeatureCards />
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <AIFeatures />
        </motion.div>
      </motion.div>
    </AppLayout>
  );
};

export default Index;
