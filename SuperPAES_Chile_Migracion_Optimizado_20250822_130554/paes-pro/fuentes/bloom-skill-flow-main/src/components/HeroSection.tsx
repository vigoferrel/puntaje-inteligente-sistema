
import React from 'react';
import { ArrowDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-skillnest-blue-50 via-white to-skillnest-green-50 py-20">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #22c55e 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Skillnest Branding */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="skillnest-logo">
              <div className="flex items-center space-x-3">
                <div className="skillnest-icon">
                  <div className="w-12 h-12 bg-gradient-to-r from-skillnest-blue-500 to-skillnest-green-500 rounded-xl flex items-center justify-center shadow-skillnest">
                    <div className="space-y-1">
                      <div className="w-7 h-0.5 bg-white rounded"></div>
                      <div className="w-7 h-0.5 bg-white rounded"></div>
                      <div className="w-7 h-0.5 bg-white rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-skillnest-blue-600 to-skillnest-green-600 bg-clip-text text-transparent">
                  Skillnest
                </div>
              </div>
            </div>
          </div>
          <div className="text-skillnest-blue-600 font-medium text-lg">
            es Coding Dojo Latam
          </div>
        </div>

        {/* Revolutionary Hero Content */}
        <div className="text-center max-w-6xl mx-auto">
          <div className="mb-8">
            <span className="inline-block bg-gradient-to-r from-skillnest-blue-100 to-skillnest-green-100 text-skillnest-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-skillnest-blue-200">
              🚀 Primera Evaluación Cognitiva Bloom para Tech Skills
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            <span className="block">Revolutionamos</span>
            <span className="block bg-gradient-to-r from-skillnest-blue-600 to-skillnest-green-600 bg-clip-text text-transparent">
              la Evaluación
            </span>
            <span className="block">Técnica con IA</span>
          </h1>

          <p className="text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            El primer widget del mundo que evalúa <strong>nivel cognitivo real</strong> en habilidades técnicas, 
            no solo memorización de sintaxis. Powered by GPT-4 y Taxonomía de Bloom.
          </p>

          {/* Key Stats */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-skillnest border border-skillnest-blue-100">
              <div className="text-4xl font-bold text-skillnest-blue-600 mb-2">85%+</div>
              <div className="text-gray-600">Precisión en detección de nivel cognitivo</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-skillnest border border-skillnest-green-100">
              <div className="text-4xl font-bold text-skillnest-green-600 mb-2">L1-L5</div>
              <div className="text-gray-600">Niveles Bloom: Recordar → Evaluar</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-skillnest border border-skillnest-blue-100">
              <div className="text-4xl font-bold text-skillnest-blue-600 mb-2">15min</div>
              <div className="text-gray-600">Evaluación completa + rutas personalizadas</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button className="bg-gradient-to-r from-skillnest-blue-500 to-skillnest-green-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-skillnest-lg transition-all duration-300 transform hover:scale-105">
              Probar Demo Interactiva
            </button>
            <button className="border-2 border-skillnest-blue-500 text-skillnest-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-skillnest-blue-50 transition-all duration-300">
              Ver Cómo Funciona
            </button>
          </div>

          {/* Scroll indicator */}
          <div className="flex flex-col items-center text-skillnest-blue-400">
            <span className="text-sm mb-2">Descubre la revolución</span>
            <ArrowDown size={24} className="animate-skillnest-bounce" />
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-skillnest-blue-200 rounded-full blur-xl opacity-70"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-skillnest-green-200 rounded-full blur-xl opacity-70"></div>
    </section>
  );
};

export default HeroSection;
