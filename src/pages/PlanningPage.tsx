
import React from 'react';
import { AppLayout } from '@/components/app-layout';

const PlanningPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              📋 Planificador Inteligente
            </h1>
            <p className="text-gray-300 text-lg">
              Tu plan de estudio personalizado para el éxito en la PAES
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <span className="text-3xl">🗓️</span>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Planificación Académica Personalizada
              </h2>
              <p className="text-gray-300 mb-6">
                Crea planes de estudio adaptativos basados en tu diagnóstico, objetivos y tiempo disponible.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">🎯 Objetivos Personalizados</h3>
                  <p className="text-gray-400 text-sm">Metas específicas según tu carrera objetivo</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">⏱️ Cronograma Adaptativo</h3>
                  <p className="text-gray-400 text-sm">Horarios que se ajustan a tu disponibilidad</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">📈 Optimización Continua</h3>
                  <p className="text-gray-400 text-sm">El plan evoluciona con tu progreso</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PlanningPage;
