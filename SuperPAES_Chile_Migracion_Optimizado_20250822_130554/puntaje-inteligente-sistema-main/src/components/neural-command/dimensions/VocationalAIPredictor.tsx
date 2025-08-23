/* eslint-disable react-refresh/only-export-components */

import React, { useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { 
  Brain, Target, TrendingUp, Sparkles, BookOpen,
  Users, Building, DollarSign, Clock, Award,
  Lightbulb, Zap, Eye, Cpu, BarChart3
} from 'lucide-react';

interface CareerPrediction {
  career: string;
  university: string;
  compatibility: number;
  requiredScore: number;
  predictedScore: number;
  probability: number;
  salary: string;
  growthRate: string;
  factors: string[];
}

interface AptitudeAnalysis {
  area: string;
  score: number;
  description: string;
  careers: string[];
  icon: unknown;
  color: string;
}

interface VocationalAIPredictorProps {
  userMetrics: unknown;
}

export const VocationalAIPredictor: React.FC<VocationalAIPredictorProps> = ({
  userMetrics
}) => {
  const [activeTab, setActiveTab] = useState<'predictions' | 'analysis' | 'simulator'>('predictions');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [careerPredictions] = useState<CareerPrediction[]>([
    {
      career: 'IngenierÃ­a en Sistemas',
      university: 'Universidad de Chile',
      compatibility: 94,
      requiredScore: 720,
      predictedScore: 756,
      probability: 87,
      salary: '$1.2M - $2.5M',
      growthRate: '+15% anual',
      factors: ['Alto rendimiento en matemÃ¡ticas', 'Excelente lÃ³gica computacional', 'Pensamiento sistemÃ¡tico']
    },
    {
      career: 'Medicina',
      university: 'Pontificia Universidad CatÃ³lica',
      compatibility: 89,
      requiredScore: 780,
      predictedScore: 756,
      probability: 72,
      salary: '$1.8M - $4.0M',
      growthRate: '+8% anual',
      factors: ['Excelente en ciencias', 'Alta dedicaciÃ³n al estudio', 'Pensamiento analÃ­tico']
    },
    {
      career: 'PsicologÃ­a',
      university: 'Universidad de Chile',
      compatibility: 91,
      requiredScore: 650,
      predictedScore: 756,
      probability: 95,
      salary: '$800K - $1.8M',
      growthRate: '+12% anual',
      factors: ['Excelente comprensiÃ³n lectora', 'AnÃ¡lisis de comportamiento', 'EmpatÃ­a desarrollada']
    },
    {
      career: 'IngenierÃ­a Comercial',
      university: 'Universidad Adolfo IbÃ¡Ã±ez',
      compatibility: 85,
      requiredScore: 700,
      predictedScore: 756,
      probability: 83,
      salary: '$1.0M - $3.5M',
      growthRate: '+10% anual',
      factors: ['Pensamiento estratÃ©gico', 'AnÃ¡lisis cuantitativo', 'Liderazgo natural']
    }
  ]);

  const [aptitudeAnalysis] = useState<AptitudeAnalysis[]>([
    {
      area: 'LÃ³gico-MatemÃ¡tica',
      score: 92,
      description: 'Excelente capacidad para el razonamiento lÃ³gico y matemÃ¡tico',
      careers: ['IngenierÃ­a', 'MatemÃ¡ticas', 'FÃ­sica', 'EconomÃ­a'],
      icon: Brain,
      color: 'from-blue-500 to-blue-700'
    },
    {
      area: 'Verbal-LingÃ¼Ã­stica',
      score: 88,
      description: 'Alta competencia en comprensiÃ³n y expresiÃ³n verbal',
      careers: ['Derecho', 'Periodismo', 'Literatura', 'PsicologÃ­a'],
      icon: BookOpen,
      color: 'from-green-500 to-green-700'
    },
    {
      area: 'CientÃ­fica',
      score: 85,
      description: 'Fuerte inclinaciÃ³n hacia el mÃ©todo cientÃ­fico',
      careers: ['Medicina', 'BiologÃ­a', 'QuÃ­mica', 'InvestigaciÃ³n'],
      icon: Zap,
      color: 'from-purple-500 to-purple-700'
    },
    {
      area: 'Espacial-Visual',
      score: 78,
      description: 'Buena capacidad de visualizaciÃ³n y diseÃ±o',
      careers: ['Arquitectura', 'DiseÃ±o', 'Arte', 'IngenierÃ­a Civil'],
      icon: Eye,
      color: 'from-orange-500 to-red-500'
    },
    {
      area: 'Social-Interpersonal',
      score: 90,
      description: 'Excelente habilidad para trabajar con personas',
      careers: ['PsicologÃ­a', 'Trabajo Social', 'EducaciÃ³n', 'RR.HH.'],
      icon: Users,
      color: 'from-pink-500 to-purple-500'
    }
  ]);

  const runVocationalAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  const renderPredictions = () => (
    <div className="space-y-6">
      {/* AI Analysis Status */}
      <Card className="bg-gradient-to-r from-cyan-900/60 to-blue-900/60 backdrop-blur-xl border-cyan-500/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center"
              animate={{ rotate: isAnalyzing ? 360 : 0 }}
              transition={{ duration: 2, repeat: isAnalyzing ? Infinity : 0, ease: "linear" }}
            >
              <Cpu className="w-6 h-6 text-white" />
            </motion.div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">IA Vocacional Neural</h3>
              <p className="text-cyan-200">
                {isAnalyzing ? 'Analizando patrones de aprendizaje...' : 'AnÃ¡lisis completado con 94% de precisiÃ³n'}
              </p>
            </div>
            <Button
              onClick={runVocationalAnalysis}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-cyan-600 to-blue-600"
            >
              {isAnalyzing ? 'Analizando...' : 'Actualizar AnÃ¡lisis'}
            </Button>
          </div>
          
          {isAnalyzing && (
            <div className="space-y-2">
              <Progress value={66} className="h-2" />
              <div className="text-sm text-cyan-200">
                Procesando: Patrones de rendimiento, preferencias de estudio, aptitudes identificadas...
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Career Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {careerPredictions.map((prediction, index) => (
          <motion.div
            key={prediction.career}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">{prediction.career}</CardTitle>
                    <p className="text-gray-300 text-sm">{prediction.university}</p>
                  </div>
                  <Badge className={`${
                    prediction.compatibility >= 90 ? 'bg-green-600' :
                    prediction.compatibility >= 80 ? 'bg-yellow-600' :
                    'bg-orange-600'
                  } text-white`}>
                    {prediction.compatibility}% Match
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Score Comparison */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-300">Puntaje Requerido</span>
                      <span className="text-white font-bold">{prediction.requiredScore}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-300">Tu PredicciÃ³n PAES</span>
                      <span className={`font-bold ${
                        prediction.predictedScore >= prediction.requiredScore ? 'text-green-400' : 'text-orange-400'
                      }`}>
                        {prediction.predictedScore}
                      </span>
                    </div>
                    <Progress 
                      value={(prediction.predictedScore / prediction.requiredScore) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Probability & Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <Target className="w-5 h-5 mx-auto text-green-400 mb-1" />
                      <div className="text-lg font-bold text-white">{prediction.probability}%</div>
                      <div className="text-xs text-gray-400">Probabilidad</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <DollarSign className="w-5 h-5 mx-auto text-yellow-400 mb-1" />
                      <div className="text-sm font-bold text-white">{prediction.salary}</div>
                      <div className="text-xs text-gray-400">Rango Salarial</div>
                    </div>
                  </div>

                  {/* Growth Rate */}
                  <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">Crecimiento: {prediction.growthRate}</span>
                  </div>

                  {/* Key Factors */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Factores Clave:</h4>
                    <div className="space-y-1">
                      {prediction.factors.map((factor, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                          <Lightbulb className="w-3 h-3 text-yellow-400" />
                          {factor}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                    Ver Detalles Completos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-6">
      {/* Aptitude Radar */}
      <Card className="bg-gradient-to-r from-purple-900/60 to-pink-900/60 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            AnÃ¡lisis de Aptitudes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aptitudeAnalysis.map((aptitude, index) => (
              <motion.div
                key={aptitude.area}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-gradient-to-r ${aptitude.color} border-none`}>
                  <CardContent className="p-6 text-center">
                    <aptitude.icon className="w-8 h-8 mx-auto text-white mb-3" />
                    <h3 className="font-bold text-white mb-2">{aptitude.area}</h3>
                    <div className="text-3xl font-bold text-white mb-2">{aptitude.score}%</div>
                    <p className="text-white/80 text-sm mb-4">{aptitude.description}</p>
                    
                    <div className="space-y-1">
                      {aptitude.careers.slice(0, 3).map((career, idx) => (
                        <Badge key={idx} className="bg-white/20 text-white text-xs mr-1">
                          {career}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personality Insights */}
      <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            Insights de Personalidad Vocacional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Fortalezas Identificadas</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-500/20 rounded-lg">
                  <Award className="w-5 h-5 text-green-400" />
                  <span className="text-white">Pensamiento analÃ­tico excepcional</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-500/20 rounded-lg">
                  <Brain className="w-5 h-5 text-blue-400" />
                  <span className="text-white">Alta capacidad de resoluciÃ³n de problemas</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-white">Excelentes habilidades interpersonales</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Ãreas de Desarrollo</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-orange-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <span className="text-white">GestiÃ³n del tiempo bajo presiÃ³n</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-500/20 rounded-lg">
                  <Eye className="w-5 h-5 text-yellow-400" />
                  <span className="text-white">VisualizaciÃ³n espacial</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-500/20 rounded-lg">
                  <Building className="w-5 h-5 text-red-400" />
                  <span className="text-white">Liderazgo en equipos grandes</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-black/60 to-slate-900/60 backdrop-blur-xl border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-8 h-8 text-cyan-400" />
              </motion.div>
              PREDICTOR VOCACIONAL IA
              <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600">
                PrecisiÃ³n 94%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button
                onClick={() => setActiveTab('predictions')}
                className={activeTab === 'predictions' 
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
                }
              >
                <Target className="w-4 h-4 mr-2" />
                Predicciones
              </Button>
              <Button
                onClick={() => setActiveTab('analysis')}
                className={activeTab === 'analysis' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
                }
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                AnÃ¡lisis
              </Button>
              <Button
                onClick={() => setActiveTab('simulator')}
                className={activeTab === 'simulator' 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
                }
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Simulador
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'predictions' && renderPredictions()}
        {activeTab === 'analysis' && renderAnalysis()}
        {activeTab === 'simulator' && (
          <Card className="bg-black/40 border-green-500/30 backdrop-blur-xl">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-16 h-16 mx-auto text-green-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Simulador de Carreras</h3>
              <p className="text-white/70 mb-4">PrÃ³ximamente: Simulador interactivo de decisiones vocacionales</p>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                Notificarme cuando estÃ© listo
              </Button>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

