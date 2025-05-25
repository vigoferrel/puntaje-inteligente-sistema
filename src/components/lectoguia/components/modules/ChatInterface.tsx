
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Zap, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ChatInterfaceProps {
  context: any;
  diagnosticIntegration: any;
  planIntegration: any;
  onAction: (action: any) => void;
  onNavigate: (module: string, context?: any) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  context,
  diagnosticIntegration,
  planIntegration,
  onAction,
  onNavigate
}) => {
  const handleQuickAction = (actionType: string, payload?: any) => {
    onAction({ type: actionType, payload });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header del Chat */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
          <MessageCircle className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Chat Inteligente PAES</h2>
          <p className="text-white/70">Tu asistente personal de estudio</p>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
          <CardContent className="p-6 text-center">
            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Iniciar Diagnóstico</h3>
            <p className="text-white/70 text-sm mb-4">
              Evalúa tu nivel actual en las materias PAES
            </p>
            <Button 
              onClick={() => handleQuickAction('START_DIAGNOSTIC')}
              className="w-full"
              disabled={!diagnosticIntegration.isReady}
            >
              {diagnosticIntegration.isReady ? 'Comenzar' : 'Preparando...'}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
          <CardContent className="p-6 text-center">
            <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Crear Plan</h3>
            <p className="text-white/70 text-sm mb-4">
              Diseña tu plan de estudio personalizado
            </p>
            <Button 
              onClick={() => handleQuickAction('CREATE_PLAN', { title: 'Plan PAES 2024' })}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              Crear Plan
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Estado del Sistema */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{diagnosticIntegration.availableTests}</div>
              <div className="text-xs text-white/70">Tests Disponibles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{planIntegration.allPlans?.length || 0}</div>
              <div className="text-xs text-white/70">Planes Activos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
