
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UnifiedEducationProvider } from "@/providers/UnifiedEducationProvider";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
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
  
  // Preloading inteligente basado en ruta actual
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
            <LazyLoadWrapper moduleName="Dashboard Principal" priority="high">
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
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UnifiedEducationProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <p>Cargando Aplicación...</p>
              </div>
            </div>
          }>
            <AppRoutes />
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </UnifiedEducationProvider>
  </QueryClientProvider>
);

export default App;
