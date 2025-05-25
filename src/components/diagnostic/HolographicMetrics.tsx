
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface HolographicMetricsProps {
  data: any;
  systemMetrics: any;
  onExitMatrix: () => void;
}

export const HolographicMetrics: React.FC<HolographicMetricsProps> = ({
  data,
  systemMetrics,
  onExitMatrix
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 p-6"
    >
      <div className="mb-6">
        <Button onClick={onExitMatrix} variant="ghost" className="text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Salir del Matrix
        </Button>
      </div>

      <Card className="bg-black/60 backdrop-blur-sm border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">Métricas Holográficas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {systemMetrics?.totalNodes || 0}
              </div>
              <div className="text-green-300">Nodos Totales</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                {systemMetrics?.completedNodes || 0}
              </div>
              <div className="text-blue-300">Nodos Completados</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">
                {systemMetrics?.availableTests || 0}
              </div>
              <div className="text-purple-300">Tests Disponibles</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
