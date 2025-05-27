
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { GlobalCinematicProvider } from "@/contexts/GlobalCinematicContext";
import { UnifiedEducationProvider } from "@/providers/UnifiedEducationProvider";
import { IntersectionalProvider } from "@/contexts/IntersectionalProvider";
import { LazyLoadWrapper, useIntelligentPreloading } from "@/components/performance/LazyLoadWrapper";
import { ProtectedRoute } from "./components/protected-route";
import { useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy loading optimizado de páginas
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
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const AppRoutes = () => {
  const location = useLocation();
  
  useIntelligentPreloading(location.pathname);

  return (
    <Routes>
      <Route 
        path="/auth" 
        element={
          <LazyLoadWrapper moduleName="Autenticación" priority="high">
            <Auth />
          </LazyLoadWrapper>
        } 
      />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <LazyLoadWrapper moduleName="Hub Neural SuperPAES" priority="high">
              <Index />
            </LazyLoadWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/lectoguia" 
        element={
          <ProtectedRoute>
            <LazyLoadWrapper moduleName="LectoGuía IA" priority="high" preloadDelay={200}>
              <LectoGuiaPage />
            </LazyLoadWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/financial" 
        element={
          <ProtectedRoute>
            <LazyLoadWrapper moduleName="Centro Financiero" priority="medium" preloadDelay={500}>
              <FinancialPage />
            </LazyLoadWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/diagnostic" 
        element={
          <ProtectedRoute>
            <LazyLoadWrapper moduleName="Diagnóstico PAES" priority="medium" preloadDelay={500}>
              <DiagnosticPage />
            </LazyLoadWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/planning" 
        element={
          <ProtectedRoute>
            <LazyLoadWrapper moduleName="Planificador" priority="medium" preloadDelay={500}>
              <PlanningPage />
            </LazyLoadWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/universe" 
        element={
          <ProtectedRoute>
            <LazyLoadWrapper moduleName="Universo Educativo 3D" priority="medium" preloadDelay={300}>
              <UniverseVisualizationPage />
            </LazyLoadWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/achievements" 
        element={
          <ProtectedRoute>
            <LazyLoadWrapper moduleName="Sistema de Logros" priority="medium" preloadDelay={400}>
              <AchievementsPage />
            </LazyLoadWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ecosystem" 
        element={
          <ProtectedRoute>
            <LazyLoadWrapper moduleName="Ecosistema Integrado" priority="medium" preloadDelay={400}>
              <EcosystemPage />
            </LazyLoadWrapper>
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
                      <p>Cargando Ecosistema Educativo...</p>
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
