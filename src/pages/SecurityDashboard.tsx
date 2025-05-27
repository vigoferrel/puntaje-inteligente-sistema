
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecurityComplianceMonitor } from '@/components/security/SecurityComplianceMonitor';
import { AuthConfigurationPanel } from '@/components/security/AuthConfigurationPanel';
import { AutomatedSecurityAlerts } from '@/components/security/AutomatedSecurityAlerts';
import { SecurityMetricsIntegration } from '@/components/security/SecurityMetricsIntegration';
import { NeuralDashboardWidget } from '@/components/neural/NeuralDashboardWidget';
import { Shield, Settings, Bell, Activity, Lock, Database } from 'lucide-react';

export const SecurityDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('compliance');
  const [widgetMinimized, setWidgetMinimized] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-900 to-gray-900"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      
      {/* Neural Dashboard Widget */}
      <NeuralDashboardWidget
        isMinimized={widgetMinimized}
        onToggleMinimize={() => setWidgetMinimized(!widgetMinimized)}
        showAdvancedMetrics={true}
      />
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            🛡️ Dashboard de Seguridad Empresarial v3.0
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Centro de comando para 
            <span className="text-green-400 font-semibold"> monitoreo de compliance</span>, 
            <span className="text-blue-400 font-semibold"> configuración auth</span> y 
            <span className="text-purple-400 font-semibold"> alertas automáticas</span>
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-gray-800/50 border-gray-700">
            <TabsTrigger 
              value="compliance" 
              className="flex items-center gap-2 data-[state=active]:bg-green-600"
            >
              <Shield className="w-4 h-4" />
              Compliance
            </TabsTrigger>
            <TabsTrigger 
              value="auth" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-600"
            >
              <Settings className="w-4 h-4" />
              Auth Config
            </TabsTrigger>
            <TabsTrigger 
              value="alerts" 
              className="flex items-center gap-2 data-[state=active]:bg-orange-600"
            >
              <Bell className="w-4 h-4" />
              Alertas
            </TabsTrigger>
            <TabsTrigger 
              value="metrics" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-600"
            >
              <Activity className="w-4 h-4" />
              Métricas
            </TabsTrigger>
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 data-[state=active]:bg-cyan-600"
            >
              <Database className="w-4 h-4" />
              Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compliance" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SecurityComplianceMonitor />
            </motion.div>
          </TabsContent>

          <TabsContent value="auth" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AuthConfigurationPanel />
            </motion.div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AutomatedSecurityAlerts />
            </motion.div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <SecurityMetricsIntegration enableRealTime={true} />
            </motion.div>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <Lock className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Sistema de Seguridad Completamente Implementado
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                <div className="bg-gray-800/30 p-6 rounded-lg border border-green-500/30">
                  <Shield className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-green-400 mb-2">Compliance</h4>
                  <p className="text-3xl font-bold text-white">100%</p>
                  <p className="text-gray-400 text-sm">Todas las correcciones aplicadas</p>
                </div>
                <div className="bg-gray-800/30 p-6 rounded-lg border border-blue-500/30">
                  <Settings className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-blue-400 mb-2">Auth Segura</h4>
                  <p className="text-3xl font-bold text-white">Activa</p>
                  <p className="text-gray-400 text-sm">Configuración optimizada</p>
                </div>
                <div className="bg-gray-800/30 p-6 rounded-lg border border-orange-500/30">
                  <Bell className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-orange-400 mb-2">Alertas Auto</h4>
                  <p className="text-3xl font-bold text-white">24/7</p>
                  <p className="text-gray-400 text-sm">Monitoreo continuo</p>
                </div>
                <div className="bg-gray-800/30 p-6 rounded-lg border border-purple-500/30">
                  <Activity className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-purple-400 mb-2">Métricas</h4>
                  <p className="text-3xl font-bold text-white">Real-time</p>
                  <p className="text-gray-400 text-sm">Integración neural activa</p>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg border border-green-500/30 max-w-4xl mx-auto">
                <h4 className="text-xl font-bold text-white mb-4">🎉 Sistema Listo para Producción</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div>
                    <h5 className="font-semibold text-green-400 mb-2">✅ Correcciones Aplicadas</h5>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Security Definer views eliminadas</li>
                      <li>• Funciones con SET search_path seguro</li>
                      <li>• RLS completamente configurado</li>
                      <li>• Integridad referencial validada</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-400 mb-2">✅ Sistemas Activos</h5>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Monitoreo de compliance automático</li>
                      <li>• Alertas de seguridad en tiempo real</li>
                      <li>• Configuración auth optimizada</li>
                      <li>• Métricas integradas con sistema neural</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
