
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { IntersectionalProvider } from '@/contexts/IntersectionalProvider';
import { NeuralRouter } from '@/router/NeuralRouter';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';

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
        <IntersectionalProvider>
          <NeuralRouter />
          <Toaster />
          <SonnerToaster />
        </IntersectionalProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
