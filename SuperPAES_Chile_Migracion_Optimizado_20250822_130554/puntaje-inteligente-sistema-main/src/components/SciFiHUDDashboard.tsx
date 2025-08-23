/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState } from 'react';
import { useSciFiHUD } from '../hooks/useSciFiHUD';
import { useSciFiNotifications } from '../hooks/useSciFiNotifications';
import { useRealNeuralMetrics } from '../hooks/useRealNeuralMetrics';
import '../styles/SciFiHUDDashboard.css';

interface HUDMetricProps {
  label: string;
  value: number;
  unit?: string;
  color: string;
  icon: string;
}

const HUDMetric: React.FC<HUDMetricProps> = ({ label, value, unit = '%', color, icon }) => (
  <div className="relative bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-pulse"></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-cyan-300 text-sm font-mono">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">
        {value.toFixed(1)}<span className="text-lg text-cyan-400">{unit}</span>
      </div>
      <div className="hud-metric-bar">
        <div
          className={`hud-metric-progress ${color}`}
          className="dynamic-progress-fill" data-progress={Math.min(value, 100)}
        ></div>
      </div>
    </div>
  </div>
);

interface NeuralPatternProps {
  pattern: {
    pattern: string;
    intensity: number;
    frequency: number;
  };
}

const NeuralPattern: React.FC<NeuralPatternProps> = ({ pattern }) => (
  <div className="flex items-center justify-between p-3 bg-black/30 rounded border border-purple-500/30">
    <div>
      <div className="text-purple-300 font-mono text-sm">{pattern.pattern.replace('_', ' ').toUpperCase()}</div>
      <div className="text-white text-lg font-bold">{pattern.intensity.toFixed(1)}%</div>
    </div>
    <div className="text-purple-400">
      <div className="text-xs">FREQ</div>
      <div className="font-mono">{pattern.frequency.toFixed(1)}Hz</div>
    </div>
  </div>
);

interface NotificationItemProps {
  notification: {
    id: string;
    type: string;
    title: string;
    message: string;
    priority: string;
    createdAt: Date;
  };
  onDismiss: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onDismiss }) => {
  const priorityColors = {
    low: 'border-blue-500/50 bg-blue-500/10',
    medium: 'border-yellow-500/50 bg-yellow-500/10',
    high: 'border-orange-500/50 bg-orange-500/10',
    critical: 'border-red-500/50 bg-red-500/10'
  };

  const typeIcons = {
    achievement: 'Ã°Å¸Ââ€ ',
    warning: 'Ã¢Å¡Â Ã¯Â¸Â',
    insight: 'Ã°Å¸â€™Â¡',
    recommendation: 'Ã°Å¸Å½Â¯',
    system: 'Ã¢Å¡â„¢Ã¯Â¸Â'
  };

  return (
    <div className={`p-3 rounded-lg border backdrop-blur-sm ${priorityColors[notification.priority as keyof typeof priorityColors] || priorityColors.medium}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2">
          <span className="text-xl">{typeIcons[notification.type as keyof typeof typeIcons] || 'Ã°Å¸â€œÂ¢'}</span>
          <div>
            <div className="text-white font-semibold text-sm">{notification.title}</div>
            <div className="text-gray-300 text-xs mt-1">{notification.message}</div>
            <div className="text-gray-500 text-xs mt-1">
              {notification.createdAt.toLocaleTimeString()}
            </div>
          </div>
        </div>
        <button
          onClick={() => onDismiss(notification.id)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          Ã¢Å“â€¢
        </button>
      </div>
    </div>
  );
};

export const SciFiHUDDashboard: React.FC = () => {
  const { hudData, isLoading, enableRealTime, disableRealTime, isRealTime } = useSciFiHUD();
  const notificationsHook = useSciFiNotifications();
  const { metrics } = useRealNeuralMetrics();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Extraer propiedades del hook de notificaciones
  const visibleNotifications = notificationsHook.visibleNotifications || [];
  const dismissNotification = notificationsHook.dismissNotification || (() => {});

  // eslint-disable-next-line react-hooks/exhaustive-depsuseEffect(() => {
    const timer = // INTERVAL DESHABILITADO: setInterval(..., 1000);
    return () => clearInterval(timer);
  }, []);useEffect(() => {
    const timer = // INTERVAL DESHABILITADO: setInterval(..., 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Activar modo tiempo real automÃƒÂ¡ticamente
    enableRealTime();
    return () => disableRealTime();
  }, [enableRealTime, disableRealTime]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-xl font-mono animate-pulse">
          INICIALIZANDO HUD NEURAL...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-mono relative overflow-hidden">
      {/* Efectos de fondo futurÃƒÂ­sticos */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse"></div>
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-pulse"></div>
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-pulse"></div>
      </div>

      {/* Header HUD */}
      <div className="relative z-10 p-6 border-b border-cyan-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">NEURAL HUD</h1>
            <p className="text-cyan-300 text-sm">Sistema de Monitoreo Avanzado</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-cyan-400 text-sm">
              {isRealTime ? 'Ã°Å¸Å¸Â¢ TIEMPO REAL ACTIVO' : 'Ã°Å¸â€Â´ MODO ESTÃƒÂTICO'}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel Principal - MÃƒÂ©tricas Neurales */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-cyan-400 mb-4">MÃƒâ€°TRICAS NEURALES PRINCIPALES</h2>
            <div className="grid grid-cols-2 gap-4">
              <HUDMetric
                label="EFICIENCIA NEURAL"
                value={hudData?.neuralEfficiency || metrics?.neural_efficiency || 0}
                color="bg-gradient-to-r from-cyan-500 to-blue-500"
                icon="Ã°Å¸Â§Â "
              />
              <HUDMetric
                label="CARGA COGNITIVA"
                value={hudData?.cognitiveLoad || metrics?.cognitive_load || 0}
                color="bg-gradient-to-r from-yellow-500 to-orange-500"
                icon="Ã¢Å¡Â¡"
              />
              <HUDMetric
                label="VELOCIDAD APRENDIZAJE"
                value={hudData?.learningVelocity || metrics?.learning_velocity || 0}
                color="bg-gradient-to-r from-green-500 to-emerald-500"
                icon="Ã°Å¸Å¡â‚¬"
              />
              <HUDMetric
                label="COHERENCIA SISTEMA"
                value={hudData?.systemCoherence || metrics?.system_coherence || 0}
                color="bg-gradient-to-r from-purple-500 to-pink-500"
                icon="Ã°Å¸â€Â®"
              />
            </div>
          </div>

          {/* SesiÃƒÂ³n Actual */}
          <div>
            <h2 className="text-xl font-bold text-cyan-400 mb-4">SESIÃƒâ€œN ACTUAL</h2>
            <div className="bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {Math.floor((hudData?.currentSession?.duration || 0) / 60)}m
                  </div>
                  <div className="text-cyan-400 text-sm">DURACIÃƒâ€œN</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {hudData?.currentSession?.engagement || 0}%
                  </div>
                  <div className="text-cyan-400 text-sm">ENGAGEMENT</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {hudData?.currentSession?.performance || 0}%
                  </div>
                  <div className="text-cyan-400 text-sm">RENDIMIENTO</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {hudData?.currentSession?.streak || 0}
                  </div>
                  <div className="text-cyan-400 text-sm">RACHA</div>
                </div>
              </div>
            </div>
          </div>

          {/* Patrones Neurales */}
          <div>
            <h2 className="text-xl font-bold text-purple-400 mb-4">PATRONES NEURALES</h2>
            <div className="space-y-3">
              {hudData?.neuralPatterns?.map((pattern, index) => (
                <NeuralPattern key={index} pattern={pattern} />
              )) || (
                <div className="text-gray-500 text-center py-4">
                  Generando patrones neurales...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panel Lateral - Indicadores y Notificaciones */}
        <div className="space-y-6">
          {/* Indicadores de Rendimiento */}
          <div>
            <h2 className="text-xl font-bold text-cyan-400 mb-4">INDICADORES</h2>
            <div className="space-y-3">
              <HUDMetric
                label="SIMULACIÃƒâ€œN PAES"
                value={hudData?.indicators?.paesSimulation || metrics?.paes_simulation_accuracy || 0}
                color="bg-gradient-to-r from-blue-500 to-cyan-500"
                icon="Ã°Å¸â€œÅ "
              />
              <HUDMetric
                label="ALINEACIÃƒâ€œN VOCACIONAL"
                value={hudData?.indicators?.vocationalAlignment || metrics?.vocational_alignment || 0}
                color="bg-gradient-to-r from-green-500 to-teal-500"
                icon="Ã°Å¸Å½Â¯"
              />
              <HUDMetric
                label="PREPARACIÃƒâ€œN BATALLA"
                value={hudData?.indicators?.battleReadiness || metrics?.battle_readiness || 0}
                color="bg-gradient-to-r from-red-500 to-orange-500"
                icon="Ã¢Å¡â€Ã¯Â¸Â"
              />
            </div>
          </div>

          {/* OptimizaciÃƒÂ³n del Sistema */}
          <div>
            <h2 className="text-xl font-bold text-green-400 mb-4">OPTIMIZACIÃƒâ€œN</h2>
            <div className="bg-black/40 backdrop-blur-sm border border-green-500/30 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-green-300">Cache Efficiency</span>
                  <span className="text-white font-bold">{hudData?.cacheEfficiency || 85}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-300">Optimization Score</span>
                  <span className="text-white font-bold">{hudData?.optimizationScore || 78}%</span>
                </div>
                <div className="optimization-progress-bar">
                  <div
                    className="optimization-progress-fill"
                    className="dynamic-progress-fill" data-progress={hudData?.optimizationScore || 78}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Notificaciones en Tiempo Real */}
          <div>
            <h2 className="text-xl font-bold text-yellow-400 mb-4">ALERTAS ACTIVAS</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {visibleNotifications.length > 0 ? (
                visibleNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onDismiss={dismissNotification}
                  />
                ))
              ) : (
                <div className="text-gray-500 text-center py-4 bg-black/20 rounded-lg border border-gray-600/30">
                  Sistema funcionando normalmente
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer con informaciÃƒÂ³n del sistema */}
      <div className="relative z-10 p-4 border-t border-cyan-500/30 mt-auto">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div>NEURAL ECOSYSTEM v5.0 | HUD FUTURÃƒÂSTICO ACTIVO</div>
          <div>CONEXIÃƒâ€œN: {isRealTime ? 'ESTABLE' : 'RECONECTANDO...'}</div>
        </div>
      </div>
    </div>
  );
};

export default SciFiHUDDashboard;



