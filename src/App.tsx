
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CinematicProvider } from "./components/cinematic/CinematicTransitionSystem";
import { AuthProvider } from "./contexts/AuthContext";
import { GlobalEducationProvider } from "./contexts/GlobalEducationProvider";
import { SuperContextProvider } from "./contexts/SuperContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import LectoGuiaPage from "./pages/LectoGuiaPage";
import FinancialPage from "./pages/FinancialPage";
import DiagnosticPage from "./pages/DiagnosticPage";
import PlanningPage from "./pages/PlanningPage";
import { ProtectedRoute } from "./components/protected-route";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GlobalEducationProvider>
        <SuperContextProvider>
          <CinematicProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } />
                  <Route path="/lectoguia" element={
                    <ProtectedRoute>
                      <LectoGuiaPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/financial" element={
                    <ProtectedRoute>
                      <FinancialPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/diagnostic" element={
                    <ProtectedRoute>
                      <DiagnosticPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/planning" element={
                    <ProtectedRoute>
                      <PlanningPage />
                    </ProtectedRoute>
                  } />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </CinematicProvider>
        </SuperContextProvider>
      </GlobalEducationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
