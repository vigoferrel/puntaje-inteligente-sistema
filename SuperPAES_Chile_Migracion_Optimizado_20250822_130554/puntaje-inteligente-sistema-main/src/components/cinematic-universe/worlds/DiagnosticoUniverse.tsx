/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion, AnimatePresence } from 'framer-motion';
import { UserType } from '../../../types/cinematic-universe';
import { Brain, Target, Zap, BarChart3, Play, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';

interface DiagnosticoUniverseProps {
  userType: UserType;
  onUniverseChange: (universe: string) => void;
}

interface DiagnosticTest {
  id: string;
  name: string;
  subject: string;
  duration: number;
  questions: number;
  difficulty: 'BÃ¡sico' | 'Intermedio' | 'Avanzado';
  status: 'available' | 'in_progress' | 'completed';
  score?: number;
  icon: string;
  color: string;
}

interface DiagnosticResult {
  subject: string;
  score: number;
  maxScore: number;
  level: string;
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
}

export const DiagnosticoUniverse: React.FC<DiagnosticoUniverseProps> = ({ userType, onUniverseChange }) => {
  const [activePhase, setActivePhase] = useState<'selection' | 'testing' | 'results'>('selection');
  const [selectedTest, setSelectedTest] = useState<DiagnosticTest | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const diagnosticTests: DiagnosticTest[] = [
    {
      id: 'competencia-lectora',
      name: 'Competencia Lectora',
      subject: 'ComprensiÃ³n de Lectura',
      duration: 45,
      questions: 25,
      difficulty: 'Intermedio',
      status: 'available',
      icon: 'ðŸ“š',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      id: 'matematica-m1',
      name: 'MatemÃ¡tica M1',
      subject: 'MatemÃ¡tica BÃ¡sica',
      duration: 60,
      questions: 30,
      difficulty: 'Intermedio',
      status: 'available',
      icon: 'ðŸ”¢',
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: 'matematica-m2',
      name: 'MatemÃ¡tica M2',
      subject: 'MatemÃ¡tica Avanzada',
      duration: 75,
      questions: 35,
      difficulty: 'Avanzado',
      status: 'available',
      icon: 'ðŸ“',
      color: 'from-purple-400 to-violet-500'
    },
    {
      id: 'ciencias',
      name: 'Ciencias',
      subject: 'FÃ­sica, QuÃ­mica, BiologÃ­a',
      duration: 90,
      questions: 40,
      difficulty: 'Avanzado',
      status: 'available',
      icon: 'ðŸ§ª',
      color: 'from-orange-400 to-red-500'
    },
    {
      id: 'historia',
      name: 'Historia y Ciencias Sociales',
      subject: 'Historia de Chile y Universal',
      duration: 60,
      questions: 30,
      difficulty: 'Intermedio',
      status: 'available',
      icon: 'ðŸ›ï¸',
      color: 'from-yellow-400 to-amber-500'
    }
  ];

  // Simular timer del test
  useEffect(() => {
    if (activePhase === 'testing' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (activePhase === 'testing' && timeRemaining === 0) {
      handleTestComplete();
    }
  }, [activePhase, timeRemaining]);

  const startDiagnostic = (test: DiagnosticTest) => {
    setSelectedTest(test);
    setActivePhase('testing');
    setCurrentQuestion(0);
    setTimeRemaining(test.duration * 60); // Convertir a segundos
    setIsLoading(false);
  };

  const handleTestComplete = () => {
    setIsLoading(true);
    
    // Simular procesamiento de resultados
    setTimeout(() => {
      const mockResult: DiagnosticResult = {
        subject: selectedTest?.subject || '',
        score: Math.floor(Math.random() * 30) + 70, // Score entre 70-100
        maxScore: 100,
        level: 'Intermedio-Alto',
        recommendations: [
          'Reforzar conceptos de Ã¡lgebra bÃ¡sica',
          'Practicar mÃ¡s ejercicios de comprensiÃ³n lectora',
          'Revisar fÃ³rmulas de geometrÃ­a'
        ],
        strengths: [
          'Excelente razonamiento lÃ³gico',
          'Buena comprensiÃ³n de conceptos bÃ¡sicos',
          'Capacidad de anÃ¡lisis desarrollada'
        ],
        weaknesses: [
          'Velocidad de cÃ¡lculo',
          'InterpretaciÃ³n de grÃ¡ficos',
          'Manejo del tiempo'
        ]
      };
      
      setDiagnosticResults([mockResult]);
      setActivePhase('results');
      setIsLoading(false);
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderSelectionPhase = () => (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
          ðŸŽ¯ DiagnÃ³stico Universe
        </h1>
        <p className="text-xl text-cyan-300 mb-2">
          Sistema de EvaluaciÃ³n Adaptativa Inteligente
        </p>
        <p className="text-gray-400">
          Descubre tu nivel actual y obtÃ©n un plan personalizado de estudio
        </p>
      </motion.div>

      {/* Tests disponibles */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {diagnosticTests.map((test, index) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.05, y: -10 }}
            className="cursor-pointer"
          >
            <Card className="bg-black/40 backdrop-blur-md border-white/20 hover:border-cyan-400/50 transition-all duration-300">
              <CardHeader className="text-center">
                <div className={`text-4xl mb-2 p-4 rounded-full bg-gradient-to-r ${test.color} w-fit mx-auto`}>
                  {test.icon}
                </div>
                <CardTitle className="text-white">{test.name}</CardTitle>
                <p className="text-gray-300 text-sm">{test.subject}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>â±ï¸ {test.duration} min</span>
                  <span>â“ {test.questions} preguntas</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Dificultad:</span>
                  <span className={`font-semibold ${
                    test.difficulty === 'BÃ¡sico' ? 'text-green-400' :
                    test.difficulty === 'Intermedio' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {test.difficulty}
                  </span>
                </div>
                <Button 
                  onClick={() => startDiagnostic(test)}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Iniciar DiagnÃ³stico
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* InformaciÃ³n adicional */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { icon: Brain, title: 'IA Adaptativa', desc: 'Preguntas que se adaptan a tu nivel' },
          { icon: Target, title: 'PrecisiÃ³n', desc: 'Resultados exactos de tu nivel actual' },
          { icon: Zap, title: 'InstantÃ¡neo', desc: 'Resultados y plan personalizado al instante' }
        ].map((feature, index) => (
          <div key={index} className="text-center p-6 bg-black/20 rounded-lg">
            <feature.icon className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );

  const renderTestingPhase = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header del test */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          {selectedTest?.icon} {selectedTest?.name}
        </h1>
        <p className="text-cyan-300">{selectedTest?.subject}</p>
      </motion.div>

      {/* Barra de progreso y timer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/20"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <span className="text-white font-semibold">
              Pregunta {currentQuestion + 1} de {selectedTest?.questions}
            </span>
            <Progress value={(currentQuestion / (selectedTest?.questions || 1)) * 100} className="w-32" />
          </div>
          <div className="flex items-center gap-2 text-white">
            <Clock className="w-5 h-5" />
            <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </motion.div>

      {/* SimulaciÃ³n de pregunta */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-black/40 backdrop-blur-md rounded-xl p-8 border border-white/20"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">
          Pregunta {currentQuestion + 1}
        </h2>
        <div className="space-y-4">
          <p className="text-gray-300 text-lg leading-relaxed">
            Esta es una simulaciÃ³n del sistema de diagnÃ³stico. En la implementaciÃ³n real, 
            aquÃ­ aparecerÃ­a una pregunta adaptativa basada en tu rendimiento anterior.
          </p>
          <div className="grid grid-cols-1 gap-3">
            {['OpciÃ³n A', 'OpciÃ³n B', 'OpciÃ³n C', 'OpciÃ³n D'].map((option, index) => (
              <button
                key={index}
                className="p-4 text-left bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20 hover:border-cyan-400/50"
                onClick={() => {
                  if (currentQuestion < (selectedTest?.questions || 1) - 1) {
                    setCurrentQuestion(prev => prev + 1);
                  } else {
                    handleTestComplete();
                  }
                }}
              >
                <span className="text-white">{option}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Botones de control */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setActivePhase('selection')}
          className="border-white/20 text-white hover:bg-white/10"
        >
          Cancelar Test
        </Button>
        <Button
          onClick={handleTestComplete}
          className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
        >
          Finalizar Test
        </Button>
      </div>
    </div>
  );

  const renderResultsPhase = () => (
    <div className="max-w-6xl mx-auto space-y-8">
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-white mb-2">Procesando Resultados</h2>
          <p className="text-cyan-300">Analizando tu rendimiento con IA...</p>
        </motion.div>
      ) : (
        <>
          {/* Header de resultados */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent mb-4">
              ðŸŽ‰ Resultados del DiagnÃ³stico
            </h1>
            <p className="text-xl text-cyan-300">
              {selectedTest?.name} - AnÃ¡lisis Completo
            </p>
          </motion.div>

          {diagnosticResults.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Score principal */}
              <Card className="lg:col-span-1 bg-black/40 backdrop-blur-md border-white/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-white">Tu Puntaje</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-6xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent mb-4">
                    {result.score}
                  </div>
                  <p className="text-gray-300 mb-2">de {result.maxScore} puntos</p>
                  <div className="text-lg font-semibold text-cyan-400">
                    Nivel: {result.level}
                  </div>
                  <Progress value={(result.score / result.maxScore) * 100} className="mt-4" />
                </CardContent>
              </Card>

              {/* Fortalezas y debilidades */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Fortalezas */}
                  <Card className="bg-black/40 backdrop-blur-md border-white/20">
                    <CardHeader>
                      <CardTitle className="text-green-400 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Fortalezas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.strengths.map((strength, i) => (
                          <li key={i} className="text-gray-300 flex items-start gap-2">
                            <span className="text-green-400 mt-1">â€¢</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Ãreas de mejora */}
                  <Card className="bg-black/40 backdrop-blur-md border-white/20">
                    <CardHeader>
                      <CardTitle className="text-yellow-400 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Ãreas de Mejora
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.weaknesses.map((weakness, i) => (
                          <li key={i} className="text-gray-300 flex items-start gap-2">
                            <span className="text-yellow-400 mt-1">â€¢</span>
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Recomendaciones */}
                <Card className="bg-black/40 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-cyan-400 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Plan de Estudio Recomendado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {result.recommendations.map((rec, i) => (
                        <li key={i} className="text-gray-300 flex items-start gap-3">
                          <span className="bg-cyan-400 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                            {i + 1}
                          </span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}

          {/* Acciones */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center gap-4"
          >
            <Button
              onClick={() => setActivePhase('selection')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Hacer Otro DiagnÃ³stico
            </Button>
            <Button
              onClick={() => onUniverseChange('superpaes')}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
            >
              Ir a SuperPAES
            </Button>
          </motion.div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto pt-20">
        <AnimatePresence mode="wait">
          {activePhase === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              {renderSelectionPhase()}
            </motion.div>
          )}
          
          {activePhase === 'testing' && (
            <motion.div
              key="testing"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              {renderTestingPhase()}
            </motion.div>
          )}
          
          {activePhase === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              {renderResultsPhase()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
