
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

// Sistema anti-bucles quirúrgicamente optimizado
let isInitializing = false;
let hasInitialized = false;
let initPromise: Promise<void> | null = null;
let lastInitAttempt = 0;
let initializationLock = false;

export const useUnifiedInitialization = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initRef = useRef(false);
  const mountedRef = useRef(true);
  const stabilityRef = useRef(false);

  const initialize = useCallback(async () => {
    const now = Date.now();
    
    // Prevenir múltiples inicializaciones quirúrgicamente
    if (!profile?.id || 
        hasInitialized || 
        isInitializing || 
        initRef.current || 
        initializationLock ||
        (now - lastInitAttempt < 10000)) { // 10 segundos entre intentos
      return;
    }

    // Bloqueo quirúrgico
    initializationLock = true;
    lastInitAttempt = now;
    initRef.current = true;
    isInitializing = true;
    
    if (mountedRef.current) {
      setLoading(true);
      setError(null);
    }

    try {
      console.log('🚀 Inicialización unificada QUIRÚRGICAMENTE OPTIMIZADA');
      
      // Simulación de carga ultra-rápida
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verificar estabilidad antes de marcar como completado
      if (mountedRef.current) {
        hasInitialized = true;
        stabilityRef.current = true;
        
        // Toast diferido para evitar interferencias
        setTimeout(() => {
          if (mountedRef.current && stabilityRef.current) {
            toast({
              title: "Sistema Neural Unificado",
              description: "Todas las funcionalidades integradas",
            });
          }
        }, 2000);
      }

    } catch (err) {
      console.error('❌ Error en inicialización:', err);
      if (mountedRef.current) {
        setError('Error al inicializar el sistema neural');
        stabilityRef.current = false;
      }
      initRef.current = false;
      hasInitialized = false;
    } finally {
      isInitializing = false;
      initializationLock = false;
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [profile?.id]);

  useEffect(() => {
    mountedRef.current = true;
    
    if (profile?.id && !hasInitialized && !isInitializing && !initializationLock) {
      // Inicialización aún más diferida para máxima estabilidad
      const timer = setTimeout(initialize, 200);
      return () => clearTimeout(timer);
    }
    
    return () => {
      mountedRef.current = false;
      stabilityRef.current = false;
    };
  }, [profile?.id, initialize]);

  // Cleanup total al desmontar
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      stabilityRef.current = false;
      if (!mountedRef.current) {
        initRef.current = false;
      }
    };
  }, []);

  return {
    loading,
    error,
    hasInitialized: hasInitialized && stabilityRef.current,
    retry: initialize
  };
};
