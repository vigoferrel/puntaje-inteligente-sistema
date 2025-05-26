
import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { SimpleLoadingScreen } from "@/components/SimpleLoadingScreen";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useStableInitialization } from "@/hooks/useStableInitialization";
import { lazy } from "react";

// Lazy imports con error boundaries individuales
const Index = lazy(() => import("./pages/Index").catch(() => {
  console.error('Error loading Index page');
  return { default: () => <div className="p-8 text-center text-red-500">Error cargando página principal</div> };
}));

const UnifiedPAESMaster = lazy(() => import("./pages/UnifiedPAESMaster").catch(() => {
  console.error('Error loading UnifiedPAESMaster page');
  return { default: () => <div className="p-8 text-center text-red-500">Error cargando página unificada</div> };
}));

const PAESDashboard = lazy(() => import("./pages/PAESDashboard").catch(() => {
  console.error('Error loading PAESDashboard page');
  return { default: () => <div className="p-8 text-center text-red-500">Error cargando dashboard PAES</div> };
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

// Componente interno para manejar la inicialización
const AppContent: React.FC = () => {
  const { isReady, error, hasUser } = useStableInitialization();

  // Mostrar loading mientras se inicializa
  if (!isReady) {
    return <SimpleLoadingScreen />;
  }

  // Mostrar error si hay uno
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Error del Sistema</h1>
          <p className="text-red-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white transition-colors"
          >
            Recargar Página
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<SimpleLoadingScreen />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/unified" element={<UnifiedPAESMaster />} />
          <Route path="/paes" element={<PAESDashboard />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

const App = () => {
  return (
    <ErrorBoundary onError={(error) => console.error('Global error:', error)}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
