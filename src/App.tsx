
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UnifiedAppProvider } from "./contexts/UnifiedAppProvider";
import { AppInitializer } from "./components/AppInitializer";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Diagnostico from "./pages/Diagnostico";
import Plan from "./pages/Plan";
import Calendario from "./pages/Calendario";
import LectoGuia from "./pages/LectoGuia";
import PAES from "./pages/PAES";
import Ejercicios from "./pages/Ejercicios";
import Finanzas from "./pages/Finanzas";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UnifiedAppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppInitializer>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/diagnostico" element={<Diagnostico />} />
              <Route path="/plan" element={<Plan />} />
              <Route path="/calendario" element={<Calendario />} />
              <Route path="/lectoguia" element={<LectoGuia />} />
              <Route path="/paes" element={<PAES />} />
              <Route path="/ejercicios" element={<Ejercicios />} />
              <Route path="/finanzas" element={<Finanzas />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </AppInitializer>
        </BrowserRouter>
      </TooltipProvider>
    </UnifiedAppProvider>
  </QueryClientProvider>
);

export default App;
