
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  Target, 
  TrendingUp,
  Shapes,
  BarChart3,
  PieChart,
  Hash
} from 'lucide-react';

interface MatematicaM1Metrics {
  aritmetica: number;
  algebraBasica: number;
  geometriaPlana: number;
  datosAzar: number;
  problemasCotidianos: number;
  procesamientoInformacion: number;
  tiempoPromedio: number;
  erroresFrecuentes: string[];
}

export const PAESMatematicaM1Integration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Datos simulados específicos para M1
  const metrics: MatematicaM1Metrics = {
    aritmetica: 82,
    algebraBasica: 75,
    geometriaPlana: 68,
    datosAzar: 71,
    problemasCotidianos: 79,
    procesamientoInformacion: 73,
    tiempoPromedio: 75, // segundos por pregunta
    erroresFrecuentes: ['Cálculos con fracciones', 'Interpretación de gráficos', 'Problemas de proporcionalidad']
  };

  const ejesTematicosMath1 = [
    { 
      name: 'Números', 
      progress: metrics.aritmetica, 
      questions: 18,
      topics: ['Enteros', 'Racionales', 'Porcentajes', 'Proporciones'],
      color: 'text-blue-400',
      icon: Hash
    },
    { 
      name: 'Álgebra y Funciones', 
      progress: metrics.algebraBasica, 
      questions: 15,
      topics: ['Ecuaciones lineales', 'Funciones básicas', 'Patrones'],
      color: 'text-green-400',
      icon: Calculator
    },
    { 
      name: 'Geometría', 
      progress: metrics.geometriaPlana, 
      questions: 12,
      topics: ['Perímetros', 'Áreas', 'Volúmenes', 'Teorema Pitágoras'],
      color: 'text-purple-400',
      icon: Shapes
    },
    { 
      name: 'Probabilidad y Estadística', 
      progress: metrics.datosAzar, 
      questions: 10,
      topics: ['Gráficos', 'Medidas resumen', 'Probabilidad básica'],
      color: 'text-yellow-400',
      icon: PieChart
    }
  ];

  const habilidadesMath1 = [
    { skill: 'Resolver problemas', level: 78, description: 'Aplicar estrategias para resolver situaciones matemáticas' },
    { skill: 'Modelar', level: 72, description: 'Traducir situaciones a lenguaje matemático' },
    { skill: 'Representar', level: 75, description: 'Usar distintas representaciones matemáticas' },
    { skill: 'Argumentar', level: 65, description: 'Justificar procedimientos y resultados' }
  ];

  return (
    <div className="space-y-6">
      {/* Header específico para M1 */}
      <Card className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border-green-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calculator className="h-6 w-6 text-green-400" />
            PAES Matemática M1 (Obligatoria)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <Hash className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{metrics.aritmetica}%</div>
              <div className="text-sm text-gray-400">Números</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <Calculator className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{metrics.algebraBasica}%</div>
              <div className="text-sm text-gray-400">Álgebra</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <Shapes className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{metrics.geometriaPlana}%</div>
              <div className="text-sm text-gray-400">Geometría</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <PieChart className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{metrics.datosAzar}%</div>
              <div className="text-sm text-gray-400">Datos y Azar</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="ejes">Ejes Temáticos</TabsTrigger>
          <TabsTrigger value="habilidades">Habilidades</TabsTrigger>
          <TabsTrigger value="estrategias">Estrategias</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Habilidades matemáticas M1 */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Habilidades Matemáticas M1</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {habilidadesMath1.map((habilidad, index) => (
                  <motion.div
                    key={habilidad.skill}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-white">{habilidad.skill}</span>
                      <span className="text-green-400 font-bold">{habilidad.level}%</span>
                    </div>
                    <Progress value={habilidad.level} className="h-2" />
                    <p className="text-sm text-gray-400">{habilidad.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Errores frecuentes y recomendaciones */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Análisis de Errores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-3">Errores Más Frecuentes</h4>
                  <div className="space-y-2">
                    {metrics.erroresFrecuentes.map((error, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-red-600/10 border border-red-600/30 rounded-lg">
                        <div className="text-red-400">⚠</div>
                        <span className="text-white">{error}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Tiempo Promedio</div>
                    <div className="text-2xl font-bold text-white">{metrics.tiempoPromedio}s</div>
                    <div className="text-xs text-blue-400">por pregunta</div>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Eficiencia</div>
                    <div className="text-2xl font-bold text-white">
                      {Math.round((metrics.aritmetica + metrics.algebraBasica + metrics.geometriaPlana + metrics.datosAzar) / 4)}%
                    </div>
                    <div className="text-xs text-green-400">rendimiento global</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ejes" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Rendimiento por Eje Temático</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {ejesTematicosMath1.map((eje, index) => {
                  const IconComponent = eje.icon;
                  return (
                    <motion.div
                      key={eje.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <IconComponent className={`h-6 w-6 ${eje.color}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-white">{eje.name}</h4>
                            <div className="flex items-center gap-3">
                              <span className={`font-bold ${eje.color}`}>{eje.progress}%</span>
                              <Badge variant="outline" className="text-gray-400">
                                {eje.questions} preguntas
                              </Badge>
                            </div>
                          </div>
                          <Progress value={eje.progress} className="h-2 mt-2" />
                        </div>
                      </div>
                      
                      <div className="ml-9">
                        <p className="text-sm text-gray-400 mb-2">Temas principales:</p>
                        <div className="flex flex-wrap gap-2">
                          {eje.topics.map(topic => (
                            <Badge key={topic} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="habilidades" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Análisis Detallado de Habilidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Fortalezas</h4>
                  {habilidadesMath1
                    .filter(hab => hab.level >= 75)
                    .map(hab => (
                      <div key={hab.skill} className="flex items-center gap-3 p-3 bg-green-600/10 border border-green-600/30 rounded-lg">
                        <div className="text-green-400">✓</div>
                        <div>
                          <div className="font-medium text-white">{hab.skill}</div>
                          <div className="text-sm text-gray-400">{hab.level}% de dominio</div>
                        </div>
                      </div>
                    ))}
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Áreas de Mejora</h4>
                  {habilidadesMath1
                    .filter(hab => hab.level < 75)
                    .map(hab => (
                      <div key={hab.skill} className="flex items-center gap-3 p-3 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
                        <div className="text-yellow-400">⚠</div>
                        <div>
                          <div className="font-medium text-white">{hab.skill}</div>
                          <div className="text-sm text-gray-400">Requiere práctica adicional</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estrategias" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Estrategias por Eje Temático</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Números y Operaciones</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Practica cálculo mental con números enteros y decimales</li>
                    <li>• Refuerza operaciones con fracciones y porcentajes</li>
                    <li>• Usa la calculadora de manera eficiente</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-600/10 border border-green-600/30 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Álgebra y Funciones</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Identifica patrones en secuencias numéricas</li>
                    <li>• Practica resolución de ecuaciones de primer grado</li>
                    <li>• Interpreta gráficos de funciones lineales</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-purple-600/10 border border-purple-600/30 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Geometría</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Memoriza fórmulas de perímetros y áreas básicas</li>
                    <li>• Practica el teorema de Pitágoras</li>
                    <li>• Visualiza problemas geométricos con dibujos</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Probabilidad y Estadística</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Interpreta gráficos de barras, líneas y circulares</li>
                    <li>• Calcula promedio, mediana y moda</li>
                    <li>• Comprende probabilidades simples</li>
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
