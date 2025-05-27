
import React from 'react';
import { AppLayout } from '@/components/app-layout';

const FinancialPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              💰 Centro Financiero PAES
            </h1>
            <p className="text-gray-300 text-lg">
              Planifica tu futuro educativo y financiero
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-3xl">🏦</span>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Tu Centro Financiero Educativo
              </h2>
              <p className="text-gray-300 mb-6">
                Calcula costos universitarios, becas disponibles y planifica tu inversión en educación superior.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">💳 Calculadora de Costos</h3>
                  <p className="text-gray-400 text-sm">Estima gastos de carrera y universidad</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">🎓 Simulador de Becas</h3>
                  <p className="text-gray-400 text-sm">Descubre becas disponibles para ti</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">📈 Planificador Financiero</h3>
                  <p className="text-gray-400 text-sm">Crea tu plan de ahorro educativo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default FinancialPage;
