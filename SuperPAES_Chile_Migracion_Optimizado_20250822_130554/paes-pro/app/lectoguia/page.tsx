'use client'

import Sidebar from '@/components/Sidebar'
import { BookOpen, Lightbulb, Target, Clock } from 'lucide-react'

export default function LectoguiaPage() {
  const topics = [
    {
      title: 'Estrategias de Lectura Comprensiva',
      description: 'Técnicas para mejorar tu comprensión lectora',
      icon: BookOpen,
      status: 'available',
      lessons: 8
    },
    {
      title: 'Análisis de Textos Argumentativos', 
      description: 'Identifica argumentos y evalúa evidencias',
      icon: Lightbulb,
      status: 'available',
      lessons: 6
    },
    {
      title: 'Vocabulario Contextual',
      description: 'Deduce significados por contexto',
      icon: Target,
      status: 'coming-soon',
      lessons: 5
    }
  ]

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                Nuevo
              </div>
              <span className="text-sm text-gray-500">Contenido generado por IA</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lectoguía</h1>
            <p className="text-gray-600">
              Guías interactivas personalizadas para mejorar tu comprensión lectora
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => {
              const Icon = topic.icon
              
              return (
                <div key={topic.title} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-purple-600" />
                    </div>
                    
                    {topic.status === 'coming-soon' && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        Próximamente
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{topic.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{topic.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{topic.lessons} lecciones</span>
                    </div>
                    
                    <button 
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        topic.status === 'available'
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={topic.status !== 'available'}
                    >
                      {topic.status === 'available' ? 'Comenzar' : 'Próximamente'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-12 card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-blue-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Contenido Personalizado con IA
              </h3>
              <p className="text-gray-600 mb-4">
                Nuestro sistema de IA genera explicaciones y ejercicios adaptados a tu nivel y estilo de aprendizaje
              </p>
              
              <button className="btn-primary">
                Solicitar contenido personalizado
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
