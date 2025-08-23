/* eslint-disable react-refresh/only-export-components */

import React, { useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { loadValidator } from '../../core/performance/LoadValidationSystem';
import { Activity, CheckCircle, AlertTriangle, X } from 'lucide-react';

export const PerformanceMonitor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [report, setReport] = useState(loadValidator.getValidationReport());

  useEffect(() => {
    const interval = setInterval(() => {
      setReport(loadValidator.getValidationReport());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto-mostrar si hay problemas de performance
    if (!report.isHealthy && report.issues.length > 0) {
      setIsVisible(true);
    }
  }, [report]);

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700"
        size="sm"
      >
        <Activity className="w-4 h-4 mr-2" />
        Performance
      </Button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Card className="w-80 bg-black/90 backdrop-blur-xl border-cyan-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-white">Performance Monitor</h3>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant={report.isHealthy ? "default" : "destructive"}
                  className={report.isHealthy ? "bg-green-600" : "bg-red-600"}
                >
                  {report.isHealthy ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 mr-1" />
                  )}
                  {report.isHealthy ? 'Saludable' : 'OptimizaciÃ³n Necesaria'}
                </Badge>
                
                <Button
                  onClick={() => setIsVisible(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-800/50 p-2 rounded">
                  <div className="text-gray-400">Tiempo de Carga</div>
                  <div className="text-white font-mono">
                    {report.metrics.componentLoadTime.toFixed(0)}ms
                  </div>
                </div>
                <div className="bg-gray-800/50 p-2 rounded">
                  <div className="text-gray-400">Renders</div>
                  <div className="text-white font-mono">
                    {report.metrics.renderCount}
                  </div>
                </div>
                <div className="bg-gray-800/50 p-2 rounded">
                  <div className="text-gray-400">Errores</div>
                  <div className="text-white font-mono">
                    {report.metrics.errorCount}
                  </div>
                </div>
                <div className="bg-gray-800/50 p-2 rounded">
                  <div className="text-gray-400">NavegaciÃ³n</div>
                  <div className="text-white font-mono">
                    {report.metrics.navigationResponseTime.toFixed(0)}ms
                  </div>
                </div>
              </div>

              {report.issues.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm text-red-400 font-medium">Problemas Detectados:</div>
                  {report.issues.map((issue, index) => (
                    <div key={index} className="text-xs text-red-300 bg-red-900/20 p-2 rounded">
                      {issue}
                    </div>
                  ))}
                </div>
              )}

              {report.recommendations.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm text-yellow-400 font-medium">Recomendaciones:</div>
                  {report.recommendations.map((rec, index) => (
                    <div key={index} className="text-xs text-yellow-300 bg-yellow-900/20 p-2 rounded">
                      {rec}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => {
                    loadValidator.reset();
                    setReport(loadValidator.getValidationReport());
                  }}
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                >
                  Reset MÃ©tricas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

