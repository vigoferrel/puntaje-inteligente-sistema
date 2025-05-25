
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft,
  Clock,
  Target,
  Brain,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { PreguntaComprensionLectora } from './PreguntaComprensionLectora';
import { PreguntaMatematica } from './PreguntaMatematica';
import { PreguntaHistorica } from './PreguntaHistorica';
import { BancoEvaluacionesService, type PreguntaBanco } from '@/services/banco-evaluaciones/BancoEvaluacionesService';
import { toast } from "@/components/ui/use-toast";

interface EvaluacionCinematicaProps {
  evaluacionId: string;
  config: {
    tipo_evaluacion: 'diagnostica' | 'formativa' | 'sumativa' | 'adaptativa';
    prueba_paes: string;
    total_preguntas: number;
    duracion_minutos: number;
    distribucion_dificultad: { basico: number; intermedio: number; avanzado: number };
    feedback_inmediato?: boolean;
    usa_gamificacion?: boolean;
  };
  onFinalizarEvaluacion: (resultados: any) => void;
}

export const EvaluacionCinematica: React.FC<EvaluacionCinematicaProps> = ({
  evaluacionId,
  config,
  onFinalizarEvaluacion
}) => {
  const [preguntas, setPreguntas] = useState<PreguntaBanco[]>([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, { respuesta: string; analytics: any }>>({});
  const [tiempoRestante, setTiempoRestante] = useState(config.duracion_minutos * 60);
  const [estadoEvaluacion, setEstadoEvaluacion] = useState<'cargando' | 'activa' | 'pausada' | 'finalizada'>('cargando');
  const [progresoTiempoReal, setProgresoTiempoReal] = useState<any>(null);
  const [modoCinematico, setModoCinematico] = useState(true);

  // Cargar preguntas al inicializar
  useEffect(() => {
    cargarPreguntasEvaluacion();
  }, [evaluacionId, config]);

  // Timer de evaluación
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (estadoEvaluacion === 'activa' && tiempoRestante > 0) {
      timer = setInterval(() => {
        setTiempoRestante(prev => {
          if (prev <= 1) {
            finalizarEvaluacion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [estadoEvaluacion, tiempoRestante]);

  // Análisis en tiempo real
  useEffect(() => {
    if (Object.keys(respuestas).length > 0) {
      analizarProgresoTiempoReal();
    }
  }, [respuestas]);

  const cargarPreguntasEvaluacion = async () => {
    try {
      setEstadoEvaluacion('cargando');
      
      const resultado = await BancoEvaluacionesService.generarEvaluacionOptimizada(config);
      
      setPreguntas(resultado.preguntas);
      setEstadoEvaluacion('activa');
      
      toast({
        title: "Evaluación Lista",
        description: `${resultado.preguntas.length} preguntas cargadas. ¡Comencemos!`,
      });
    } catch (error) {
      console.error('Error cargando evaluación:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la evaluación. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  };

  const analizarProgresoTiempoReal = async () => {
    const respuestasArray = Object.values(respuestas);
    const progreso = await BancoEvaluacionesService.analizarProgresoTiempoReal(
      'user-id', // Obtener del contexto de auth
      respuestasArray
    );
    
    setProgresoTiempoReal(progreso);
  };

  const manejarRespuesta = (respuesta: string, analytics: any) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaActual]: { respuesta, analytics }
    }));

    // Avanzar a la siguiente pregunta automáticamente
    setTimeout(() => {
      if (preguntaActual < preguntas.length - 1) {
        setPreguntaActual(prev => prev + 1);
      } else {
        finalizarEvaluacion();
      }
    }, config.feedback_inmediato ? 2000 : 500);
  };

  const finalizarEvaluacion = () => {
    setEstadoEvaluacion('finalizada');
    
    const resultados = {
      evaluacionId,
      respuestas,
      tiempoTotal: config.duracion_minutos * 60 - tiempoRestante,
      progresoTiempoReal,
      estadisticas: calcularEstadisticas()
    };
    
    onFinalizarEvaluacion(resultados);
  };

  const calcularEstadisticas = () => {
    const respuestasArray = Object.values(respuestas);
    const correctas = respuestasArray.filter(r => {
      const pregunta = preguntas[Object.keys(respuestas).indexOf(r.respuesta)];
      return pregunta?.alternativas.find(alt => alt.letra === r.respuesta)?.es_correcta;
    }).length;

    return {
      totalPreguntas: preguntas.length,
      preguntasRespondidas: respuestasArray.length,
      respuestasCorrectas: correctas,
      porcentajeAcierto: respuestasArray.length > 0 ? (correctas / respuestasArray.length) * 100 : 0,
      tiempoPromedioPorPregunta: respuestasArray.length > 0 ? 
        respuestasArray.reduce((sum, r) => sum + (r.analytics.tiempo_respuesta_segundos || 0), 0) / respuestasArray.length : 0
    };
  };

  const togglePausa = () => {
    setEstadoEvaluacion(prev => prev === 'activa' ? 'pausada' : 'activa');
  };

  const navegarPregunta = (direccion: 'anterior' | 'siguiente') => {
    if (direccion === 'anterior' && preguntaActual > 0) {
      setPreguntaActual(prev => prev - 1);
    } else if (direccion === 'siguiente' && preguntaActual < preguntas.length - 1) {
      setPreguntaActual(prev => prev + 1);
    }
  };

  if (estadoEvaluacion === 'cargando') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-2">Preparando Evaluación</h2>
            <p className="text-white/80">Cargando contenido educativo optimizado...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (estadoEvaluacion === 'finalizada') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 text-white"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <Target className="w-20 h-20 mx-auto text-green-400" />
          </motion.div>
          <h2 className="text-3xl font-bold">¡Evaluación Completada!</h2>
          <p className="text-white/80">Procesando resultados...</p>
        </motion.div>
      </div>
    );
  }

  const preguntaActualData = preguntas[preguntaActual];
  if (!preguntaActualData) return null;

  const progreso = ((preguntaActual + 1) / preguntas.length) * 100;
  const tiempoFormateado = `${Math.floor(tiempoRestante / 60)}:${(tiempoRestante % 60).toString().padStart(2, '0')}`;

  return (
    <div className="evaluacion-cinematica">
      {/* Header con información de progreso */}
      <motion.div 
        className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Información de evaluación */}
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                {config.tipo_evaluacion.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="border-white/20 text-white">
                {config.prueba_paes}
              </Badge>
            </div>

            {/* Progreso */}
            <div className="flex-1 mx-8">
              <div className="flex items-center justify-between text-white text-sm mb-1">
                <span>Pregunta {preguntaActual + 1} de {preguntas.length}</span>
                <span>{Math.round(progreso)}% completado</span>
              </div>
              <Progress value={progreso} className="h-2" />
            </div>

            {/* Tiempo y controles */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-lg">{tiempoFormateado}</span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePausa}
                className="text-white hover:bg-white/10"
              >
                {estadoEvaluacion === 'activa' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Overlay de pausa */}
      <AnimatePresence>
        {estadoEvaluacion === 'pausada' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center"
          >
            <Card className="bg-black/50 border-white/20 text-white">
              <CardContent className="p-8 text-center">
                <Pause className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Evaluación Pausada</h3>
                <p className="text-white/80 mb-6">Presiona continuar cuando estés listo</p>
                <Button onClick={togglePausa} size="lg">
                  <Play className="w-4 h-4 mr-2" />
                  Continuar
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel de progreso en tiempo real */}
      {progresoTiempoReal && config.tipo_evaluacion === 'adaptativa' && (
        <motion.div
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          className="fixed right-4 top-24 z-30 w-80"
        >
          <Card className="bg-black/80 border-white/20 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Análisis en Tiempo Real
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Puntaje actual:</span>
                <span className="font-semibold">{Math.round(progresoTiempoReal.puntajeActual)}%</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Tiempo promedio:</span>
                <span className="font-semibold">{Math.round(progresoTiempoReal.tiempoPromedio)}s</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Predicción PAES:</span>
                <span className="font-semibold">{progresoTiempoReal.prediccionRendimiento.puntajePredictedoPAES}</span>
              </div>

              {progresoTiempoReal.recomendacionesInmediatas.length > 0 && (
                <div className="p-2 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>{progresoTiempoReal.recomendacionesInmediatas[0]}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Contenido principal de la pregunta */}
      <div className="pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={preguntaActual}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            {preguntaActualData.texto_base ? (
              <PreguntaComprensionLectora
                pregunta={{
                  id: preguntaActualData.id,
                  enunciado: preguntaActualData.enunciado,
                  texto_base: preguntaActualData.texto_base,
                  tipo_texto: preguntaActualData.tipo_texto as any,
                  genero_textual: preguntaActualData.genero_textual || '',
                  autor_texto: preguntaActualData.autor_texto,
                  extension_palabras: preguntaActualData.extension_palabras || 0,
                  nivel_complejidad_lexica: preguntaActualData.nivel_complejidad_lexica as any,
                  alternativas: preguntaActualData.alternativas
                }}
                onRespuesta={manejarRespuesta}
                tiempoRestante={tiempoRestante}
                permitirRetroceder={preguntaActual > 0}
                modoInmersivo={modoCinematico}
              />
            ) : preguntaActualData.imagen_principal_url || preguntaActualData.formulas_relevantes ? (
              <PreguntaMatematica
                pregunta={{
                  id: preguntaActualData.id,
                  enunciado: preguntaActualData.enunciado,
                  imagen_principal_url: preguntaActualData.imagen_principal_url,
                  imagen_secundaria_url: preguntaActualData.imagen_secundaria_url,
                  datos_tabla: preguntaActualData.datos_tabla,
                  formulas_relevantes: preguntaActualData.formulas_relevantes,
                  unidades_trabajo: preguntaActualData.unidades_trabajo,
                  tipo_grafico: preguntaActualData.tipo_grafico as any,
                  variables_involucradas: preguntaActualData.variables_involucradas,
                  alternativas: preguntaActualData.alternativas
                }}
                onRespuesta={manejarRespuesta}
                tiempoRestante={tiempoRestante}
                mostrarCalculadora={true}
              />
            ) : (
              <PreguntaHistorica
                pregunta={{
                  id: preguntaActualData.id,
                  enunciado: preguntaActualData.enunciado,
                  documento_fuente: preguntaActualData.documento_fuente,
                  tipo_documento: preguntaActualData.tipo_documento,
                  mapa_imagen_url: preguntaActualData.mapa_imagen_url,
                  cronologia: preguntaActualData.cronologia,
                  contexto_historico: preguntaActualData.contexto_historico,
                  personajes_involucrados: preguntaActualData.personajes_involucrados,
                  lugares_geograficos: preguntaActualData.lugares_geograficos,
                  periodo_historico: preguntaActualData.periodo_historico,
                  alternativas: preguntaActualData.alternativas
                }}
                onRespuesta={manejarRespuesta}
                tiempoRestante={tiempoRestante}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navegación de preguntas (para modo no automático) */}
      <motion.div
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navegarPregunta('anterior')}
            disabled={preguntaActual === 0}
            className="text-white hover:bg-white/10"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <span className="text-white px-4 py-1 bg-white/10 rounded-full text-sm">
            {preguntaActual + 1} / {preguntas.length}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navegarPregunta('siguiente')}
            disabled={preguntaActual === preguntas.length - 1}
            className="text-white hover:bg-white/10"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
