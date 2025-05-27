
import React, { useState, useEffect } from 'react';
import { EducationalUniverse } from '@/components/universe/EducationalUniverse';
import { useOptimizedLectoGuia } from '@/hooks/lectoguia/useOptimizedLectoGuia';
import { useUnifiedEducation } from '@/providers/UnifiedEducationProvider';
import { EmergencyBypass } from '@/components/emergency/EmergencyBypass';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Activity, Zap } from 'lucide-react';

const LectoGuiaPage: React.FC = () => {
  const { activateLectoGuia, isReady } = useOptimizedLectoGuia();
  const { system, ui, metrics } = useUnifiedEducation();
  const [loadingStartTime] = useState(Date.now());
  const [loadingTime, setLoadingTime] = useState(0);
  const [emergencyMode, setEmergencyMode] = useState(false);

  // Contador de tiempo de carga
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingTime(Date.now() - loadingStartTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [loadingStartTime]);

  // Activación inicial
  useEffect(() => {
    activateLectoGuia();
  }, [activateLectoGuia]);

  const handleEmergencyBypass = () => {
    console.log('🚨 EMERGENCY BYPASS ACTIVADO por usuario');
    setEmergencyMode(true);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // Modo de emergencia - renderizado básico
  if (emergencyMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Brain className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium">LectoGuía IA - Modo Emergencia</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-400">Funcionalidad Básica</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white/60">Estado: </span>
                <span className="font-medium text-orange-400">Emergencia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          <Card className="bg-white/10 border-white/20 backdrop-blur-lg mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-orange-400" />
                <h2 className="text-xl font-bold text-white">Modo Emergencia Activo</h2>
              </div>
              <p className="text-white/70 mb-4">
                El sistema está funcionando con funcionalidades básicas. 
                Algunas características avanzadas pueden no estar disponibles.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-500/20 rounded-lg p-3 border border-green-500/30">
                  <div className="text-sm font-semibold text-green-400">✅ Disponible</div>
                  <div className="text-xs text-white/70">Navegación básica</div>
                </div>
                <div className="bg-green-500/20 rounded-lg p-3 border border-green-500/30">
                  <div className="text-sm font-semibold text-green-400">✅ Disponible</div>
                  <div className="text-xs text-white/70">Contenido educativo</div>
                </div>
                <div className="bg-orange-500/20 rounded-lg p-3 border border-orange-500/30">
                  <div className="text-sm font-semibold text-orange-400">⚠️ Limitado</div>
                  <div className="text-xs text-white/70">Funciones avanzadas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <EducationalUniverse 
            initialMode="subject"
            activeSubject="competencia-lectora"
          />
        </div>
      </div>
    );
  }

  // Loading con Emergency Bypass
  if (!isReady) {
    return (
      <EmergencyBypass
        onBypass={handleEmergencyBypass}
        onRetry={handleRetry}
        isLoading={true}
        loadingTime={loadingTime}
      />
    );
  }

  // Renderizado normal
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header de estado del sistema */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Brain className="w-4 h-4 text-blue-400" />
                <span className="text-white font-medium">LectoGuía IA</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Sistema: {system.healthScore}%</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white/60">Conexión: </span>
              <span className={`font-medium ${
                ui.connectionStatus === 'connected' ? 'text-green-400' : 'text-red-400'
              }`}>
                {ui.connectionStatus === 'connected' ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <EducationalUniverse 
        initialMode="subject"
        activeSubject="competencia-lectora"
      />
    </div>
  );
};

export default LectoGuiaPage;
