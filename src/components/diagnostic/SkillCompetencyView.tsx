
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { BookOpen, Calculator, FlaskConical, Globe, Brain, BarChart3, ArrowRight } from "lucide-react";
import { TPAESHabilidad, TPAESPrueba, getHabilidadDisplayName, getPruebaDisplayName } from "@/types/system-types";

interface SkillLevel {
  skill: TPAESHabilidad;
  level: number;
  hasCompletedDiagnostic: boolean;
}

interface NodeData {
  id: string;
  title: string;
  description: string;
  skill: TPAESHabilidad;
  difficulty: string;
  estimatedTimeMinutes: number;
  dependsOn: string[];
  progress?: number; // 0 a 1
}

interface SkillCompetencyViewProps {
  skillLevels: Record<TPAESPrueba, SkillLevel[]>;
  availableNodes: NodeData[];
  onStartDiagnostic: (prueba: TPAESPrueba) => void;
  onSelectNode: (nodeId: string) => void;
  loading: boolean;
}

export const SkillCompetencyView = ({
  skillLevels,
  availableNodes,
  onStartDiagnostic,
  onSelectNode,
  loading
}: SkillCompetencyViewProps) => {
  const [selectedTest, setSelectedTest] = useState<TPAESPrueba>('MATEMATICA_1');
  
  // Helper para obtener el icono
  const getTestIcon = (prueba: TPAESPrueba) => {
    switch (prueba) {
      case 'COMPETENCIA_LECTORA':
        return <BookOpen className="h-5 w-5 text-blue-600" />;
      case 'MATEMATICA_1':
      case 'MATEMATICA_2':
        return <Calculator className="h-5 w-5 text-purple-600" />;
      case 'CIENCIAS':
        return <FlaskConical className="h-5 w-5 text-green-600" />;
      case 'HISTORIA':
        return <Globe className="h-5 w-5 text-amber-600" />;
      default:
        return <BookOpen className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic':
        return 'text-green-600 bg-green-50';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-50';
      case 'advanced':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  // Obtener tests disponibles a partir de los skill levels
  const availableTests = Object.keys(skillLevels) as TPAESPrueba[];
  
  // Filtrar nodos por el test seleccionado
  const testNodes = availableNodes.filter(node => {
    const skillsForTest = skillLevels[selectedTest];
    return skillsForTest?.some(s => s.skill === node.skill);
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 animate-pulse rounded-md w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue={selectedTest} className="w-full" onValueChange={(value) => setSelectedTest(value as TPAESPrueba)}>
        <TabsList className="mb-6 w-full justify-start overflow-x-auto">
          {availableTests.map((test) => (
            <TabsTrigger key={test} value={test} className="flex items-center gap-2">
              {getTestIcon(test)}
              <span>{getPruebaDisplayName(test)}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {availableTests.map((test) => (
          <TabsContent key={test} value={test} className="space-y-6">
            {/* Sección de Habilidades */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Competencias Evaluadas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skillLevels[test].map((skill, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{getHabilidadDisplayName(skill.skill)}</CardTitle>
                        <CardDescription>
                          {skill.hasCompletedDiagnostic 
                            ? "Nivel basado en diagnóstico" 
                            : "No has completado el diagnóstico"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {skill.hasCompletedDiagnostic ? (
                          <>
                            <div className="flex justify-between items-center mb-1 text-sm">
                              <span>Nivel actual</span>
                              <span className="font-semibold">{Math.round(skill.level * 100)}%</span>
                            </div>
                            <Progress value={skill.level * 100} className="h-2" />
                          </>
                        ) : (
                          <div className="flex justify-center py-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => onStartDiagnostic(test)}
                              className="flex items-center gap-2"
                            >
                              Realizar diagnóstico
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Sección de Nodos de Aprendizaje */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Nodos de Aprendizaje Relacionados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testNodes.length > 0 ? (
                  testNodes.map((node, idx) => (
                    <motion.div 
                      key={node.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 + 0.3 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <Card 
                        className="cursor-pointer h-full hover:shadow-md transition-all duration-200" 
                        onClick={() => onSelectNode(node.id)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{node.title}</CardTitle>
                            <Badge className={getDifficultyColor(node.difficulty)}>
                              {node.difficulty}
                            </Badge>
                          </div>
                          <CardDescription>{node.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-4">
                          <div className="flex flex-col gap-2">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Habilidad:</span>
                                <div className="font-medium">{getHabilidadDisplayName(node.skill)}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Tiempo:</span>
                                <div className="font-medium">{node.estimatedTimeMinutes} min</div>
                              </div>
                            </div>
                            
                            {node.progress !== undefined && (
                              <div className="mt-2">
                                <div className="flex justify-between items-center text-xs mb-1">
                                  <span>Progreso</span>
                                  <span>{Math.round(node.progress * 100)}%</span>
                                </div>
                                <Progress value={node.progress * 100} className="h-1.5" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-6">
                    <p className="text-muted-foreground">No hay nodos disponibles para esta prueba.</p>
                    <Button className="mt-4" onClick={() => onStartDiagnostic(test)}>
                      Realizar diagnóstico para comenzar
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button 
                onClick={() => onStartDiagnostic(test)}
                size="lg" 
                className="gap-2"
              >
                {skillLevels[test].some(s => s.hasCompletedDiagnostic) ? 'Repetir diagnóstico' : 'Realizar diagnóstico ahora'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
