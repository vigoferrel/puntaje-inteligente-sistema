/* eslint-disable react-refresh/only-export-components */

import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Rocket, Sparkles, BookOpen, Brain, Target,
  PlayCircle, Zap, Star, Settings
} from 'lucide-react';
import { StudentProfile, IntelligentRecommendation } from '../../core/unified-education-system/EducationDataHub';

interface AdaptiveContentGenerationProps {
  studentProfile: StudentProfile;
  recommendations: IntelligentRecommendation[];
}

export const AdaptiveContentGeneration: React.FC<AdaptiveContentGenerationProps> = ({
  studentProfile,
  recommendations
}) => {
  const [generatingContent, setGeneratingContent] = useState(false);
  const [selectedType, setSelectedType] = useState<'ejercicios' | 'diagnostico' | 'estudio'>('ejercicios');

  const handleGenerateContent = async (type: string) => {
    setGeneratingContent(true);
    console.log(`ðŸš€ Generando contenido adaptativo: ${type}`);
    
    // Simular generaciÃ³n de contenido
    setTimeout(() => {
      setGeneratingContent(false);
      console.log(`âœ… Contenido ${type} generado exitosamente`);
    }, 2000);
  };

  const contentTypes = [
    {
      id: 'ejercicios',
      label: 'Ejercicios Adaptativos',
      icon: Target,
      description: 'Ejercicios personalizados segÃºn tu nivel',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'diagnostico',
      label: 'DiagnÃ³stico Inteligente',
      icon: Brain,
      description: 'EvaluaciÃ³n adaptativa de habilidades',
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 'estudio',
      label: 'Material de Estudio',
      icon: BookOpen,
      description: 'Contenido teÃ³rico personalizado',
      color: 'from-green-600 to-emerald-600'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Rocket className="w-6 h-6 text-cyan-400" />
            GeneraciÃ³n de Contenido Adaptativo
            <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600">
              IA Avanzada
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Perfil del estudiante */}
          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="text-white font-medium mb-3">Perfil Adaptativo</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Nivel:</span>
                <span className="text-cyan-400 ml-2 capitalize">{studentProfile.currentLevel}</span>
              </div>
              <div>
                <span className="text-gray-400">Estilo:</span>
                <span className="text-purple-400 ml-2 capitalize">{studentProfile.learningStyle}</span>
              </div>
              <div>
                <span className="text-gray-400">Meta PAES:</span>
                <span className="text-green-400 ml-2">{studentProfile.academicGoals.targetScore} pts</span>
              </div>
              <div>
                <span className="text-gray-400">GamificaciÃ³n:</span>
                <span className="text-yellow-400 ml-2">{studentProfile.motivationProfile.gamification}%</span>
              </div>
            </div>
          </div>

          {/* Tipos de contenido */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contentTypes.map((type, index) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              
              return (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedType(type.id as unknown)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-cyan-500 bg-cyan-500/20' 
                      : 'border-white/10 bg-white/5 hover:border-cyan-500/50'
                  }`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${type.color} rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-white font-medium mb-2">{type.label}</h4>
                  <p className="text-gray-400 text-sm">{type.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Recomendaciones activas */}
          <div className="space-y-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Recomendaciones Activas IA
            </h4>
            
            {recommendations.slice(0, 3).map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-purple-600/20 rounded-lg border-l-4 border-purple-400"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">
                    {rec.description}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(rec.confidence * 100)}% confianza
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>{rec.estimatedTime} min</span>
                  <span className="capitalize">{rec.priority} prioridad</span>
                  <span className="capitalize">{rec.subject}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Acciones de generaciÃ³n */}
          <div className="flex gap-3">
            <Button
              onClick={() => handleGenerateContent(selectedType)}
              disabled={generatingContent}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            >
              {generatingContent ? (
                <>
                  <Settings className="w-4 h-4 mr-2 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Generar {selectedType}
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              className="border-purple-500/50 text-white hover:bg-purple-500/20"
            >
              <Zap className="w-4 h-4 mr-2" />
              Auto-Adaptar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

