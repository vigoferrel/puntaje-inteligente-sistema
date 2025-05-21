
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Diagnostico from "./pages/Diagnostico";
import Plan from "./pages/Plan";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/protected-route";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/diagnostico" element={<ProtectedRoute><Diagnostico /></ProtectedRoute>} />
            <Route path="/plan" element={<ProtectedRoute><Plan /></ProtectedRoute>} />
            
            {/* Learning cycle phase routes */}
            <Route path="/entrenamiento" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
            <Route path="/contenido" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
            <Route path="/evaluaciones" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
            <Route path="/analisis" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
            <Route path="/reforzamiento" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
            <Route path="/simulaciones" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
