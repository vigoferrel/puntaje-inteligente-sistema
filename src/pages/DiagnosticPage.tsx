
import React from 'react';
import { AppLayout } from '@/components/app-layout';

const DiagnosticPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🧠 Centro de Diagnóstico IA
            </h1>
            <p className="text-gray-300 text-lg">
              Evaluación inteligente de tus habilidades académicas
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-3xl">🔬</span>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Diagnóstico Académico Avanzado
              </h2>
              <p className="text-gray-300 mb-6">
                Evaluaciones adaptativas que identifican tus fortalezas y áreas de mejora para optimizar tu preparación PAES.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">🎯 Evaluación Inicial</h3>
                  <p className="text-gray-400 text-sm">Determina tu nivel actual en cada área</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">📊 Análisis Predictivo</h3>
                  <p className="text-gray-400 text-sm">Proyecta tu rendimiento en la PAES</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">🔄 Seguimiento Continuo</h3>
                  <p className="text-gray-400 text-sm">Monitorea tu progreso en tiempo real</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DiagnosticPage;
