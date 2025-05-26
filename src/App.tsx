
import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { SimpleLoadingScreen } from "@/components/SimpleLoadingScreen";
import { useSimpleInitialization } from "@/hooks/useSimpleInitialization";

// Importaciones lazy para evitar problemas de carga
import { lazy } from "react";

const Index = lazy(() => import("./pages/Index"));
const UnifiedPAESMaster = lazy(() => import("./pages/UnifiedPAESMaster"));
const PAESDashboard = lazy(() => import("./pages/PAESDashboard"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 1, // Solo 1 reintento
    },
  },
});

// Componente interno para manejar la inicialización
const AppContent: React.FC = () => {
  const { isReady, error, hasUser } = useSimpleInitialization();

  // Mostrar loading mientras se inicializa
  if (!isReady) {
    return <SimpleLoadingScreen />;
  }

  // Mostrar error si hay uno
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Error del Sistema</h1>
          <p className="text-red-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
          >
            Recargar
          </button>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<SimpleLoadingScreen />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/unified" element={<UnifiedPAESMaster />} />
        <Route path="/paes" element={<PAESDashboard />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
