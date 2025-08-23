/**
 * 🎯 EJEMPLO DE USO - ARSENAL EDUCATIVO COMPLETO
 * ==============================================
 * Ejemplo completo de implementación del Arsenal Educativo en React
 * Incluye configuración, inicialización y uso de todas las funcionalidades
 */

import React, { useEffect, useState } from 'react';
import { createArsenalEducativoService } from './services/ArsenalEducativoService';
import useArsenalEducativo from './hooks/useArsenalEducativo';
import { ArsenalEducativoService, defaultArsenalConfig } from './types/arsenal-educativo.types';

// =====================================================================================
// CONFIGURACIÓN SUPABASE
// =====================================================================================

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'your-supabase-url';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// Configuración personalizada del arsenal
const arsenalConfig = {
  ...defaultArsenalConfig,
  enableNeuralCache: true,
  enableRealTimeAnalytics: true,
  enableHUD: true,
  enableNotifications: true,
  enablePlaylists: true,
  enableSuperPAES: true,
  analyticsUpdateInterval: 3000, // 3 segundos
  hudRefreshRate: 1000, // 1 segundo
  maxNotifications: 25
};

// =====================================================================================
// COMPONENTE DASHBOARD DEL ARSENAL
// =====================================================================================

interface ArsenalDashboardProps {
  service: ArsenalEducativoService;
}

const ArsenalDashboard: React.FC<ArsenalDashboardProps> = ({ service }) => {
  const arsenal = useArsenalEducativo({
    service,
    config: arsenalConfig,
    autoStart: true
  });

  // Efecto para manejar errores
  useEffect(() => {
    if (arsenal.error) {
      console.error('Error en Arsenal Educativo:', arsenal.error);
    }
  }, [arsenal.error]);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      minHeight: '100vh'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        🎯 Arsenal Educativo SUPERPAES
      </h1>

      {arsenal.isLoading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '18px' }}>⏳ Cargando arsenal...</div>
        </div>
      )}

      {arsenal.error && (
        <div style={{ 
          background: 'rgba(255, 0, 0, 0.1)', 
          border: '1px solid #ff4444', 
          padding: '10px', 
          borderRadius: '8px',
          margin: '10px 0'
        }}>
          ❌ {arsenal.error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* CACHE NEURAL */}
        <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '20px', borderRadius: '12px' }}>
          <h2>🧠 Cache Neural</h2>
          {arsenal.cachePerformance && (
            <div>
              <p>💯 Hit Rate: {arsenal.cachePerformance.hit_percentage.toFixed(1)}%</p>
              <p>📊 Requests: {arsenal.cachePerformance.total_requests}</p>
              <p>⚡ Score: {arsenal.cachePerformance.optimization_score.toFixed(2)}</p>
              <button 
                onClick={() => arsenal.updateCache('test-session', { test: 'data', timestamp: Date.now() })}
                style={{ 
                  background: '#00d4aa', 
                  color: 'white', 
                  border: 'none', 
                  padding: '8px 16px', 
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Actualizar Cache
              </button>
            </div>
          )}
        </div>

        {/* ANALYTICS EN TIEMPO REAL */}
        <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '20px', borderRadius: '12px' }}>
          <h2>📈 Analytics</h2>
          {arsenal.analytics && (
            <div>
              <p>🎯 Engagement: {arsenal.analytics.engagement_score?.toFixed(1) || 0}</p>
              <p>📊 Métricas: {arsenal.analytics.current_session_metrics?.length || 0}</p>
              <button 
                onClick={() => arsenal.trackUserMetric('user_interaction', Math.random() * 100, { action: 'button_click' })}
                style={{ 
                  background: '#ff6b6b', 
                  color: 'white', 
                  border: 'none', 
                  padding: '8px 16px', 
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Trackear Métrica
              </button>
            </div>
          )}
        </div>

        {/* HUD FUTURÍSTICO */}
        <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '20px', borderRadius: '12px' }}>
          <h2>🚀 HUD Futurístico</h2>
          {arsenal.hudSession ? (
            <div>
              <p>✅ Sesión Activa</p>
              <p>📈 Score: {arsenal.hudSession.optimization_score.toFixed(2)}</p>
              <p>🚨 Alertas: {arsenal.hudAlerts.length}</p>
              <button 
                onClick={() => arsenal.updateHUDData({ 
                  optimization_score: Math.random() * 100,
                  performance_indicator: 'excellent',
                  timestamp: Date.now()
                })}
                style={{ 
                  background: '#4ecdc4', 
                  color: 'white', 
                  border: 'none', 
                  padding: '8px 16px', 
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Actualizar HUD
              </button>
            </div>
          ) : (
            <div>
              <p>💤 Sesión Inactiva</p>
              <button 
                onClick={() => arsenal.startHUD({ theme: 'cyan', mode: 'advanced' })}
                style={{ 
                  background: '#4ecdc4', 
                  color: 'white', 
                  border: 'none', 
                  padding: '8px 16px', 
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Iniciar HUD
              </button>
            </div>
          )}
        </div>

        {/* NOTIFICACIONES IA */}
        <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '20px', borderRadius: '12px' }}>
          <h2>🔔 Notificaciones IA</h2>
          <div>
            <p>📬 Total: {arsenal.notifications.length}</p>
            <p>🔴 No leídas: {arsenal.unreadCount}</p>
            <button 
              onClick={() => arsenal.sendNotification({
                notification_type: 'achievement',
                title: '🎉 ¡Logro Desbloqueado!',
                message: `Has completado una nueva métrica a las ${new Date().toLocaleTimeString()}`,
                priority: 'high'
              })}
              style={{ 
                background: '#feca57', 
                color: 'white', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Crear Notificación
            </button>
          </div>
        </div>

        {/* SISTEMA SPOTIFY */}
        <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '20px', borderRadius: '12px' }}>
          <h2>🎵 Sistema Spotify</h2>
          <div>
            <p>💡 Recomendadas: {arsenal.recommendedPlaylists.length}</p>
            <p>📚 Mis Playlists: {arsenal.myPlaylists.length}</p>
            <button 
              onClick={() => arsenal.createNewPlaylist({
                title: `Playlist ${Date.now()}`,
                description: 'Creada automáticamente',
                playlist_type: 'custom',
                difficulty_level: 'mixed',
                subject_focus: ['matemáticas', 'ciencias']
              })}
              style={{ 
                background: '#1dd1a1', 
                color: 'white', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Crear Playlist
            </button>
          </div>
        </div>

        {/* SUPERPAES AVANZADO */}
        <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '20px', borderRadius: '12px' }}>
          <h2>🎯 SuperPAES</h2>
          <div>
            <p>🔮 Simulaciones: {arsenal.simulations.length}</p>
            {arsenal.currentSimulation && (
              <p>📊 Actual: {arsenal.currentSimulation.simulation_type}</p>
            )}
            <button 
              onClick={async () => {
                try {
                  const simulationId = await arsenal.runSimulation('predictive', {
                    scores: { matematicas: 650, lenguaje: 680, ciencias: 620, historia: 640 },
                    parameters: { iterations: 1000, confidence: 0.95 }
                  });
                  await arsenal.getResults(simulationId);
                } catch (error) {
                  console.error('Error en simulación:', error);
                }
              }}
              style={{ 
                background: '#ff6b6b', 
                color: 'white', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Ejecutar Simulación
            </button>
          </div>
        </div>

      </div>

      {/* LISTA DE NOTIFICACIONES */}
      {arsenal.notifications.length > 0 && (
        <div style={{ 
          marginTop: '30px', 
          background: 'rgba(255, 255, 255, 0.1)', 
          padding: '20px', 
          borderRadius: '12px' 
        }}>
          <h2>📋 Notificaciones Recientes</h2>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {arsenal.notifications.slice(0, 5).map(notification => (
              <div 
                key={notification.id}
                style={{ 
                  background: notification.is_read ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.15)',
                  padding: '10px',
                  margin: '10px 0',
                  borderRadius: '8px',
                  borderLeft: notification.is_read ? 'none' : '4px solid #feca57'
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{notification.title}</div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>{notification.message}</div>
                <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '5px' }}>
                  {new Date(notification.created_at).toLocaleString()}
                </div>
                {!notification.is_read && (
                  <button 
                    onClick={() => arsenal.markNotificationRead(notification.id)}
                    style={{ 
                      background: '#00d4aa', 
                      color: 'white', 
                      border: 'none', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      marginTop: '5px'
                    }}
                  >
                    Marcar como leída
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ESTADO DEL SISTEMA */}
      <div style={{ 
        marginTop: '30px', 
        background: 'rgba(255, 255, 255, 0.1)', 
        padding: '15px', 
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h3>🎯 Estado del Arsenal</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <span>🧠 Cache: {arsenalConfig.enableNeuralCache ? '✅' : '❌'}</span>
          <span>📈 Analytics: {arsenalConfig.enableRealTimeAnalytics ? '✅' : '❌'}</span>
          <span>🚀 HUD: {arsenalConfig.enableHUD ? '✅' : '❌'}</span>
          <span>🔔 Notificaciones: {arsenalConfig.enableNotifications ? '✅' : '❌'}</span>
          <span>🎵 Playlists: {arsenalConfig.enablePlaylists ? '✅' : '❌'}</span>
          <span>🎯 SuperPAES: {arsenalConfig.enableSuperPAES ? '✅' : '❌'}</span>
        </div>
      </div>
    </div>
  );
};

// =====================================================================================
// COMPONENTE PRINCIPAL CON INICIALIZACIÓN
// =====================================================================================

const ArsenalEducativoExample: React.FC = () => {
  const [service, setService] = useState<ArsenalEducativoService | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Verificar que las variables de entorno estén configuradas
      if (!SUPABASE_URL || SUPABASE_URL === 'your-supabase-url') {
        throw new Error('REACT_APP_SUPABASE_URL no está configurada');
      }
      
      if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'your-supabase-anon-key') {
        throw new Error('REACT_APP_SUPABASE_ANON_KEY no está configurada');
      }

      // Crear el servicio
      const arsenalService = createArsenalEducativoService(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        arsenalConfig
      );

      setService(arsenalService);
      console.log('✅ Arsenal Educativo inicializado correctamente');
    } catch (error: any) {
      console.error('❌ Error inicializando Arsenal Educativo:', error);
      setInitError(error.message);
    }
  }, []);

  if (initError) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        background: '#ff4444',
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <h1>❌ Error de Configuración</h1>
          <p>{initError}</p>
          <div style={{ marginTop: '20px', fontSize: '14px', opacity: 0.8 }}>
            <p>Asegúrate de configurar:</p>
            <ul style={{ textAlign: 'left', display: 'inline-block' }}>
              <li>REACT_APP_SUPABASE_URL en tu archivo .env</li>
              <li>REACT_APP_SUPABASE_ANON_KEY en tu archivo .env</li>
              <li>Los scripts SQL ejecutados en Supabase</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        background: '#667eea',
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎯</div>
          <h1>Inicializando Arsenal Educativo...</h1>
          <p>Configurando servicios y conectando con Supabase</p>
        </div>
      </div>
    );
  }

  return <ArsenalDashboard service={service} />;
};

export default ArsenalEducativoExample;
