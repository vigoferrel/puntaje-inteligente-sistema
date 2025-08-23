import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  BookOpen, 
  Calculator, 
  History, 
  Microscope, 
  Clock, 
  Target,
  Zap,
  Brain,
  Settings,
  Play,
  Loader2
} from 'lucide-react'
import { ExamConfig, ExamType, TestSubject, DifficultyLevel } from '@/types/exams'
import { useExamPresets } from '@/hooks/useExamSystem'

interface ExamGeneratorProps {
  onGenerateExam: (config: ExamConfig) => Promise<void>
  isGenerating: boolean
}

export const ExamGenerator: React.FC<ExamGeneratorProps> = ({
  onGenerateExam,
  isGenerating
}) => {
  const { diagnosticPreset, practicePreset, simulationPreset, quickReviewPreset } = useExamPresets()
  
  const [config, setConfig] = useState<ExamConfig>(practicePreset)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const examTypes: Array<{
    type: ExamType
    title: string
    description: string
    icon: React.ComponentType<any>
    color: string
    preset: ExamConfig
  }> = [
    {
      type: 'DIAGNOSTIC',
      title: 'Diagnóstico',
      description: 'Evalúa tu nivel actual en todas las materias',
      icon: Target,
      color: 'from-blue-600 to-blue-700',
      preset: diagnosticPreset
    },
    {
      type: 'PRACTICE',
      title: 'Práctica',
      description: 'Sesión de práctica con retroalimentación',
      icon: BookOpen,
      color: 'from-green-600 to-green-700',
      preset: practicePreset
    },
    {
      type: 'SIMULATION',
      title: 'Simulacro',
      description: 'Simula las condiciones reales de la PAES',
      icon: Brain,
      color: 'from-purple-600 to-purple-700',
      preset: simulationPreset
    },
    {
      type: 'QUICK_REVIEW',
      title: 'Repaso Rápido',
      description: 'Ejercicios cortos para repasar conceptos',
      icon: Zap,
      color: 'from-yellow-600 to-yellow-700',
      preset: quickReviewPreset
    }
  ]

  const subjects: Array<{
    value: TestSubject
    label: string
    icon: React.ComponentType<any>
    color: string
  }> = [
    { value: 'COMPETENCIA_LECTORA', label: 'Competencia Lectora', icon: BookOpen, color: 'text-blue-500' },
    { value: 'MATEMATICA_M1', label: 'Matemática M1', icon: Calculator, color: 'text-green-500' },
    { value: 'MATEMATICA_M2', label: 'Matemática M2', icon: Calculator, color: 'text-purple-500' },
    { value: 'HISTORIA', label: 'Historia y CC.SS.', icon: History, color: 'text-orange-500' },
    { value: 'CIENCIAS', label: 'Ciencias', icon: Microscope, color: 'text-red-500' }
  ]

  const handlePresetSelect = (preset: ExamConfig) => {
    setConfig(preset)
  }

  const handleConfigChange = (updates: Partial<ExamConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  const handleGenerate = async () => {
    try {
      await onGenerateExam(config)
    } catch (error) {
      console.error('Error generating exam:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Presets de examen */}
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            Tipo de Examen
          </CardTitle>
          <CardDescription className="text-gray-300">
            Selecciona el tipo de examen que deseas generar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {examTypes.map((examType) => {
              const IconComponent = examType.icon
              const isSelected = config.examType === examType.type
              
              return (
                <Card
                  key={examType.type}
                  className={`cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? `bg-gradient-to-r ${examType.color} border-white/40 scale-105` 
                      : 'bg-white/5 border-white/20 hover:bg-white/10 hover:scale-105'
                  }`}
                  onClick={() => handlePresetSelect(examType.preset)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                      isSelected ? 'bg-white/20' : 'bg-white/10'
                    }`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">{examType.title}</h3>
                    <p className="text-sm text-gray-300">{examType.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Configuración básica */}
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuración
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Materia */}
          <div>
            <Label className="text-white mb-3 block">Materia</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <Button
                variant={!config.subject ? "default" : "outline"}
                className={`h-auto py-4 flex-col space-y-2 ${
                  !config.subject 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
                onClick={() => handleConfigChange({ subject: undefined })}
              >
                <Brain className="w-6 h-6" />
                <span className="text-sm">Todas las Materias</span>
              </Button>
              
              {subjects.map((subject) => {
                const IconComponent = subject.icon
                const isSelected = config.subject === subject.value
                
                return (
                  <Button
                    key={subject.value}
                    variant={isSelected ? "default" : "outline"}
                    className={`h-auto py-4 flex-col space-y-2 ${
                      isSelected 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                    onClick={() => handleConfigChange({ subject: subject.value })}
                  >
                    <IconComponent className={`w-6 h-6 ${subject.color}`} />
                    <span className="text-sm text-center">{subject.label}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Configuración básica */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="questions" className="text-white">
                Número de Preguntas
              </Label>
              <Input
                id="questions"
                type="number"
                min="5"
                max="100"
                value={config.numberOfQuestions}
                onChange={(e) => handleConfigChange({ numberOfQuestions: parseInt(e.target.value) || 20 })}
                className="bg-white/10 border-white/20 text-white mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="timeLimit" className="text-white">
                Tiempo Límite (minutos)
              </Label>
              <Input
                id="timeLimit"
                type="number"
                min="10"
                max="300"
                value={config.timeLimit || 60}
                onChange={(e) => handleConfigChange({ timeLimit: parseInt(e.target.value) || 60 })}
                className="bg-white/10 border-white/20 text-white mt-2"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => setShowAdvanced(!showAdvanced)}
                variant="outline"
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Configuración Avanzada
              </Button>
            </div>
          </div>

          {/* Configuración avanzada */}
          {showAdvanced && (
            <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-white font-medium">Distribución de Dificultad</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-white text-sm">Básico (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={config.difficultyDistribution?.basico || 30}
                    onChange={(e) => handleConfigChange({
                      difficultyDistribution: {
                        ...config.difficultyDistribution,
                        basico: parseInt(e.target.value) || 30
                      }
                    })}
                    className="bg-white/10 border-white/20 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Intermedio (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={config.difficultyDistribution?.intermedio || 50}
                    onChange={(e) => handleConfigChange({
                      difficultyDistribution: {
                        ...config.difficultyDistribution,
                        intermedio: parseInt(e.target.value) || 50
                      }
                    })}
                    className="bg-white/10 border-white/20 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Avanzado (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={config.difficultyDistribution?.avanzado || 20}
                    onChange={(e) => handleConfigChange({
                      difficultyDistribution: {
                        ...config.difficultyDistribution,
                        avanzado: parseInt(e.target.value) || 20
                      }
                    })}
                    className="bg-white/10 border-white/20 text-white mt-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    id="explanations"
                    type="checkbox"
                    checked={config.includeExplanations || false}
                    onChange={(e) => handleConfigChange({ includeExplanations: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="explanations" className="text-white text-sm">
                    Incluir explicaciones
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    id="review"
                    type="checkbox"
                    checked={config.allowReview || false}
                    onChange={(e) => handleConfigChange({ allowReview: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="review" className="text-white text-sm">
                    Permitir revisión
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    id="shuffle"
                    type="checkbox"
                    checked={config.shuffleQuestions || false}
                    onChange={(e) => handleConfigChange({ shuffleQuestions: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="shuffle" className="text-white text-sm">
                    Mezclar preguntas
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Botón de generación */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generando Examen...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Generar Examen
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de configuración */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-gray-300">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {config.timeLimit || 'Sin límite'} min
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                {config.numberOfQuestions} preguntas
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {config.subject ? subjects.find(s => s.value === config.subject)?.label : 'Todas las materias'}
              </span>
            </div>
            <div className="text-blue-400 font-medium">
              Duración estimada: {Math.ceil((config.numberOfQuestions * 1.5) / 60 * (config.timeLimit || 60))} min
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
