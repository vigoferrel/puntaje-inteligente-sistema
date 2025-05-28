
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Navigation } from '@/modules/shared/Navigation';

// Páginas principales consolidadas
import Index from '@/pages/Index';
import { LectoGuiaPage } from '@/pages/LectoGuiaPage';
import { DiagnosticPage } from '@/pages/DiagnosticPage';
import { PlanningPage } from '@/pages/PlanningPage';

// Contextos
import { AuthProvider } from '@/contexts/AuthContext';
import { SuperContextProvider } from '@/contexts/SuperContext';

// Cliente de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SuperContextProvider>
          <Router>
            <div className="min-h-screen">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/lectoguia" element={<LectoGuiaPage />} />
                <Route path="/diagnostic" element={<DiagnosticPage />} />
                <Route path="/planning" element={<PlanningPage />} />
              </Routes>
              <Navigation />
              <Toaster />
            </div>
          </Router>
        </SuperContextProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
