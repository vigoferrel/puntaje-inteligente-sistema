
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Componentes mejorados
import { QuickNavigationWidget } from './QuickNavigationWidget';
import { RealMetricsWidget } from './RealMetricsWidget';

// Componentes existentes
import { SuperPAESCommandCenter } from './SuperPAESCommandCenter';
import { UniverseVisualizationIntegration } from './UniverseVisualizationIntegration';
import { LectoGuiaIntegration } from './LectoGuiaIntegration';
import { DiagnosticIntegration } from './DiagnosticIntegration';
import { PlanningIntegration } from './PlanningIntegration';
import { FinancialIntegration } from './FinancialIntegration';
import { PAESUnifiedDashboard } from '@/components/paes-unified/PAESUnifiedDashboard';

// Hooks y contextos
import { useAuth } from '@/contexts/AuthContext';
import { useSuperContext } from '@/contexts/SuperContext';

// Iconos
import { 
  Sparkles, 
  Brain, 
  Rocket, 
  Settings,
  ChevronDown,
  User,
  Bell
} from 'lucide-react';

export const SuperPAESUnifiedHub: React.FC = () => {
  const { profile } = useAuth();
  const { isInitialized, cinematicMode } = useSuperContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);

  const userName = profile?.name || profile?.email?.split('@')[0] || 'Estudiante';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Fondo cinematográfico mejorado */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-500" />
      </div>

      {/* Header mejorado */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
              >
                <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">SuperPAES Hub</h1>
                  <p className="text-white/70 text-sm">Centro de comando inteligente</p>
                </div>
              </motion.div>

              {cinematicMode && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                  <Brain className="w-3 h-3 mr-1" />
                  Modo Neural Activo
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-white hover:bg-white/10 relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg">
                <User className="w-4 h-4 text-white/70" />
                <span className="text-white text-sm font-medium">{userName}</span>
                <ChevronDown className="w-4 h-4 text-white/70" />
              </div>
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/10 bg-black/30"
            >
              <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="space-y-2">
                  <div className="text-sm text-white">🎯 Nueva evaluación disponible</div>
                  <div className="text-sm text-white">📚 Plan de estudio actualizado</div>
                  <div className="text-sm text-white">⭐ ¡Nuevo logro desbloqueado!</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Contenido principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-white/10 backdrop-blur-xl border border-white/20">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white"
            >
              Vista General
            </TabsTrigger>
            <TabsTrigger 
              value="command" 
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white"
            >
              Centro de Comando
            </TabsTrigger>
            <TabsTrigger 
              value="paes" 
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white"
            >
              Dashboard PAES
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Widgets mejorados */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <QuickNavigationWidget />
                <RealMetricsWidget />
              </div>

              {/* Grid de módulos principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <LectoGuiaIntegration />
                <DiagnosticIntegration />
                <PlanningIntegration />
                <FinancialIntegration />
                <UniverseVisualizationIntegration />
                
                {/* Card de acceso a más funciones */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 border-white/20 h-full cursor-pointer">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                      <Rocket className="w-12 h-12 text-white mb-4" />
                      <h3 className="text-lg font-bold text-white mb-2">
                        Explorar Más
                      </h3>
                      <p className="text-white/80 text-sm">
                        Descubre todas las funcionalidades avanzadas
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="command">
            <SuperPAESCommandCenter />
          </TabsContent>

          <TabsContent value="paes">
            <PAESUnifiedDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
