
import { useState, useEffect, useCallback } from "react";
import { useDiagnostic } from "@/hooks/use-diagnostic";
import { toast } from "@/components/ui/use-toast";
import { useDemonstrationMode } from "./use-demonstration-mode";
import { useAuth } from "@/contexts/AuthContext";

interface DiagnosticInitializationResult {
  initializing: boolean;
  generatingDiagnostic: boolean;
  error: string | null;
  retryInitialization: () => Promise<void>;
  retryCount: number;
  progress: number;
  loadingStep: string;
  isDemoMode: boolean;
}

export const useDiagnosticInitialization = (): DiagnosticInitializationResult => {
  const [initializing, setInitializing] = useState(true);
  const [generatingDiagnostic, setGeneratingDiagnostic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState("Inicializando");
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // Get diagnostic service
  const diagnosticService = useDiagnostic();
  const { user } = useAuth();
  
  // Get demo mode hook
  const demoMode = useDemonstrationMode();
  
  // Función para cargar diagnósticos reales de la base de datos
  const loadRealDiagnostics = useCallback(async () => {
    if (!user?.id) {
      console.log("No hay usuario autenticado, usando ID por defecto");
    }
    
    setLoadingStep("Cargando diagnósticos de la base de datos");
    setProgress(30);
    
    // Intentar cargar diagnósticos reales
    const userId = user?.id || "auto-generated";
    const loadedTests = await diagnosticService.fetchDiagnosticTests(userId);
    
    setProgress(80);
    
    if (loadedTests && loadedTests.length > 0) {
      console.log(`✅ Diagnósticos reales cargados: ${loadedTests.length}`);
      setProgress(100);
      setError(null);
      return true;
    }
    
    return false;
  }, [diagnosticService, user?.id]);
  
  // Función para activar el modo demostración como fallback
  const activateDemonstrationMode = useCallback(() => {
    console.log("🔄 Activando modo demostración como fallback");
    setLoadingStep("Cargando diagnósticos de demostración");
    
    // Activar el modo demo
    demoMode.activateDemoMode();
    setIsDemoMode(true);
    
    // Sustituir los tests del servicio con tests de demostración
    diagnosticService.tests = demoMode.getDemoDiagnosticTests();
    
    console.log("Modo demostración activado, tests cargados:", diagnosticService.tests.length);
    
    toast({
      title: "Modo demostración",
      description: "Se han cargado diagnósticos de demostración debido a problemas de conectividad",
    });
    
    setProgress(100);
    setError(null);
  }, [demoMode, diagnosticService]);
  
  // Función principal para inicializar diagnósticos
  const initDiagnostics = useCallback(async () => {
    try {
      setError(null);
      setInitializing(true);
      setIsDemoMode(false);
      setProgress(10);
      setLoadingStep("Conectando con la base de datos");
      
      // Primero intentar cargar diagnósticos reales
      const realDataLoaded = await loadRealDiagnostics();
      
      if (realDataLoaded) {
        // Si se cargaron datos reales exitosamente
        setInitializing(false);
        return;
      }
      
      // Si no hay datos reales, intentar generar diagnósticos por defecto
      setLoadingStep("Generando diagnósticos por defecto");
      setProgress(50);
      
      const hasDefaultTests = await diagnosticService.ensureDefaultDiagnosticsExist();
      
      if (hasDefaultTests) {
        // Reintentar cargar después de generar por defecto
        const retryLoaded = await loadRealDiagnostics();
        if (retryLoaded) {
          setInitializing(false);
          return;
        }
      }
      
      // Como último recurso, activar modo demostración
      console.warn("⚠️ No se pudieron cargar diagnósticos reales, activando modo demo");
      activateDemonstrationMode();
      
    } catch (error) {
      console.error("❌ Error al inicializar diagnósticos:", error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      
      // En caso de error, usar modo demostración
      activateDemonstrationMode();
    } finally {
      setInitializing(false);
      setGeneratingDiagnostic(false);
    }
  }, [loadRealDiagnostics, diagnosticService, activateDemonstrationMode]);

  // Inicializar datos solo una vez al cargar
  useEffect(() => {
    initDiagnostics();
    // Solo ejecutar al montar el componente
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Función para reintentar inicialización
  const retryInitialization = async () => {
    setRetryCount(prev => prev + 1);
    await initDiagnostics();
  };

  return {
    initializing,
    generatingDiagnostic,
    error,
    retryInitialization,
    retryCount,
    progress,
    loadingStep,
    isDemoMode
  };
};
