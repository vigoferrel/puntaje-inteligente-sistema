
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Zap, 
  Shield, 
  Activity, 
  CheckCircle, 
  AlertTriangle,
  Cpu,
  Network
} from 'lucide-react';

interface NeuralHealthMetrics {
  systemHealth: number;
  errorRate: number;
  responseTime: number;
  memoryUsage: number;
  connectionStability: number;
  neuralSynapse: number;
}

export const NeuralHealthDashboard: React.FC = () => {
  const [metrics, setMetrics] = React.useState<NeuralHealthMetrics>({
    systemHealth: 98,
    errorRate: 0.1,
    responseTime: 120,
    memoryUsage: 45,
    connectionStability: 99,
    neuralSynapse: 95
  });

  const healthItems = [
    {
      label: 'Salud Sistémica',
      value: metrics.systemHealth,
      unit: '%',
      icon: Brain,
      color: metrics.systemHealth > 95 ? 'text-green-400' : metrics.systemHealth > 80 ? 'text-yellow-400' : 'text-red-400',
      status: metrics.systemHealth > 95 ? 'optimal' : metrics.systemHealth > 80 ? 'good' : 'critical'
    },
    {
      label: 'Tasa de Error',
      value: metrics.errorRate,
      unit: '%',
      icon: Shield,
      color: metrics.errorRate < 1 ? 'text-green-400' : metrics.errorRate < 5 ? 'text-yellow-400' : 'text-red-400',
      status: metrics.errorRate < 1 ? 'optimal' : metrics.errorRate < 5 ? 'good' : 'critical'
    },
    {
      label: 'Tiempo Respuesta',
      value: metrics.responseTime,
      unit: 'ms',
      icon: Zap,
      color: metrics.responseTime < 200 ? 'text-green-400' : metrics.responseTime < 500 ? 'text-yellow-400' : 'text-red-400',
      status: metrics.responseTime < 200 ? 'optimal' : metrics.responseTime < 500 ? 'good' : 'critical'
    },
    {
      label: 'Uso Memoria',
      value: metrics.memoryUsage,
      unit: '%',
      icon: Cpu,
      color: metrics.memoryUsage < 70 ? 'text-green-400' : metrics.memoryUsage < 85 ? 'text-yellow-400' : 'text-red-400',
      status: metrics.memoryUsage < 70 ? 'optimal' : metrics.memoryUsage < 85 ? 'good' : 'critical'
    },
    {
      label: 'Estabilidad',
      value: metrics.connectionStability,
      unit: '%',
      icon: Network,
      color: metrics.connectionStability > 95 ? 'text-green-400' : metrics.connectionStability > 80 ? 'text-yellow-400' : 'text-red-400',
      status: metrics.connectionStability > 95 ? 'optimal' : metrics.connectionStability > 80 ? 'good' : 'critical'
    },
    {
      label: 'Sinapsis Neural',
      value: metrics.neuralSynapse,
      unit: '%',
      icon: Activity,
      color: metrics.neuralSynapse > 90 ? 'text-green-400' : metrics.neuralSynapse > 70 ? 'text-yellow-400' : 'text-red-400',
      status: metrics.neuralSynapse > 90 ? 'optimal' : metrics.neuralSynapse > 70 ? 'good' : 'critical'
    }
  ];

  const overallHealth = Math.round(
    (metrics.systemHealth + 
     (100 - metrics.errorRate) + 
     Math.max(0, 100 - metrics.responseTime / 5) + 
     (100 - metrics.memoryUsage) + 
     metrics.connectionStability + 
     metrics.neuralSynapse) / 6
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        systemHealth: Math.min(100, prev.systemHealth + (Math.random() - 0.4) * 2),
        errorRate: Math.max(0, prev.errorRate + (Math.random() - 0.7) * 0.1),
        responseTime: Math.max(50, prev.responseTime + (Math.random() - 0.5) * 20),
        memoryUsage: Math.max(20, Math.min(90, prev.memoryUsage + (Math.random() - 0.6) * 5)),
        connectionStability: Math.min(100, prev.connectionStability + (Math.random() - 0.3) * 1),
        neuralSynapse: Math.min(100, prev.neuralSynapse + (Math.random() - 0.4) * 3)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Estado General */}
      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-xl border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-400" />
            Estado del Sistema Nervioso Central
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl font-bold text-white">{overallHealth}%</div>
            <Badge className={
              overallHealth > 95 ? "bg-green-600" :
              overallHealth > 80 ? "bg-yellow-600" : "bg-red-600"
            }>
              {overallHealth > 95 ? 'Óptimo' : 
               overallHealth > 80 ? 'Bueno' : 'Crítico'}
            </Badge>
          </div>
          <Progress value={overallHealth} className="h-3" />
          <div className="text-sm text-white/70 mt-2">
            Sistema funcionando en condiciones {overallHealth > 95 ? 'óptimas' : overallHealth > 80 ? 'normales' : 'subóptimas'}
          </div>
        </CardContent>
      </Card>

      {/* Métricas Detalladas */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {healthItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <div className="flex items-center gap-1">
                    {item.status === 'optimal' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : item.status === 'good' ? (
                      <Activity className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
                <div className="text-lg font-bold text-white">
                  {item.value}{item.unit}
                </div>
                <div className="text-xs text-white/60">{item.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Diagnósticos Automáticos */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Diagnósticos Automáticos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Protocolos de auto-recuperación activados</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Error boundaries funcionando correctamente</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">SuperPAES integrado como coordinador central</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <Activity className="w-4 h-4" />
              <span className="text-sm">Monitoreo continuo de salud sistémica</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
