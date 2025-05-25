
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LectoGuiaProvider } from "@/contexts/lectoguia";
import Index from "./pages/Index";
import NewIndex from "./pages/NewIndex";
import UnifiedIndex from "./pages/UnifiedIndex";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LectoGuiaProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<UnifiedIndex />} />
              <Route path="/dashboard" element={<Index />} />
              <Route path="/home" element={<NewIndex />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LectoGuiaProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
