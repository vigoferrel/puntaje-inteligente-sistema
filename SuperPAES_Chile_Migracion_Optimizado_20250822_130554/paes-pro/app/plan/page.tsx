'use client'

import Sidebar from '@/components/Sidebar'
import { Calendar, Target, TrendingUp, Clock, BookOpen, CheckCircle } from 'lucide-react'

export default function PlanPage() {
  const studyPlan = {
    title: 'Plan de Estudio Personalizado',
    goal: 'Mejorar puntaje PAES en Competencia Lectora',
    targetScore: 650,
    currentScore: 500,
    timeframe: '12 semanas',
    progress: 15
  }

  const weeklyPlan = [
    {
      week: 1,
      title: 'Fundamentos de Comprensión Lectora',
      status: 'completed',
      topics: [
        { name: 'Identificación de ideas principales', completed: true },
        { name: 'Estructura textual básica', completed: true },
        { name: 'Vocabulario en contexto', completed: false }
      ],
      timeRequired: '4 horas'
    },
    {
      week: 2,
      title: 'Técnicas de Lectura Comprensiva',
      status: 'in-progress',
      topics: [
        { name: 'Lectura exploratoria', completed: true },
        { name: 'Lectura analítica', completed: false },
        { name: 'Toma de notas efectiva', completed: false }
      ],
      timeRequired: '5 horas'
    },
    {
      week: 3,
      title: 'Análisis de Textos Argumentativos',
      status: 'pending',
      topics: [
        { name: 'Identificación de argumentos', completed: false },
        { name: 'Evaluación de evidencias', completed: false },
        { name: 'Detección de falacias', completed: false }
      ],
      timeRequired: '6 horas'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle
      case 'in-progress': return Clock
      default: return BookOpen
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Plan de Estudio</h1>
            <p className="text-gray-600">
              Plan personalizado basado en tu diagnóstico y objetivos académicos
            </p>
          </div>

          {/* Resumen del plan */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Objetivo</h3>
                  <p className="text-sm text-gray-600">{studyPlan.goal}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Puntaje actual:</span>
                  <span className="font-semibold">{studyPlan.currentScore} pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Puntaje objetivo:</span>
                  <span className="font-semibold text-purple-600">{studyPlan.targetScore} pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tiempo estimado:</span>
                  <span className="font-semibold">{studyPlan.timeframe}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Progreso General</h3>
                  <p className="text-sm text-gray-600">Semana 2 de 12</p>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progreso del plan</span>
                  <span className="font-medium">{studyPlan.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill bg-blue-500"
                    style={{ width: `${studyPlan.progress}%` }}
                  />
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>¡Vas por buen camino! Mantén el ritmo para alcanzar tu objetivo.</p>
              </div>
            </div>
          </div>

          {/* Plan semanal */}
          <div className="card mb-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Plan Semanal</h2>
            </div>

            <div className="space-y-6">
              {weeklyPlan.map((week) => {
                const StatusIcon = getStatusIcon(week.status)
                
                return (
                  <div key={week.week} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3 text-sm font-medium">
                          {week.week}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{week.title}</h3>
                          <p className="text-sm text-gray-600">Semana {week.week}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(week.status)}`}>
                          {week.status === 'completed' ? 'Completado' : 
                           week.status === 'in-progress' ? 'En progreso' : 'Pendiente'}
                        </span>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {week.timeRequired}
                        </div>
                      </div>
                    </div>

                    <div className="ml-11">
                      <div className="space-y-2">
                        {week.topics.map((topic, index) => (
                          <div key={index} className="flex items-center">
                            <div className={`w-4 h-4 rounded mr-3 flex items-center justify-center ${
                              topic.completed ? 'bg-green-500' : 'bg-gray-300'
                            }`}>
                              {topic.completed && <CheckCircle className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-sm ${topic.completed ? 'text-gray-900 line-through' : 'text-gray-700'}`}>
                              {topic.name}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      {week.status === 'in-progress' && (
                        <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          Continuar semana
                        </button>
                      )}
                      
                      {week.status === 'pending' && (
                        <button className="mt-3 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                          Iniciar semana
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Estadísticas de estudio */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">8h</div>
              <div className="text-gray-600 text-sm">Tiempo estudiado</div>
              <div className="text-xs text-gray-500 mt-1">esta semana</div>
            </div>
            
            <div className="card text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">5</div>
              <div className="text-gray-600 text-sm">Temas completados</div>
              <div className="text-xs text-gray-500 mt-1">de 15 totales</div>
            </div>
            
            <div className="card text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">85%</div>
              <div className="text-gray-600 text-sm">Consistencia</div>
              <div className="text-xs text-gray-500 mt-1">últimas 2 semanas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
