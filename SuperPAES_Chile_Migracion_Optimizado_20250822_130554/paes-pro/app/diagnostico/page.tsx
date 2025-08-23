'use client'

import Sidebar from '@/components/Sidebar'
import { Activity, Clock, Target, TrendingUp, Brain } from 'lucide-react'

export default function DiagnosticoPage() {
  const diagnosticTests = [
    {
      id: 'competencia-lectora',
      title: 'Competencia Lectora',
      description: 'Evalúa tu capacidad de comprensión, interpretación y análisis de textos',
      duration: 30,
      questions: 15,
      lastScore: null,
      status: 'available',
      skills: ['Localizar información', 'Interpretar y relacionar', 'Evaluar y reflexionar']
    },
    {
      id: 'matematica-m1',
      title: 'Matemática M1',
      description: 'Números, álgebra, funciones y geometría',
      duration: 45,
      questions: 20,
      lastScore: null,
      status: 'available',
      skills: ['Números y operaciones', 'Álgebra', 'Funciones', 'Geometría']
    },
    {
      id: 'matematica-m2',
      title: 'Matemática M2',
      description: 'Cálculo, probabilidades y estadística',
      duration: 45,
      questions: 20,
      lastScore: null,
      status: 'coming-soon',
      skills: ['Límites y derivadas', 'Probabilidades', 'Estadística']
    }
  ]

  const handleStartDiagnostic = (testId: string) => {
    console.log('Starting diagnostic:', testId)
    // Aquí iría la lógica para iniciar el diagnóstico
  }

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Diagnóstico Adaptativo</h1>
            <p className="text-gray-600">
              Evalúa tu nivel actual y recibe un plan de estudio personalizado basado en tus fortalezas y debilidades
            </p>
          </div>

          {/* Información del diagnóstico */}
          <div className="card mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¿Qué es el Diagnóstico Adaptativo?
                </h3>
                <p className="text-gray-600 mb-4">
                  Nuestro sistema de diagnóstico utiliza inteligencia artificial para adaptar las preguntas 
                  según tus respuestas, proporcionando una evaluación más precisa de tu nivel en menos tiempo.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Activity className="w-4 h-4 mr-2 text-blue-600" />
                    <span>Adaptativo</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Target className="w-4 h-4 mr-2 text-blue-600" />
                    <span>Personalizado</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-blue-600" />
                    <span>Rápido</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                    <span>Preciso</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tests disponibles */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {diagnosticTests.map((test) => (
              <div key={test.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-purple-600" />
                  </div>
                  
                  {test.status === 'coming-soon' && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      Próximamente
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{test.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{test.description}</p>
                
                {/* Información del test */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Duración:</span>
                    <span className="font-medium">{test.duration} minutos</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Preguntas:</span>
                    <span className="font-medium">{test.questions} aprox.</span>
                  </div>
                </div>
                
                {/* Habilidades evaluadas */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Habilidades evaluadas:</p>
                  <div className="flex flex-wrap gap-1">
                    {test.skills.map((skill) => (
                      <span 
                        key={skill}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Último resultado */}
                {test.lastScore && (
                  <div className="mb-4 p-2 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-700">Último resultado:</span>
                      <span className="font-semibold text-green-800">{test.lastScore} pts</span>
                    </div>
                  </div>
                )}
                
                {/* Botón de acción */}
                <button
                  onClick={() => handleStartDiagnostic(test.id)}
                  disabled={test.status !== 'available'}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    test.status === 'available'
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {test.lastScore ? 'Retomar diagnóstico' : 'Iniciar diagnóstico'}
                </button>
              </div>
            ))}
          </div>

          {/* Recomendaciones */}
          <div className="mt-12 card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              💡 Recomendaciones para un mejor diagnóstico
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Antes del diagnóstico:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Asegúrate de tener una conexión estable a internet</li>
                  <li>Busca un lugar tranquilo y sin distracciones</li>
                  <li>Ten papel y lápiz a mano para cálculos</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Durante el diagnóstico:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Lee cada pregunta con atención</li>
                  <li>No te apresures, pero tampoco demores mucho</li>
                  <li>Si no sabes una respuesta, haz tu mejor intento</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
