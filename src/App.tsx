
import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { CinematicThemeProvider } from "@/contexts/CinematicThemeProvider";
import { SimpleLoadingScreen } from "@/components/SimpleLoadingScreen";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AutoRecoverySystem } from "@/components/recovery/AutoRecoverySystem";
import { CinematicInterfaceMaster } from "@/components/cinematic/CinematicInterfaceMaster";
import { useState } from "react";
import { lazy } from "react";

// Lazy imports simplificados con error handling
const Index = lazy(() => import("./pages/Index").catch(() => {
  console.error('Error loading Index page');
  return { default: () => <div className="p-8 text-center text-cyan-400">Página principal cargando...</div> };
}));

const UnifiedPAESMaster = lazy(() => import("./pages/UnifiedPAESMaster").catch(() => {
  console.error('Error loading UnifiedPAESMaster page');
  return { default: () => <div className="p-8 text-center text-cyan-400">Sistema unificado cargando...</div> };
}));

const PAESDashboard = lazy(() => import("./pages/PAESDashboard").catch(() => {
  console.error('Error loading PAESDashboard page');
  return { default: () => <div className="p-8 text-center text-cyan-400">Dashboard PAES cargando...</div> };
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [currentModule, setCurrentModule] = useState('dashboard');
  const [userProgress] = useState({
    totalProgress: 75,
    currentStreak: 15,
    paesScore: 685,
    studyHours: 142
  });

  const handleModuleChange = (module: string) => {
    setCurrentModule(module);
  };

  return (
    <ErrorBoundary onError={(error) => console.error('Global error:', error)}>
      <AutoRecoverySystem>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <CinematicThemeProvider>
                <CinematicInterfaceMaster
                  currentModule={currentModule}
                  userProgress={userProgress}
                  onModuleChange={handleModuleChange}
                >
                  <Suspense fallback={<SimpleLoadingScreen />}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/unified" element={<UnifiedPAESMaster />} />
                      <Route path="/paes" element={<PAESDashboard />} />
                    </Routes>
                  </Suspense>
                </CinematicInterfaceMaster>
              </CinematicThemeProvider>
              <Toaster />
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </AutoRecoverySystem>
    </ErrorBoundary>
  );
};

export default App;
