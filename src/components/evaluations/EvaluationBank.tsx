
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Database, Search, Filter, BookOpen, 
  Target, Brain, Clock, Star
} from 'lucide-react';

export const EvaluationBank: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const evaluationCategories = [
    {
      id: 'competencia-lectora',
      name: 'Competencia Lectora',
      icon: BookOpen,
      color: 'bg-blue-600',
      evaluations: 156,
      difficulty: 'Variada',
      description: 'Comprensión de textos y análisis crítico'
    },
    {
      id: 'matematica',
      name: 'Matemática M1 y M2',
      icon: Target,
      color: 'bg-green-600',
      evaluations: 243,
      difficulty: 'Progresiva',
      description: 'Desde álgebra básica hasta cálculo avanzado'
    },
    {
      id: 'ciencias',
      name: 'Ciencias',
      icon: Brain,
      color: 'bg-purple-600',
      evaluations: 189,
      difficulty: 'Adaptativa',
      description: 'Física, química y biología integradas'
    },
    {
      id: 'historia',
      name: 'Historia y CCSS',
      icon: Clock,
      color: 'bg-orange-600',
      evaluations: 134,
      difficulty: 'Contextual',
      description: 'Historia de Chile y ciencias sociales'
    }
  ];

  const featuredEvaluations = [
    {
      id: 1,
      title: 'Simulacro PAES Completo 2024',
      subject: 'Todas las materias',
      questions: 280,
      duration: '4h 30min',
      difficulty: 'Avanzado',
      rating: 4.9,
      users: 1247
    },
    {
      id: 2,
      title: 'Comprensión Lectora Intensiva',
      subject: 'Competencia Lectora',
      questions: 45,
      duration: '90min',
      difficulty: 'Intermedio',
      rating: 4.8,
      users: 892
    },
    {
      id: 3,
      title: 'Matemática M1 - Álgebra Avanzada',
      subject: 'Matemática',
      questions: 30,
      duration: '75min',
      difficulty: 'Avanzado',
      rating: 4.7,
      users: 654
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'básico': return 'bg-green-100 text-green-800';
      case 'intermedio': return 'bg-yellow-100 text-yellow-800';
      case 'avanzado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Database className="w-12 h-12 text-cyan-400" />
              <div>
                <CardTitle className="text-white text-4xl">Banco de Evaluaciones</CardTitle>
                <p className="text-cyan-300 text-lg">Biblioteca Completa de Evaluaciones PAES</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Badge className="bg-cyan-600 text-white">
                <Database className="w-4 h-4 mr-1" />
                722 Evaluaciones
              </Badge>
              <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                <Star className="w-4 h-4 mr-1" />
                Calidad Verificada
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Búsqueda y Filtros */}
        <Card className="bg-black/40 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar evaluaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white"
                />
              </div>
              <Button variant="outline" className="border-white/20 text-white">
                <Filter className="w-4 h-4 mr-2" />
                Filtros Avanzados
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categorías de Evaluaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {evaluationCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group cursor-pointer"
            >
              <Card className="bg-black/40 backdrop-blur-xl border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className={`p-4 rounded-xl ${category.color} mb-4`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    {category.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Evaluaciones:</span>
                      <span className="text-white font-medium">{category.evaluations}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Dificultad:</span>
                      <Badge variant="outline" className="text-xs">
                        {category.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Evaluaciones Destacadas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Evaluaciones Destacadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {featuredEvaluations.map((evaluation, index) => (
                <motion.div
                  key={evaluation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium text-lg">{evaluation.title}</h4>
                      <p className="text-gray-400 text-sm">{evaluation.subject}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-white font-medium">{evaluation.rating}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-white font-bold">{evaluation.questions}</div>
                      <div className="text-gray-400 text-xs">Preguntas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold">{evaluation.duration}</div>
                      <div className="text-gray-400 text-xs">Duración</div>
                    </div>
                    <div className="text-center">
                      <Badge className={getDifficultyColor(evaluation.difficulty)}>
                        {evaluation.difficulty}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-cyan-400 font-bold">{evaluation.users}</div>
                      <div className="text-gray-400 text-xs">Usuarios</div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
                    Comenzar Evaluación
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};
