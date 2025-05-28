
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Database, Play, Target, Clock, 
  Brain, Sparkles, Award, TrendingUp 
} from 'lucide-react';

interface RealEvaluation {
  id: string;
  codigo: string;
  nombre: string;
  tipo_evaluacion: string;
  duracion_minutos: number;
  total_preguntas: number;
  nivel_dificultad: string;
  prueba_paes: string;
  questionsFromBank: number;
  averageScore: number;
  completionRate: number;
}

export const RealEvaluationSystem: React.FC = () => {
  const { user } = useAuth();
  const [realEvaluations, setRealEvaluations] = useState<RealEvaluation[]>([]);
  const [realQuestions, setRealQuestions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvaluation, setSelectedEvaluation] = useState<string | null>(null);

  useEffect(() => {
    const loadRealEvaluations = async () => {
      try {
        setIsLoading(true);

        // Cargar evaluaciones reales del sistema
        const { data: evaluationsData } = await supabase
          .from('evaluaciones')
          .select('*')
          .eq('esta_activo', true)
          .order('created_at', { ascending: false });

        // Cargar contador de preguntas reales
        const { count: questionsCount } = await supabase
          .from('banco_preguntas')
          .select('*', { count: 'exact', head: true })
          .eq('validada', true);

        // Obtener estadísticas de uso por evaluación
        const evaluationsWithStats = await Promise.all(
          (evaluationsData || []).map(async (evaluation) => {
            // Contar preguntas disponibles para esta evaluación
            const { count: bankQuestions } = await supabase
              .from('banco_preguntas')
              .select('*', { count: 'exact', head: true })
              .eq('prueba_paes', evaluation.prueba_paes || 'COMPETENCIA_LECTORA')
              .eq('validada', true);

            // Para las estadísticas, usar datos básicos por ahora
            // ya que las tablas de sesiones pueden no existir aún
            const averageScore = 0;
            const completionRate = 0;

            return {
              ...evaluation,
              questionsFromBank: bankQuestions || 0,
              averageScore: Math.round(averageScore),
              completionRate
            };
          })
        );

        setRealEvaluations(evaluationsWithStats);
        setRealQuestions(questionsCount || 0);
      } catch (error) {
        console.error('Error loading real evaluations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRealEvaluations();
  }, []);

  const handleStartEvaluation = async (evaluationId: string) => {
    if (!user?.id) return;

    try {
      setSelectedEvaluation(evaluationId);
      
      // Simular inicio de evaluación por ahora
      console.log('Iniciando evaluación:', evaluationId);
      
      // Aquí se conectaría con el sistema real de evaluaciones
      setTimeout(() => {
        setSelectedEvaluation(null);
      }, 2000);
      
    } catch (error) {
      console.error('Error starting evaluation:', error);
      setSelectedEvaluation(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'basico': return 'bg-green-100 text-green-800 border-green-300';
      case 'intermedio': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'avanzado': return 'bg-red-100 text-red-800 border-red-300';
      case 'mixto': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'diagnostica': return <Brain className="w-4 h-4" />;
      case 'formativa': return <Target className="w-4 h-4" />;
      case 'sumativa': return <Award className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8 pb-8">
        {/* Header con estadísticas reales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Database className="w-12 h-12 text-cyan-400" />
                <div>
                  <CardTitle className="text-white text-4xl">Sistema de Evaluación Real</CardTitle>
                  <p className="text-cyan-300 text-lg">Banco Oficial de Preguntas PAES</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-6">
                <Badge className="bg-cyan-600 text-white">
                  <Database className="w-4 h-4 mr-1" />
                  {realQuestions.toLocaleString()} Preguntas Validadas
                </Badge>
                <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                  <Sparkles className="w-4 h-4 mr-1" />
                  {realEvaluations.length} Evaluaciones Activas
                </Badge>
                <Badge className="bg-green-600 text-white">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Sistema Neural Activo
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Grid de evaluaciones reales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {realEvaluations.map((evaluation, index) => (
            <motion.div
              key={evaluation.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className="bg-black/40 backdrop-blur-xl border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(evaluation.tipo_evaluacion)}
                      <div>
                        <CardTitle className="text-white text-lg group-hover:text-cyan-300 transition-colors">
                          {evaluation.nombre}
                        </CardTitle>
                        <p className="text-gray-400 text-sm">{evaluation.codigo}</p>
                      </div>
                    </div>
                    <Badge className={getDifficultyColor(evaluation.nivel_dificultad)}>
                      {evaluation.nivel_dificultad}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-white font-bold">{evaluation.total_preguntas}</div>
                      <div className="text-gray-400 text-xs">Preguntas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold">{evaluation.duracion_minutos}min</div>
                      <div className="text-gray-400 text-xs">Duración</div>
                    </div>
                    <div className="text-center">
                      <div className="text-cyan-400 font-bold">{evaluation.questionsFromBank}</div>
                      <div className="text-gray-400 text-xs">Banco Real</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 font-bold">{evaluation.completionRate}</div>
                      <div className="text-gray-400 text-xs">Completadas</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Badge variant="outline" className="text-white border-white/30">
                      {evaluation.prueba_paes || 'PAES General'}
                    </Badge>
                  </div>
                  
                  <Button 
                    onClick={() => handleStartEvaluation(evaluation.id)}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                    disabled={selectedEvaluation === evaluation.id}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {selectedEvaluation === evaluation.id ? 'Iniciando...' : 'Comenzar Evaluación'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
