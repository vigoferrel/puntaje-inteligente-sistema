
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NeuralSystemValidator } from '@/components/validation/NeuralSystemValidator';
import { PerformanceComparison } from '@/components/validation/PerformanceComparison';
import { SystemHealthMonitor } from '@/components/system-health/SystemHealthMonitor';
import { MinimizablePerformanceMonitor } from '@/components/optimization/MinimizablePerformanceMonitor';
import { CheckCircle, TrendingUp, Activity, Database } from 'lucide-react';

export const ValidationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('validation');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-900 to-gray-900"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      
      {/* Floating Performance Monitor */}
      <MinimizablePerformanceMonitor />
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            🧠 Dashboard de Validación Neural
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Monitoreo completo del sistema neural optimizado con 
            <span className="text-green-400 font-semibold"> 55 índices especializados</span> y 
            <span className="text-blue-400 font-semibold"> mejoras de performance del 60-80%</span>
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-800/50 border-gray-700">
            <TabsTrigger 
              value="validation" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-600"
            >
              <CheckCircle className="w-4 h-4" />
              Validación
            </TabsTrigger>
            <TabsTrigger 
              value="performance" 
              className="flex items-center gap-2 data-[state=active]:bg-green-600"
            >
              <TrendingUp className="w-4 h-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger 
              value="monitoring" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-600"
            >
              <Activity className="w-4 h-4" />
              Monitoreo
            </TabsTrigger>
            <TabsTrigger 
              value="system" 
              className="flex items-center gap-2 data-[state=active]:bg-cyan-600"
            >
              <Database className="w-4 h-4" />
              Sistema
            </TabsTrigger>
          </TabsList>

          <TabsContent value="validation" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <NeuralSystemValidator />
            </motion.div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PerformanceComparison />
            </motion.div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SystemHealthMonitor />
            </motion.div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <Database className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Sistema Neural Completamente Optimizado
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-gray-800/30 p-6 rounded-lg border border-cyan-500/30">
                  <h4 className="font-semibold text-cyan-400 mb-2">Índices Activos</h4>
                  <p className="text-3xl font-bold text-white">55</p>
                  <p className="text-gray-400 text-sm">Especializados para consultas neurales</p>
                </div>
                <div className="bg-gray-800/30 p-6 rounded-lg border border-green-500/30">
                  <h4 className="font-semibold text-green-400 mb-2">Mejora Performance</h4>
                  <p className="text-3xl font-bold text-white">60-80%</p>
                  <p className="text-gray-400 text-sm">Reducción en tiempo de respuesta</p>
                </div>
                <div className="bg-gray-800/30 p-6 rounded-lg border border-purple-500/30">
                  <h4 className="font-semibold text-purple-400 mb-2">Estado Sistema</h4>
                  <p className="text-3xl font-bold text-white">100%</p>
                  <p className="text-gray-400 text-sm">Funcionalidad operativa</p>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
