
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LectoGuiaProvider } from "@/contexts/lectoguia";
import { CinematicThemeProvider } from "@/contexts/CinematicThemeProvider";
import { useEffect } from "react";
import UnifiedIndex from "./pages/UnifiedIndex";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: false,
    },
  },
});

// Componente para manejar navegación por URL con todas las rutas
const UnifiedIndexWithParams = () => {
  const [searchParams] = useSearchParams();
  const tool = searchParams.get('tool');
  
  useEffect(() => {
    if (tool) {
      console.log(`🔗 Navegando via URL a herramienta: ${tool}`);
    }
  }, [tool]);
  
  return <UnifiedIndex initialTool={tool} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LectoGuiaProvider>
        <CinematicThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Todas las rutas redirigen al dashboard unificado */}
                <Route path="/" element={<UnifiedIndexWithParams />} />
                <Route path="/dashboard" element={<UnifiedIndexWithParams />} />
                <Route path="/lectoguia" element={<UnifiedIndexWithParams />} />
                <Route path="/calendar" element={<UnifiedIndexWithParams />} />
                <Route path="/calendario" element={<UnifiedIndexWithParams />} />
                <Route path="/financial" element={<UnifiedIndexWithParams />} />
                <Route path="/finanzas" element={<UnifiedIndexWithParams />} />
                <Route path="/exercises" element={<UnifiedIndexWithParams />} />
                <Route path="/ejercicios" element={<UnifiedIndexWithParams />} />
                <Route path="/diagnostic" element={<UnifiedIndexWithParams />} />
                <Route path="/diagnostico" element={<UnifiedIndexWithParams />} />
                <Route path="/plan" element={<UnifiedIndexWithParams />} />
                <Route path="/superpaes" element={<UnifiedIndexWithParams />} />
                <Route path="*" element={<UnifiedIndexWithParams />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CinematicThemeProvider>
      </LectoGuiaProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
