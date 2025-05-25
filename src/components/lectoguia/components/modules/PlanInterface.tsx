
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PlanInterfaceProps {
  planIntegration: any;
  onAction: (action: any) => void;
  onNavigate: (module: string, context?: any) => void;
}

export const PlanInterface: React.FC<PlanInterfaceProps> = ({
  planIntegration,
  onAction,
  onNavigate
}) => {
  const handleCreatePlan = () => {
    onAction({
      type: 'CREATE_PLAN',
      payload: {
        title: `Plan PAES ${new Date().getFullYear()}`,
        description: 'Plan de estudio personalizado generado automáticamente'
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Plan de Estudios</h2>
          <p className="text-white/70">Tu hoja de ruta hacia el éxito PAES</p>
        </div>
      </div>

      {/* Plan Actual o Estado Vacío */}
      {planIntegration.currentPlan ? (
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              {planIntegration.currentPlan.title}
            </h3>
            <p className="text-white/70 mb-4">
              {planIntegration.currentPlan.description}
            </p>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Calendar className="w-4 h-4" />
              Creado: {new Date().toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-white/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Aún no tienes un plan de estudios
            </h3>
            <p className="text-white/70 mb-6">
              Crea tu plan personalizado basado en tus resultados de diagnóstico
            </p>
            
            <Button onClick={handleCreatePlan} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Crear Mi Plan PAES
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Resumen de Planes */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-primary">{planIntegration.allPlans?.length || 0}</div>
            <div className="text-xs text-white/70">Planes Totales</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-green-400">0%</div>
            <div className="text-xs text-white/70">Progreso</div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
