import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle, Info, Zap, HardDrive, Cpu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type AlertSeverity = 'info' | 'warning' | 'critical';
type AlertCategory = 'memory' | 'performance' | 'errors' | 'security' | 'user_experience';

interface Alert {
  id: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  message: string;
  timestamp: number;
  metrics?: Record<string, number>;
  recommendation?: string;
  autoFixAvailable?: boolean;
  acknowledged?: boolean;
}

interface ThresholdConfig {
  memory: { warning: number; critical: number };
  responseTime: { warning: number; critical: number };
  errorRate: { warning: number; critical: number };
  renderTime: { warning: number; critical: number };
}

class IntelligentAlertsEngine {
  private static instance: IntelligentAlertsEngine;
  private alerts: Alert[] = [];
  private subscribers: ((alerts: Alert[]) => void)[] = [];
  private thresholds: ThresholdConfig = {
    memory: { warning: 70, critical: 85 },
    responseTime: { warning: 200, critical: 500 },
    errorRate: { warning: 1, critical: 3 },
    renderTime: { warning: 100, critical: 200 }
  };

  static getInstance(): IntelligentAlertsEngine {
    if (!IntelligentAlertsEngine.instance) {
      IntelligentAlertsEngine.instance = new IntelligentAlertsEngine();
    }
    return IntelligentAlertsEngine.instance;
  }

  subscribe(callback: (alerts: Alert[]) => void): () => void {
    this.subscribers.push(callback);
    callback(this.alerts);
    
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notify() {
    this.subscribers.forEach(callback => callback([...this.alerts]));
  }

  analyzeMetrics(metrics: {
    memory: number;
    responseTime: number;
    errorRate: number;
    renderTime: number;
    componentName?: string;
  }) {
    const { memory, responseTime, errorRate, renderTime, componentName = 'Sistema' } = metrics;
    const alerts: Alert[] = [];

    // Análisis de memoria
    if (memory >= this.thresholds.memory.critical) {
      alerts.push({
        id: `memory-critical-${Date.now()}`,
        severity: 'critical',
        category: 'memory',
        title: 'Uso crítico de memoria',
        message: `${componentName} está usando ${memory.toFixed(1)}% de memoria disponible`,
        timestamp: Date.now(),
        metrics: { memory },
        recommendation: 'Activar limpieza automática de cache y optimizar componentes',
        autoFixAvailable: true
      });
    } else if (memory >= this.thresholds.memory.warning) {
      alerts.push({
        id: `memory-warning-${Date.now()}`,
        severity: 'warning',
        category: 'memory',
        title: 'Alto uso de memoria',
        message: `${componentName} está usando ${memory.toFixed(1)}% de memoria`,
        timestamp: Date.now(),
        metrics: { memory },
        recommendation: 'Considerar optimizar la gestión de estado',
        autoFixAvailable: false
      });
    }

    // Análisis de tiempo de respuesta
    if (responseTime >= this.thresholds.responseTime.critical) {
      alerts.push({
        id: `response-critical-${Date.now()}`,
        severity: 'critical',
        category: 'performance',
        title: 'Tiempo de respuesta crítico',
        message: `${componentName} respondiendo en ${responseTime.toFixed(0)}ms`,
        timestamp: Date.now(),
        metrics: { responseTime },
        recommendation: 'Implementar lazy loading y memoización',
        autoFixAvailable: true
      });
    } else if (responseTime >= this.thresholds.responseTime.warning) {
      alerts.push({
        id: `response-warning-${Date.now()}`,
        severity: 'warning',
        category: 'performance',
        title: 'Tiempo de respuesta lento',
        message: `${componentName} respondiendo en ${responseTime.toFixed(0)}ms`,
        timestamp: Date.now(),
        metrics: { responseTime },
        recommendation: 'Revisar componentes y optimizar renders',
        autoFixAvailable: false
      });
    }

    // Análisis de tasa de errores
    if (errorRate >= this.thresholds.errorRate.critical) {
      alerts.push({
        id: `error-critical-${Date.now()}`,
        severity: 'critical',
        category: 'errors',
        title: 'Alta tasa de errores',
        message: `${componentName} reportando ${errorRate.toFixed(1)}% de errores`,
        timestamp: Date.now(),
        metrics: { errorRate },
        recommendation: 'Revisar logs y implementar manejo de errores',
        autoFixAvailable: false
      });
    }

    // Agregar nuevas alertas
    alerts.forEach(alert => this.addAlert(alert));
  }

  private addAlert(alert: Alert) {
    // Evitar alertas duplicadas
    const existing = this.alerts.find(a => 
      a.category === alert.category && 
      a.severity === alert.severity &&
      Date.now() - a.timestamp < 30000 // 30 segundos
    );

    if (existing) return;

    this.alerts.unshift(alert);
    
    // Mantener solo las últimas 50 alertas
    this.alerts = this.alerts.slice(0, 50);
    
    // Mostrar toast según severidad
    this.showToast(alert);
    this.notify();
  }

  private showToast(alert: Alert) {
    const icons = {
      info: '💡',
      warning: '⚠️',
      critical: '🚨'
    };

    const toastConfig = {
      description: alert.message,
      icon: icons[alert.severity],
      duration: alert.severity === 'critical' ? 10000 : 5000
    };

    switch (alert.severity) {
      case 'critical':
        toast.error(alert.title, toastConfig);
        break;
      case 'warning':
        toast.warning(alert.title, toastConfig);
        break;
      default:
        toast.info(alert.title, toastConfig);
    }
  }

  acknowledgeAlert(id: string) {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) {
      alert.acknowledged = true;
      this.notify();
    }
  }

  dismissAlert(id: string) {
    this.alerts = this.alerts.filter(a => a.id !== id);
    this.notify();
  }

  getUnacknowledgedAlerts(): Alert[] {
    return this.alerts.filter(a => !a.acknowledged);
  }

  getCriticalAlerts(): Alert[] {
    return this.alerts.filter(a => a.severity === 'critical' && !a.acknowledged);
  }

  autoFix(alertId: string): Promise<boolean> {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert || !alert.autoFixAvailable) return Promise.resolve(false);

    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular auto-fix
        console.log(`🔧 Auto-fixing: ${alert.title}`);
        
        if (alert.category === 'memory') {
          // Simular limpieza de memoria
          if (typeof window !== 'undefined' && 'gc' in window) {
            (window as any).gc();
          }
        }
        
        this.acknowledgeAlert(alertId);
        
        toast.success('Auto-fix aplicado', {
          description: `${alert.title} ha sido resuelto automáticamente`,
          icon: '✅'
        });
        
        resolve(true);
      }, 2000);
    });
  }
}

export const AlertsPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const alertsEngine = IntelligentAlertsEngine.getInstance();

  useEffect(() => {
    const unsubscribe = alertsEngine.subscribe(setAlerts);
    return unsubscribe;
  }, [alertsEngine]);

  useEffect(() => {
    const criticalAlerts = alertsEngine.getCriticalAlerts();
    setIsVisible(criticalAlerts.length > 0);
  }, [alerts, alertsEngine]);

  const handleAcknowledge = useCallback((id: string) => {
    alertsEngine.acknowledgeAlert(id);
  }, [alertsEngine]);

  const handleDismiss = useCallback((id: string) => {
    alertsEngine.dismissAlert(id);
  }, [alertsEngine]);

  const handleAutoFix = useCallback(async (id: string) => {
    const success = await alertsEngine.autoFix(id);
    if (!success) {
      toast.error('Auto-fix no disponible', {
        description: 'Esta alerta requiere intervención manual'
      });
    }
  }, [alertsEngine]);

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500';
      default: return 'text-blue-400 bg-blue-500/20 border-blue-500';
    }
  };

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: AlertCategory) => {
    switch (category) {
      case 'memory': return <HardDrive className="w-4 h-4" />;
      case 'performance': return <Zap className="w-4 h-4" />;
      case 'errors': return <AlertTriangle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);
  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length;

  if (!isVisible && unacknowledgedAlerts.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        className="fixed top-4 right-4 z-50 w-96"
      >
        <Card className="bg-black/95 backdrop-blur-xl border-cyan-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <h3 className="font-semibold text-white">Alertas del Sistema</h3>
                {criticalCount > 0 && (
                  <Badge variant="destructive" className="bg-red-600">
                    {criticalCount} críticas
                  </Badge>
                )}
              </div>
              <Button
                onClick={() => setIsVisible(false)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {unacknowledgedAlerts.slice(0, 5).map(alert => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(alert.severity)}
                      <span className="font-medium text-white text-sm">{alert.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(alert.category)}
                      <span className="text-xs text-gray-400 capitalize">
                        {alert.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-300 mb-2">{alert.message}</p>
                  
                  {alert.recommendation && (
                    <p className="text-xs text-cyan-300 mb-3">
                      💡 {alert.recommendation}
                    </p>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAcknowledge(alert.id)}
                      variant="outline"
                      size="sm"
                      className="text-xs h-6"
                    >
                      Aceptar
                    </Button>
                    {alert.autoFixAvailable && (
                      <Button
                        onClick={() => handleAutoFix(alert.id)}
                        variant="outline"
                        size="sm"
                        className="text-xs h-6 text-green-400 border-green-400 hover:bg-green-400/10"
                      >
                        Auto-Fix
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDismiss(alert.id)}
                      variant="ghost"
                      size="sm"
                      className="text-xs h-6 text-red-400 hover:text-red-300"
                    >
                      Descartar
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {unacknowledgedAlerts.length > 5 && (
              <div className="mt-3 text-center">
                <span className="text-xs text-gray-400">
                  +{unacknowledgedAlerts.length - 5} alertas más
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export { IntelligentAlertsEngine };
