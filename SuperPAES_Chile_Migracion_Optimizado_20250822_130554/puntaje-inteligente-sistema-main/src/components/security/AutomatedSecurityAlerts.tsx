/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
// DISABLED: // DISABLED: import { supabase } from '../../integrations/supabase/unified-client';
import { AlertTriangle, CheckCircle, Shield, Zap, Settings, Database } from 'lucide-react';
import { parseSecurityData } from '../../utils/typeGuards';
import { supabase } from '../../integrations/supabase/leonardo-auth-client';

interface SecurityAlert {
  id: string;
  type: string;
  title: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'success' | 'warning' | 'error';
  timestamp: number;
  actions: string[];
}

export const AutomatedSecurityAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const checkSecurityStatus = async () => {
    try {
      setIsLoading(true);
      
      // Obtener datos de seguridad
      const { data: readinessData } = await supabase.rpc('production_readiness_check');
      const securityData = parseSecurityData(readinessData);
      
      // AnÃ¡lisis de seguridad actualizado
      const newAlerts: SecurityAlert[] = [];
      
      // Alert basado en datos reales
      if (securityData.security_issues && securityData.security_issues > 0) {
        newAlerts.push({
          id: 'integrity-issues',
          type: 'warning',
          title: 'Problemas de Integridad Detectados',
          message: `Se encontraron ${securityData.security_issues} problemas de integridad en la base de datos`,
          severity: 'medium',
          timestamp: Date.now(),
          actions: ['Revisar mapeo skill_id/test_id', 'Validar referencias']
        });
      }

      // Estado general del sistema
      if (securityData.overall_status === 'warning') {
        newAlerts.push({
          id: 'system-warning',
          type: 'warning', 
          title: 'Sistema Requiere AtenciÃ³n',
          message: `Performance del sistema en ${securityData.performance_score}%`,
          severity: 'medium',
          timestamp: Date.now(),
          actions: ['Optimizar consultas', 'Revisar Ã­ndices']
        });
      } else if (securityData.overall_status === 'critical') {
        newAlerts.push({
          id: 'system-critical',
          type: 'error',
          title: 'Estado CrÃ­tico del Sistema', 
          message: 'Se requiere intervenciÃ³n inmediata',
          severity: 'high',
          timestamp: Date.now(),
          actions: ['Contactar soporte', 'Ejecutar diagnÃ³stico completo']
        });
      }

      // Si no hay problemas, mostrar estado saludable
      if (newAlerts.length === 0) {
        newAlerts.push({
          id: 'system-healthy',
          type: 'success',
          title: 'Sistema Completamente Seguro',
          message: 'Todas las verificaciones de seguridad pasaron exitosamente',
          severity: 'low',
          timestamp: Date.now(),
          actions: []
        });
      }

      setAlerts(newAlerts);
      
    } catch (error) {
      console.error('Error checking security status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-depsuseEffect(() => {
    checkSecurityStatus();
  }, []);useEffect(() => {
    checkSecurityStatus();
  }, []);

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          Alertas de Seguridad AutomÃ¡ticas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center">
            <p className="text-white">Cargando alertas...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-3 rounded-md bg-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                    <Badge className="opacity-80">{alert.severity}</Badge>
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-white mt-2">{alert.title}</h4>
                <p className="text-gray-300">{alert.message}</p>
                {alert.actions.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {alert.actions.map((action, index) => (
                      <Button key={index} size="sm" variant="outline">{action}</Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};





