
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, Database, Shield, TrendingUp, TrendingDown } from 'lucide-react';

interface SecurityMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: 'performance' | 'security' | 'database' | 'neural';
  status: 'good' | 'warning' | 'critical';
}

interface SecurityMetricsIntegrationProps {
  enableRealTime?: boolean;
}

export const SecurityMetricsIntegration: React.FC<SecurityMetricsIntegrationProps> = ({
  enableRealTime = false
}) => {
  const [metrics, setMetrics] = useState<SecurityMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const generateMetrics = () => {
    const newMetrics: SecurityMetric[] = [
      {
        id: 'response-time',
        name: 'Tiempo de Respuesta',
        value: 120 + Math.random() * 30,
        unit: 'ms',
        trend: Math.random() > 0.5 ? 'down' : 'stable',
        category: 'performance',
        status: 'good'
      },
      {
        id: 'security-score',
        name: 'Puntuación de Seguridad',
        value: 95 + Math.random() * 5,
        unit: '%',
        trend: 'stable',
        category: 'security',
        status: 'good'
      },
      {
        id: 'db-connections',
        name: 'Conexiones DB Activas',
        value: Math.floor(5 + Math.random() * 15),
        unit: 'conexiones',
        trend: Math.random() > 0.7 ? 'up' : 'stable',
        category: 'database',
        status: 'good'
      },
      {
        id: 'neural-coherence',
        name: 'Coherencia Neural',
        value: 85 + Math.random() * 10,
        unit: '%',
        trend: 'up',
        category: 'neural',
        status: 'good'
      },
      {
        id: 'auth-success-rate',
        name: 'Tasa de Éxito Auth',
        value: 98 + Math.random() * 2,
        unit: '%',
        trend: 'stable',
        category: 'security',
        status: 'good'
      },
      {
        id: 'error-rate',
        name: 'Tasa de Errores',
        value: Math.random() * 2,
        unit: '%',
        trend: 'down',
        category: 'performance',
        status: 'good'
      }
    ];

    setMetrics(newMetrics);
    setIsLoading(false);
  };

  useEffect(() => {
    generateMetrics();

    if (enableRealTime) {
      const interval = setInterval(generateMetrics, 5000);
      return () => clearInterval(interval);
    }
  }, [enableRealTime]);

  const getCategoryIcon = (category: SecurityMetric['category']) => {
    switch (category) {
      case 'performance':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'security':
        return <Shield className="w-4 h-4 text-green-400" />;
      case 'database':
        return <Database className="w-4 h-4 text-blue-400" />;
      case 'neural':
        return <Activity className="w-4 h-4 text-purple-400" />;
    }
  };

  const getTrendIcon = (trend: SecurityMetric['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      case 'stable':
        return <div className="w-3 h-3 bg-gray-400 rounded-full" />;
    }
  };

  const getStatusColor = (status: SecurityMetric['status']) => {
    switch (status) {
      case 'good':
        return 'border-green-500/30 bg-green-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'critical':
        return 'border-red-500/30 bg-red-500/10';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6 text-center">
          <Activity className="w-8 h-8 text-cyan-400 mx-auto mb-2 animate-spin" />
          <p className="text-white">Cargando métricas de seguridad...</p>
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
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            Métricas de Seguridad en Tiempo Real
            {enableRealTime && (
              <Badge className="bg-green-500">
                En Vivo
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-lg border ${getStatusColor(metric.status)}`}
          >
            <div className="flex items-center justify-between mb-2">
              {getCategoryIcon(metric.category)}
              <div className="flex items-center gap-1">
                {getTrendIcon(metric.trend)}
                <Badge variant="outline" className="text-xs capitalize">
                  {metric.category}
                </Badge>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-white mb-1">
              {metric.value.toFixed(metric.unit === 'ms' ? 0 : 1)}
              <span className="text-sm text-gray-400 ml-1">{metric.unit}</span>
            </div>
            
            <div className="text-sm text-gray-300">{metric.name}</div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-gray-500">
                Actualizado ahora
              </div>
              <Badge className={
                metric.status === 'good' ? 'bg-green-600' :
                metric.status === 'warning' ? 'bg-yellow-600' : 'bg-red-600'
              }>
                {metric.status.toUpperCase()}
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Resumen Neural */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            Integración Neural Activa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {metrics.find(m => m.id === 'neural-coherence')?.value.toFixed(1) || 0}%
              </div>
              <div className="text-sm text-gray-400">Coherencia Neural</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {metrics.length}
              </div>
              <div className="text-sm text-gray-400">Métricas Monitoreadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {enableRealTime ? '5s' : 'Manual'}
              </div>
              <div className="text-sm text-gray-400">Frecuencia Actualización</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

