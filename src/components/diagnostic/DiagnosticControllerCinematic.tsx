
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Brain, 
  BarChart3, 
  Clock, 
  Award,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { useUnifiedState } from '@/hooks/useUnifiedState';

interface DiagnosticResult {
  area: string;
  score: number;
  level: 'BÁSICO' | 'INTERMEDIO' | 'AVANZADO';
  recommendations: string[];
}

interface DiagnosticControllerCinematicProps {
  onComplete?: (results: DiagnosticResult[]) => void;
  onNavigateToTool?: (tool: string) => void;
}

export const DiagnosticControllerCinematic: React.FC<DiagnosticControllerCinematicProps> = ({
  onComplete,
  onNavigateToTool
}) => {
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'testing' | 'analysis' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<number[]>([]);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { updateUserProgress, updateSystemMetrics } = useUnifiedState();

  const diagnosticAreas = [
    {
      name: 'Comprensión Lectora',
      description: 'Análisis de textos y extracción de información',
      icon: Target,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Análisis Crítico',
      description: 'Evaluación de argumentos y posiciones',
      icon: Brain,
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Vocabulario',
      description: 'Conocimiento léxico y contextual',
      icon: Award,
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Inferencia',
      description: 'Deducción de información implícita',
      icon: BarChart3,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const sampleQuestions = [
    {
      text: "¿Cuál es tu nivel de confianza al analizar textos complejos?",
      options: ["Muy bajo", "Bajo", "Medio", "Alto", "Muy alto"]
    },
    {
      text: "¿Con qué frecuencia identificas ideas principales correctamente?",
      options: ["Nunca", "Raramente", "A veces", "Frecuentemente", "Siempre"]
    },
    {
      text: "¿Qué tan fácil te resulta hacer inferencias de textos?",
      options: ["Muy difícil", "Difícil", "Neutral", "Fácil", "Muy fácil"]
    }
  ];

  const handleStartDiagnostic = () => {
    setCurrentPhase('testing');
    setCurrentQuestion(0);
    setResponses([]);
  };

  const handleResponse = (responseIndex: number) => {
    const newResponses = [...responses, responseIndex];
    setResponses(newResponses);

    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentPhase('analysis');
      processResults(newResponses);
    }
  };

  const processResults = async (responses: number[]) => {
    setIsProcessing(true);
    
    // Simular análisis IA
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const avgScore = responses.reduce((sum, score) => sum + score, 0) / responses.length;
    const normalizedScore = Math.round((avgScore / 4) * 100);
    
    const diagnosticResults: DiagnosticResult[] = diagnosticAreas.map((area, index) => {
      const variance = (Math.random() - 0.5) * 40; // ±20 puntos de variación
      const areaScore = Math.max(0, Math.min(100, normalizedScore + variance));
      
      let level: 'BÁSICO' | 'INTERMEDIO' | 'AVANZADO';
      if (areaScore < 50) level = 'BÁSICO';
      else if (areaScore < 75) level = 'INTERMEDIO';
      else level = 'AVANZADO';

      return {
        area: area.name,
        score: areaScore,
        level,
        recommendations: [
          `Practicar ${area.name.toLowerCase()} con ejercicios adaptativos`,
          `Revisar conceptos fundamentales de ${area.name.toLowerCase()}`,
          `Utilizar LectoGuía IA para apoyo personalizado`
        ]
      };
    });
    
    setResults(diagnosticResults);
    setCurrentPhase('results');
    setIsProcessing(false);
    
    // Actualizar estado global
    updateUserProgress({
      overallScore: normalizedScore,
      level: Math.floor(normalizedScore / 20) + 1
    });
    
    updateSystemMetrics({
      totalProgress: normalizedScore,
      completedNodes: Math.floor(normalizedScore * 2.77)
    });
    
    onComplete?.(diagnosticResults);
  };

  const renderIntroPhase = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="relative inline-block">
          <h2 className="text-3xl font-bold cinematic-gradient-text poppins-heading">
            Evaluación Diagnóstica IA
          </h2>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -top-3 -right-6"
          >
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </motion.div>
        </div>
        <p className="text-lg text-white/80 poppins-body">
          Evaluación inteligente de tus habilidades PAES
        </p>
      </motion.div>

      <Card className="cinematic-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3 poppins-title">
            <Target className="w-6 h-6 text-cyan-400" />
            Áreas de Evaluación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {diagnosticAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <motion.div
                  key={area.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="cinematic-glass rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${area.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white poppins-subtitle">
                        {area.name}
                      </h3>
                      <p className="text-white/70 text-sm poppins-caption">
                        {area.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          <div className="text-center">
            <Button
              onClick={handleStartDiagnostic}
              className="cinematic-button px-8 py-3 text-lg"
            >
              Iniciar Evaluación
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTestingPhase = () => (
    <Card className="cinematic-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-3 poppins-title">
            <Brain className="w-6 h-6 text-purple-400" />
            Pregunta {currentQuestion + 1} de {sampleQuestions.length}
          </CardTitle>
          <Badge className="bg-white/10 text-white border-white/20">
            {Math.round(((currentQuestion + 1) / sampleQuestions.length) * 100)}%
          </Badge>
        </div>
        <Progress 
          value={((currentQuestion + 1) / sampleQuestions.length) * 100} 
          className="mt-4 h-2 bg-white/10"
        />
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-white poppins-subtitle">
            {sampleQuestions[currentQuestion].text}
          </h3>
          
          <div className="space-y-3">
            {sampleQuestions[currentQuestion].options.map((option, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => handleResponse(index)}
                  className="w-full text-left h-auto p-4 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-cyan-400/50 text-white"
                >
                  <span className="poppins-body">{option}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );

  const renderAnalysisPhase = () => (
    <Card className="cinematic-card">
      <CardContent className="p-12 text-center space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto border-4 border-cyan-400/30 border-t-cyan-400 rounded-full"
        />
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white cinematic-text-glow poppins-title">
            Analizando Respuestas
          </h3>
          <p className="text-white/70 poppins-body">
            IA procesando tus habilidades y generando recomendaciones personalizadas...
          </p>
        </div>
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderResultsPhase = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl font-bold cinematic-gradient-text poppins-heading">
          Resultados del Diagnóstico
        </h2>
        <p className="text-lg text-white/80 poppins-body">
          Análisis completado con éxito
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((result, index) => (
          <motion.div
            key={result.area}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="cinematic-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between poppins-title">
                  <span>{result.area}</span>
                  <Badge className={`${
                    result.level === 'AVANZADO' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    result.level === 'INTERMEDIO' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                    'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {result.level}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/80 poppins-body">Puntuación</span>
                    <span className="font-bold text-white">{result.score}%</span>
                  </div>
                  <Progress value={result.score} className="h-3 bg-white/10" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-white poppins-subtitle">Recomendaciones:</h4>
                  <ul className="space-y-1">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="text-white/70 text-sm flex items-start gap-2 poppins-caption">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="cinematic-card">
        <CardContent className="p-6 text-center space-y-4">
          <h3 className="text-xl font-semibold text-white poppins-subtitle">
            ¿Qué sigue?
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              onClick={() => onNavigateToTool?.('lectoguia')}
              className="cinematic-button"
            >
              Usar LectoGuía IA
            </Button>
            <Button
              onClick={() => onNavigateToTool?.('exercises')}
              className="cinematic-button"
            >
              Ejercicios Adaptativos
            </Button>
            <Button
              onClick={() => onNavigateToTool?.('plan')}
              className="cinematic-button"
            >
              Plan Personalizado
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen p-6 font-poppins">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {currentPhase === 'intro' && renderIntroPhase()}
          {currentPhase === 'testing' && renderTestingPhase()}
          {currentPhase === 'analysis' && renderAnalysisPhase()}
          {currentPhase === 'results' && renderResultsPhase()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
