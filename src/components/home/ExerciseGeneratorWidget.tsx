
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Play, ArrowRight, Zap, BookOpen, Calculator, History, FlaskConical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Subject {
  code: string;
  name: string;
  totalNodes: number;
  tier1: number;
  criticalAreas: number;
  priority: 'high' | 'medium' | 'low';
}

interface ExerciseGeneratorWidgetProps {
  subjects: Subject[];
}

export const ExerciseGeneratorWidget: React.FC<ExerciseGeneratorWidgetProps> = ({ subjects }) => {
  const getSubjectIcon = (code: string) => {
    switch (code) {
      case 'COMPETENCIA_LECTORA': return BookOpen;
      case 'MATEMATICA_1':
      case 'MATEMATICA_2': return Calculator;
      case 'HISTORIA': return History;
      case 'CIENCIAS': return FlaskConical;
      default: return Brain;
    }
  };

  const getSubjectSlug = (code: string) => {
    switch (code) {
      case 'COMPETENCIA_LECTORA': return 'competencia-lectora';
      case 'MATEMATICA_1': return 'matematica-m1';
      case 'MATEMATICA_2': return 'matematica-m2';
      case 'HISTORIA': return 'historia';
      case 'CIENCIAS': return 'ciencias';
      default: return 'competencia-lectora';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Media';
    }
  };

  // Obtener materias con prioridad alta para destacar
  const highPrioritySubjects = subjects.filter(s => s.priority === 'high').slice(0, 2);
  const otherSubjects = subjects.filter(s => s.priority !== 'high');

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary text-white">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Generador de Ejercicios IA</CardTitle>
              <p className="text-muted-foreground">
                Crea ejercicios personalizados basados en el sistema de 277 nodos
              </p>
            </div>
          </div>
          <Button asChild>
            <Link to="/ejercicios" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Abrir Generador
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Materias de Alta Prioridad */}
        {highPrioritySubjects.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-red-500" />
              Materias que Requieren Atención Inmediata
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highPrioritySubjects.map((subject, index) => {
                const Icon = getSubjectIcon(subject.code);
                const slug = getSubjectSlug(subject.code);
                
                return (
                  <motion.div
                    key={subject.code}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-red-200 bg-red-50 hover:shadow-md transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-red-600" />
                            <h4 className="font-medium text-sm">{subject.name}</h4>
                          </div>
                          <Badge className={getPriorityColor(subject.priority)}>
                            {getPriorityText(subject.priority)}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Tier 1 Críticos:</span>
                            <span className="font-semibold">{subject.tier1} nodos</span>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Áreas críticas:</span>
                            <span className="font-semibold text-red-600">{subject.criticalAreas}</span>
                          </div>
                        </div>
                        
                        <Button asChild size="sm" className="w-full bg-red-600 hover:bg-red-700">
                          <Link to={`/ejercicios/${slug}`} className="flex items-center gap-2">
                            <Play className="h-3 w-3" />
                            Generar Ejercicios
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Acceso Rápido a Todas las Materias */}
        <div>
          <h3 className="font-semibold mb-3">Acceso Rápido por Materia</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {subjects.map((subject, index) => {
              const Icon = getSubjectIcon(subject.code);
              const slug = getSubjectSlug(subject.code);
              
              return (
                <motion.div
                  key={subject.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    className="h-16 w-full flex flex-col items-center justify-center gap-1 hover:shadow-md transition-all"
                  >
                    <Link to={`/ejercicios/${slug}`}>
                      <Icon className="h-5 w-5" />
                      <span className="text-xs text-center leading-tight">
                        {subject.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {subject.totalNodes} nodos
                      </span>
                    </Link>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white/50 rounded-lg p-4 text-center">
          <h4 className="font-semibold mb-2">¿Necesitas práctica específica?</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Genera ejercicios personalizados con IA para cualquier nodo de aprendizaje
          </p>
          <Button asChild className="w-full md:w-auto">
            <Link to="/ejercicios" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Explorar Generador Completo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
