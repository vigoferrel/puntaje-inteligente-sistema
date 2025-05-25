
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Play, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ExerciseInterfaceProps {
  context: any;
  onAction: (action: any) => void;
  onNavigate: (module: string, context?: any) => void;
}

export const ExerciseInterface: React.FC<ExerciseInterfaceProps> = ({
  context,
  onAction,
  onNavigate
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
          <Target className="w-8 h-8 text-green-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Ejercicios Adaptativos</h2>
          <p className="text-white/70">Práctica personalizada según tu nivel</p>
        </div>
      </div>

      {/* Estado Vacío */}
      <Card className="bg-white/10 border-white/20">
        <CardContent className="p-8 text-center">
          <BarChart3 className="w-12 h-12 text-white/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            No hay ejercicios activos
          </h3>
          <p className="text-white/70 mb-6">
            Inicia un diagnóstico o selecciona un nodo de aprendizaje para generar ejercicios personalizados
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => onNavigate('diagnostic')}
              className="w-full"
            >
              <Play className="w-4 h-4 mr-2" />
              Iniciar Diagnóstico
            </Button>
            
            <Button 
              onClick={() => onNavigate('chat')}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              Volver al Chat
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-blue-400">0</div>
            <div className="text-xs text-white/70">Completados</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-yellow-400">0%</div>
            <div className="text-xs text-white/70">Precisión</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-green-400">0</div>
            <div className="text-xs text-white/70">Racha</div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
