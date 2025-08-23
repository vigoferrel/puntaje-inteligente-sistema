/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { motion } from 'framer-motion';
import { Globe, Layers3, Sparkles } from 'lucide-react';

export const UniverseVisualizationIntegration: FC = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 border-white/20 h-full cursor-pointer">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8 text-white" />
            <div>
              <CardTitle className="text-white">Universo 3D</CardTitle>
              <p className="text-white/80 text-sm">VisualizaciÃ³n inmersiva</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-white/90 text-sm">
            <Layers3 className="w-4 h-4" />
            <span>ExploraciÃ³n multidimensional</span>
          </div>
          <div className="flex items-center gap-2 text-white/90 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Conexiones neuronales</span>
          </div>
          <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
            Explorar Universo
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

