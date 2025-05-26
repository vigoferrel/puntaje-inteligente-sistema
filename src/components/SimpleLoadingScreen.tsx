
import React from 'react';
import { Brain } from 'lucide-react';

export const SimpleLoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-cyan-400" />
          <span className="text-lg font-semibold">PAES Master</span>
        </div>
        <p className="text-cyan-300 text-sm">Cargando sistema...</p>
      </div>
    </div>
  );
};
