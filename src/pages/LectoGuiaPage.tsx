
import React from 'react';
import { AppLayout } from '@/components/app-layout';

const LectoGuiaPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🤖 LectoGuía IA
            </h1>
            <p className="text-gray-300 text-lg">
              Tu asistente inteligente de comprensión lectora
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-3xl">📚</span>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                LectoGuía está listo para ayudarte
              </h2>
              <p className="text-gray-300 mb-6">
                Desarrolla tus habilidades de comprensión lectora con ejercicios adaptativos y retroalimentación inteligente.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">📖 Textos Adaptativos</h3>
                  <p className="text-gray-400 text-sm">Contenido personalizado según tu nivel</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">🎯 Ejercicios Inteligentes</h3>
                  <p className="text-gray-400 text-sm">Preguntas que se adaptan a tu progreso</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">📊 Análisis Detallado</h3>
                  <p className="text-gray-400 text-sm">Seguimiento de tu mejora continua</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LectoGuiaPage;
