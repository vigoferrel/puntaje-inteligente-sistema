
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CinematicProvider } from "./components/cinematic/CinematicTransitionSystem";
import Index from "./pages/Index";
import SurgeonPage from "./pages/SurgeonPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CinematicProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/surgeon" element={<SurgeonPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CinematicProvider>
  </QueryClientProvider>
);

export default App;
