
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Target, 
  Clock, 
  CheckCircle,
  ArrowRight,
  BookOpen,
  BarChart3
} from 'lucide-react';

interface InitialAssessmentPanelProps {
  onComplete: () => void;
}

export const InitialAssessmentPanel: React.FC<InitialAssessmentPanelProps> = ({
  onComplete
}) => {
  const assessmentSteps = [
    {
      icon: Brain,
      title: "Evaluación Cognitiva",
      description: "Determinar tu nivel actual en cada habilidad PAES",
      duration: "45 min",
      questions: "60 preguntas"
    },
    {
      icon: Target,
      title: "Análisis de Fortalezas",
      description: "Identificar tus áreas de mayor competencia",
      duration: "15 min",
      questions: "Automático"
    },
    {
      icon: BarChart3,
      title: "Línea Base Establecida",
      description: "Crear tu perfil personalizado de puntajes",
      duration: "5 min",
      questions: "Procesamiento"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-lg text-white mb-6">
          <h1 className="text-3xl font-bold mb-4">Evaluación Inicial Inteligente</h1>
          <p className="text-xl text-blue-100">
            Estableceremos tu línea base para crear un plan completamente personalizado
          </p>
        </div>
      </motion.div>

      {/* Beneficios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-800">Diagnóstico Preciso</h3>
            <p className="text-sm text-green-600">
              Evaluación integral usando ejercicios oficiales PAES
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-blue-800">Plan Personalizado</h3>
            <p className="text-sm text-blue-600">
              Estrategias específicas basadas en tus resultados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-purple-800">Seguimiento Continuo</h3>
            <p className="text-sm text-purple-600">
              Monitoreo automático de tu progreso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Proceso de Evaluación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>Proceso de Evaluación</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {assessmentSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {step.duration}
                </Badge>
                <span className="text-xs text-gray-500">{step.questions}</span>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Información Adicional */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <BookOpen className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">¿Qué incluye la evaluación?</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Preguntas oficiales de PAES de años anteriores</li>
                <li>• Ejercicios adaptativos generados por IA</li>
                <li>• Análisis automático de patrones de respuesta</li>
                <li>• Establecimiento de metas personalizadas</li>
                <li>• Recomendaciones de estudio específicas</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón de Inicio */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <Button
          onClick={onComplete}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 group"
        >
          <Brain className="w-5 h-5 mr-2" />
          Comenzar Evaluación Inicial
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
        
        <p className="text-sm text-gray-600 mt-4">
          La evaluación se guarda automáticamente. Puedes pausar en cualquier momento.
        </p>
      </motion.div>
    </div>
  );
};
