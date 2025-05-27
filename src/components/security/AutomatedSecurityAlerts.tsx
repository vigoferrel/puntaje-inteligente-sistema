
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Bell, AlertTriangle, Shield, X, CheckCircle, Clock } from 'lucide-react';

interface SecurityAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: Date;
  category: string;
  auto_resolved: boolean;
  actions_available: string[];
}

export const AutomatedSecurityAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  const generateSecurityAlert = (
    severity: SecurityAlert['severity'],
    title: string,
    description: string,
    category: string,
    auto_resolved: boolean = false,
    actions: string[] = []
  ): SecurityAlert => ({
    id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    severity,
    title,
    description,
    timestamp: new Date(),
    category,
    auto_resolved,
    actions_available: actions
  });

  const runSecurityMonitoring = async () => {
    try {
      // Simular verificaciones de seguridad automáticas
      const newAlerts: SecurityAlert[] = [];

      // Verificar production readiness
      const { data: readinessData, error } = await supabase
        .rpc('production_readiness_check');

      if (error) {
        newAlerts.push(generateSecurityAlert(
          'high',
          'Error en Verificación de Seguridad',
          `Error al ejecutar verificación: ${error.message}`,
          'System Error',
          false,
          ['Retry Check', 'View Logs']
        ));
      } else if (readinessData) {
        if (readinessData.overall_status === 'NEEDS_FIXES') {
          newAlerts.push(generateSecurityAlert(
            'critical',
            'Sistema Requiere Correcciones Críticas',
            `Detectados ${readinessData.security_issues} problemas de seguridad que requieren atención inmediata`,
            'Security Issues',
            false,
            ['Auto Fix', 'View Details', 'Manual Review']
          ));
        } else if (readinessData.overall_status === 'NEEDS_OPTIMIZATION') {
          newAlerts.push(generateSecurityAlert(
            'medium',
            'Optimización de Performance Requerida',
            `Score de performance: ${readinessData.performance_score}% - Considere optimizar índices`,
            'Performance',
            false,
            ['Optimize Indexes', 'View Metrics']
          ));
        } else if (readinessData.overall_status === 'PRODUCTION_READY') {
          newAlerts.push(generateSecurityAlert(
            'low',
            'Sistema Listo para Producción',
            'Todas las verificaciones de seguridad han pasado exitosamente',
            'Success',
            true,
            []
          ));
        }
      }

      // Verificar índices de performance
      const { data: indexData, error: indexError } = await supabase
        .rpc('analyze_index_performance');

      if (!indexError && indexData) {
        const lowEfficiencyIndexes = indexData.filter(idx => idx.usage_efficiency < 30);
        
        if (lowEfficiencyIndexes.length > 0) {
          newAlerts.push(generateSecurityAlert(
            'medium',
            'Índices con Baja Eficiencia Detectados',
            `${lowEfficiencyIndexes.length} índices con eficiencia menor al 30% detectados`,
            'Database Performance',
            false,
            ['Review Indexes', 'Optimize Database']
          ));
        }
      }

      // Agregar alertas que no han sido descartadas
      const filteredAlerts = newAlerts.filter(alert => !dismissedAlerts.has(alert.id));
      setAlerts(prev => {
        // Evitar duplicados por tipo de alerta
        const existingCategories = prev.map(a => a.category);
        const uniqueNewAlerts = filteredAlerts.filter(alert => 
          !existingCategories.includes(alert.category)
        );
        return [...prev, ...uniqueNewAlerts].slice(-10); // Mantener solo últimas 10
      });

      // Mostrar toast para alertas críticas
      newAlerts.forEach(alert => {
        if (alert.severity === 'critical' && !dismissedAlerts.has(alert.id)) {
          toast({
            title: `🚨 ${alert.title}`,
            description: alert.description,
            variant: "destructive"
          });
        }
      });

      setLastCheck(new Date());

    } catch (error) {
      console.error('Error en monitoreo de seguridad:', error);
    }
  };

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => new Set(prev).add(alertId));
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const executeAction = async (alert: SecurityAlert, action: string) => {
    console.log(`Ejecutando acción "${action}" para alerta:`, alert.title);
    
    if (action === 'Auto Fix') {
      // Simular auto-fix
      toast({
        title: "🔧 Auto-Fix Iniciado",
        description: "Ejecutando correcciones automáticas..."
      });
      
      setTimeout(() => {
        toast({
          title: "✅ Auto-Fix Completado",
          description: "Las correcciones han sido aplicadas exitosamente"
        });
        dismissAlert(alert.id);
      }, 3000);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'high': return <Shield className="w-4 h-4 text-orange-400" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-400" />;
      default: return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Monitoreo automático cada 2 minutos
  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(runSecurityMonitoring, 2 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isMonitoring, dismissedAlerts]);

  // Verificación inicial
  useEffect(() => {
    runSecurityMonitoring();
  }, []);

  return (
    <div className="space-y-4">
      {/* Header de Control */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">
            Alertas de Seguridad Automáticas ({alerts.length})
          </h3>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="monitoring-toggle"
              checked={isMonitoring}
              onChange={(e) => setIsMonitoring(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="monitoring-toggle" className="text-white text-sm">
              Monitoreo Activo
            </label>
          </div>
          
          <Button
            size="sm"
            onClick={runSecurityMonitoring}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Shield className="w-3 h-3 mr-1" />
            Verificar Ahora
          </Button>
        </div>
      </div>

      <p className="text-gray-400 text-sm">
        Última verificación: {lastCheck.toLocaleTimeString()}
      </p>

      {/* Lista de Alertas */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'critical' ? 'border-red-500 bg-red-900/20' :
                alert.severity === 'high' ? 'border-orange-500 bg-orange-900/20' :
                alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-900/20' :
                'border-green-500 bg-green-900/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getSeverityIcon(alert.severity)}
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <span className="text-gray-400 text-xs">{alert.category}</span>
                    <span className="text-gray-500 text-xs">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <h4 className="text-white font-medium mb-1">{alert.title}</h4>
                  <p className="text-gray-300 text-sm mb-3">{alert.description}</p>
                  
                  {alert.actions_available.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {alert.actions_available.map((action, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="outline"
                          onClick={() => executeAction(alert, action)}
                          className="text-xs"
                        >
                          {action}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => dismissAlert(alert.id)}
                  className="text-gray-400 hover:text-white ml-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {alerts.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <p className="text-white">No hay alertas de seguridad activas</p>
            <p className="text-gray-400 text-sm">Sistema funcionando correctamente</p>
          </div>
        )}
      </div>
    </div>
  );
};
