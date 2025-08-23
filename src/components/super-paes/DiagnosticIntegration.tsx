
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Target, BarChart3, TrendingUp } from 'lucide-react';

export const DiagnosticIntegration: React.FC = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 border-white/20 h-full cursor-pointer">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-white" />
            <div>
              <CardTitle className="text-white">Diagnóstico</CardTitle>
              <p className="text-white/80 text-sm">Evaluación inteligente</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Badge className="bg-white/20 text-white border-white/30">
            <BarChart3 className="w-3 h-3 mr-1" />
            Análisis Preciso
          </Badge>
          <div className="text-white/90 text-sm">
            Evaluación completa de habilidades y conocimientos PAES
          </div>
          <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
            Comenzar Evaluación
            <TrendingUp className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
