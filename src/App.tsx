
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LectoGuiaProvider } from "@/contexts/lectoguia";
import { useEffect } from "react";
import Index from "./pages/Index";
import NewIndex from "./pages/NewIndex";
import UnifiedIndex from "./pages/UnifiedIndex";
import SuperPAES from "./pages/SuperPAES";
import Calendario from "./pages/Calendario";

const queryClient = new QueryClient();

// Componente para manejar navegación por URL
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
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<UnifiedIndexWithParams />} />
              <Route path="/dashboard" element={<Index />} />
              <Route path="/home" element={<NewIndex />} />
              <Route path="/superpaes" element={<SuperPAES />} />
              <Route path="/calendario" element={<Calendario />} />
              <Route path="/financial" element={
                <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h1 className="text-4xl font-bold mb-4">Centro Financiero</h1>
                    <p className="text-xl mb-8">Calculadora de Becas y Beneficios PAES</p>
                    <p className="text-gray-300">Sistema en desarrollo - Próximamente disponible</p>
                  </div>
                </div>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LectoGuiaProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
