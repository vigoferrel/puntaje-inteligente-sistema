
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Clock, 
  Eye, 
  BarChart3, 
  Lightbulb,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface PreguntaComprensionLectoraProps {
  pregunta: {
    id: string;
    enunciado: string;
    texto_base: string;
    tipo_texto: 'narrativo' | 'expositivo' | 'argumentativo' | 'instructivo' | 'descriptivo';
    genero_textual: string;
    autor_texto?: string;
    extension_palabras: number;
    nivel_complejidad_lexica?: 'basico' | 'intermedio' | 'avanzado';
    alternativas: Array<{
      letra: string;
      contenido: string;
      es_correcta: boolean;
    }>;
  };
  onRespuesta: (respuesta: string, analytics: any) => void;
  tiempoRestante: number;
  permitirRetroceder: boolean;
  modoInmersivo?: boolean;
}

export const PreguntaComprensionLectora: React.FC<PreguntaComprensionLectoraProps> = ({
  pregunta,
  onRespuesta,
  tiempoRestante,
  permitirRetroceder,
  modoInmersivo = true
}) => {
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string>('');
  const [tiempoLectura, setTiempoLectura] = useState(0);
  const [highlightedText, setHighlightedText] = useState<string>('');
  const [showAnalisisTexto, setShowAnalisisTexto] = useState(false);
  const [porcentajeLectura, setPorcentajeLectura] = useState(0);
  
  // Analytics de comportamiento
  const [scrollPosition, setScrollPosition] = useState(0);
  const [relecturas, setRelecturas] = useState(0);
  const [tiempoPorSeccion, setTiempoPorSeccion] = useState<Record<string, number>>({});
  const [primeraInteraccion, setPrimeraInteraccion] = useState<Date | null>(null);
  
  const textoRef = useRef<HTMLDivElement>(null);
  const inicioLecturaRef = useRef<Date>(new Date());

  // Timer para tracking de tiempo de lectura
  useEffect(() => {
    const timer = setInterval(() => {
      setTiempoLectura(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Tracking de scroll y relectura
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollPercent = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
    setPorcentajeLectura(Math.min(100, Math.max(porcentajeLectura, scrollPercent)));
    
    // Detectar relectura
    if (element.scrollTop < scrollPosition - 50) {
      setRelecturas(prev => prev + 1);
    }
    setScrollPosition(element.scrollTop);
  };

  // Tracking de selección de texto
  const handleTextSelection = () => {
    const selection = window.getSelection()?.toString();
    if (selection) {
      setHighlightedText(selection);
      if (!primeraInteraccion) {
        setPrimeraInteraccion(new Date());
      }
    }
  };

  // Manejo de selección de respuesta
  const handleSeleccionRespuesta = (letra: string) => {
    setRespuestaSeleccionada(letra);
  };

  // Confirmar respuesta con analytics
  const handleConfirmarRespuesta = () => {
    if (!respuestaSeleccionada) return;

    const analytics = {
      tiempo_lectura_segundos: tiempoLectura,
      porcentaje_texto_leido: porcentajeLectura,
      numero_relecturas: relecturas,
      texto_resaltado: highlightedText,
      tiempo_primera_interaccion: primeraInteraccion ? 
        (primeraInteraccion.getTime() - inicioLecturaRef.current.getTime()) / 1000 : null,
      patron_scroll: {
        max_scroll: scrollPosition,
        relecturas_detectadas: relecturas
      }
    };

    onRespuesta(respuestaSeleccionada, analytics);
  };

  // Estimación de tiempo de lectura
  const tiempoEstimadoLectura = Math.ceil(pregunta.extension_palabras / 200); // 200 palabras por minuto

  return (
    <div className="pregunta-comprension-lectora h-screen flex">
      {/* Panel de texto (lado izquierdo) */}
      <motion.div 
        className="w-1/2 flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 border-r"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="h-full m-4 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  {pregunta.genero_textual}
                </CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">{pregunta.tipo_texto}</Badge>
                  {pregunta.nivel_complejidad_lexica && (
                    <Badge variant={
                      pregunta.nivel_complejidad_lexica === 'basico' ? 'default' :
                      pregunta.nivel_complejidad_lexica === 'intermedio' ? 'secondary' : 'destructive'
                    }>
                      {pregunta.nivel_complejidad_lexica}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="text-right text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {pregunta.extension_palabras} palabras
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-4 h-4" />
                  ~{tiempoEstimadoLectura} min lectura
                </div>
              </div>
            </div>
            
            {pregunta.autor_texto && (
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Autor:</strong> {pregunta.autor_texto}
              </p>
            )}
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            {/* Indicador de progreso de lectura */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progreso de lectura</span>
                <span>{Math.round(porcentajeLectura)}%</span>
              </div>
              <Progress value={porcentajeLectura} className="h-2" />
            </div>
            
            {/* Contenido del texto */}
            <div 
              ref={textoRef}
              className="flex-1 overflow-y-auto p-4 bg-white rounded-lg border text-justify leading-relaxed"
              onScroll={handleScroll}
              onMouseUp={handleTextSelection}
            >
              <ReactMarkdown className="prose prose-sm max-w-none">
                {pregunta.texto_base}
              </ReactMarkdown>
            </div>
            
            {/* Panel de análisis expandible */}
            <motion.div className="mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAnalisisTexto(!showAnalisisTexto)}
                className="w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Análisis de lectura
                </div>
                {showAnalisisTexto ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              
              <AnimatePresence>
                {showAnalisisTexto && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-blue-50 rounded-lg p-3 mt-2 text-sm"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <strong>Tiempo leyendo:</strong>
                        <div>{Math.floor(tiempoLectura / 60)}:{(tiempoLectura % 60).toString().padStart(2, '0')}</div>
                      </div>
                      <div>
                        <strong>Velocidad:</strong>
                        <div>{Math.round(pregunta.extension_palabras / Math.max(tiempoLectura / 60, 1))} p/min</div>
                      </div>
                      {relecturas > 0 && (
                        <>
                          <div>
                            <strong>Relecturas:</strong>
                            <div>{relecturas}</div>
                          </div>
                          <div>
                            <strong>Texto cubierto:</strong>
                            <div>{Math.round(porcentajeLectura)}%</div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {highlightedText && (
                      <div className="mt-2 p-2 bg-yellow-100 rounded border-l-2 border-yellow-500">
                        <strong>Texto resaltado:</strong>
                        <div className="text-xs italic">"{highlightedText.slice(0, 100)}..."</div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Panel de pregunta (lado derecho) */}
      <motion.div 
        className="w-1/2 flex flex-col bg-gradient-to-br from-purple-50 to-pink-50"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <Card className="h-full m-4 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Pregunta de Comprensión</CardTitle>
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Clock className="w-5 h-5 text-orange-600" />
                {Math.floor(tiempoRestante / 60)}:{(tiempoRestante % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            {/* Enunciado de la pregunta */}
            <div className="mb-6 p-4 bg-white rounded-lg border-l-4 border-purple-500">
              <ReactMarkdown className="prose prose-sm max-w-none">
                {pregunta.enunciado}
              </ReactMarkdown>
            </div>
            
            {/* Alternativas */}
            <div className="flex-1 space-y-3">
              {pregunta.alternativas.map((alternativa, index) => (
                <motion.div
                  key={alternativa.letra}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Button
                    variant={respuestaSeleccionada === alternativa.letra ? "default" : "outline"}
                    className={`w-full text-left p-4 h-auto justify-start transition-all duration-200 ${
                      respuestaSeleccionada === alternativa.letra 
                        ? "bg-purple-500 text-white shadow-lg scale-[1.02]" 
                        : "hover:bg-purple-50 hover:border-purple-300"
                    }`}
                    onClick={() => handleSeleccionRespuesta(alternativa.letra)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        respuestaSeleccionada === alternativa.letra 
                          ? "bg-white text-purple-500" 
                          : "bg-purple-100 text-purple-700"
                      }`}>
                        {alternativa.letra}
                      </div>
                      <div className="flex-1 text-sm">
                        <ReactMarkdown className="prose prose-sm max-w-none">
                          {alternativa.contenido}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
            
            {/* Consejo contextual */}
            {porcentajeLectura < 70 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <strong>Sugerencia:</strong> Asegúrate de leer todo el texto antes de responder. 
                    Has cubierto el {Math.round(porcentajeLectura)}% del contenido.
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Botones de acción */}
            <div className="flex gap-3 mt-6">
              {permitirRetroceder && (
                <Button variant="outline" className="flex-1">
                  ← Anterior
                </Button>
              )}
              <Button 
                onClick={handleConfirmarRespuesta}
                disabled={!respuestaSeleccionada}
                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                Confirmar respuesta
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
