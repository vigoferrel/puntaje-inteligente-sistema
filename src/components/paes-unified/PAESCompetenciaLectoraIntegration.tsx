
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp,
  Eye,
  MessageSquare,
  FileText,
  BarChart3
} from 'lucide-react';

interface CompetenciaLectoraMetrics {
  velocidadLectora: number; // palabras por minuto
  comprensionGlobal: number; // porcentaje
  vocabularioAvanzado: number; // porcentaje
  analisisRetorico: number; // porcentaje
  inferenciaContextual: number; // porcentaje
  textosPracticados: number;
  tiempoPromedioPregunta: number; // segundos
}

export const PAESCompetenciaLectoraIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Datos simulados - en implementación real vendrían del hook
  const metrics: CompetenciaLectoraMetrics = {
    velocidadLectora: 185,
    comprensionGlobal: 78,
    vocabularioAvanzado: 82,
    analisisRetorico: 65,
    inferenciaContextual: 70,
    textosPracticados: 24,
    tiempoPromedioPregunta: 95
  };

  const textTypes = [
    { name: 'Textos Literarios', progress: 85, questions: 12, color: 'text-blue-400' },
    { name: 'Textos Expositivos', progress: 72, questions: 15, color: 'text-green-400' },
    { name: 'Textos Argumentativos', progress: 68, questions: 18, color: 'text-purple-400' },
    { name: 'Textos Periodísticos', progress: 75, questions: 10, color: 'text-yellow-400' }
  ];

  const readingSkills = [
    { skill: 'Localizar información', level: 88, description: 'Encontrar datos específicos en el texto' },
    { skill: 'Comprender globalmente', level: 75, description: 'Entender la idea principal y estructura' },
    { skill: 'Interpretar y relacionar', level: 70, description: 'Conectar ideas y hacer inferencias' },
    { skill: 'Reflexionar y valorar', level: 62, description: 'Evaluar críticamente el contenido' }
  ];

  return (
    <div className="space-y-6">
      {/* Header específico */}
      <Card className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-blue-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-400" />
            PAES Competencia Lectora
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <Eye className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{metrics.velocidadLectora}</div>
              <div className="text-sm text-gray-400">palabras/min</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{metrics.comprensionGlobal}%</div>
              <div className="text-sm text-gray-400">Comprensión</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <MessageSquare className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{metrics.vocabularioAvanzado}%</div>
              <div className="text-sm text-gray-400">Vocabulario</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <Clock className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{metrics.tiempoPromedioPregunta}s</div>
              <div className="text-sm text-gray-400">por pregunta</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="skills">Habilidades</TabsTrigger>
          <TabsTrigger value="texts">Tipos de Texto</TabsTrigger>
          <TabsTrigger value="strategy">Estrategias</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Habilidades de lectura */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Habilidades de Comprensión Lectora</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {readingSkills.map((skill, index) => (
                  <motion.div
                    key={skill.skill}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-white">{skill.skill}</span>
                      <span className="text-blue-400 font-bold">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                    <p className="text-sm text-gray-400">{skill.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Métricas de velocidad y eficiencia */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Eficiencia Lectora</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Velocidad de Lectura</div>
                  <div className="text-2xl font-bold text-white">{metrics.velocidadLectora} ppm</div>
                  <div className="text-xs text-green-400">+15 desde el mes pasado</div>
                </div>
                
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Textos Completados</div>
                  <div className="text-2xl font-bold text-white">{metrics.textosPracticados}</div>
                  <div className="text-xs text-blue-400">Variedad de géneros</div>
                </div>
                
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Tiempo por Pregunta</div>
                  <div className="text-2xl font-bold text-white">{metrics.tiempoPromedioPregunta}s</div>
                  <div className="text-xs text-yellow-400">Objetivo: 90s</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Análisis Detallado de Habilidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-white">Fortalezas</h4>
                    {readingSkills
                      .filter(skill => skill.level >= 75)
                      .map(skill => (
                        <div key={skill.skill} className="flex items-center gap-3 p-3 bg-green-600/10 border border-green-600/30 rounded-lg">
                          <div className="text-green-400">✓</div>
                          <div>
                            <div className="font-medium text-white">{skill.skill}</div>
                            <div className="text-sm text-gray-400">{skill.level}% de dominio</div>
                          </div>
                        </div>
                      ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-white">Áreas de Mejora</h4>
                    {readingSkills
                      .filter(skill => skill.level < 75)
                      .map(skill => (
                        <div key={skill.skill} className="flex items-center gap-3 p-3 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
                          <div className="text-yellow-400">⚠</div>
                          <div>
                            <div className="font-medium text-white">{skill.skill}</div>
                            <div className="text-sm text-gray-400">Requiere práctica adicional</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="texts" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Rendimiento por Tipo de Texto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {textTypes.map((type, index) => (
                  <motion.div
                    key={type.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-white">{type.name}</h4>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold ${type.color}`}>{type.progress}%</span>
                        <Badge variant="outline" className="text-gray-400">
                          {type.questions} preguntas
                        </Badge>
                      </div>
                    </div>
                    <Progress value={type.progress} className="h-2" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Estrategias Recomendadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Para Mejorar Velocidad de Lectura</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Practica lectura en bloques de palabras</li>
                    <li>• Evita la subvocalización</li>
                    <li>• Usa técnicas de skimming para textos largos</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-600/10 border border-green-600/30 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Para Mejorar Comprensión</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Identifica la estructura del texto antes de leer</li>
                    <li>• Practica hacer resúmenes mentales por párrafo</li>
                    <li>• Conecta la información nueva con conocimientos previos</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-purple-600/10 border border-purple-600/30 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Para Análisis Crítico</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Identifica el propósito del autor</li>
                    <li>• Busca evidencias que apoyen los argumentos</li>
                    <li>• Practica distinguir entre hechos y opiniones</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
