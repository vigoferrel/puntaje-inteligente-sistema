
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { IntersectionalProvider } from '@/contexts/IntersectionalProvider';
import { NeuralRouter } from '@/router/NeuralRouter';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <IntersectionalProvider>
          <div className="min-h-screen">
            <NeuralRouter />
            <Toaster />
          </div>
        </IntersectionalProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
