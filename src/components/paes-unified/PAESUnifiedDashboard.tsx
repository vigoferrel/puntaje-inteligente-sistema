
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePAESContext } from '@/contexts/PAESContext';
import { PAESGlobalMetrics } from './PAESGlobalMetrics';
import { PAESTestNavigation } from './PAESTestNavigation';
import { PAESCompetenciaLectoraIntegration } from './PAESCompetenciaLectoraIntegration';
import { PAESMatematicaM1Integration } from './PAESMatematicaM1Integration';
import { PAESCienciasIntegration } from '@/components/paes-ciencias/PAESCienciasIntegration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Target } from 'lucide-react';

interface PAESUnifiedDashboardProps {
  className?: string;
}

export const PAESUnifiedDashboard: React.FC<PAESUnifiedDashboardProps> = ({ className }) => {
  const {
    loading,
    testPerformances,
    unifiedMetrics,
    comparativeAnalysis,
    refreshData
  } = usePAESContext();

  const [activeTestView, setActiveTestView] = useState<string>('global');

  const handleTestSelect = (testId: string) => {
    setActiveTestView(testId);
  };

  const renderTestContent = () => {
    if (activeTestView === 'global' || activeTestView === 'comparative') {
      return (
        <div className="space-y-6">
          {unifiedMetrics && (
            <PAESGlobalMetrics
              metrics={unifiedMetrics}
              testPerformances={testPerformances}
            />
          )}
          
          {comparativeAnalysis && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-400" />
                  Análisis Comparativo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-white mb-3">Gaps Críticos de Habilidades</h4>
                    <div className="space-y-2">
                      {comparativeAnalysis.skillGaps.slice(0, 5).map((gap, index) => (
                        <div 
                          key={gap.skill}
                          className={`p-3 rounded-lg border ${
                            gap.severity === 'HIGH' ? 'bg-red-600/10 border-red-600/30' :
                            gap.severity === 'MEDIUM' ? 'bg-yellow-600/10 border-yellow-600/30' :
                            'bg-blue-600/10 border-blue-600/30'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-white">{gap.skill}</span>
                            <span className="text-sm text-gray-400">
                              {gap.tests_affected.length} pruebas afectadas
                            </span>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {gap.recommended_hours}h de estudio recomendadas
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      );
    }

    const activeTest = testPerformances.find(test => test.testId === activeTestView);
    if (!activeTest) return null;

    if (activeTest.testCode.includes('COMPETENCIA_LECTORA')) {
      return <PAESCompetenciaLectoraIntegration />;
    }
    
    if (activeTest.testCode.includes('MATEMATICA_1')) {
      return <PAESMatematicaM1Integration />;
    }
    
    if (activeTest.testCode.includes('CIENCIAS')) {
      return <PAESCienciasIntegration />;
    }

    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8 text-center">
          <div className="text-gray-400">
            Vista específica para {activeTest.testName} en desarrollo
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className || ''}`}>
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`space-y-6 ${className || ''}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard PAES Unificado</h1>
          <p className="text-gray-400">Análisis integral de tu preparación</p>
        </div>
        
        <Button
          onClick={refreshData}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </Button>
      </div>

      <PAESTestNavigation
        testPerformances={testPerformances}
        activeTest={activeTestView}
        onTestSelect={handleTestSelect}
      />

      <motion.div
        key={activeTestView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderTestContent()}
      </motion.div>
    </motion.div>
  );
};
