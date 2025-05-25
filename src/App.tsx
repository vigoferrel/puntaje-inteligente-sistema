
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UnifiedAppProvider } from "./contexts/UnifiedAppProvider";
import { IntersectionalProvider } from "./contexts/IntersectionalProvider";
import { CinematicProvider } from "@/components/cinematic/CinematicTransitionSystem";
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
    <UnifiedAppProvider>
      <IntersectionalProvider>
        <CinematicProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppRouter />
          </TooltipProvider>
        </CinematicProvider>
      </IntersectionalProvider>
    </UnifiedAppProvider>
  </QueryClientProvider>
);

export default App;
