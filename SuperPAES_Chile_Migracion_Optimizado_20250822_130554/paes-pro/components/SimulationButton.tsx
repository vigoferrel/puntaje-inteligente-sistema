'use client'

import { useState } from 'react'
import { Play, Settings, Clock, BookOpen } from 'lucide-react'

interface SimulationButtonProps {
  testType?: string
  onStartSimulation?: (config: SimulationConfig) => void
}

interface SimulationConfig {
  testType: string
  questionsCount: number
  timeLimit: number
  difficulty: 'facil' | 'intermedio' | 'dificil'
}

export default function SimulationButton({ testType = 'COMPETENCIA_LECTORA', onStartSimulation }: SimulationButtonProps) {
  const [showConfig, setShowConfig] = useState(false)
  const [config, setConfig] = useState<SimulationConfig>({
    testType,
    questionsCount: 10,
    timeLimit: 30,
    difficulty: 'intermedio'
  })

  const handleStartSimulation = () => {
    if (showConfig) {
      onStartSimulation?.(config)
      setShowConfig(false)
    } else {
      setShowConfig(true)
    }
  }

  if (showConfig) {
    return (
      <div className="card max-w-md mx-auto">
        <h3 className="text-lg font-semibold mb-4">Configurar Simulación</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de preguntas
            </label>
            <select
              value={config.questionsCount}
              onChange={(e) => setConfig({...config, questionsCount: parseInt(e.target.value)})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={5}>5 preguntas</option>
              <option value={10}>10 preguntas</option>
              <option value={15}>15 preguntas</option>
              <option value={20}>20 preguntas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Límite de tiempo (minutos)
            </label>
            <select
              value={config.timeLimit}
              onChange={(e) => setConfig({...config, timeLimit: parseInt(e.target.value)})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={15}>15 minutos</option>
              <option value={30}>30 minutos</option>
              <option value={45}>45 minutos</option>
              <option value={60}>60 minutos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dificultad
            </label>
            <select
              value={config.difficulty}
              onChange={(e) => setConfig({...config, difficulty: e.target.value as 'facil' | 'intermedio' | 'dificil'})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="facil">Fácil</option>
              <option value="intermedio">Intermedio</option>
              <option value="dificil">Difícil</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => setShowConfig(false)}
            className="btn-secondary flex-1"
          >
            Cancelar
          </button>
          <button
            onClick={handleStartSimulation}
            className="btn-primary flex-1 flex items-center justify-center"
          >
            <Play className="w-4 h-4 mr-2" />
            Iniciar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          ¿Listo para poner a prueba tus habilidades?
        </h3>
        <p className="text-gray-600">
          Realiza una simulación completa para evaluar tu nivel actual.
        </p>
      </div>

      <div className="flex items-center justify-center space-x-6 mb-6 text-sm text-gray-600">
        <div className="flex items-center">
          <BookOpen className="w-4 h-4 mr-2" />
          <span>10 preguntas</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          <span>30 minutos</span>
        </div>
        <div className="flex items-center">
          <Settings className="w-4 h-4 mr-2" />
          <span>Adaptativo</span>
        </div>
      </div>

      <button
        onClick={handleStartSimulation}
        className="btn-primary text-lg px-8 py-3 flex items-center mx-auto"
      >
        <Play className="w-5 h-5 mr-2" />
        Iniciar simulación
      </button>
    </div>
  )
}
