
import React from 'react';

const ProblemStorytelling = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              El Problema que Nadie Había Resuelto
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Las evaluaciones técnicas actuales no miden lo que realmente importa: 
              <strong> el nivel cognitivo</strong> de las habilidades técnicas.
            </p>
          </div>

          {/* Problem Scenarios */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Traditional Evaluation */}
            <div className="relative">
              <div className="bg-red-50 border-l-4 border-red-400 p-8 rounded-r-lg">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-red-600 font-bold">❌</span>
                  </div>
                  <h3 className="text-2xl font-bold text-red-800">Evaluación Tradicional</h3>
                </div>
                <div className="space-y-4 text-red-700">
                  <p><strong>Pregunta típica:</strong> "¿Qué hace Array.map() en JavaScript?"</p>
                  <p><strong>Respuesta memorizada:</strong> "Crea un nuevo array aplicando una función a cada elemento"</p>
                  <p><strong>Nivel cognitivo:</strong> L1 - Recordar (Memorización)</p>
                  <div className="bg-red-100 p-4 rounded mt-4">
                    <p className="font-semibold">❌ Problema: El desarrollador puede googlear esto en 5 segundos, pero ¿puede aplicarlo para resolver problemas complejos?</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skillnest Bloom Evaluation */}
            <div className="relative">
              <div className="bg-skillnest-green-50 border-l-4 border-skillnest-green-500 p-8 rounded-r-lg">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-skillnest-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-skillnest-green-600 font-bold">✅</span>
                  </div>
                  <h3 className="text-2xl font-bold text-skillnest-green-800">Evaluación Skillnest Bloom</h3>
                </div>
                <div className="space-y-4 text-skillnest-green-700">
                  <p><strong>Pregunta cognitiva:</strong> "Analiza por qué este código tiene problemas de performance y propón 3 optimizaciones"</p>
                  <p><strong>Análisis IA de respuesta:</strong> Detecta nivel L4 (Analizar) o L5 (Evaluar)</p>
                  <p><strong>Nivel cognitivo real:</strong> L4-L5 - Puede resolver problemas complejos</p>
                  <div className="bg-skillnest-green-100 p-4 rounded mt-4">
                    <p className="font-semibold">✅ Resultado: Sabemos que puede pensar críticamente y resolver problemas reales</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real World Impact */}
          <div className="bg-gradient-to-r from-skillnest-blue-50 to-skillnest-green-50 rounded-2xl p-8 mb-12">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Impacto en el Mundo Real
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-skillnest-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="text-xl font-semibold text-skillnest-blue-700 mb-2">Para Reclutadores</h4>
                <p className="text-gray-600">Contrata desarrolladores que realmente pueden resolver problemas, no solo memorizar sintaxis</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-skillnest-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎓</span>
                </div>
                <h4 className="text-xl font-semibold text-skillnest-green-700 mb-2">Para Bootcamps</h4>
                <p className="text-gray-600">Personaliza el aprendizaje basado en el nivel cognitivo real de cada estudiante</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-skillnest-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h4 className="text-xl font-semibold text-skillnest-blue-700 mb-2">Para Equipos Dev</h4>
                <p className="text-gray-600">Identifica gaps cognitivos y crea planes de desarrollo específicos</p>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="text-center">
            <blockquote className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              "No es lo que sabes, es <span className="text-skillnest-blue-600">cómo piensas</span> con lo que sabes"
            </blockquote>
            <cite className="text-lg text-skillnest-green-600 font-semibold">
              - Filosofía Skillnest Bloom Assessment
            </cite>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemStorytelling;
