
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "@/contexts/AuthContext";
import { IntersectionalProvider } from "@/contexts/IntersectionalProvider";
import { UnifiedSystemContainer } from "@/components/unified-system/UnifiedSystemContainer";
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <IntersectionalProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <UnifiedSystemContainer />
          </TooltipProvider>
        </IntersectionalProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
