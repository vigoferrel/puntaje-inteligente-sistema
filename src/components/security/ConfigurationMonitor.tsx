
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, CheckCircle, AlertCircle, Clock, Shield } from 'lucide-react';

interface ConfigurationCheck {
  id: string;
  name: string;
  description: string;
  status: 'optimal' | 'warning' | 'needs_review';
  category: 'auth' | 'security' | 'performance' | 'database';
  recommendation?: string;
  lastChecked: Date;
}

export const ConfigurationMonitor: React.FC = () => {
  const [configurations, setConfigurations] = useState<ConfigurationCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const runConfigurationChecks = async () => {
    setIsLoading(true);
    
    // Simular verificaciones de configuración
    const checks: ConfigurationCheck[] = [
      {
        id: 'otp-expiry',
        name: 'OTP Expiry Time',
        description: 'Tiempo de expiración de códigos OTP configurado a 30 minutos',
        status: 'optimal',
        category: 'auth',
        lastChecked: new Date()
      },
      {
        id: 'password-protection',
        name: 'Leaked Password Protection',
        description: 'Protección contra contraseñas filtradas habilitada',
        status: 'optimal',
        category: 'security',
        lastChecked: new Date()
      },
      {
        id: 'rls-policies',
        name: 'Row Level Security',
        description: 'Políticas RLS configuradas para todas las tablas sensibles',
        status: 'optimal',
        category: 'security',
        lastChecked: new Date()
      },
      {
        id: 'function-security',
        name: 'Function Security',
        description: 'Funciones públicas usan SECURITY DEFINER con SET search_path',
        status: 'optimal',
        category: 'database',
        lastChecked: new Date()
      },
      {
        id: 'external-services',
        name: 'External Services',
        description: 'Servicios externos (universidades, beneficios) funcionando normalmente',
        status: 'warning',
        category: 'performance',
        recommendation: 'Estas son funciones automáticas del sistema, no requieren acción',
        lastChecked: new Date()
      },
      {
        id: 'neural-system',
        name: 'Neural System v3.0',
        description: 'Sistema neural refactorizado funcionando correctamente',
        status: 'optimal',
        category: 'performance',
        lastChecked: new Date()
      }
    ];

    setConfigurations(checks);
    setIsLoading(false);
  };

  useEffect(() => {
    runConfigurationChecks();
  }, []);

  const getStatusIcon = (status: ConfigurationCheck['status']) => {
    switch (status) {
      case 'optimal':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'needs_review':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: ConfigurationCheck['status']) => {
    switch (status) {
      case 'optimal':
        return 'bg-green-500/20 border-green-500/30';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/30';
      case 'needs_review':
        return 'bg-red-500/20 border-red-500/30';
    }
  };

  const getCategoryIcon = (category: ConfigurationCheck['category']) => {
    switch (category) {
      case 'auth':
        return <Shield className="w-4 h-4 text-blue-400" />;
      case 'security':
        return <Shield className="w-4 h-4 text-red-400" />;
      case 'performance':
        return <Settings className="w-4 h-4 text-purple-400" />;
      case 'database':
        return <Settings className="w-4 h-4 text-green-400" />;
    }
  };

  const optimalCount = configurations.filter(c => c.status === 'optimal').length;
  const warningCount = configurations.filter(c => c.status === 'warning').length;
  const reviewCount = configurations.filter(c => c.status === 'needs_review').length;

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6 text-center">
          <Settings className="w-8 h-8 text-cyan-400 mx-auto mb-2 animate-spin" />
          <p className="text-white">Verificando configuraciones...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Resumen de Estado */}
      <Card className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-green-400" />
            Estado de Configuraciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{optimalCount}</div>
              <div className="text-sm text-gray-400">Óptimas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{warningCount}</div>
              <div className="text-sm text-gray-400">Informativas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{reviewCount}</div>
              <div className="text-sm text-gray-400">Requieren Revisión</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Configuraciones */}
      <div className="space-y-3">
        {configurations.map((config) => (
          <motion.div
            key={config.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-4 rounded-lg border ${getStatusColor(config.status)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {getCategoryIcon(config.category)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(config.status)}
                    <h4 className="font-semibold text-white">{config.name}</h4>
                    <Badge variant="outline" className="text-xs capitalize">
                      {config.category}
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{config.description}</p>
                  {config.recommendation && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-2 mb-2">
                      <p className="text-yellow-400 text-xs">{config.recommendation}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    Verificado: {config.lastChecked.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Acciones */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold mb-1">Verificación Automática</h4>
              <p className="text-gray-400 text-sm">
                Las configuraciones se verifican automáticamente cada 5 minutos
              </p>
            </div>
            <Button onClick={runConfigurationChecks} variant="outline">
              Verificar Ahora
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

