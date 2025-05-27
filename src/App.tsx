import React, { Suspense, memo } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { GlobalCinematicProvider } from "@/contexts/GlobalCinematicContext";
import { UnifiedEducationProvider } from "@/providers/UnifiedEducationProvider";
import { IntersectionalProvider } from "@/contexts/IntersectionalProvider";
import { OptimizedLazyLoadWrapper, useOptimizedPreloading } from "@/components/performance/OptimizedLazyLoadWrapper";
import { useAdvancedBundleOptimizer } from "@/core/performance/AdvancedBundleOptimizer";
import { useGlobalMemoryMonitor } from "@/hooks/useMemoryOptimization";
import { ProtectedRoute } from "./components/protected-route";
import { useLocation } from "react-router-dom";

// QueryClient optimizado para mejor performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      // Optimización: cache más agresivo para reducir re-renders
      refetchOnMount: false,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 1,
    },
  },
});

// Componente optimizado para rutas con memo
const AppRoutes = memo(() => {
  const location = useLocation();
  const { components } = useAdvancedBundleOptimizer(location.pathname);
  
  // Hook de preloading optimizado
  useOptimizedPreloading(location.pathname);

  return (
    <Routes>
      <Route 
        path="/auth" 
        element={
          <OptimizedLazyLoadWrapper 
            moduleName="Autenticación" 
            priority="critical"
            enableMemoryCleanup={true}
          >
            <components.Auth />
          </OptimizedLazyLoadWrapper>
        } 
      />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <OptimizedLazyLoadWrapper 
              moduleName="Hub Neural SuperPAES" 
              priority="critical"
              enableMemoryCleanup={true}
            >
              <components.Index />
            </OptimizedLazyLoadWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/lectoguia" 
        element={
          <ProtectedRoute>
            <OptimizedLazyLoadWrapper 
              moduleName="LectoGuía IA" 
              priority="high" 
              preloadDelay={100}
              enableMemoryCleanup={true}
            >
              <components.LectoGuiaPage />
            </OptimizedLazyLoadWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/financial" 
        element={
          <ProtectedRoute>
            <OptimizedLazyLoadWrapper 
              moduleName="Centro Financiero" 
              priority="medium" 
              preloadDelay={200}
              enableMemoryCleanup={true}
            >
              <components.FinancialPage />
            </OptimizedLazyLoadWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/diagnostic" 
        element={
          <ProtectedRoute>
            <OptimizedLazyLoadWrapper 
              moduleName="Diagnóstico PAES" 
              priority="high" 
              preloadDelay={150}
              enableMemoryCleanup={true}
            >
              <components.DiagnosticPage />
            </OptimizedLazyLoadWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/planning" 
        element={
          <ProtectedRoute>
            <OptimizedLazyLoadWrapper 
              moduleName="Planificador" 
              priority="medium" 
              preloadDelay={200}
              enableMemoryCleanup={true}
            >
              <components.PlanningPage />
            </OptimizedLazyLoadWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/universe" 
        element={
          <ProtectedRoute>
            <OptimizedLazyLoadWrapper 
              moduleName="Universo Educativo 3D" 
              priority="medium" 
              preloadDelay={250}
              enableMemoryCleanup={true}
            >
              <components.UniverseVisualizationPage />
            </OptimizedLazyLoadWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/achievements" 
        element={
          <ProtectedRoute>
            <OptimizedLazyLoadWrapper 
              moduleName="Sistema de Logros" 
              priority="medium" 
              preloadDelay={300}
              enableMemoryCleanup={true}
            >
              <components.AchievementsPage />
            </OptimizedLazyLoadWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ecosystem" 
        element={
          <ProtectedRoute>
            <OptimizedLazyLoadWrapper 
              moduleName="Ecosistema Integrado" 
              priority="medium" 
              preloadDelay={300}
              enableMemoryCleanup={true}
            >
              <components.EcosystemPage />
            </OptimizedLazyLoadWrapper>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
});

AppRoutes.displayName = 'AppRoutes';

// Componente principal optimizado
const App = memo(() => {
  // Monitoreo global de memoria
  const { getAllMetrics, forceGlobalCleanup } = useGlobalMemoryMonitor();

  // Log de métricas en desarrollo (solo una vez al cargar)
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        const metrics = getAllMetrics();
        console.log('📊 Métricas iniciales de memoria:', metrics);
      }, 5000);
    }
  }, [getAllMetrics]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GlobalCinematicProvider>
          <UnifiedEducationProvider>
            <IntersectionalProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Suspense fallback={
                    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                        <p>Cargando Ecosistema Neural Optimizado v2.0...</p>
                        <p className="text-sm text-cyan-300 mt-2">Sistema de memoria inteligente activo</p>
                      </div>
                    </div>
                  }>
                    <AppRoutes />
                  </Suspense>
                </BrowserRouter>
              </TooltipProvider>
            </IntersectionalProvider>
          </UnifiedEducationProvider>
        </GlobalCinematicProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
});

App.displayName = 'App';

export default App;
