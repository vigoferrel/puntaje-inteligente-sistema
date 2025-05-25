
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, Play, CheckCircle, XCircle, RotateCcw,
  Target, Clock, Zap, Activity
} from 'lucide-react';
import { IntelligentRecommendation, StudentProfile } from '@/core/unified-education-system/EducationDataHub';

interface AdaptiveDiagnostics3DProps {
  recommendations: IntelligentRecommendation[];
  studentProfile: StudentProfile;
}

export const AdaptiveDiagnostics3D: React.FC<AdaptiveDiagnostics3DProps> = ({
  recommendations,
  studentProfile
}) => {
  const [diagnosticActive, setDiagnosticActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [diagnosticComplete, setDiagnosticComplete] = useState(false);

  // Preguntas de diagnóstico adaptativo simuladas
  const diagnosticQuestions = [
    {
      id: 1,
      question: "¿Cuál es la mejor estrategia para abordar un problema matemático complejo?",
      options: [
        "Intentar resolverlo inmediatamente",
        "Dividir el problema en partes más pequeñas",
        "Buscar un ejemplo similar",
        "Aplicar fórmulas memorizadas"
      ],
      correct: 1,
      skill: "SOLVE_PROBLEMS",
      adaptiveLevel: studentProfile.currentLevel
    },
    {
      id: 2,
      question: "Al leer un texto científico, ¿qué haces primero?",
      options: [
        "Leer completo sin parar",
        "Identificar ideas principales",
        "Buscar términos desconocidos",
        "Tomar notas detalladas"
      ],
      correct: 1,
      skill: "TRACK_LOCATE",
      adaptiveLevel: studentProfile.currentLevel
    },
    {
      id: 3,
      question: "¿Cómo evalúas la validez de una fuente histórica?",
      options: [
        "Por su antigüedad",
        "Por el contexto y autor",
        "Por la cantidad de información",
        "Por su popularidad"
      ],
      correct: 1,
      skill: "SOURCE_ANALYSIS",
      adaptiveLevel: studentProfile.currentLevel
    }
  ];

  const startDiagnostic = () => {
    setDiagnosticActive(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setDiagnosticComplete(false);
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex.toString()];
    setAnswers(newAnswers);

    if (currentQuestion < diagnosticQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Diagnóstico completado
      setDiagnosticComplete(true);
      setDiagnosticActive(false);
    }
  };

  const resetDiagnostic = () => {
    setDiagnosticActive(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setDiagnosticComplete(false);
  };

  const calculateResults = () => {
    if (answers.length === 0) return { score: 0, strengths: [], weaknesses: [] };

    const correct = answers.reduce((sum, answer, index) => {
      return sum + (parseInt(answer) === diagnosticQuestions[index].correct ? 1 : 0);
    }, 0);

    const score = (correct / diagnosticQuestions.length) * 100;
    
    const strengths = diagnosticQuestions
      .filter((q, index) => parseInt(answers[index]) === q.correct)
      .map(q => q.skill);
    
    const weaknesses = diagnosticQuestions
      .filter((q, index) => parseInt(answers[index]) !== q.correct)
      .map(q => q.skill);

    return { score, strengths, weaknesses };
  };

  const results = calculateResults();

  return (
    <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-green-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3">
          <Brain className="w-6 h-6 text-green-400" />
          Diagnóstico Adaptativo 3D
          <Badge className="bg-gradient-to-r from-green-600 to-emerald-600">
            IA Neural
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!diagnosticActive && !diagnosticComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="p-6 bg-green-600/20 rounded-lg border border-green-500/30">
              <Activity className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <h3 className="text-white font-medium mb-2">Evaluación Inteligente</h3>
              <p className="text-green-200 text-sm mb-4">
                Sistema de diagnóstico que se adapta a tu perfil cognitivo en tiempo real
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                <div className="text-center">
                  <div className="text-green-400 font-bold">3D</div>
                  <div className="text-gray-400">Dimensiones</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-bold">IA</div>
                  <div className="text-gray-400">Adaptativo</div>
                </div>
              </div>
              
              <Button
                onClick={startDiagnostic}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Iniciar Diagnóstico
              </Button>
            </div>
          </motion.div>
        )}

        {diagnosticActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {/* Progreso */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white">Pregunta {currentQuestion + 1} de {diagnosticQuestions.length}</span>
                <span className="text-green-400">
                  {Math.round(((currentQuestion + 1) / diagnosticQuestions.length) * 100)}%
                </span>
              </div>
              <Progress value={((currentQuestion + 1) / diagnosticQuestions.length) * 100} className="h-2" />
            </div>

            {/* Pregunta actual */}
            <div className="p-4 bg-white/5 rounded-lg border border-green-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-300">
                  Evaluando: {diagnosticQuestions[currentQuestion].skill}
                </span>
              </div>
              
              <h4 className="text-white font-medium mb-4">
                {diagnosticQuestions[currentQuestion].question}
              </h4>
              
              <div className="space-y-2">
                {diagnosticQuestions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-3 text-left bg-white/5 hover:bg-green-600/20 rounded border border-white/10 hover:border-green-500/50 text-white transition-all"
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Información adaptativa */}
            <div className="p-3 bg-green-600/20 rounded border-l-4 border-green-400">
              <div className="flex items-center gap-2 text-sm text-green-200">
                <Zap className="w-4 h-4" />
                <span>
                  Adaptado a tu nivel: {studentProfile.currentLevel} • 
                  Estilo: {studentProfile.learningStyle}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {diagnosticComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Resultados */}
            <div className="text-center p-6 bg-green-600/20 rounded-lg border border-green-500/30">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <h3 className="text-white font-medium mb-2">Diagnóstico Completado</h3>
              <div className="text-3xl font-bold text-green-400 mb-2">
                {Math.round(results.score)}%
              </div>
              <p className="text-green-200 text-sm">Precisión en evaluación adaptativa</p>
            </div>

            {/* Análisis detallado */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-600/20 rounded-lg">
                <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Fortalezas
                </h4>
                <div className="space-y-1">
                  {results.strengths.map((skill, index) => (
                    <Badge key={index} className="bg-green-600 text-white text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {results.strengths.length === 0 && (
                    <p className="text-gray-400 text-xs">Enfócate en mejorar</p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-orange-600/20 rounded-lg">
                <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-orange-400" />
                  Áreas de Mejora
                </h4>
                <div className="space-y-1">
                  {results.weaknesses.map((skill, index) => (
                    <Badge key={index} variant="outline" className="border-orange-500/50 text-orange-400 text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {results.weaknesses.length === 0 && (
                    <p className="text-gray-400 text-xs">¡Excelente dominio!</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recomendaciones IA */}
            <div className="p-4 bg-purple-600/20 rounded-lg border border-purple-500/30">
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                Recomendaciones IA Personalizadas
              </h4>
              <div className="space-y-2 text-sm">
                {results.score >= 80 && (
                  <p className="text-green-300">
                    • Excelente desempeño. Considera avanzar a contenido de mayor dificultad.
                  </p>
                )}
                {results.score >= 60 && results.score < 80 && (
                  <p className="text-yellow-300">
                    • Buen nivel. Refuerza las áreas débiles con ejercicios específicos.
                  </p>
                )}
                {results.score < 60 && (
                  <p className="text-orange-300">
                    • Enfócate en consolidar conceptos fundamentales antes de avanzar.
                  </p>
                )}
                <p className="text-purple-300">
                  • El sistema adaptará automáticamente el contenido basado en estos resultados.
                </p>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-3">
              <Button
                onClick={resetDiagnostic}
                variant="outline"
                className="flex-1 border-green-500/50 text-white hover:bg-green-500/20"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Repetir Diagnóstico
              </Button>
              
              <Button
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Target className="w-4 h-4 mr-2" />
                Ver Ejercicios Adaptativos
              </Button>
            </div>
          </motion.div>
        )}

        {/* Información del sistema */}
        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-3 h-3" />
              <span>Duración estimada: 3-5 min</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Activity className="w-3 h-3" />
              <span>Adapta en tiempo real</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
