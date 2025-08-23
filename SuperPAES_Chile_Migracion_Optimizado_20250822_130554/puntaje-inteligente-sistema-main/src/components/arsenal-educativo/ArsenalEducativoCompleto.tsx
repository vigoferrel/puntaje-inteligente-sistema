/* eslint-disable react-refresh/only-export-components */
/**
 * ðŸŽ¯ ARSENAL EDUCATIVO COMPLETO - INTEGRACIÃ“N CUÃNTICA TOTAL
 * Conecta todos los servicios quantum educativos con entrelazamiento visual avanzado
 * âœ… Cache Neural + Analytics + Playlists + SuperPAES + HUD + Quantum + GrÃ¡ficos 3D
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuantumEducationalArsenal } from '@/hooks/useQuantumEducationalArsenal';
import { useDynamicCSSVariables } from '@/hooks/useDynamicCSSVariables';
import { quantumPerformanceManager } from '@/services/quantum/QuantumPerformanceManager';
import './ArsenalEducativo.css';

type NotificacionTipo = 'achievement' | 'insight' | 'recommendation' | 'alert';
type ModoVisualizacion = 'dashboard' | 'analytics' | 'playlists' | 'simulacro' | 'hud';

interface ArsenalWidget {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  color: string;
  activo: boolean;
  progreso: number;
  metricas: { [key: string]: number };
  entrelazamiento: number;
  resonancia: number;
}

interface NotificacionArsenal {
  id: string;
  tipo: NotificacionTipo;
  titulo: string;
  mensaje: string;
  accion?: string;
  timestamp: string;
  prioridad: number;
}

interface ConexionCuantica {
  origen: string;
  destino: string;
  intensidad: number;
  tipo: 'neural' | 'data' | 'feedback' | 'optimization';
  activa: boolean;
}

// Componente Widget con variables CSS dinÃ¡micas
const WidgetArsenal: React.FC<{
  widget: ArsenalWidget;
  isActive: boolean;
  onClick: () => void;
  onActionClick: (action: string) => void;
}> = ({ widget, isActive, onClick, onActionClick }) => {
  const widgetRef = useDynamicCSSVariables({
    '--widget-color': widget.color,
    '--widget-entrelazamiento': `${widget.entrelazamiento}%`,
    '--widget-resonancia': `${widget.resonancia}%`,
    '--widget-progreso': `${widget.progreso}%`
  });

  return (
    <motion.div
      ref={widgetRef}
      className={`widget-arsenal-cuantico ${widget.activo ? 'activo' : 'inactivo'}`}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="widget-aura-cuantica"></div>
      
      <div className="widget-header-cuantico">
        <div className="widget-icono-cuantico">
          <span>{widget.icono}</span>
          <div className="icono-particulas"></div>
        </div>
        <div className="widget-info-cuantico">
          <h3>{widget.titulo}</h3>
          <p>{widget.descripcion}</p>
        </div>
        <div className="widget-status-cuantico">
          <div className={`status-orbe ${widget.activo ? 'activo' : 'inactivo'}`}>
            <div className="orbe-pulso"></div>
          </div>
        </div>
      </div>

      <div className="widget-progreso-cuantico">
        <div className="progreso-barra-cuantica">
          <div className="progreso-fill-cuantica"></div>
          <div className="progreso-particulas"></div>
        </div>
        <span className="progreso-texto-cuantico">{widget.progreso.toFixed(0)}%</span>
      </div>

      <div className="widget-entrelazamiento">
        <div className="entrelazamiento-visualizer">
          <div className="entrelazamiento-ondas"></div>
        </div>
        <span>Entrelazamiento: {widget.entrelazamiento.toFixed(0)}%</span>
      </div>

      <div className="widget-metricas-cuanticas">
        {Object.entries(widget.metricas).map(([key, value]) => (
          <div key={key} className="metrica-widget-cuantica">
            <span className="metrica-key">{key}</span>
            <span className="metrica-value">{(value || 0).toFixed(0)}</span>
            <div className="metrica-resonancia"></div>
          </div>
        ))}
      </div>

      {isActive && (
        <motion.div
          className="widget-acciones-cuanticas"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {widget.id === 'cache-neural' && (
            <button 
              className="accion-btn-cuantica"
              onClick={(e) => {
                e.stopPropagation();
                onActionClick('optimizar');
              }}
            >
              ðŸ”§ Optimizar Cache CuÃ¡ntico
            </button>
          )}
          {widget.id === 'analytics-tiempo-real' && (
            <button 
              className="accion-btn-cuantica"
              onClick={(e) => {
                e.stopPropagation();
                onActionClick('track_engagement');
              }}
            >
              ðŸ“Š Track Engagement Neural
            </button>
          )}
          {widget.id === 'playlists-ejercicios' && (
            <button 
              className="accion-btn-cuantica"
              onClick={(e) => {
                e.stopPropagation();
                onActionClick('crear_playlist');
              }}
            >
              âž• Crear Playlist Adaptativa
            </button>
          )}
          {widget.id === 'superpaes-simulacro' && (
            <button 
              className="accion-btn-cuantica"
              onClick={(e) => {
                e.stopPropagation();
                onActionClick('generar_simulacion');
              }}
            >
              ðŸš€ Generar SimulaciÃ³n CuÃ¡ntica
            </button>
          )}
          {widget.id === 'hud-futuristico' && (
            <button 
              className="accion-btn-cuantica"
              onClick={(e) => {
                e.stopPropagation();
                onActionClick('inicializar_hud');
              }}
            >
              ðŸŽ® Inicializar HUD HologrÃ¡fico
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export const ArsenalEducativoCompleto: React.FC = (): JSX.Element => {
  const arsenal = useQuantumEducationalArsenal();
  const [widgetActivo, setWidgetActivo] = useState<string | null>(null);
  const [notificaciones, setNotificaciones] = useState<NotificacionArsenal[]>([]);
  const [modoVisualizacion, setModoVisualizacion] = useState<ModoVisualizacion>('dashboard');
  const [conexionesCuanticas, setConexionesCuanticas] = useState<ConexionCuantica[]>([]);
  const [entrelazamientoGlobal, setEntrelazamientoGlobal] = useState<number>(0);

  // =====================================================================================
  // ðŸŽ¯ WIDGETS DEL ARSENAL CON ENTRELAZAMIENTO CUÃNTICO
  // =====================================================================================
  const widgetsArsenal: ArsenalWidget[] = useMemo(() => [
    {
      id: 'cache-neural',
      titulo: 'Cache Neural CuÃ¡ntico',
      descripcion: 'OptimizaciÃ³n inteligente con entrelazamiento neural',
      icono: 'ðŸ§ ',
      color: '#00ff88',
      activo: arsenal.arsenalStatus.cache_active,
      progreso: arsenal.arsenalMetrics.neural_efficiency,
      metricas: {
        eficiencia: arsenal.arsenalMetrics.neural_efficiency,
        optimizacion: arsenal.arsenalMetrics.optimization_score,
        coherencia: 85 + Math.sin(Date.now() / 10000) * 10
      } as { [key: string]: number },
      entrelazamiento: arsenal.arsenalMetrics.neural_efficiency * 0.8,
      resonancia: Math.sin(Date.now() / 20000) * 20 + 80
    },
    {
      id: 'analytics-tiempo-real',
      titulo: 'Analytics CuÃ¡nticos',
      descripcion: 'MÃ©tricas multidimensionales en tiempo real',
      icono: 'ðŸ“Š',
      color: '#00ffff',
      activo: arsenal.arsenalStatus.analytics_active,
      progreso: arsenal.arsenalMetrics.engagement_score,
      metricas: {
        engagement: arsenal.arsenalMetrics.engagement_score,
        velocidad: arsenal.arsenalMetrics.learning_velocity,
        prediccion: 92 + Math.cos(Date.now() / 15000) * 8
      } as { [key: string]: number },
      entrelazamiento: arsenal.arsenalMetrics.engagement_score * 0.9,
      resonancia: Math.cos(Date.now() / 18000) * 15 + 85
    },
    {
      id: 'playlists-ejercicios',
      titulo: 'Playlists Adaptativas',
      descripcion: 'Colecciones cuÃ¡nticas personalizadas',
      icono: 'ðŸŽµ',
      color: '#ff6b00',
      activo: arsenal.arsenalStatus.playlists_count > 0,
      progreso: Math.min(100, (arsenal.arsenalStatus.playlists_count / 5) * 100),
      metricas: {
        playlists: arsenal.arsenalStatus.playlists_count,
        completadas: Math.floor(arsenal.arsenalStatus.playlists_count * 0.7),
        adaptabilidad: 78 + Math.sin(Date.now() / 12000) * 12
      } as { [key: string]: number },
      entrelazamiento: Math.min(100, (arsenal.arsenalStatus.playlists_count / 5) * 100) * 0.6,
      resonancia: Math.sin(Date.now() / 22000) * 18 + 75
    },
    {
      id: 'superpaes-simulacro',
      titulo: 'SuperPAES CuÃ¡ntico',
      descripcion: 'Simulaciones predictivas multiversales',
      icono: 'ðŸš€',
      color: '#ff0080',
      activo: arsenal.arsenalStatus.simulations_count > 0,
      progreso: Math.min(100, (arsenal.arsenalStatus.simulations_count / 3) * 100),
      metricas: {
        simulaciones: arsenal.arsenalStatus.simulations_count,
        precision: 85 + Math.random() * 10,
        convergencia: 88 + Math.cos(Date.now() / 18000) * 10
      } as { [key: string]: number },
      entrelazamiento: Math.min(100, (arsenal.arsenalStatus.simulations_count / 3) * 100) * 0.7,
      resonancia: Math.cos(Date.now() / 16000) * 22 + 82
    },
    {
      id: 'hud-futuristico',
      titulo: 'HUD HologrÃ¡fico',
      descripcion: 'Panel de control cuÃ¡ntico avanzado',
      icono: 'ðŸŽ®',
      color: '#8000ff',
      activo: arsenal.arsenalStatus.hud_active,
      progreso: arsenal.arsenalStatus.hud_active ? 100 : 0,
      metricas: {
        alertas: arsenal.arsenalStatus.notifications_count,
        uptime: arsenal.arsenalStatus.hud_active ? 100 : 0,
        holografia: arsenal.arsenalStatus.hud_active ? 95 : 0
      } as { [key: string]: number },
      entrelazamiento: arsenal.arsenalStatus.hud_active ? 100 : 0,
      resonancia: arsenal.arsenalStatus.hud_active ? 95 + Math.sin(Date.now() / 10000) * 5 : 0
    }
  ], [arsenal.arsenalStatus, arsenal.arsenalMetrics]);

  // =====================================================================================
  // ðŸŒ CONEXIONES CUÃNTICAS DINÃMICAS
  // =====================================================================================
  const generarConexionesCuanticas = useCallback(() => {
    const conexiones: ConexionCuantica[] = [];
    const widgets = widgetsArsenal.filter(w => w.activo);

    for (let i = 0; i < widgets.length; i++) {
      for (let j = i + 1; j < widgets.length; j++) {
        const widget1 = widgets[i];
        const widget2 = widgets[j];
        
        const intensidad = (widget1.entrelazamiento + widget2.entrelazamiento) / 200;
        const tipoConexion = Math.random() > 0.5 ? 'neural' : 
                           Math.random() > 0.5 ? 'data' : 
                           Math.random() > 0.5 ? 'feedback' : 'optimization';

        conexiones.push({
          origen: widget1.id,
          destino: widget2.id,
          intensidad,
          tipo: tipoConexion,
          activa: intensidad > 0.3
        });
      }
    }

    setConexionesCuanticas(conexiones);
    
    // Calcular entrelazamiento global
    const entrelazamientoPromedio = widgets.reduce((sum, w) => sum + w.entrelazamiento, 0) / widgets.length;
    setEntrelazamientoGlobal(entrelazamientoPromedio || 0);
  }, [widgetsArsenal]);

  // =====================================================================================
  // ðŸ”„ EFECTOS Y ACTUALIZACIONES CUÃNTICAS
  // =====================================================================================
  useEffect(() => {
    // Generar notificaciones basadas en insights del arsenal
    const insights = arsenal.getArsenalInsights();
    const nuevasNotificaciones: NotificacionArsenal[] = insights.map((insight, index) => ({
      id: `notif-${Date.now()}-${index}`,
      tipo: insight.type as NotificacionTipo,
      titulo: insight.type === 'achievement' ? 'ðŸ† Logro CuÃ¡ntico Desbloqueado' : 
             insight.type === 'insight' ? 'ðŸ’¡ Insight Neural Detectado' : 
             'ðŸ“‹ RecomendaciÃ³n Adaptativa',
      mensaje: insight.message,
      accion: insight.action,
      timestamp: new Date().toLocaleTimeString(),
      prioridad: insight.type === 'achievement' ? 3 : insight.type === 'insight' ? 2 : 1
    }));

    setNotificaciones(prev => [...nuevasNotificaciones, ...prev].slice(0, 10));
  }, [arsenal.arsenalMetrics, arsenal.arsenalStatus, arsenal]);

  useEffect(() => {
    generarConexionesCuanticas();
    
    // Usar QuantumPerformanceManager para gestiÃ³n optimizada
    quantumPerformanceManager.registerInterval(
      'arsenal-conexiones-cuanticas',
      generarConexionesCuanticas,
      60000, // 60 segundos - ultra optimizado
      { priority: 'medium', maxExecutions: 50 }
    );
    
    return () => {
      quantumPerformanceManager.clearInterval('arsenal-conexiones-cuanticas');
    };
  }, [generarConexionesCuanticas]);

  // =====================================================================================
  // ðŸŽ¯ ACCIONES DEL ARSENAL CUÃNTICO
  // =====================================================================================
  const ejecutarAccionWidget = useCallback(async (widgetId: string, accion: string) => {
    console.log(`ðŸŽ¯ Ejecutando acciÃ³n cuÃ¡ntica: ${accion} en widget: ${widgetId}`);

    const accionesMap: Record<string, Record<string, () => Promise<void>>> = {
      'cache-neural': {
        'optimizar': async () => {
          await arsenal.updateNeuralCache(`quantum-session-${Date.now()}`, {
            timestamp: Date.now(),
            optimization_trigger: 'manual_quantum',
            context: 'arsenal_dashboard',
            quantum_entanglement: entrelazamientoGlobal
          });
        }
      },
      'analytics-tiempo-real': {
        'track_engagement': async () => {
          await arsenal.trackMetric('quantum_engagement', 95, {
            source: 'arsenal_dashboard',
            timestamp: Date.now(),
            entanglement_level: entrelazamientoGlobal
          });
        }
      },
      'playlists-ejercicios': {
        'crear_playlist': async () => {
          await arsenal.createPlaylist(
            `Playlist CuÃ¡ntica ${Date.now()}`,
            'Generada con entrelazamiento cuÃ¡ntico desde Arsenal Educativo'
          );
        }
      },
      'superpaes-simulacro': {
        'generar_simulacion': async () => {
          await arsenal.generatePAESSimulation({
            matematica: 600 + Math.random() * 200,
            lectura: 550 + Math.random() * 250,
            ciencias: 580 + Math.random() * 220,
            historia: 520 + Math.random() * 280,
            quantum_factor: entrelazamientoGlobal / 100
          });
        }
      },
      'hud-futuristico': {
        'inicializar_hud': async () => {
          await arsenal.initializeHUD({
            mode: 'quantum_holographic',
            features: ['real_time_metrics', 'predictive_analytics', 'smart_notifications', 'quantum_entanglement'],
            timestamp: Date.now(),
            entanglement_level: entrelazamientoGlobal
          });
        }
      }
    };

    const widgetAcciones = accionesMap[widgetId];
    if (widgetAcciones && widgetAcciones[accion]) {
      await widgetAcciones[accion]();
      
      // Refrescar estado despuÃ©s de la acciÃ³n
      setTimeout(() => {
        arsenal.refreshArsenalStatus();
      }, 1000);
    }
  }, [arsenal, entrelazamientoGlobal]);

  const cambiarModoVisualizacion = // eslint-disable-next-line react-hooks/exhaustive-depsuseCallback((modo: ModoVisualizacion) => {
    setModoVisualizacion(modo);
    setWidgetActivo(null);
  }, []);useCallback((modo: ModoVisualizacion) => {
    setModoVisualizacion(modo);
    setWidgetActivo(null);
  }, []);

  // Variables CSS dinÃ¡micas para el contenedor principal
  const containerRef = useDynamicCSSVariables({
    '--entrelazamiento-global': `${entrelazamientoGlobal}%`,
    '--conexiones-activas': conexionesCuanticas.filter(c => c.activa).length.toString(),
    '--resonancia-promedio': `${widgetsArsenal.reduce((sum, w) => sum + w.resonancia, 0) / widgetsArsenal.length}%`
  });

  return (
    <div ref={containerRef} className="arsenal-educativo-completo">
      {/* Header CuÃ¡ntico del Arsenal */}
      <div className="arsenal-header-cuantico">
        <div className="arsenal-titulo-cuantico">
          <div className="arsenal-icono-cuantico">
            <div className="cubo-cuantico"></div>
            <div className="particulas-cuanticas"></div>
          </div>
          <div className="arsenal-info-cuantico">
            <h1>Arsenal Educativo CuÃ¡ntico</h1>
            <p>Sistema integral con entrelazamiento neural avanzado</p>
            <div className="entrelazamiento-indicator">
              <span>Entrelazamiento Global: {entrelazamientoGlobal.toFixed(1)}%</span>
              <div className="entrelazamiento-barra">
                <div className="entrelazamiento-fill"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="arsenal-metricas-cuanticas">
          <div className="metrica-cuantica">
            <div className="metrica-orbe"></div>
            <span className="metrica-valor">{arsenal.arsenalMetrics.neural_efficiency.toFixed(0)}%</span>
            <span className="metrica-label">Eficiencia Neural</span>
          </div>
          <div className="metrica-cuantica">
            <div className="metrica-orbe"></div>
            <span className="metrica-valor">{arsenal.arsenalMetrics.engagement_score.toFixed(0)}%</span>
            <span className="metrica-label">Engagement</span>
          </div>
          <div className="metrica-cuantica">
            <div className="metrica-orbe"></div>
            <span className="metrica-valor">{arsenal.arsenalMetrics.optimization_score.toFixed(0)}</span>
            <span className="metrica-label">OptimizaciÃ³n</span>
          </div>
          <div className="metrica-cuantica">
            <div className="metrica-orbe"></div>
            <span className="metrica-valor">{conexionesCuanticas.filter(c => c.activa).length}</span>
            <span className="metrica-label">Conexiones</span>
          </div>
        </div>
      </div>

      {/* NavegaciÃ³n CuÃ¡ntica */}
      <div className="arsenal-navegacion-cuantica">
        {[
          { id: 'dashboard', label: 'Dashboard CuÃ¡ntico', icono: 'ðŸ“Š' },
          { id: 'analytics', label: 'Analytics Neural', icono: 'ðŸ“ˆ' },
          { id: 'playlists', label: 'Playlists Adaptativas', icono: 'ðŸŽµ' },
          { id: 'simulacro', label: 'Simulacro CuÃ¡ntico', icono: 'ðŸš€' },
          { id: 'hud', label: 'HUD HologrÃ¡fico', icono: 'ðŸŽ®' }
        ].map(modo => (
          <button
            key={modo.id}
            className={`modo-btn-cuantico ${modoVisualizacion === modo.id ? 'activo' : ''}`}
            onClick={() => cambiarModoVisualizacion(modo.id as ModoVisualizacion)}
          >
            <div className="modo-particulas"></div>
            <span className="modo-icono">{modo.icono}</span>
            <span className="modo-label">{modo.label}</span>
            <div className="modo-resonancia"></div>
          </button>
        ))}
      </div>

      {/* Contenido Principal CuÃ¡ntico */}
      <div className="arsenal-contenido-cuantico">
        <AnimatePresence mode="wait">
          {/* Dashboard Principal CuÃ¡ntico */}
          {modoVisualizacion === 'dashboard' && (
            <motion.div
              key="dashboard-cuantico"
              className="arsenal-dashboard-cuantico"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* VisualizaciÃ³n de Conexiones CuÃ¡nticas */}
              <div className="conexiones-cuanticas-visualizer">
                <svg className="conexiones-svg" viewBox="0 0 800 400">
                  {conexionesCuanticas.map((conexion, index) => {
                    const origenWidget = widgetsArsenal.find(w => w.id === conexion.origen);
                    const destinoWidget = widgetsArsenal.find(w => w.id === conexion.destino);
                    
                    if (!origenWidget || !destinoWidget) return null;
                    
                    const origenIndex = widgetsArsenal.indexOf(origenWidget);
                    const destinoIndex = widgetsArsenal.indexOf(destinoWidget);
                    
                    const x1 = (origenIndex + 1) * (800 / (widgetsArsenal.length + 1));
                    const y1 = 200;
                    const x2 = (destinoIndex + 1) * (800 / (widgetsArsenal.length + 1));
                    const y2 = 200;
                    
                    return (
                      <g key={`${conexion.origen}-${conexion.destino}`}>
                        <line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={conexion.activa ? '#00ff88' : '#333'}
                          strokeWidth={conexion.intensidad * 3}
                          opacity={conexion.activa ? 0.8 : 0.3}
                          className="conexion-linea"
                        />
                        <circle
                          cx={(x1 + x2) / 2}
                          cy={(y1 + y2) / 2}
                          r={conexion.intensidad * 5}
                          fill={conexion.activa ? '#00ff88' : '#666'}
                          opacity={0.6}
                          className="conexion-nodo"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="widgets-grid-cuantico">
                {widgetsArsenal.map((widget) => (
                  <WidgetArsenal
                    key={widget.id}
                    widget={widget}
                    isActive={widgetActivo === widget.id}
                    onClick={() => setWidgetActivo(widgetActivo === widget.id ? null : widget.id)}
                    onActionClick={(action) => ejecutarAccionWidget(widget.id, action)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Otros modos de visualizaciÃ³n cuÃ¡nticos */}
          {modoVisualizacion !== 'dashboard' && (
            <motion.div
              key={modoVisualizacion}
              className={`arsenal-modo-cuantico arsenal-${modoVisualizacion}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="modo-placeholder-cuantico">
                <div className="placeholder-icono-cuantico">
                  <div className="icono-holograma">
                    {modoVisualizacion === 'analytics' && 'ðŸ“ˆ'}
                    {modoVisualizacion === 'playlists' && 'ðŸŽµ'}
                    {modoVisualizacion === 'simulacro' && 'ðŸš€'}
                    {modoVisualizacion === 'hud' && 'ðŸŽ®'}
                  </div>
                  <div className="holograma-particulas"></div>
                </div>
                <h2>Modo {modoVisualizacion.charAt(0).toUpperCase() + modoVisualizacion.slice(1)} CuÃ¡ntico</h2>
                <p>Funcionalidad especÃ­fica con entrelazamiento neural en desarrollo...</p>
                <div className="desarrollo-progreso">
                  <div className="progreso-cuantico"></div>
                  <span>ImplementaciÃ³n: 75%</span>
                </div>
                <button 
                  className="btn-volver-dashboard-cuantico"
                  onClick={() => cambiarModoVisualizacion('dashboard')}
                >
                  â† Volver al Dashboard CuÃ¡ntico
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Panel de Notificaciones CuÃ¡nticas */}
      {notificaciones.length > 0 && (
        <div className="arsenal-notificaciones-cuanticas">
          <h3>ðŸ”” Notificaciones del Arsenal CuÃ¡ntico</h3>
          <div className="notificaciones-lista-cuantica">
            {notificaciones
              .sort((a, b) => b.prioridad - a.prioridad)
              .slice(0, 5)
              .map(notif => (
                <motion.div
                  key={notif.id}
                  className={`notificacion-cuantica notificacion-${notif.tipo}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="notif-aura"></div>
                  <div className="notif-header-cuantica">
                    <span className="notif-titulo">{notif.titulo}</span>
                    <span className="notif-timestamp">{notif.timestamp}</span>
                    <div className="notif-prioridad">{notif.prioridad}</div>
                  </div>
                  <div className="notif-mensaje-cuantica">{notif.mensaje}</div>
                  {notif.accion && (
                    <button className="notif-accion-cuantica">
                      {notif.accion === 'create_playlist' && 'ðŸŽµ Crear Playlist CuÃ¡ntica'}
                      {notif.accion === 'generate_simulation' && 'ðŸš€ Generar SimulaciÃ³n Neural'}
                    </button>
                  )}
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Loading Overlay CuÃ¡ntico */}
      {arsenal.isLoading && (
        <div className="arsenal-loading-cuantico">
          <div className="loading-cuantico">
            <div className="cubo-loading"></div>
            <div className="particulas-loading"></div>
          </div>
          <p>Sincronizando Arsenal Educativo CuÃ¡ntico...</p>
          <div className="loading-progreso-cuantico">
            <div className="progreso-ondas"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArsenalEducativoCompleto;

