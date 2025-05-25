
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { LectoGuiaProvider } from "@/contexts/lectoguia";
import { CinematicThemeProvider } from "@/contexts/CinematicThemeProvider";
import { IntersectionalProvider } from "@/contexts/IntersectionalProvider";
import { NeuralRouter } from "@/router/NeuralRouter";
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <IntersectionalProvider>
        <LectoGuiaProvider>
          <CinematicThemeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <NeuralRouter />
            </TooltipProvider>
          </CinematicThemeProvider>
        </LectoGuiaProvider>
      </IntersectionalProvider>
    </AuthProvider>
  </QueryClientProvider>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
