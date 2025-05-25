
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Play, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DiagnosticInterfaceProps {
  diagnosticIntegration: any;
  onAction: (action: any) => void;
  onNavigate: (module: string, context?: any) => void;
}

export const DiagnosticInterface: React.FC<DiagnosticInterfaceProps> = ({
  diagnosticIntegration,
  onAction,
  onNavigate
}) => {
  const handleStartDiagnostic = () => {
    onAction({ type: 'START_DIAGNOSTIC' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
          <BarChart3 className="w-8 h-8 text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Centro Diagnóstico</h2>
          <p className="text-white/70">Evalúa tu nivel en todas las materias PAES</p>
        </div>
      </div>

      {/* Estado del Sistema */}
      <Card className="bg-white/10 border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Sistema Diagnóstico</h3>
            <Badge variant={diagnosticIntegration.isReady ? "default" : "secondary"}>
              {diagnosticIntegration.isReady ? 'Listo' : 'Preparando'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{diagnosticIntegration.availableTests}</div>
              <div className="text-sm text-white/70">Tests Disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{diagnosticIntegration.systemMetrics?.totalNodes || 0}</div>
              <div className="text-sm text-white/70">Nodos de Aprendizaje</div>
            </div>
          </div>

          {diagnosticIntegration.isReady ? (
            <Button onClick={handleStartDiagnostic} className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Iniciar Evaluación Diagnóstica
            </Button>
          ) : (
            <Button disabled className="w-full">
              Preparando sistema...
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Tests Disponibles */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-white/80">Evaluaciones Disponibles</h4>
        
        {['Comprensión Lectora', 'Matemática M1', 'Matemática M2', 'Ciencias', 'Historia'].map((subject, index) => (
          <Card key={subject} className="bg-white/5 border-white/10">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{index + 1}</span>
                </div>
                <span className="text-white font-medium">{subject}</span>
              </div>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};
