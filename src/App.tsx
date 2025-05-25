
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UnifiedAppProvider } from "./contexts/UnifiedAppProvider";
import { IntersectionalProvider } from "./contexts/IntersectionalProvider";
import { CinematicProvider } from "@/components/cinematic/CinematicTransitionSystem";
import { NeuralErrorBoundary } from "@/components/neural/NeuralErrorBoundary";
import { AppRouter } from "@/router/AppRouter";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <NeuralErrorBoundary 
      onError={(error) => console.error('🧠 App Level Error:', error.message)}
    >
      <UnifiedAppProvider>
        <IntersectionalProvider>
          <CinematicProvider>
            <TooltipProvider>
              <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
                <Toaster />
                <Sonner />
                <AppRouter />
              </div>
            </TooltipProvider>
          </CinematicProvider>
        </IntersectionalProvider>
      </UnifiedAppProvider>
    </NeuralErrorBoundary>
  </QueryClientProvider>
);

export default App;
