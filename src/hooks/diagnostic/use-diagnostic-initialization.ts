
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDiagnostic } from '@/hooks/use-diagnostic';

export const useDiagnosticInitialization = () => {
  const { user } = useAuth();
  const diagnosticService = useDiagnostic();
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [generatingDiagnostic, setGeneratingDiagnostic] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isDemoMode] = useState(false); // Always false now since we use real data

  useEffect(() => {
    const initializeDiagnostic = async () => {
      if (!user?.id) {
        setInitializing(false);
        return;
      }
      
      try {
        setInitializing(true);
        setGeneratingDiagnostic(true);
        
        // Fetch real diagnostic tests
        await diagnosticService.fetchDiagnosticTests(user.id);
        
        // Ensure we have at least one diagnostic test available
        if (diagnosticService.tests.length === 0) {
          await diagnosticService.ensureDefaultDiagnosticsExist();
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing diagnostic system:', error);
      } finally {
        setInitializing(false);
        setGeneratingDiagnostic(false);
      }
    };

    initializeDiagnostic();
  }, [user?.id, diagnosticService]);

  const retryInitialization = async () => {
    setRetryCount(prev => prev + 1);
    setInitializing(true);
    setGeneratingDiagnostic(true);
    
    try {
      if (user?.id) {
        await diagnosticService.fetchDiagnosticTests(user.id);
        if (diagnosticService.tests.length === 0) {
          await diagnosticService.createLocalFallbackDiagnostics();
        }
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Retry initialization failed:', error);
    } finally {
      setInitializing(false);
      setGeneratingDiagnostic(false);
    }
  };

  return {
    isInitialized,
    initializing,
    generatingDiagnostic,
    error: diagnosticService.loading ? null : (diagnosticService.tests.length === 0 ? 'No diagnostic tests available' : null),
    retryInitialization,
    retryCount,
    isDemoMode,
    tests: diagnosticService.tests,
    loading: diagnosticService.loading
  };
};
