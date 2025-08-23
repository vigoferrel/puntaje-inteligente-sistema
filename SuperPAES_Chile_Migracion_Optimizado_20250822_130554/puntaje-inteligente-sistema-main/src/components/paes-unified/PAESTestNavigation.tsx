/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Calculator, 
  Microscope, 
  History,
  FileText,
  TrendingUp,
  Clock
} from 'lucide-react';
import { PAESTestPerformance } from '../../hooks/use-paes-unified-dashboard-optimized';

interface PAESTestNavigationProps {
  testPerformances: PAESTestPerformance[];
  activeTest: string;
  onTestSelect: (testId: string) => void;
  className?: string;
}

export const PAESTestNavigation: FC<PAESTestNavigationProps> = ({
  testPerformances,
  activeTest,
  onTestSelect,
  className
}) => {
  const getTestIcon = (testCode: string) => {
    if (testCode.includes('COMPETENCIA_LECTORA')) return BookOpen;
    if (testCode.includes('MATEMATICA_1')) return Calculator;
    if (testCode.includes('MATEMATICA_2')) return Calculator;
    if (testCode.includes('CIENCIAS')) return Microscope;
    if (testCode.includes('HISTORIA')) return History;
    return FileText;
  };

  const getTestColor = (testCode: string) => {
    if (testCode.includes('COMPETENCIA_LECTORA')) return 'text-blue-400 bg-blue-600/10 border-blue-600/30';
    if (testCode.includes('MATEMATICA')) return 'text-green-400 bg-green-600/10 border-green-600/30';
    if (testCode.includes('CIENCIAS')) return 'text-purple-400 bg-purple-600/10 border-purple-600/30';
    if (testCode.includes('HISTORIA')) return 'text-yellow-400 bg-yellow-600/10 border-yellow-600/30';
    return 'text-gray-400 bg-gray-600/10 border-gray-600/30';
  };

  const getPerformanceColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-400';
    if (accuracy >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Pruebas PAES</h3>
        <Badge variant="outline" className="text-gray-400">
          {testPerformances.length} disponibles
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testPerformances.map((performance, index) => {
          const TestIcon = getTestIcon(performance.testCode);
          const isActive = activeTest === performance.testId;
          
          return (
            <motion.div
              key={performance.testId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={isActive ? "default" : "outline"}
                className={`w-full h-auto p-4 flex flex-col items-start gap-3 ${
                  isActive 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                }`}
                onClick={() => onTestSelect(performance.testId)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`p-2 rounded-lg ${getTestColor(performance.testCode)}`}>
                    <TestIcon className="h-5 w-5" />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getPerformanceColor(performance.accuracy)}`}
                  >
                    {Math.round(performance.accuracy)}%
                  </Badge>
                </div>

                <div className="text-left w-full">
                  <h4 className="font-medium text-sm mb-1">{performance.testName}</h4>
                  <p className="text-xs text-gray-400 mb-2">
                    {performance.correctAnswers}/{performance.totalQuestions} correctas
                  </p>
                  
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-xs">{performance.projectedScore} pts</span>
                    </div>
                    
                    {performance.lastActivity && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">
                          {new Date(performance.lastActivity).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Indicadores de fortalezas/debilidades */}
                <div className="w-full">
                  {performance.strengths.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1">
                      {performance.strengths.slice(0, 2).map(strength => (
                        <Badge 
                          key={strength} 
                          variant="outline" 
                          className="text-xs text-green-400 border-green-600/50"
                        >
                          âœ“ {strength.slice(0, 8)}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {performance.criticalAreas.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {performance.criticalAreas.slice(0, 2).map(area => (
                        <Badge 
                          key={area} 
                          variant="outline" 
                          className="text-xs text-red-400 border-red-600/50"
                        >
                          ! {area.slice(0, 8)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* BotÃ³n para ver comparaciÃ³n global */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: testPerformances.length * 0.1 + 0.2 }}
      >
        <Button
          variant="outline"
          className="w-full bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-600/50 hover:bg-purple-800/20"
          onClick={() => onTestSelect('comparative')}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Ver AnÃ¡lisis Comparativo
        </Button>
      </motion.div>
    </div>
  );
};

