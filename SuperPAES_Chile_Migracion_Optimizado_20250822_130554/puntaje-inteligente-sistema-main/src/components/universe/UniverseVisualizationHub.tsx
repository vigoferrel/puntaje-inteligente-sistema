/* eslint-disable react-refresh/only-export-components */

import React, { Suspense } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { AppLayout } from '../../components/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { SafeThreeProvider, useThreeSupport } from '../../core/three/SafeThreeProvider';
import { SystemErrorBoundary } from '../../core/error-handling/SystemErrorBoundary';
import { Globe, Atom, Brain, Sparkles } from 'lucide-react';

const UniverseContent: React.FC = () => {
  const threeSupported = useThreeSupport();

  if (threeSupported === null) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white/60">Verificando compatibilidad 3D...</div>
      </div>
    );
  }

  if (!threeSupported) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* VersiÃ³n fallback sin Three.js */}
        <Card className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Universo Educativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-black/20 rounded-lg flex items-center justify-center">
              <div className="text-white/60 text-center">
                <Atom className="w-12 h-12 mx-auto mb-2 animate-pulse" />
                <div>Modo 2D Activado</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Red Neural PAES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-black/20 rounded-lg flex items-center justify-center">
              <div className="text-white/60 text-center">
                <Brain className="w-12 h-12 mx-auto mb-2 animate-pulse" />
                <div>Dashboard Simplificado</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Aprendizaje Adaptativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-black/20 rounded-lg flex items-center justify-center">
              <div className="text-white/60 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-2 animate-pulse" />
                <div>VisualizaciÃ³n EstÃ¡tica</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Contenido con Three.js (lazy loaded)
  return (
    <SafeThreeProvider>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Universo de VisualizaciÃ³n PAES</h2>
          <p className="text-white/70">ExploraciÃ³n inmersiva del conocimiento educativo</p>
        </div>
        
        <div className="h-96 bg-black/20 rounded-lg border border-white/10">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="text-white/60">Inicializando universo 3D...</div>
            </div>
          }>
            {/* AquÃ­ irÃ­a el componente Three.js real */}
            <div className="flex items-center justify-center h-full">
              <div className="text-white/60 text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                <div>Renderizando universo 3D...</div>
              </div>
            </div>
          </Suspense>
        </div>
      </div>
    </SafeThreeProvider>
  );
};

export const UniverseVisualizationHub: React.FC = () => {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <SystemErrorBoundary moduleName="Universe Visualization Hub">
            <UniverseContent />
          </SystemErrorBoundary>
        </motion.div>
      </div>
    </AppLayout>
  );
};

