
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { neuralTester } from '@/core/testing/NeuralDimensionTester';
import { systemValidator } from '@/core/validation/SystemValidator';
import { RealTimeHealthMonitor } from '@/core/monitoring/RealTimeHealthMonitor';
import { intelligentNav } from '@/core/navigation/IntelligentNavigationSystem';
import { CheckCircle, XCircle, AlertTriangle, Activity, Zap, Award } from 'lucide-react';

// Definir interfaces TypeScript para mayor seguridad de tipos
interface ValidationReport {
  overall: 'excellent' | 'good' | 'warning' | 'critical';
  score: number;
  systemHealth: {
    performance: number;
    stability: number;
    memory_usage: number;
    response_time: number;
  };
  tests: ValidationTest[];
  certification: {
    level: 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE';
    validUntil: string;
    issues: string[];
  };
}

interface ValidationTest {
  testType: string;
  passed: boolean;
  metrics: {
    duration: number;
    peakMemoryUsage: number;
    averageResponseTime: number;
    errorCount: number;
  };
  recommendations?: string[];
}

interface TestResult {
  dimensionId: string;
  passed: boolean;
  errors: string[];
  performance: {
    loadTime: number;
  };
  coverage: number;
}

export const ValidationControlCenter: React.FC = () => {
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<string>('');

  useEffect(() => {
    // Cargar último reporte si existe
    const lastReport = systemValidator.getLastValidation();
    if (lastReport) {
      setValidationReport(lastReport);
    }
  }, []);

  const runCompleteValidation = async () => {
    setIsRunning(true);
    setCurrentPhase('Iniciando tests unitarios...');

    try {
      // Fase 1: Tests unitarios
      setCurrentPhase('Ejecutando tests de dimensiones...');
      const testResults = await neuralTester.runFullTestSuite();
      setTestResults(testResults);

      // Fase 2: Stress testing
      setCurrentPhase('Ejecutando stress testing...');
      const validationReport = await systemValidator.runFullValidation();
      setValidationReport(validationReport);

      // Fase 3: Navegación inteligente
      setCurrentPhase('Validando navegación inteligente...');
      const navStats = intelligentNav.getNavigationStats();
      
      setCurrentPhase('✅ Validación completada con éxito');
      
      console.log('🎯 VALIDACIÓN COMPLETA FINALIZADA:', {
        testResults: testResults.length,
        validationScore: validationReport.score,
        navigationStats: navStats
      });

    } catch (error) {
      console.error('❌ Error durante validación:', error);
      setCurrentPhase('❌ Error en validación');
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string): React.ReactNode => {
    switch (status) {
      case 'PASSED':
      case 'excellent':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'WARNING':
      case 'good':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'FAILED':
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  const getCertificationBadge = (level: string): React.ReactNode => {
    const colors: Record<string, string> = {
      'PLATINUM': 'from-purple-400 to-purple-600',
      'GOLD': 'from-yellow-400 to-yellow-600',
      'SILVER': 'from-gray-300 to-gray-500',
      'BRONZE': 'from-orange-400 to-orange-600'
    };

    const gradientClass = colors[level] || 'from-gray-400 to-gray-600';

    return (
      <Badge className={`bg-gradient-to-r ${gradientClass} text-white font-bold`}>
        <Award className="w-3 h-3 mr-1" />
        {level}
      </Badge>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          animate={{ 
            rotateY: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-center"
        >
          <div className="mx-auto w-32 h-32 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-4xl mb-4">
            🔬
          </div>
          <h2 className="text-4xl font-bold text-white">Centro de Validación Neural</h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mt-2">
            Sistema integral de testing, monitoreo y certificación de calidad
          </p>
        </motion.div>

        {/* Control Panel */}
        <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-xl">Panel de Control</h3>
            <Button
              onClick={runCompleteValidation}
              disabled={isRunning}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold"
            >
              {isRunning ? (
                <>
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                  Ejecutando...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Ejecutar Validación Completa
                </>
              )}
            </Button>
          </div>

          {isRunning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-purple-500/20 rounded-lg p-4 mb-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-white">{currentPhase}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Validation Report */}
        {validationReport && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 rounded-lg p-6 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {getStatusIcon(validationReport.overall)}
                <h3 className="text-white font-bold text-xl">Reporte de Validación</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{validationReport.score}%</div>
                  <div className="text-white/60 text-sm">Puntuación General</div>
                </div>
                {getCertificationBadge(validationReport.certification.level)}
              </div>
            </div>

            {/* System Health */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {Object.entries(validationReport.systemHealth).map(([metric, score]) => (
                <div key={metric} className="bg-white/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-2">{score}%</div>
                  <div className="text-white/70 text-sm capitalize">{metric.replace('_', ' ')}</div>
                  <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                    <div 
                      className="bg-purple-400 h-1 rounded-full transition-all duration-1000"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Test Results */}
            <div className="space-y-3">
              <h4 className="text-white font-bold mb-3">Resultados de Tests</h4>
              {validationReport.tests.map((test, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(test.passed ? 'PASSED' : 'FAILED')}
                      <span className="text-white font-medium">{test.testType}</span>
                    </div>
                    <Badge variant={test.passed ? 'default' : 'destructive'}>
                      {test.passed ? 'PASS' : 'FAIL'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400">Duración: </span>
                      <span className="text-white">{test.metrics.duration.toFixed(0)}ms</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Memoria: </span>
                      <span className="text-white">{test.metrics.peakMemoryUsage.toFixed(1)}MB</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Resp. Promedio: </span>
                      <span className="text-white">{test.metrics.averageResponseTime.toFixed(0)}ms</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Errores: </span>
                      <span className="text-white">{test.metrics.errorCount}</span>
                    </div>
                  </div>

                  {test.recommendations && test.recommendations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="text-white/80 text-sm">
                        💡 {test.recommendations[0]}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Certification Details */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-white font-bold mb-3">Certificación de Calidad</h4>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/80">
                    Nivel de certificación: {getCertificationBadge(validationReport.certification.level)}
                  </div>
                  <div className="text-white/60 text-sm mt-1">
                    Válido hasta: {new Date(validationReport.certification.validUntil).toLocaleDateString()}
                  </div>
                </div>
                {validationReport.certification.issues.length === 0 && (
                  <div className="text-green-400 text-sm">
                    ✅ Todas las validaciones pasaron correctamente
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Test Results Summary */}
        {testResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 rounded-lg p-6 backdrop-blur-sm"
          >
            <h3 className="text-white font-bold text-xl mb-4">Resumen de Tests por Dimensión</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testResults.map((result, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-medium capitalize">
                      {result.dimensionId.replace('_', ' ')}
                    </span>
                    {getStatusIcon(result.passed ? 'PASSED' : 'FAILED')}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Coverage:</span>
                      <span className="text-white">{result.coverage.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Load Time:</span>
                      <span className="text-white">{result.performance.loadTime.toFixed(0)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Errores:</span>
                      <span className={result.errors.length > 0 ? 'text-red-400' : 'text-green-400'}>
                        {result.errors.length}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Real-time Monitor Integration */}
        <RealTimeHealthMonitor />
      </div>
    </motion.div>
  );
};
