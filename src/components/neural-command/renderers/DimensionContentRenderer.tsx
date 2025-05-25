
import React from 'react';
import { motion } from 'framer-motion';
import { Grid3x3 } from 'lucide-react';
import { DiagnosticIntelligenceCenter } from '@/components/diagnostic/DiagnosticIntelligenceCenter';
import { CinematicFinancialCenter } from '@/components/financial-center/CinematicFinancialCenter';
import { PAESUniverseDashboard } from '@/components/paes-universe/PAESUniverseDashboard';
import { NeuralDimension, NeuralDimensionConfig } from '../config/neuralTypes';
import { useNeuralMetrics } from '../hooks/useNeuralMetrics';

interface DimensionContentRendererProps {
  activeDimension: NeuralDimension;
  activeDimensionData: NeuralDimensionConfig | undefined;
}

export const DimensionContentRenderer: React.FC<DimensionContentRendererProps> = ({
  activeDimension,
  activeDimensionData
}) => {
  const { metrics } = useNeuralMetrics();

  switch (activeDimension) {
    case 'intelligence_hub':
      return (
        <DiagnosticIntelligenceCenter 
          onStartAssessment={() => {
            console.log('🎯 Iniciando evaluación desde Intelligence Hub');
          }}
        />
      );
    
    case 'financial_center':
      return <CinematicFinancialCenter />;
    
    case 'paes_universe':
      return <PAESUniverseDashboard />;
    
    case 'matrix_diagnostics':
      return (
        <div className="p-6 font-poppins">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Grid3x3 className="w-8 h-8 text-green-400" />
              <h2 className="text-3xl font-bold text-green-400 font-poppins">Matrix Diagnóstico Neural</h2>
            </div>
            <p className="text-white/70 max-w-2xl mx-auto font-poppins">
              Sistema avanzado de evaluación neural que analiza patrones de aprendizaje 
              y genera diagnósticos precisos de habilidades cognitivas.
            </p>
            <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-xl p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2 font-poppins">
                    {Math.round(metrics.neural_efficiency)}%
                  </div>
                  <div className="text-green-300 font-poppins">Eficiencia Neural</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2 font-poppins">
                    {Math.round(metrics.adaptive_learning_score)}
                  </div>
                  <div className="text-blue-300 font-poppins">Aprendizaje Adaptativo</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2 font-poppins">
                    {Math.round(metrics.cross_pollination_rate)}%
                  </div>
                  <div className="text-purple-300 font-poppins">Cross-Pollination</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      );
    
    default:
      return (
        <div className="p-6 font-poppins">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              {activeDimensionData && <activeDimensionData.icon className="w-8 h-8 text-white" />}
              <h2 className="text-3xl font-bold text-white font-poppins">
                {activeDimensionData?.name || 'Dimensión Neural'}
              </h2>
            </div>
            <p className="text-white/70 max-w-2xl mx-auto font-poppins">
              {activeDimensionData?.description || 'Dimensión neural en desarrollo'}
            </p>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 max-w-4xl mx-auto">
              <p className="text-white/60 font-poppins">
                Dimensión neural lista para integración completa
              </p>
            </div>
          </motion.div>
        </div>
      );
  }
};
