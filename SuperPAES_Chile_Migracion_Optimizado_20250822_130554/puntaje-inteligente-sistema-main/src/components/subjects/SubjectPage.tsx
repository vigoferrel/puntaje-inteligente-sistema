/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import '@/styles/CinematicAnimations.css';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { 
  Target, BookOpen, Brain, Play, Clock, Award, 
  TrendingUp, Zap, CheckCircle, Star 
} from 'lucide-react';

const subjectData = {
  'matematica-1': {
    title: 'MatemÃ¡tica M1',
    description: 'Ãlgebra, funciones y nÃºmeros',
    color: '#00FF88',
    progress: 65,
    topics: [
      { name: 'NÃºmeros y operaciones', progress: 80, exercises: 24 },
      { name: 'Ãlgebra bÃ¡sica', progress: 70, exercises: 18 },
      { name: 'Funciones lineales', progress: 45, exercises: 12 },
      { name: 'Ecuaciones cuadrÃ¡ticas', progress: 30, exercises: 8 }
    ]
  },
  'matematica-2': {
    title: 'MatemÃ¡tica M2',
    description: 'GeometrÃ­a, datos y azar',
    color: '#8833FF',
    progress: 45,
    topics: [
      { name: 'GeometrÃ­a plana', progress: 60, exercises: 20 },
      { name: 'GeometrÃ­a espacial', progress: 40, exercises: 15 },
      { name: 'Probabilidades', progress: 35, exercises: 10 },
      { name: 'EstadÃ­stica', progress: 45, exercises: 12 }
    ]
  },
  'competencia-lectora': {
    title: 'Competencia Lectora',
    description: 'ComprensiÃ³n y anÃ¡lisis de textos',
    color: '#FF8800',
    progress: 78,
    topics: [
      { name: 'ComprensiÃ³n literal', progress: 85, exercises: 30 },
      { name: 'ComprensiÃ³n inferencial', progress: 80, exercises: 25 },
      { name: 'ComprensiÃ³n crÃ­tica', progress: 70, exercises: 20 },
      { name: 'Vocabulario contextual', progress: 75, exercises: 18 }
    ]
  },
  'ciencias': {
    title: 'Ciencias',
    description: 'FÃ­sica, quÃ­mica y biologÃ­a',
    color: '#FF3366',
    progress: 55,
    topics: [
      { name: 'FÃ­sica mecÃ¡nica', progress: 65, exercises: 22 },
      { name: 'QuÃ­mica orgÃ¡nica', progress: 50, exercises: 18 },
      { name: 'BiologÃ­a celular', progress: 60, exercises: 20 },
      { name: 'FÃ­sica elÃ©ctrica', progress: 45, exercises: 15 }
    ]
  },
  'historia': {
    title: 'Historia',
    description: 'Historia y ciencias sociales',
    color: '#FFAA00',
    progress: 72,
    topics: [
      { name: 'Historia de Chile', progress: 80, exercises: 25 },
      { name: 'Historia universal', progress: 70, exercises: 22 },
      { name: 'GeografÃ­a', progress: 65, exercises: 18 },
      { name: 'EducaciÃ³n cÃ­vica', progress: 75, exercises: 20 }
    ]
  }
};

export const SubjectPage: FC = () => {
  const { subject } = useParams();
  const data = subjectData[subject as keyof typeof subjectData];

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Materia no encontrada</h2>
          <p className="text-gray-400">La materia solicitada no existe en el sistema.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 space-y-6 overflow-y-auto">
      {/* Header de la Materia */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="bg-gradient-to-r from-black/40 via-purple-900/40 to-black/40 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30 dynamic-border-opacity" data-border={data.color} data-opacity="50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center dynamic-bg-border"
                data-bg-color={`${data.color}20`}
                data-border={`2px solid ${data.color}`}
              >
                <Target className="w-8 h-8 dynamic-color" data-color={data.color} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{data.title}</h1>
                <p className="text-cyan-400">{data.description}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-4xl font-bold dynamic-color" data-color={data.color}>
                {data.progress}%
              </div>
              <div className="text-sm text-white opacity-80">Progreso General</div>
              <Badge className="mt-2 dynamic-bg-template">
                <TrendingUp className="w-3 h-3 mr-1" />
                En desarrollo
              </Badge>
            </div>
          </div>
          
          <div className="mt-6">
            <Progress 
              value={data.progress} 
              className="h-3 dynamic-style" 
              data-style="background: rgba(255,255,255,0.1)"
            />
          </div>
        </div>
      </motion.div>

      {/* EstadÃ­sticas RÃ¡pidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Temas Completados', value: `${data.topics.filter(t => t.progress >= 70).length}/${data.topics.length}`, icon: CheckCircle },
          { label: 'Ejercicios Totales', value: data.topics.reduce((sum, t) => sum + t.exercises, 0), icon: Zap },
          { label: 'Promedio Tema', value: `${Math.round(data.topics.reduce((sum, t) => sum + t.progress, 0) / data.topics.length)}%`, icon: Star },
          { label: 'Tiempo Estimado', value: '12h restantes', icon: Clock }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-white/10">
                <CardContent className="p-4 text-center">
                  <Icon className="w-8 h-8 mx-auto mb-2 dynamic-color" data-color={data.color} />
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Lista de Temas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-white/10">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 dynamic-color" data-color={data.color} />
              Temas de Estudio
            </h3>
            
            <div className="space-y-4">
              {data.topics.map((topic, index) => (
                <motion.div
                  key={topic.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold dynamic-topic-indicator"
                        data-bg-color={topic.progress >= 70 ? `${data.color}30` : 'rgba(255,255,255,0.1)'}
                        data-text-color={topic.progress >= 70 ? data.color : '#fff'}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{topic.name}</h4>
                        <p className="text-gray-400 text-sm">{topic.exercises} ejercicios disponibles</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold dynamic-color" data-color={data.color}>
                          {topic.progress}%
                        </div>
                        <div className="text-xs text-gray-400">Completado</div>
                      </div>
                      
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Estudiar
                      </Button>
                    </div>
                  </div>
                  
                  <Progress 
                    value={topic.progress} 
                    className="h-2 dynamic-style" 
                    data-style="background: rgba(255,255,255,0.1)"
                  />
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex space-x-4">
              <Button 
                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Continuar Estudio
              </Button>
              
              <Button 
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                size="lg"
              >
                <Target className="w-5 h-5 mr-2" />
                EvaluaciÃ³n
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

