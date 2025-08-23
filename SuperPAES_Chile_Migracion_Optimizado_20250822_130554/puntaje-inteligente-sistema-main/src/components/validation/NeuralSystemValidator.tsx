/* eslint-disable react-refresh/only-export-components */

import React, { useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
// DISABLED: import { supabase } from '../../integrations/supabase/unified-client';
import { CheckCircle, AlertTriangle, RefreshCw, Database, Zap } from 'lucide-react';

interface ValidationResult {
  issue_type: string;
  description: string;
  node_count: number;
}

interface IndexPerformance {
  table_name: string;
  index_name: string;
  index_size: string;
  scans: number;
  tuples_read: number;
  tuples_fetched: number;
  usage_efficiency: number;
}

export const NeuralSystemValidator: React.FC = () => {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [indexPerformance, setIndexPerformance] = useState<IndexPerformance[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [lastValidation, setLastValidation] = useState<Date | null>(null);
  const [systemHealth, setSystemHealth] = useState<'excellent' | 'good' | 'warning' | 'critical'>('good');

  const runValidation = async () => {
    setIsValidating(true);
    try {
      // Ejecutar validaciÃ³n de coherencia de nodos
      const { data: coherenceData, error: coherenceError } = await supabase
        .rpc('validate_nodes_coherence');

      if (coherenceError) {
        console.error('Error validating coherence:', coherenceError);
      } else {
        setValidationResults(coherenceData || []);
      }

      // Analizar performance de Ã­ndices
      const { data: indexData, error: indexError } = await supabase
        .rpc('analyze_index_performance');

      if (indexError) {
        console.error('Error analyzing indexes:', indexError);
      } else {
        setIndexPerformance(indexData || []);
      }

      // Calcular health del sistema
      const totalIssues = coherenceData?.reduce((sum, item) => sum + item.node_count, 0) || 0;
      const avgEfficiency = indexData?.reduce((sum, item) => sum + item.usage_efficiency, 0) / (indexData?.length || 1) || 0;

      if (totalIssues === 0 && avgEfficiency > 80) {
        setSystemHealth('excellent');
      } else if (totalIssues < 5 && avgEfficiency > 60) {
        setSystemHealth('good');
      } else if (totalIssues < 15 && avgEfficiency > 40) {
        setSystemHealth('warning');
      } else {
        setSystemHealth('critical');
      }

      setLastValidation(new Date());
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-depsuseEffect(() => {
    runValidation();
  }, []);useEffect(() => {
    runValidation();
  }, []);

  const getHealthColor = () => {
    switch (systemHealth) {
      case 'excellent': return 'from-green-500 to-emerald-500';
      case 'good': return 'from-blue-500 to-cyan-500';
      case 'warning': return 'from-yellow-500 to-orange-500';
      case 'critical': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getHealthIcon = () => {
    switch (systemHealth) {
      case 'excellent': return <CheckCircle className="w-5 h-5" />;
      case 'good': return <Zap className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'critical': return <RefreshCw className="w-5 h-5 animate-spin" />;
      default: return <Database className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header de Estado General */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${getHealthColor()} text-white font-semibold mb-4`}>
          {getHealthIcon()}
          <span>Sistema Neural: {systemHealth.toUpperCase()}</span>
        </div>
        {lastValidation && (
          <p className="text-gray-400 text-sm">
            Ãšltima validaciÃ³n: {lastValidation.toLocaleTimeString()}
          </p>
        )}
      </motion.div>

      {/* BotÃ³n de RevalidaciÃ³n */}
      <div className="flex justify-center">
        <Button
          onClick={runValidation}
          disabled={isValidating}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isValidating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Validando...
            </>
          ) : (
            <>
              <Database className="w-4 h-4 mr-2" />
              Ejecutar ValidaciÃ³n Completa
            </>
          )}
        </Button>
      </div>

      {/* Resultados de ValidaciÃ³n de Coherencia */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            ValidaciÃ³n de Coherencia de Nodos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {validationResults.length > 0 ? (
            validationResults.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">{result.description}</p>
                  <p className="text-gray-400 text-sm">Tipo: {result.issue_type}</p>
                </div>
                <Badge variant={result.node_count === 0 ? "default" : "destructive"}>
                  {result.node_count} {result.node_count === 1 ? 'problema' : 'problemas'}
                </Badge>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-white">No se encontraron problemas de coherencia</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance de Ãndices */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Performance de Ãndices ({indexPerformance.length} Ã­ndices analizados)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {indexPerformance.slice(0, 9).map((index, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 bg-gray-700/30 rounded-lg"
              >
                <p className="text-white font-medium text-sm truncate">{index.index_name}</p>
                <p className="text-gray-400 text-xs truncate">{index.table_name}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-300 text-xs">{index.index_size}</span>
                  <Badge 
                    variant={index.usage_efficiency > 70 ? "default" : index.usage_efficiency > 40 ? "secondary" : "destructive"}
                    className="text-xs"
                  >
                    {index.usage_efficiency.toFixed(1)}%
                  </Badge>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {index.scans} scans â€¢ {index.tuples_read} reads
                </div>
              </motion.div>
            ))}
          </div>
          
          {indexPerformance.length > 9 && (
            <div className="text-center mt-4">
              <p className="text-gray-400 text-sm">
                Mostrando los primeros 9 de {indexPerformance.length} Ã­ndices
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};




