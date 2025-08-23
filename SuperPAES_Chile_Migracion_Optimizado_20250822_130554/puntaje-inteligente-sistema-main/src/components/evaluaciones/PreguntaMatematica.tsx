/* eslint-disable react-refresh/only-export-components */

import React, { useState, useRef } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../../types/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  Calculator, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  BookOpen,
  Clock,
  Lightbulb,
  Grid3X3
} from "lucide-react";
import { MathJax, MathJaxContext } from 'better-react-mathjax';

interface PreguntaMatematicaProps {
  pregunta: {
    id: string;
    enunciado: string;
    imagen_principal_url?: string;
    imagen_secundaria_url?: string;
    datos_tabla?: unknown;
    formulas_relevantes?: string[];
    unidades_trabajo?: string;
    tipo_grafico?: 'funcion' | 'estadistico' | 'geometrico' | 'cientifico';
    variables_involucradas?: string[];
    alternativas: Array<{
      letra: string;
      contenido: string;
      es_correcta: boolean;
    }>;
  };
  onRespuesta: (respuesta: string, analytics: unknown) => void;
  tiempoRestante: number;
  mostrarCalculadora?: boolean;
}

const CalculadoraCientifica: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [memoria, setMemoria] = useState(0);

  const botones = [
    ['C', 'Â±', '%', 'Ã·'],
    ['7', '8', '9', 'Ã—'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  const manejarClick = (valor: string) => {
    // LÃ³gica bÃ¡sica de calculadora
    if (valor === 'C') {
      setDisplay('0');
    } else if (valor === '=') {
      try {
        const resultado = eval(display.replace('Ã—', '*').replace('Ã·', '/'));
        setDisplay(resultado.toString());
      } catch {
        setDisplay('Error');
      }
    } else {
      setDisplay(prev => prev === '0' ? valor : prev + valor);
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <div className="bg-black text-green-400 p-3 rounded mb-3 text-right text-xl font-mono">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {botones.flat().map((boton, index) => (
          <Button
            key={index}
            variant={['C', 'Â±', '%', 'Ã·', 'Ã—', '-', '+', '='].includes(boton) ? "secondary" : "outline"}
            className="h-12 text-lg"
            onClick={() => manejarClick(boton)}
          >
            {boton}
          </Button>
        ))}
      </div>
    </div>
  );
};

export const PreguntaMatematica: React.FC<PreguntaMatematicaProps> = ({
  pregunta,
  onRespuesta,
  tiempoRestante,
  mostrarCalculadora = false
}) => {
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showCalculadora, setShowCalculadora] = useState(false);
  const [showFormulas, setShowFormulas] = useState(false);
  const [showDatos, setShowDatos] = useState(false);
  const [anotaciones, setAnotaciones] = useState<Array<{x: number, y: number, text: string}>>([]);
  const [tiempoInteraccion, setTiempoInteraccion] = useState(0);
  
  const imagenRef = useRef<HTMLImageElement>(null);
  const inicioRef = useRef<Date>(new Date());

  const handleImageZoom = (factor: number) => {
    setZoomLevel(prev => Math.max(0.5, Math.min(3, prev * factor)));
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imagenRef.current) return;
    
    const rect = imagenRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Agregar anotaciÃ³n simple
    const nuevaAnotacion = {
      x, y,
      text: `Punto (${Math.round(x)}, ${Math.round(y)})`
    };
    
    setAnotaciones(prev => [...prev, nuevaAnotacion]);
  };

  const handleConfirmarRespuesta = () => {
    if (!respuestaSeleccionada) return;

    const analytics = {
      tiempo_interaccion_segundos: Math.floor((Date.now() - inicioRef.current.getTime()) / 1000),
      zoom_utilizado: zoomLevel !== 1,
      nivel_zoom_maximo: zoomLevel,
      calculadora_usada: showCalculadora,
      formulas_consultadas: showFormulas,
      datos_consultados: showDatos,
      anotaciones_realizadas: anotaciones.length,
      herramientas_utilizadas: [
        zoomLevel !== 1 && 'zoom',
        showCalculadora && 'calculadora',
        showFormulas && 'formulas',
        showDatos && 'datos'
      ].filter(Boolean)
    };

    onRespuesta(respuestaSeleccionada, analytics);
  };

  return (
    <MathJaxContext>
      <div className="pregunta-matematica h-screen flex">
        {/* Panel visual principal */}
        <motion.div 
          className="w-2/3 flex flex-col bg-gradient-to-br from-green-50 to-emerald-50"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card className="h-full m-4 shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Grid3X3 className="w-5 h-5 text-green-600" />
                  Contenido Visual
                  {pregunta.tipo_grafico && (
                    <Badge variant="secondary">{pregunta.tipo_grafico}</Badge>
                  )}
                </CardTitle>
                
                {/* Herramientas de imagen */}
                {pregunta.imagen_principal_url && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleImageZoom(1.2)}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleImageZoom(0.8)}
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setZoomLevel(1)}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Badge variant="outline">
                      Zoom: {Math.round(zoomLevel * 100)}%
                    </Badge>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              {/* Imagen principal con zoom y anotaciones */}
              {pregunta.imagen_principal_url && (
                <div className="flex-1 overflow-auto bg-white rounded-lg border p-4">
                  <div
                    className="relative inline-block transition-transform duration-200 dynamic-scale"
                    data-scale={zoomLevel}
                  >
                    <img 
                      ref={imagenRef}
                      src={pregunta.imagen_principal_url} 
                      alt="GrÃ¡fico matemÃ¡tico"
                      className="max-w-full h-auto cursor-crosshair"
                      onClick={handleImageClick}
                    />
                    
                    {/* Overlay de anotaciones */}
                    {anotaciones.map((anotacion, index) => (
                      <div
                        key={index}
                        className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 dynamic-particle"
                        data-left={anotacion.x}
                        data-top={anotacion.y}
                        title={anotacion.text}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Tabla de datos si existe */}
              {pregunta.datos_tabla && (
                <motion.div 
                  className="mt-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <Button
                    variant="outline"
                    onClick={() => setShowDatos(!showDatos)}
                    className="mb-2"
                  >
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    {showDatos ? 'Ocultar' : 'Mostrar'} Datos
                  </Button>
                  
                  <AnimatePresence>
                    {showDatos && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white rounded-lg p-4 border overflow-auto"
                      >
                        <h4 className="font-semibold mb-2">Datos:</h4>
                        <table className="w-full border-collapse border border-gray-300">
                          {Object.entries(pregunta.datos_tabla).map(([key, value]) => (
                            <tr key={key} className="border border-gray-300">
                              <td className="border border-gray-300 p-2 bg-gray-50 font-medium">{key}</td>
                              <td className="border border-gray-300 p-2">
                                {Array.isArray(value) ? value.join(', ') : String(value)}
                              </td>
                            </tr>
                          ))}
                        </table>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Panel de pregunta y herramientas */}
        <motion.div 
          className="w-1/3 flex flex-col bg-gradient-to-br from-blue-50 to-cyan-50"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <Card className="h-full m-4 shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Pregunta MatemÃ¡tica</CardTitle>
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Clock className="w-5 h-5 text-orange-600" />
                  {Math.floor(tiempoRestante / 60)}:{(tiempoRestante % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col space-y-4">
              {/* Enunciado con MathJax */}
              <div className="p-4 bg-white rounded-lg border-l-4 border-blue-500">
                <MathJax>
                  <div dangerouslySetInnerHTML={{ __html: pregunta.enunciado }} />
                </MathJax>
              </div>
              
              {/* Herramientas matemÃ¡ticas */}
              <div className="space-y-3">
                {/* FÃ³rmulas Ãºtiles */}
                {pregunta.formulas_relevantes && pregunta.formulas_relevantes.length > 0 && (
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFormulas(!showFormulas)}
                      className="w-full justify-start"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      FÃ³rmulas Ãºtiles
                    </Button>
                    
                    <AnimatePresence>
                      {showFormulas && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 p-3 bg-blue-50 rounded-lg border"
                        >
                          {pregunta.formulas_relevantes.map((formula, index) => (
                            <div key={index} className="mb-2">
                              <MathJax>
                                <div dangerouslySetInnerHTML={{ __html: formula }} />
                              </MathJax>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                
                {/* Calculadora */}
                {mostrarCalculadora && (
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCalculadora(!showCalculadora)}
                      className="w-full justify-start"
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculadora cientÃ­fica
                    </Button>
                    
                    <AnimatePresence>
                      {showCalculadora && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2"
                        >
                          <CalculadoraCientifica />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                
                {/* InformaciÃ³n de unidades */}
                {pregunta.unidades_trabajo && (
                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="flex items-center gap-2 text-sm">
                      <Lightbulb className="w-4 h-4 text-yellow-600" />
                      <strong>Unidades:</strong> {pregunta.unidades_trabajo}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Alternativas */}
              <div className="flex-1 space-y-2">
                {pregunta.alternativas.map((alternativa, index) => (
                  <motion.div
                    key={alternativa.letra}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Button
                      variant={respuestaSeleccionada === alternativa.letra ? "default" : "outline"}
                      className={`w-full text-left p-3 h-auto justify-start transition-all duration-200 ${
                        respuestaSeleccionada === alternativa.letra 
                          ? "bg-blue-500 text-white shadow-lg" 
                          : "hover:bg-blue-50 hover:border-blue-300"
                      }`}
                      onClick={() => setRespuestaSeleccionada(alternativa.letra)}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                          respuestaSeleccionada === alternativa.letra 
                            ? "bg-white text-blue-500" 
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {alternativa.letra}
                        </div>
                        <div className="flex-1">
                          <MathJax>
                            <div dangerouslySetInnerHTML={{ __html: alternativa.contenido }} />
                          </MathJax>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
              
              {/* BotÃ³n de confirmaciÃ³n */}
              <Button 
                onClick={handleConfirmarRespuesta}
                disabled={!respuestaSeleccionada}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                Confirmar respuesta
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MathJaxContext>
  );
};


