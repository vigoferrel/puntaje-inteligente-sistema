
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
import PAESDashboard from "./pages/PAESDashboard";
import PAESUniversePage from "./pages/PAESUniversePage";
import SubjectDetail from "./pages/SubjectDetail";
import Settings from "./pages/Settings";

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
              <Route path="/paes-dashboard" element={<PAESDashboard />} />
              <Route path="/paes-universe" element={<PAESUniversePage />} />
              <Route path="/ejercicios" element={<Ejercicios />} />
              <Route path="/finanzas" element={<Finanzas />} />
              <Route path="/centro-financiero" element={<Finanzas />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/materia/:subject" element={<SubjectDetail />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/configuracion" element={<Settings />} />
            </Routes>
          </AppInitializer>
        </BrowserRouter>
      </TooltipProvider>
    </UnifiedAppProvider>
  </QueryClientProvider>
);

export default App;
