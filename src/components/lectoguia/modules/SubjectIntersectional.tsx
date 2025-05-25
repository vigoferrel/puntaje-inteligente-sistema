
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Target, TrendingUp, Star, ArrowRight } from 'lucide-react';
import { IntersectionalContext, CrossModuleAction } from '@/types/intersectional-types';

interface SubjectIntersectionalProps {
  context: IntersectionalContext & { 
    moduleState: any; 
    financialAlignment?: any;
  };
  onNavigateToTool: (tool: string, context?: any) => void;
  onDispatchAction: (action: CrossModuleAction) => void;
}

const SUBJECTS = [
  { 
    id: 'COMPETENCIA_LECTORA', 
    name: 'Competencia Lectora', 
    icon: '📚',
    color: 'blue',
    skills: ['Comprensión', 'Análisis', 'Interpretación', 'Evaluación'],
    careerRelevance: ['Derecho', 'Periodismo', 'Psicología', 'Educación']
  },
  { 
    id: 'MATEMATICA_1', 
    name: 'Matemática M1', 
    icon: '🔢',
    color: 'green',
    skills: ['Números', 'Álgebra', 'Geometría', 'Estadística'],
    careerRelevance: ['Ingeniería', 'Administración', 'Economía', 'Ciencias']
  },
  { 
    id: 'MATEMATICA_2', 
    name: 'Matemática M2', 
    icon: '🧮',
    color: 'purple',
    skills: ['Funciones', 'Cálculo', 'Probabilidad', 'Modelamiento'],
    careerRelevance: ['Ingeniería', 'Física', 'Matemática', 'Medicina']
  },
  { 
    id: 'CIENCIAS', 
    name: 'Ciencias', 
    icon: '🔬',
    color: 'orange',
    skills: ['Biología', 'Física', 'Química', 'Método Científico'],
    careerRelevance: ['Medicina', 'Veterinaria', 'Biología', 'Química']
  },
  { 
    id: 'HISTORIA', 
    name: 'Historia', 
    icon: '🏛️',
    color: 'red',
    skills: ['Análisis Histórico', 'Fuentes', 'Pensamiento Temporal', 'Multicausalidad'],
    careerRelevance: ['Historia', 'Ciencias Políticas', 'Derecho', 'Sociología']
  }
];

export const SubjectIntersectional: React.FC<SubjectIntersectionalProps> = ({
  context,
  onNavigateToTool,
  onDispatchAction
}) => {
  const [selectedSubject, setSelectedSubject] = useState(context.currentSubject);

  // Simular niveles de dominio por materia
  const getMasteryLevel = (subjectId: string) => {
    const base = subjectId === context.currentSubject ? context.crossModuleMetrics.averagePerformance : 0;
    const variation = Math.random() * 30 - 15; // ±15 puntos de variación
    return Math.max(0, Math.min(100, base + variation));
  };

  // Calcular relevancia para carrera objetivo
  const getCareerRelevance = (subject: any) => {
    if (!context.financialAlignment?.targetCareer) return 'medium';
    
    const targetCareer = context.financialAlignment.targetCareer.toLowerCase();
    const relevantCareers = subject.careerRelevance.map((c: string) => c.toLowerCase());
    
    if (relevantCareers.some(career => targetCareer.includes(career))) {
      return 'high';
    }
    
    return 'medium';
  };

  // Manejar cambio de materia con contexto interseccional
  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    
    // Notificar cambio a todos los módulos
    onDispatchAction({
      type: 'UPDATE_CONTEXT',
      source: 'subject',
      target: 'all',
      payload: { currentSubject: subjectId },
      priority: 'high'
    });
    
    // Trigger de sincronización con métricas
    setTimeout(() => {
      onDispatchAction({
        type: 'SYNC_METRICS',
        source: 'subject',
        target: 'all',
        payload: { subjectChanged: true, newSubject: subjectId },
        priority: 'medium'
      });
    }, 500);
  };

  // Generar recomendaciones específicas por materia
  const getSubjectRecommendations = (subject: any) => {
    const recommendations = [];
    const masteryLevel = getMasteryLevel(subject.id);
    const relevance = getCareerRelevance(subject);
    
    if (relevance === 'high' && masteryLevel < 75) {
      recommendations.push({
        type: 'urgent',
        title: 'Prioritario para tu carrera',
        description: `${subject.name} es crucial para ${context.financialAlignment?.targetCareer}`,
        action: () => onNavigateToTool('exercise', { subject: subject.id, intensive: true })
      });
    }
    
    if (masteryLevel < 50) {
      recommendations.push({
        type: 'improvement',
        title: 'Requiere atención',
        description: 'Nivel por debajo del promedio esperado',
        action: () => onNavigateToTool('diagnostic', { focus: subject.id })
      });
    }
    
    if (masteryLevel >= 80) {
      recommendations.push({
        type: 'advanced',
        title: 'Excelente nivel',
        description: 'Mantén tu ventaja competitiva',
        action: () => onNavigateToTool('exercise', { subject: subject.id, advanced: true })
      });
    }
    
    return recommendations;
  };

  const currentSubjectData = SUBJECTS.find(s => s.id === selectedSubject) || SUBJECTS[0];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Materias Interseccionales
          </div>
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
            {SUBJECTS.length} Áreas Disponibles
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Selector de Materias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUBJECTS.map((subject, index) => {
            const masteryLevel = getMasteryLevel(subject.id);
            const relevance = getCareerRelevance(subject);
            const isSelected = selectedSubject === subject.id;
            
            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                  isSelected 
                    ? `border-${subject.color}-500 bg-${subject.color}-50 shadow-lg` 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
                onClick={() => handleSubjectChange(subject.id)}
              >
                {/* Header de la materia */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{subject.icon}</span>
                    <div>
                      <div className={`font-semibold ${isSelected ? `text-${subject.color}-800` : 'text-gray-800'}`}>
                        {subject.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {Math.round(masteryLevel)}% dominio
                      </div>
                    </div>
                  </div>
                  
                  {/* Indicadores */}
                  <div className="flex flex-col gap-1 items-end">
                    {relevance === 'high' && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Prioritaria
                      </Badge>
                    )}
                    {masteryLevel >= 80 && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        Excelente
                      </Badge>
                    )}
                    {masteryLevel < 50 && (
                      <Badge className="bg-red-100 text-red-800 text-xs">
                        Atención
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Progreso */}
                <div className="space-y-2">
                  <Progress value={masteryLevel} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Progreso actual</span>
                    <span>{Math.round(masteryLevel)}%</span>
                  </div>
                </div>
                
                {/* Habilidades clave */}
                <div className="mt-3">
                  <div className="text-xs text-gray-600 mb-1">Habilidades clave:</div>
                  <div className="flex flex-wrap gap-1">
                    {subject.skills.slice(0, 2).map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {subject.skills.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{subject.skills.length - 2} más
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detalles de la Materia Seleccionada */}
        <motion.div
          key={selectedSubject}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{currentSubjectData.icon}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{currentSubjectData.name}</h3>
              <p className="text-gray-600">Análisis detallado y recomendaciones</p>
            </div>
          </div>

          {/* Habilidades detalladas */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Habilidades Específicas
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {currentSubjectData.skills.map((skill, index) => {
                const skillLevel = getMasteryLevel(currentSubjectData.id) + (Math.random() * 20 - 10);
                return (
                  <div key={index} className="text-center p-3 bg-white rounded-lg border">
                    <div className="font-medium text-gray-800 mb-1">{skill}</div>
                    <div className="text-sm text-gray-600">{Math.round(Math.max(0, Math.min(100, skillLevel)))}%</div>
                    <Progress value={Math.max(0, Math.min(100, skillLevel))} className="h-1 mt-2" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recomendaciones específicas */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Recomendaciones Inteligentes
            </h4>
            {getSubjectRecommendations(currentSubjectData).map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border-l-4 ${
                  rec.type === 'urgent' 
                    ? 'bg-red-50 border-red-400' 
                    : rec.type === 'improvement'
                    ? 'bg-yellow-50 border-yellow-400'
                    : 'bg-green-50 border-green-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{rec.title}</div>
                    <div className="text-sm text-gray-600">{rec.description}</div>
                  </div>
                  <Button
                    onClick={rec.action}
                    size="sm"
                    className="gap-1"
                  >
                    Acción <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Acciones rápidas */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={() => onNavigateToTool('exercise', { subject: selectedSubject })}
              className="gap-2"
              variant="outline"
            >
              🎯 Ejercicios
            </Button>
            <Button
              onClick={() => onNavigateToTool('chat', { focusSubject: selectedSubject })}
              className="gap-2"
              variant="outline"
            >
              💬 Consultar IA
            </Button>
            <Button
              onClick={() => onNavigateToTool('diagnostic', { subject: selectedSubject })}
              className="gap-2"
              variant="outline"
            >
              📊 Evaluar
            </Button>
            <Button
              onClick={() => onNavigateToTool('planning', { prioritySubject: selectedSubject })}
              className="gap-2"
              variant="outline"
            >
              📚 Planificar
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};
