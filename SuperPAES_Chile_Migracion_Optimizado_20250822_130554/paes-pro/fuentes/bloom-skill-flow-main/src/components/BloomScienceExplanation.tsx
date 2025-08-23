
import React, { useState } from 'react';
import { CircleArrowDown, CircleArrowUp } from 'lucide-react';

const BloomScienceExplanation = () => {
  const [activeLevel, setActiveLevel] = useState(3);

  const bloomLevels = [
    {
      level: 1,
      name: "Recordar",
      description: "Memorización y recuperación de información",
      techExample: "¿Qué es una función en JavaScript?",
      color: "red",
      cognitive: "Memoria básica"
    },
    {
      level: 2,
      name: "Comprender", 
      description: "Explicar ideas y conceptos",
      techExample: "Explica cómo funciona el event loop",
      color: "orange", 
      cognitive: "Comprensión conceptual"
    },
    {
      level: 3,
      name: "Aplicar",
      description: "Usar conocimiento en nuevas situaciones",
      techExample: "Implementa una función que ordene un array",
      color: "yellow",
      cognitive: "Aplicación práctica"
    },
    {
      level: 4,
      name: "Analizar",
      description: "Examinar y identificar patrones",
      techExample: "Analiza por qué este código tiene memory leaks",
      color: "green",
      cognitive: "Pensamiento analítico"
    },
    {
      level: 5,
      name: "Evaluar",
      description: "Juzgar y tomar decisiones informadas",
      techExample: "Evalúa 3 arquitecturas y recomienda la mejor",
      color: "blue",
      cognitive: "Juicio crítico experto"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      red: "bg-red-100 border-red-300 text-red-800",
      orange: "bg-orange-100 border-orange-300 text-orange-800", 
      yellow: "bg-yellow-100 border-yellow-300 text-yellow-800",
      green: "bg-skillnest-green-100 border-skillnest-green-300 text-skillnest-green-800",
      blue: "bg-skillnest-blue-100 border-skillnest-blue-300 text-skillnest-blue-800"
    };
    return colorMap[color as keyof typeof colorMap];
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-skillnest-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              La Ciencia Detrás del Widget
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Combinamos la <strong>Taxonomía de Bloom</strong> con <strong>análisis semántico GPT-4</strong> 
              para detectar el nivel cognitivo real en habilidades técnicas.
            </p>
            <div className="bg-white p-6 rounded-xl shadow-skillnest border border-skillnest-blue-100 inline-block">
              <p className="text-lg font-semibold text-skillnest-blue-700">
                🧠 Primera herramienta que aplica ciencia cognitiva a evaluación tech
              </p>
            </div>
          </div>

          {/* Bloom Pyramid Interactive */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Los 5 Niveles Cognitivos de Bloom para Tech Skills
            </h3>
            
            <div className="max-w-4xl mx-auto">
              {/* Pyramid Visual */}
              <div className="relative">
                {bloomLevels.reverse().map((level, index) => {
                  const isActive = activeLevel === level.level;
                  const width = `${100 - (index * 15)}%`;
                  
                  return (
                    <div
                      key={level.level}
                      className={`relative mx-auto mb-2 cursor-pointer transition-all duration-300 ${
                        isActive ? 'transform scale-105 z-10' : 'hover:transform hover:scale-102'
                      }`}
                      style={{ width }}
                      onClick={() => setActiveLevel(level.level)}
                    >
                      <div className={`
                        p-6 rounded-lg border-2 transition-all duration-300
                        ${isActive 
                          ? `${getColorClasses(level.color)} shadow-lg` 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                        }
                      `}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`
                              w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                              ${isActive ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-600'}
                            `}>
                              L{level.level}
                            </div>
                            <div>
                              <h4 className="text-xl font-bold">{level.name}</h4>
                              <p className="text-sm opacity-75">{level.cognitive}</p>
                            </div>
                          </div>
                          {isActive ? <CircleArrowUp size={24} /> : <CircleArrowDown size={24} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Level Details */}
              <div className="mt-8 bg-white p-8 rounded-xl shadow-skillnest border border-skillnest-blue-100">
                {(() => {
                  const currentLevel = bloomLevels.find(l => l.level === activeLevel);
                  if (!currentLevel) return null;
                  
                  return (
                    <div>
                      <h4 className="text-2xl font-bold text-skillnest-blue-700 mb-4">
                        Nivel {currentLevel.level}: {currentLevel.name}
                      </h4>
                      <p className="text-lg text-gray-700 mb-4">{currentLevel.description}</p>
                      <div className="bg-skillnest-blue-50 p-4 rounded-lg">
                        <p className="font-semibold text-skillnest-blue-800 mb-2">Ejemplo de pregunta técnica:</p>
                        <p className="text-skillnest-blue-700">"{currentLevel.techExample}"</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* AI Analysis Process */}
          <div className="bg-white rounded-2xl p-8 shadow-skillnest-lg border border-skillnest-blue-100">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Proceso de Análisis con IA
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-skillnest-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h4 className="text-xl font-semibold text-skillnest-blue-700 mb-3">1. Pregunta Adaptativa</h4>
                <p className="text-gray-600">
                  Generamos preguntas que requieren diferentes niveles cognitivos basados en respuestas anteriores
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-skillnest-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h4 className="text-xl font-semibold text-skillnest-green-700 mb-3">2. Análisis Semántico GPT-4</h4>
                <p className="text-gray-600">
                  Analizamos la respuesta semánticamente para detectar patrones de pensamiento y nivel cognitivo
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-skillnest-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className="text-xl font-semibold text-skillnest-blue-700 mb-3">3. Nivel Bloom Detectado</h4>
                <p className="text-gray-600">
                  Clasificamos con 85%+ precisión el nivel cognitivo y generamos rutas de aprendizaje personalizadas
                </p>
              </div>
            </div>

            {/* Technical Accuracy */}
            <div className="mt-12 bg-gradient-to-r from-skillnest-blue-50 to-skillnest-green-50 p-6 rounded-xl">
              <div className="text-center">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Precisión Técnica Validada</h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-skillnest-blue-600">85%+</div>
                    <div className="text-sm text-gray-600">Precisión en detección de nivel</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-skillnest-green-600">GPT-4</div>
                    <div className="text-sm text-gray-600">Modelo de análisis semántico</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-skillnest-blue-600">+5000</div>
                    <div className="text-sm text-gray-600">Evaluaciones validadas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BloomScienceExplanation;
