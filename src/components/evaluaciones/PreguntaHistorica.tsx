import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Scroll, 
  Map, 
  Calendar, 
  Users, 
  MapPin,
  Clock,
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { SafeMarkdown } from '@/components/shared/SafeMarkdown';

interface TimelineEvent {
  año: number;
  evento: string;
  descripcion?: string;
  importancia?: 'alta' | 'media' | 'baja';
}

interface TimelineComponentProps {
  eventos: TimelineEvent[];
}

const TimelineComponent: React.FC<TimelineComponentProps> = ({ eventos }) => {
  return (
    <div className="relative">
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 to-amber-600"></div>
      
      {eventos.map((evento, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative flex items-start mb-6"
        >
          <div className="absolute left-4 w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow-lg z-10"></div>
          
          <div className="ml-12 bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={
                evento.importancia === 'alta' ? 'destructive' :
                evento.importancia === 'media' ? 'secondary' : 'outline'
              }>
                {evento.año}
              </Badge>
              {evento.importancia === 'alta' && (
                <Badge variant="destructive" className="text-xs">Clave</Badge>
              )}
            </div>
            <h4 className="font-semibold text-sm">{evento.evento}</h4>
            {evento.descripcion && (
              <p className="text-xs text-muted-foreground mt-1">{evento.descripcion}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

interface PreguntaHistoricaProps {
  pregunta: {
    id: string;
    enunciado: string;
    documento_fuente?: string;
    tipo_documento?: string;
    mapa_imagen_url?: string;
    cronologia?: {
      eventos: TimelineEvent[];
    };
    contexto_historico?: string;
    personajes_involucrados?: string[];
    lugares_geograficos?: string[];
    periodo_historico?: string;
    alternativas: Array<{
      letra: string;
      contenido: string;
      es_correcta: boolean;
    }>;
  };
  onRespuesta: (respuesta: string, analytics: any) => void;
  tiempoRestante: number;
}

export const PreguntaHistorica: React.FC<PreguntaHistoricaProps> = ({
  pregunta,
  onRespuesta,
  tiempoRestante
}) => {
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'documento' | 'mapa' | 'cronologia'>('documento');
  const [showContexto, setShowContexto] = useState(false);
  const [tiempoInteraccion, setTiempoInteraccion] = useState<Record<string, number>>({});
  
  const inicioRef = React.useRef<Date>(new Date());
  const tabStartRef = React.useRef<Date>(new Date());

  const handleTabChange = (newTab: 'documento' | 'mapa' | 'cronologia') => {
    const ahora = new Date();
    const tiempoEnTab = ahora.getTime() - tabStartRef.current.getTime();
    
    setTiempoInteraccion(prev => ({
      ...prev,
      [activeTab]: (prev[activeTab] || 0) + tiempoEnTab
    }));
    
    setActiveTab(newTab);
    tabStartRef.current = ahora;
  };

  const handleConfirmarRespuesta = () => {
    if (!respuestaSeleccionada) return;

    const ahora = new Date();
    const tiempoEnTabActual = ahora.getTime() - tabStartRef.current.getTime();
    const tiempoFinal = {
      ...tiempoInteraccion,
      [activeTab]: (tiempoInteraccion[activeTab] || 0) + tiempoEnTabActual
    };

    const analytics = {
      tiempo_total_segundos: Math.floor((ahora.getTime() - inicioRef.current.getTime()) / 1000),
      tiempo_por_recurso: tiempoFinal,
      recursos_utilizados: Object.keys(tiempoFinal),
      tab_principal: Object.entries(tiempoFinal).reduce((a, b) => 
        tiempoFinal[a[0]] > tiempoFinal[b[0]] ? a : b
      )[0],
      contexto_consultado: showContexto,
      estrategia_navegacion: activeTab
    };

    onRespuesta(respuestaSeleccionada, analytics);
  };

  const tabsDisponibles = [
    pregunta.documento_fuente && { id: 'documento', label: 'Documento', icon: Scroll },
    pregunta.mapa_imagen_url && { id: 'mapa', label: 'Mapa', icon: Map },
    pregunta.cronologia && { id: 'cronologia', label: 'Cronología', icon: Calendar }
  ].filter(Boolean) as Array<{ id: 'documento' | 'mapa' | 'cronologia', label: string, icon: any }>;

  return (
    <div className="pregunta-historica h-screen flex">
      {/* Panel de recursos históricos */}
      <motion.div 
        className="w-2/3 flex flex-col bg-gradient-to-br from-amber-50 to-orange-50"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="h-full m-4 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Scroll className="w-5 h-5 text-amber-600" />
                  Recursos Históricos
                  {pregunta.periodo_historico && (
                    <Badge variant="secondary">{pregunta.periodo_historico}</Badge>
                  )}
                </CardTitle>
                
                {/* Información de contexto */}
                <div className="flex gap-2 mt-2">
                  {pregunta.personajes_involucrados && pregunta.personajes_involucrados.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      {pregunta.personajes_involucrados.length} personajes
                    </div>
                  )}
                  {pregunta.lugares_geograficos && pregunta.lugares_geograficos.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {pregunta.lugares_geograficos.length} lugares
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            {/* Tabs de navegación de recursos */}
            <Tabs value={activeTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3">
                {tabsDisponibles.map((tab) => (
                  <TabsTrigger 
                    key={tab.id}
                    value={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className="flex items-center gap-2"
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {/* Contenido del documento */}
              {pregunta.documento_fuente && (
                <TabsContent value="documento" className="flex-1 overflow-hidden">
                  <div className="h-full flex flex-col">
                    <div className="mb-3">
                      <h4 className="font-semibold">{pregunta.tipo_documento || 'Documento histórico'}</h4>
                      {pregunta.periodo_historico && (
                        <p className="text-sm text-muted-foreground">{pregunta.periodo_historico}</p>
                      )}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto bg-white p-4 rounded-lg border border-amber-200">
                      <blockquote className="border-l-4 border-amber-500 pl-4 italic text-justify leading-relaxed">
                        <SafeMarkdown>{pregunta.documento_fuente}</SafeMarkdown>
                      </blockquote>
                    </div>
                    
                    {/* Información adicional del documento */}
                    {(pregunta.personajes_involucrados || pregunta.lugares_geograficos) && (
                      <div className="mt-3 p-3 bg-amber-50 rounded-lg border">
                        {pregunta.personajes_involucrados && (
                          <div className="mb-2">
                            <div className="flex items-center gap-1 text-sm font-medium mb-1">
                              <Users className="w-4 h-4 text-amber-600" />
                              Personajes mencionados:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {pregunta.personajes_involucrados.map((personaje, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {personaje}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {pregunta.lugares_geograficos && (
                          <div>
                            <div className="flex items-center gap-1 text-sm font-medium mb-1">
                              <MapPin className="w-4 h-4 text-amber-600" />
                              Lugares mencionados:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {pregunta.lugares_geograficos.map((lugar, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {lugar}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}
              
              {/* Contenido del mapa */}
              {pregunta.mapa_imagen_url && (
                <TabsContent value="mapa" className="flex-1">
                  <div className="h-full bg-white rounded-lg border border-amber-200 p-4">
                    <img 
                      src={pregunta.mapa_imagen_url} 
                      alt="Mapa histórico"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </TabsContent>
              )}
              
              {/* Contenido de la cronología */}
              {pregunta.cronologia && (
                <TabsContent value="cronologia" className="flex-1">
                  <div className="h-full overflow-y-auto bg-white rounded-lg border border-amber-200 p-4">
                    <TimelineComponent eventos={pregunta.cronologia.eventos} />
                  </div>
                </TabsContent>
              )}
            </Tabs>
            
            {/* Contexto histórico expandible */}
            {pregunta.contexto_historico && (
              <motion.div className="mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowContexto(!showContexto)}
                  className="w-full justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Contexto histórico
                  </div>
                  {showContexto ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
                
                <AnimatePresence>
                  {showContexto && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-amber-50 rounded-lg p-3 mt-2 text-sm border border-amber-200"
                    >
                      <SafeMarkdown>{pregunta.contexto_historico}</SafeMarkdown>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Panel de pregunta */}
      <motion.div 
        className="w-1/3 flex flex-col bg-gradient-to-br from-red-50 to-pink-50"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <Card className="h-full m-4 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Pregunta Histórica</CardTitle>
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Clock className="w-5 h-5 text-orange-600" />
                {Math.floor(tiempoRestante / 60)}:{(tiempoRestante % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            {/* Enunciado de la pregunta */}
            <div className="mb-6 p-4 bg-white rounded-lg border-l-4 border-red-500">
              <SafeMarkdown className="prose prose-sm max-w-none">
                {pregunta.enunciado}
              </SafeMarkdown>
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
                        ? "bg-red-500 text-white shadow-lg scale-[1.02]" 
                        : "hover:bg-red-50 hover:border-red-300"
                    }`}
                    onClick={() => setRespuestaSeleccionada(alternativa.letra)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        respuestaSeleccionada === alternativa.letra 
                          ? "bg-white text-red-500" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {alternativa.letra}
                      </div>
                      <div className="flex-1 text-sm">
                        <SafeMarkdown className="prose prose-sm max-w-none">
                          {alternativa.contenido}
                        </SafeMarkdown>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
            
            {/* Botón de confirmación */}
            <Button 
              onClick={handleConfirmarRespuesta}
              disabled={!respuestaSeleccionada}
              className="w-full mt-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              Confirmar respuesta
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
