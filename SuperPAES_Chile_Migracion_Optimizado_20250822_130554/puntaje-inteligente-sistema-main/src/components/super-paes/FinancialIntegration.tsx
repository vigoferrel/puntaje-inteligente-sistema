/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { motion } from 'framer-motion';
import { DollarSign, Calculator, TrendingUp } from 'lucide-react';

export const FinancialIntegration: FC = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card className="bg-gradient-to-br from-yellow-600 to-orange-600 border-white/20 h-full cursor-pointer">
        <CardHeader>
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-white" />
            <div>
              <CardTitle className="text-white">Centro Financiero</CardTitle>
              <p className="text-white/80 text-sm">Becas y financiamiento</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Badge className="bg-white/20 text-white border-white/30">
            <Calculator className="w-3 h-3 mr-1" />
            Calculadora
          </Badge>
          <div className="text-white/90 text-sm">
            Simulador de costos universitarios y oportunidades de becas
          </div>
          <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
            Explorar Opciones
            <TrendingUp className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

