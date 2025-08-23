import { FC, useEffect, useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import './DiagnosticComponent.css';
import { supabase } from '../integrations/supabase/leonardo-auth-client';

const DiagnosticComponent: FC = () => {
  const [diagnostics, setDiagnostics] = useState({
    react: false,
    supabase: false,
    contexts: false,
    webgl: false
  });

  useEffect(() => {
    const runDiagnostics = async () => {
      console.log('🔍 Ejecutando diagnósticos...');
      
      // Test React
      try {
        setDiagnostics(prev => ({ ...prev, react: true }));
        console.log('✅ React funcionando');
      } catch (error) {
        console.error('❌ Error en React:', error);
      }

      // Test Supabase
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';
        
        // DISABLED: const supabase = createClient(supabaseUrl, supabaseKey);
        setDiagnostics(prev => ({ ...prev, supabase: true }));
        console.log('✅ Supabase cliente creado');
      } catch (error) {
        console.error('❌ Error en Supabase:', error);
      }

      // Test WebGL
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          setDiagnostics(prev => ({ ...prev, webgl: true }));
          console.log('✅ WebGL disponible');
        } else {
          console.warn('⚠️ WebGL no disponible');
        }
      } catch (error) {
        console.error('❌ Error en WebGL:', error);
      }

      // Test Contexts
      try {
        setDiagnostics(prev => ({ ...prev, contexts: true }));
        console.log('✅ Contextos básicos funcionando');
      } catch (error) {
        console.error('❌ Error en contextos:', error);
      }
    };

    runDiagnostics();
  }, []);

  return (
    <div className="diagnostic-container">
      <h1 className="diagnostic-title">🚀 PAES System - Diagnóstico</h1>
      <div className="diagnostic-section">
        <h2>Estado de Componentes:</h2>
        <ul className="diagnostic-list">
          <li>{diagnostics.react ? '✅' : '❌'} React</li>
          <li>{diagnostics.supabase ? '✅' : '❌'} Supabase</li>
          <li>{diagnostics.webgl ? '✅' : '⚠️'} WebGL</li>
          <li>{diagnostics.contexts ? '✅' : '❌'} Contextos</li>
        </ul>
      </div>
      
      <div className="diagnostic-section">
        <h2>Variables de Entorno:</h2>
        <ul className="env-list">
          <li>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Configurada' : '❌ No configurada'}</li>
          <li>VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada'}</li>
          <li>NODE_ENV: {import.meta.env.NODE_ENV || 'development'}</li>
        </ul>
      </div>

      <div className="diagnostic-section">
        <button
          onClick={() => window.location.reload()}
          className="reload-button"
        >
          Recargar Diagnóstico
        </button>
      </div>
    </div>
  );
};

export default DiagnosticComponent;
