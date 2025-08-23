/* eslint-disable react-refresh/only-export-components */

import React, { useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { loadValidator } from '../../core/performance/LoadValidationSystem';
import { Activity, CheckCircle, AlertTriangle, X, Minimize2, Maximize2 } from 'lucide-react';

export const MinimizablePerformanceMonitor: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [report, setReport] = useState(loadValidator.getValidationReport());

  useEffect(() => {
    const interval = setInterval(() => {
      setReport(loadValidator.getValidationReport());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto-mostrar si hay problemas crÃƒÂ­ticos de performance
    if (!report.isHealthy && report.issues.length > 2) {
      setIsVisible(true);
      setIsMinimized(false);
    }
  }, [report]);

  // Auto-minimizar despuÃƒÂ©s de 10 segundos de inactividad
  useEffect(() => {
    if (!isMinimized && isVisible) {
      const timer = setTimeout(() => {
        setIsMinimized(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isMinimized, isVisible]);

  if (!isVisible) {
    return (
      <motion.div
        className="fixed bottom-4 right-4 z-30"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-blue-600/80 hover:bg-blue-700/90 backdrop-blur-sm"
          size="sm"
        >
          <Activity className="w-4 h-4 mr-2" />
          Performance
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed bottom-4 right-4 z-30"
      >
        {isMinimized ? (
          // VersiÃƒÂ³n minimizada
          <motion.div
            className="bg-black/70 backdrop-blur-xl rounded-lg border border-cyan-500/30 p-3 cursor-pointer"
            onClick={() => setIsMinimized(false)}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <Badge 
                variant={report.isHealthy ? "default" : "destructive"}
                className={`${report.isHealthy ? "bg-green-600" : "bg-red-600"} text-xs`}
              >
                {report.isHealthy ? <CheckCircle className="w-3 h-3 w-3 h-3" />}
              </Badge>
              <span className="text-white text-xs">
                {Math.round(report.metrics.componentLoadTime)}ms
              </span>
            </div>
          </motion.div>
        ) : (
          // VersiÃƒÂ³n expandida
          <Card className="w-80 bg-black/80 backdrop-blur-xl border-cyan-500/30">
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
                    {report.isHealthy ? 'Saludable' : 'OptimizaciÃƒÂ³n Necesaria'}
                  </Badge>
                  
                  <Button
                    onClick={() => setIsMinimized(true)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white h-6 w-6 p-0"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </Button>
                  
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

              {/* Resto del contenido igual que PerformanceMonitor original */}
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
                    <div className="text-gray-400">NavegaciÃƒÂ³n</div>
                    <div className="text-white font-mono">
                      {report.metrics.navigationResponseTime.toFixed(0)}ms
                    </div>
                  </div>
                </div>

                {report.issues.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm text-red-400 font-medium">Problemas Detectados:</div>
                    {report.issues.slice(0, 2).map((issue, index) => (
                      <div key={index} className="text-xs text-red-300 bg-red-900/20 p-2 rounded">
                        {issue}
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
                    Reset MÃƒÂ©tricas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

