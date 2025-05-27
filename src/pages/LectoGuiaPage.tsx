
import React from 'react';
import { EducationalUniverse } from '@/components/universe/EducationalUniverse';
import { useOptimizedLectoGuia } from '@/hooks/lectoguia/useOptimizedLectoGuia';
import { useUnifiedEducation } from '@/providers/UnifiedEducationProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Activity, Zap } from 'lucide-react';

const LectoGuiaPage: React.FC = () => {
  const { activateLectoGuia, isReady } = useOptimizedLectoGuia();
  const { system, ui, metrics } = useUnifiedEducation();

  React.useEffect(() => {
    activateLectoGuia();
  }, [activateLectoGuia]);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
          <CardContent className="p-8 text-center">
            <Brain className="w-12 h-12 mx-auto mb-4 text-blue-400 animate-pulse" />
            <h2 className="text-xl font-bold text-white mb-2">Inicializando LectoGuía</h2>
            <p className="text-white/70">Cargando sistema educativo inteligente...</p>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Health: {system.healthScore}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400">Level: {metrics.level}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
