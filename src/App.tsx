
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LectoGuiaProvider } from "@/contexts/lectoguia";
import { CinematicThemeProvider } from "@/contexts/CinematicThemeProvider";
import { useEffect, useState } from "react";
import { NeuralCommandCenter } from "@/components/neural-command/NeuralCommandCenter";
import UnifiedIndex from "./pages/UnifiedIndex";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, ArrowUpDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: false,
    },
  },
});

// Sistema de toggle entre Neural y Unified
const SystemToggle = ({ currentSystem, onToggle }: { currentSystem: 'neural' | 'unified', onToggle: () => void }) => (
  <div className="fixed top-4 right-4 z-50">
    <Card className="bg-black/60 backdrop-blur-xl border-cyan-500/30">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <Badge className={`${currentSystem === 'neural' ? 'bg-cyan-600' : 'bg-gray-600'}`}>
            <Brain className="w-3 h-3 mr-1" />
            Neural
          </Badge>
          
          <Button
            onClick={onToggle}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>
          
          <Badge className={`${currentSystem === 'unified' ? 'bg-purple-600' : 'bg-gray-600'}`}>
            <Sparkles className="w-3 h-3 mr-1" />
            Unificado
          </Badge>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Componente principal con toggle de sistema
const MainSystemWithToggle = () => {
  const [searchParams] = useSearchParams();
  const [systemMode, setSystemMode] = useState<'neural' | 'unified'>('neural');
  const tool = searchParams.get('tool');
  
  useEffect(() => {
    if (tool) {
      console.log(`🔗 Navegando via URL a herramienta: ${tool}`);
    }
  }, [tool]);

  const toggleSystem = () => {
    setSystemMode(prev => prev === 'neural' ? 'unified' : 'neural');
  };

  return (
    <>
      <SystemToggle currentSystem={systemMode} onToggle={toggleSystem} />
      
      {systemMode === 'neural' ? (
        <NeuralCommandCenter />
      ) : (
        <UnifiedIndex initialTool={tool} />
      )}
    </>
  );
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
                {/* Todas las rutas ahora muestran el sistema con toggle */}
                <Route path="/*" element={<MainSystemWithToggle />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CinematicThemeProvider>
      </LectoGuiaProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
