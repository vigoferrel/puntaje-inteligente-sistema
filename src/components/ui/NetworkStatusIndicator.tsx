import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, 
  WifiOff, 
  Cloud, 
  CloudOff, 
  Zap, 
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface NetworkStatusIndicatorProps {
  isOnline: boolean;
  isSupabaseAvailable: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'offline';
  lastSync?: Date;
  isDataStale?: boolean;
  compact?: boolean;
}

const NetworkStatusIndicator: React.FC<NetworkStatusIndicatorProps> = ({
  isOnline,
  isSupabaseAvailable,
  connectionQuality,
  lastSync,
  isDataStale = false,
  compact = false
}) => {
  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        color: 'text-red-600 bg-red-100 border-red-200',
        status: 'Sin conexión',
        description: 'Modo offline activado',
        pulsing: false
      };
    }

    if (!isSupabaseAvailable) {
      return {
        icon: CloudOff,
        color: 'text-orange-600 bg-orange-100 border-orange-200',
        status: 'Servidor no disponible',
        description: 'Usando datos locales',
        pulsing: true
      };
    }

    switch (connectionQuality) {
      case 'excellent':
        return {
          icon: Cloud,
          color: 'text-green-600 bg-green-100 border-green-200',
          status: 'Excelente',
          description: 'Conectado y sincronizado',
          pulsing: false
        };
      case 'good':
        return {
          icon: Cloud,
          color: 'text-blue-600 bg-blue-100 border-blue-200',
          status: 'Buena',
          description: 'Conectado',
          pulsing: false
        };
      case 'poor':
        return {
          icon: Zap,
          color: 'text-yellow-600 bg-yellow-100 border-yellow-200',
          status: 'Lenta',
          description: 'Conexión inestable',
          pulsing: true
        };
      default:
        return {
          icon: WifiOff,
          color: 'text-gray-600 bg-gray-100 border-gray-200',
          status: 'Desconocido',
          description: 'Estado desconocido',
          pulsing: false
        };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  const formatLastSync = (date?: Date) => {
    if (!date) return 'Nunca';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    return `Hace ${Math.floor(diffHours / 24)} días`;
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${statusInfo.color}`}
      >
        <motion.div
          animate={statusInfo.pulsing ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Icon className="w-4 h-4" />
        </motion.div>
        <span>{statusInfo.status}</span>
        {isDataStale && (
          <AlertTriangle className="w-3 h-3" />
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-lg p-4 ${statusInfo.color}`}
    >
      <div className="flex items-start space-x-3">
        <motion.div
          animate={statusInfo.pulsing ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex-shrink-0"
        >
          <Icon className="w-6 h-6" />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold">
              Conexión: {statusInfo.status}
            </h3>
            {isDataStale && (
              <div className="flex items-center space-x-1 text-xs">
                <Clock className="w-3 h-3" />
                <span>Datos antiguos</span>
              </div>
            )}
          </div>
          
          <p className="text-xs opacity-80 mt-1">
            {statusInfo.description}
          </p>
          
          {lastSync && (
            <div className="flex items-center space-x-2 text-xs opacity-70 mt-2">
              <CheckCircle className="w-3 h-3" />
              <span>Última sincronización: {formatLastSync(lastSync)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Additional details for poor connection */}
      <AnimatePresence>
        {connectionQuality === 'poor' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-current border-opacity-20"
          >
            <div className="text-xs space-y-1">
              <p>• Los datos se cargan más lento</p>
              <p>• Algunas funciones pueden no estar disponibles</p>
              <p>• Se usan datos locales cuando es posible</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline mode details */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-current border-opacity-20"
          >
            <div className="text-xs space-y-1">
              <p>• Funcionando sin conexión</p>
              <p>• Los datos se guardan localmente</p>
              <p>• Se sincronizará al reconectar</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NetworkStatusIndicator;
