
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
import { ProtectedRoute } from "./components/protected-route";
import { useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy loading optimizado de páginas con prioridades
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const LectoGuiaPage = lazy(() => import("./pages/LectoGuiaPage"));
const FinancialPage = lazy(() => import("./pages/FinancialPage"));
const DiagnosticPage = lazy(() => import("./pages/DiagnosticPage"));
const PlanningPage = lazy(() => import("./pages/PlanningPage"));
const UniverseVisualizationPage = lazy(() => import("./pages/UniverseVisualizationPage"));
const AchievementsPage = lazy(() => import("./pages/AchievementsPage"));
const EcosystemPage = lazy(() => import("./pages/EcosystemPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1, // Reducido de 2 a 1 para mejor performance
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const AppRoutes = () => {
  const location = useLocation();
  
  useOptimizedPreloading(location.pathname);

  return (
    <Routes>
      <Route 
        path="/auth" 
        element={
          <OptimizedLazyLoadWrapper moduleName="Autenticación" priority="critical">
            <Auth />
          </OptimizedLazyLoadWrapper>
        } 
      />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <OptimizedLazyLoadWrapper moduleName="Hub Neural SuperPAES" priority="critical">
              <Index />
            </OptimizedLazyLoadWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/lectoguia" 
        element={
          <ProtectedRoute>
            <OptimizedLazyLoadWrapper moduleName="LectoGuía IA" priority="high" preloadDelay={100}>
              <LectoGuiaPage />
            </OptimizedLazyLoadWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/financial" 
        element={
          <ProtectedRoute>
            <OptimizedLazyLoadWrapper moduleName="Centro Financiero" priority="medium" preloadDelay={200}>
              <FinancialPage />
            </OptimizedLazyLoadWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/diagnostic" 
        element={
          <ProtectedRoute>
            <OptimizedLazyLoadWrapper moduleName="Diagnóstico PAES" priority="high" preloadDelay={150}>
              <DiagnosticPage />
            </OptimizedLazyLoadWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/planning" 
        element={
          <ProtectedRoute>
            <OptimizedLazyLoadWrapper moduleName="Planificador" priority="medium" preloadDelay={200}>
              <PlanningPage />
            </OptimizedLazyLoadWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/universe" 
        element={
          <ProtectedRoute>
            <OptimizedLazyLoadWrapper moduleName="Universo Educativo 3D" priority="medium" preloadDelay={250}>
              <UniverseVisualizationPage />
            </OptimizedLazyLoadWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/achievements" 
        element={
          <ProtectedRoute>
            <OptimizedLazyLoadWrapper moduleName="Sistema de Logros" priority="medium" preloadDelay={300}>
              <AchievementsPage />
            </OptimizedLazyLoadWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ecosystem" 
        element={
          <ProtectedRoute>
            <OptimizedLazyLoadWrapper moduleName="Ecosistema Integrado" priority="medium" preloadDelay={300}>
              <EcosystemPage />
            </OptimizedLazyLoadWrapper>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

const App = () => (
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
                      <p>Cargando Ecosistema Neural Optimizado...</p>
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

export default App;
