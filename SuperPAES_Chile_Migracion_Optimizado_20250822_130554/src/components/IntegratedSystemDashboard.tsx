import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Cpu, 
  Database, 
  Music, 
  Shield, 
  Trophy, 
  Zap, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Target,
  BookOpen,
  Star
} from 'lucide-react';
import { integratedSystemService } from '../services/IntegratedSystemService';
import { monitoringService } from '../services/MonitoringService';

interface SystemStatus {
  quantum: any;
  ai: any;
  arsenal: any;
  spotify: any;
  cache: any;
  security: any;
  monitoring: any;
}

const IntegratedSystemDashboard: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSystemStatus = () => {
      try {
        const status = integratedSystemService.getSystemStatus();
        setSystemStatus(status);
        
        // Simular progreso de usuario
        const progress = integratedSystemService.updateUserProgress('user_001', 'exercise_completed', 85);
        setUserProgress(progress);
        
        // Obtener alertas activas
        const alerts = monitoringService.getActiveAlerts();
        setActiveAlerts(alerts);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching system status:', error);
        setIsLoading(false);
      }
    };

    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
      case 'active':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'critical':
      case 'error':
      case 'offline':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'critical':
      case 'error':
      case 'offline':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!systemStatus) {
    return (
      <div className="text-center text-red-500">
        Error al cargar el estado del sistema
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header del Sistema Integrado */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">🚀 Sistema Integrado SUPERPAES</h1>
        <p className="text-blue-100">
          Unificación completa de PAES-MASTER, PAES-AGENTE, PAES-MVP, Puntaje Inteligente y Reading Competence
        </p>
      </div>

      {/* Estado General del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Estado General</p>
              <p className={`text-lg font-semibold ${getStatusColor(systemStatus.monitoring.status)}`}>
                {systemStatus.monitoring.status.toUpperCase()}
              </p>
            </div>
            {getStatusIcon(systemStatus.monitoring.status)}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Alertas Activas</p>
              <p className="text-lg font-semibold text-red-500">{activeAlerts.length}</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Usuarios Activos</p>
              <p className="text-lg font-semibold text-blue-500">
                {systemStatus.monitoring.components?.application?.active_users || 0}
              </p>
            </div>
            <Users className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
              <p className="text-lg font-semibold text-green-500">
                {Math.floor((systemStatus.monitoring.components?.application?.uptime_minutes || 0) / 60)}h
              </p>
            </div>
            <Clock className="w-6 h-6 text-green-500" />
          </div>
        </div>
      </div>

      {/* Componentes del Sistema */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PAES-MASTER - Motor Cuántico */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex items-center mb-4">
            <Brain className="w-6 h-6 text-purple-500 mr-2" />
            <h2 className="text-xl font-semibold">🧠 PAES-MASTER - Motor Cuántico</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Nodos Activos:</span>
              <span className="font-semibold">{systemStatus.quantum.nodes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Niveles Bloom:</span>
              <span className="font-semibold">{systemStatus.quantum.bloom_levels}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Coherencia:</span>
              <span className="font-semibold">{(systemStatus.quantum.coherence * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Entropía:</span>
              <span className="font-semibold">{(systemStatus.quantum.entropy * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Entrelazamiento:</span>
              <span className="font-semibold">{systemStatus.quantum.entanglement}</span>
            </div>
          </div>
        </div>

        {/* PAES-AGENTE - Sistema de IA */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex items-center mb-4">
            <Cpu className="w-6 h-6 text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold">🤖 PAES-AGENTE - Sistema de IA</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Requests Procesados:</span>
              <span className="font-semibold">{systemStatus.ai.requests_processed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tiempo Respuesta:</span>
              <span className="font-semibold">{systemStatus.ai.average_response_time.toFixed(0)}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Precisión Modelo:</span>
              <span className="font-semibold">{(systemStatus.ai.model_accuracy * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tokens Usados:</span>
              <span className="font-semibold">{systemStatus.ai.token_usage.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Memoria Contexto:</span>
              <span className="font-semibold">{systemStatus.ai.context_memory}</span>
            </div>
          </div>
        </div>

        {/* PAES-MVP - Sistema de Cache */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex items-center mb-4">
            <Database className="w-6 h-6 text-green-500 mr-2" />
            <h2 className="text-xl font-semibold">⚡ PAES-MVP - Sistema de Cache</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Nivel Cache:</span>
              <span className="font-semibold">{systemStatus.cache.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Hit Rate:</span>
              <span className="font-semibold">{(systemStatus.cache.hit_rate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Miss Rate:</span>
              <span className="font-semibold">{(systemStatus.cache.miss_rate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tamaño:</span>
              <span className="font-semibold">{systemStatus.cache.size_mb}MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Compresión:</span>
              <span className="font-semibold">{(systemStatus.cache.compression_ratio * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Puntaje Inteligente - Arsenal Educativo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex items-center mb-4">
            <Target className="w-6 h-6 text-red-500 mr-2" />
            <h2 className="text-xl font-semibold">🎯 Puntaje Inteligente - Arsenal Educativo</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Sistema Bloom:</span>
              {getStatusIcon(systemStatus.arsenal.bloom_system ? 'active' : 'offline')}
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Leonardo Neural:</span>
              {getStatusIcon(systemStatus.arsenal.leonardo_neural ? 'active' : 'offline')}
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Scripts Cuánticos:</span>
              {getStatusIcon(systemStatus.arsenal.quantum_scripts ? 'active' : 'offline')}
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Gamificación:</span>
              {getStatusIcon(systemStatus.arsenal.gamification ? 'active' : 'offline')}
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Sistema Backup:</span>
              {getStatusIcon(systemStatus.arsenal.backup_system ? 'active' : 'offline')}
            </div>
          </div>
        </div>

        {/* Spotify Neural Sync */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex items-center mb-4">
            <Music className="w-6 h-6 text-pink-500 mr-2" />
            <h2 className="text-xl font-semibold">🎵 Spotify Neural Sync</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Playlist ID:</span>
              <span className="font-semibold text-sm">{systemStatus.spotify.playlist_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Frecuencia Neural:</span>
              <span className="font-semibold">{systemStatus.spotify.neural_frequency}Hz</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Estado:</span>
              <span className={`font-semibold ${getStatusColor(systemStatus.spotify.sync_status)}`}>
                {systemStatus.spotify.sync_status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Adaptación:</span>
              <span className="font-semibold">{(systemStatus.spotify.adaptation_level * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Patrones:</span>
              <span className="font-semibold">{systemStatus.spotify.personalized_patterns.length}</span>
            </div>
          </div>
        </div>

        {/* Sistema de Seguridad */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex items-center mb-4">
            <Shield className="w-6 h-6 text-indigo-500 mr-2" />
            <h2 className="text-xl font-semibold">🔒 Sistema de Seguridad</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">JWT Válido:</span>
              {getStatusIcon(systemStatus.security.jwt_valid ? 'active' : 'offline')}
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">RLS Activo:</span>
              {getStatusIcon(systemStatus.security.rls_active ? 'active' : 'offline')}
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Rate Limit:</span>
              <span className={`font-semibold ${getStatusColor(systemStatus.security.rate_limit_status)}`}>
                {systemStatus.security.rate_limit_status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Sanitización:</span>
              {getStatusIcon(systemStatus.security.data_sanitization ? 'active' : 'offline')}
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Logs de Auditoría:</span>
              <span className="font-semibold">{systemStatus.security.audit_logs}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progreso del Usuario y Gamificación */}
      {userProgress && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex items-center mb-4">
            <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
            <h2 className="text-xl font-semibold">🏆 Progreso del Usuario</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{userProgress.current_level}</div>
              <div className="text-sm text-gray-600">Nivel Actual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{userProgress.experience_points}</div>
              <div className="text-sm text-gray-600">Puntos de Experiencia</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{userProgress.badges.length}</div>
              <div className="text-sm text-gray-600">Badges Obtenidos</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Streak Diario: {userProgress.streaks.daily} días</span>
              <span>Streak Semanal: {userProgress.streaks.weekly} semanas</span>
            </div>
            <div className="text-sm text-gray-600">
              Nodo Actual: {userProgress.learning_path.current_node}
            </div>
          </div>
        </div>
      )}

      {/* Alertas Activas */}
      {activeAlerts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
            <h2 className="text-xl font-semibold text-red-500">⚠️ Alertas Activas</h2>
          </div>
          
          <div className="space-y-2">
            {activeAlerts.slice(0, 5).map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div>
                  <div className="font-semibold text-red-700 dark:text-red-300">{alert.component}</div>
                  <div className="text-sm text-red-600 dark:text-red-400">{alert.message}</div>
                </div>
                <div className="text-xs text-red-500">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acciones del Sistema */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">⚙️ Acciones del Sistema</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              const result = integratedSystemService.activateQuantumScripts();
              console.log('Scripts cuánticos activados:', result);
            }}
            className="flex items-center justify-center p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Zap className="w-4 h-4 mr-2" />
            Activar Scripts Cuánticos
          </button>
          
          <button
            onClick={() => {
              const result = integratedSystemService.optimizeCache();
              console.log('Cache optimizado:', result);
            }}
            className="flex items-center justify-center p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Database className="w-4 h-4 mr-2" />
            Optimizar Cache
          </button>
          
          <button
            onClick={() => {
              const result = integratedSystemService.createNeuralPlaylist('user_001', 'learning');
              console.log('Playlist neural creada:', result);
            }}
            className="flex items-center justify-center p-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            <Music className="w-4 h-4 mr-2" />
            Crear Playlist Neural
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntegratedSystemDashboard;
