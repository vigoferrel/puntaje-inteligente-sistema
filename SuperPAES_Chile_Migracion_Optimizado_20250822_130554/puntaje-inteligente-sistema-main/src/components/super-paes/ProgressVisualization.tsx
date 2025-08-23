/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { 
  BarChart3, PieChart, TrendingUp, Target, 
  Brain, Lightbulb, MapPin, ArrowRight
} from 'lucide-react';

interface ProgressVisualizationProps {
  analisis: unknown;
  recomendaciones: unknown;
}

export const ProgressVisualization: FC<ProgressVisualizationProps> = ({
  analisis,
  recomendaciones
}) => {
  if (!analisis || !recomendaciones) {
    return (
      <div className="text-center py-12">
        <div className="text-white/60">No hay datos de anÃ¡lisis disponibles</div>
      </div>
    );
  }

  const siguientesPasos = analisis.siguientesPasos || [];
  const recomendacionesGenerales = analisis.recomendacionesGenerales || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-white mb-2">AnÃ¡lisis Detallado</h2>
        <p className="text-purple-200">Insights profundos de tu perfil vocacional</p>
      </motion.div>

      {/* Perfil Cognitivo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border-blue-300/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-400" />
              Perfil Cognitivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Niveles de Bloom */}
              <div>
                <h3 className="text-white font-semibold mb-4">TaxonomÃ­a de Bloom</h3>
                <div className="space-y-3">
                  {Object.entries(analisis.perfilCognitivo?.nivelesBloom || {}).map(([nivel, puntaje], index) => (
                    <motion.div
                      key={nivel}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-300 text-sm">{nivel}</span>
                        <span className="text-blue-400 font-medium">{String(puntaje)}%</span>
                      </div>
                      <Progress value={Number(puntaje)} className="h-2" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Estilos y Preferencias */}
              <div>
                <h3 className="text-white font-semibold mb-4">Estilos Cognitivos</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-slate-400 mb-2">Estilos de Razonamiento:</div>
                    <div className="flex flex-wrap gap-2">
                      {(analisis.perfilCognitivo?.estilosRazonamiento || []).map((estilo: string) => (
                        <Badge key={estilo} className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                          {estilo}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-slate-400 mb-2">Preferencias Cognitivas:</div>
                    <div className="flex flex-wrap gap-2">
                      {(analisis.perfilCognitivo?.preferenciasCognitivas || []).map((preferencia: string) => (
                        <Badge key={preferencia} className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                          {preferencia}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Fortalezas Vocacionales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl border-green-300/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-green-400" />
              Fortalezas Vocacionales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(analisis.fortalezasVocacionales || []).map((fortaleza: unknown, index: number) => (
                <motion.div
                  key={fortaleza.competencia}
                  className="p-4 rounded-lg bg-white/5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-semibold">{fortaleza.competencia}</h4>
                    <Badge className="bg-green-500/20 text-green-300">
                      {fortaleza.nivel}
                    </Badge>
                  </div>
                  
                  <p className="text-slate-300 text-sm mb-3">{fortaleza.descripcion}</p>
                  
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Carreras Alineadas:</div>
                    <div className="flex flex-wrap gap-1">
                      {fortaleza.carrerasAlineadas.slice(0, 3).map((carrera: string) => (
                        <Badge key={carrera} variant="outline" className="border-green-400/30 text-green-300 text-xs">
                          {carrera}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Ãreas de InterÃ©s */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border-purple-300/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="w-6 h-6 text-purple-400" />
              Ãreas de InterÃ©s
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {(analisis.areasInteres || []).map((area: unknown, index: number) => (
                <motion.div
                  key={area.nombre}
                  className="p-4 rounded-lg bg-white/5 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {area.nivelInteres}/10
                  </div>
                  <h4 className="text-white font-semibold mb-2">{area.nombre}</h4>
                  <p className="text-slate-300 text-sm mb-3">{area.fundamentacion}</p>
                  <Progress value={area.nivelInteres * 10} className="h-2" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recomendaciones Generales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-xl border-yellow-300/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              Recomendaciones Generales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recomendacionesGenerales.map((recomendacion: string, index: number) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-300">{recomendacion}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Siguientes Pasos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-indigo-600/20 to-blue-600/20 backdrop-blur-xl border-indigo-300/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ArrowRight className="w-6 h-6 text-indigo-400" />
              Siguientes Pasos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {siguientesPasos.map((paso: unknown, index: number) => (
                <motion.div
                  key={index}
                  className="p-4 rounded-lg bg-white/5 border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white font-semibold">{paso.descripcion}</h4>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={
                          paso.prioridad === 'alta' ? 'bg-red-500/20 text-red-300' :
                          paso.prioridad === 'media' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-green-500/20 text-green-300'
                        }
                      >
                        {paso.prioridad}
                      </Badge>
                      <Badge variant="outline" className="border-indigo-400/30 text-indigo-300">
                        {paso.tiempoEstimado}
                      </Badge>
                    </div>
                  </div>
                  
                  {paso.recursos && paso.recursos.length > 0 && (
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Recursos sugeridos:</div>
                      <div className="flex flex-wrap gap-1">
                        {paso.recursos.map((recurso: string) => (
                          <Badge key={recurso} variant="outline" className="border-slate-500 text-slate-300 text-xs">
                            {recurso}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

