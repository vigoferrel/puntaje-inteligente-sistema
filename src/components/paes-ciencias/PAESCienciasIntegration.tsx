
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Microscope, 
  Beaker, 
  Atom, 
  FlaskConical,
  TrendingUp,
  BookOpen,
  Target,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePAESCienciasIntegration } from '@/hooks/use-paes-ciencias-integration';

interface PAESCienciasIntegrationProps {
  className?: string;
}

export const PAESCienciasIntegration = ({ className }: PAESCienciasIntegrationProps) => {
  const {
    loading,
    cienciasNodes,
    questionMappings,
    analytics,
    getRecommendedNodes
  } = usePAESCienciasIntegration();

  const [activeTab, setActiveTab] = useState('overview');

  const getSubjectIcon = (code: string) => {
    if (code.includes('BIO')) return Microscope;
    if (code.includes('QUIM')) return Beaker;
    if (code.includes('FIS')) return Atom;
    if (code.includes('MET')) return FlaskConical;
    return BookOpen;
  };

  const getSubjectColor = (code: string) => {
    if (code.includes('BIO')) return 'text-green-400 bg-green-600/10 border-green-600/30';
    if (code.includes('QUIM')) return 'text-blue-400 bg-blue-600/10 border-blue-600/30';
    if (code.includes('FIS')) return 'text-purple-400 bg-purple-600/10 border-purple-600/30';
    if (code.includes('MET')) return 'text-yellow-400 bg-yellow-600/10 border-yellow-600/30';
    return 'text-gray-400 bg-gray-600/10 border-gray-600/30';
  };

  const recommendedNodes = getRecommendedNodes(5);

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8 text-center">
          <Microscope className="h-12 w-12 text-green-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-300">Cargando integración PAES Ciencias...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header con estadísticas */}
      <Card className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border-green-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Microscope className="h-5 w-5 text-green-400" />
            PAES Ciencias - Biología 2024
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <BookOpen className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{cienciasNodes.length}</div>
              <div className="text-sm text-gray-400">Nodos Ciencias</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <Target className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{questionMappings.length}</div>
              <div className="text-sm text-gray-400">Preguntas Mapeadas</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">4</div>
              <div className="text-sm text-gray-400">Habilidades Clave</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <BarChart3 className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{recommendedNodes.length}</div>
              <div className="text-sm text-gray-400">Recomendados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Resumen
          </TabsTrigger>
          <TabsTrigger 
            value="nodes"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Nodos
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="recommendations"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Recomendaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Distribución por áreas */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Distribución por Áreas de Conocimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['CS-BIO', 'CS-FIS', 'CS-QUIM', 'CS-MET'].map((prefix, index) => {
                  const areaNodes = cienciasNodes.filter(node => node.code.startsWith(prefix));
                  const Icon = getSubjectIcon(prefix);
                  const areaName = prefix === 'CS-BIO' ? 'Biología' :
                                 prefix === 'CS-FIS' ? 'Física' :
                                 prefix === 'CS-QUIM' ? 'Química' : 'Metodología';
                  
                  return (
                    <motion.div
                      key={prefix}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${getSubjectColor(prefix)}`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="h-5 w-5" />
                        <span className="font-medium text-white">{areaName}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-white">{areaNodes.length}</div>
                        <div className="text-sm text-gray-400">nodos disponibles</div>
                        
                        <div className="flex flex-wrap gap-1">
                          {['básico', 'intermedio', 'avanzado'].map(difficulty => {
                            const count = areaNodes.filter(n => n.difficulty === difficulty).length;
                            return count > 0 ? (
                              <Badge key={difficulty} variant="outline" className="text-xs">
                                {difficulty}: {count}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Mapeo FORMA_153_2024 */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Cobertura Examen FORMA_153_2024</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Preguntas mapeadas</span>
                  <span className="text-white font-bold">{questionMappings.length} / 80</span>
                </div>
                <Progress value={(questionMappings.length / 80) * 100} className="h-2" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Módulo Común</div>
                    <div className="text-lg font-bold text-white">
                      {questionMappings.filter(q => q.questionNumber <= 54).length}
                    </div>
                    <div className="text-xs text-gray-500">Preguntas 1-54</div>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Electivo Biología</div>
                    <div className="text-lg font-bold text-white">
                      {questionMappings.filter(q => q.questionNumber > 54).length}
                    </div>
                    <div className="text-xs text-gray-500">Preguntas 55-80</div>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Dificultad Promedio</div>
                    <div className="text-lg font-bold text-white">
                      {questionMappings.length > 0 
                        ? (questionMappings.reduce((sum, q) => sum + q.difficultyWeight, 0) / questionMappings.length).toFixed(2)
                        : '0.00'
                      }
                    </div>
                    <div className="text-xs text-gray-500">Peso ponderado</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nodes" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Nodos de Aprendizaje PAES Ciencias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {cienciasNodes.map((node, index) => {
                  const Icon = getSubjectIcon(node.code);
                  return (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 text-blue-400 mt-1" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white text-sm mb-1 truncate">
                            {node.title}
                          </h4>
                          <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                            {node.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-1 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {node.code}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                node.difficulty === 'basic' ? 'border-green-600/50 text-green-400' :
                                node.difficulty === 'intermediate' ? 'border-yellow-600/50 text-yellow-400' :
                                'border-red-600/50 text-red-400'
                              }`}
                            >
                              {node.difficulty}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {node.estimated_time_minutes}min
                            </Badge>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            {node.domain_category} • {node.cognitive_level}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {analytics ? (
            <>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Distribución de Habilidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.skillDistribution.map((skill, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                        <div>
                          <span className="text-white font-medium">{skill.skill_type}</span>
                          <div className="text-sm text-gray-400">{skill.content_area}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-blue-400 font-bold">{skill.total_preguntas}</span>
                          <div className="text-xs text-gray-500">{skill.porcentaje}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Nodos Críticos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.criticalNodes.slice(0, 10).map((node, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                        <div className="flex-1">
                          <span className="text-white font-medium">{node.node_name}</span>
                          <div className="text-sm text-gray-400">
                            {node.cognitive_level} • {node.difficulty}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-green-400 font-bold">{node.total_preguntas}</span>
                          <div className="text-xs text-gray-500">preguntas</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Analytics no disponibles</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Nodos Recomendados</CardTitle>
            </CardHeader>
            <CardContent>
              {recommendedNodes.length > 0 ? (
                <div className="space-y-4">
                  {recommendedNodes.map((node, index) => {
                    const Icon = getSubjectIcon(node.code);
                    return (
                      <motion.div
                        key={node.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-green-600/10 border border-green-600/30 rounded-lg"
                      >
                        <div className="bg-green-600/20 p-2 rounded-full">
                          <Icon className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{node.title}</h4>
                          <p className="text-sm text-gray-300">{node.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs border-green-600/50 text-green-400">
                              {node.code}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {node.estimated_time_minutes}min
                            </Badge>
                          </div>
                        </div>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Estudiar
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No hay recomendaciones disponibles</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
