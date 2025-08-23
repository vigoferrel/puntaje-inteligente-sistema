/* eslint-disable react-refresh/only-export-components */
import { FC, useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { 
  GraduationCap, MapPin, Clock, Star, 
  TrendingUp, ExternalLink, Heart, Award
} from 'lucide-react';

interface VocationalRecommendationsProps {
  recomendaciones: unknown;
  onActualizar: () => void;
}

export const VocationalRecommendations: FC<VocationalRecommendationsProps> = ({
  recomendaciones,
  onActualizar
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'principal' | 'alternativas' | 'exploratorias'>('principal');

  if (!recomendaciones) {
    return (
      <div className="text-center py-12">
        <div className="text-white/60">No hay recomendaciones disponibles</div>
        <Button onClick={onActualizar} className="mt-4">
          Generar Recomendaciones
        </Button>
      </div>
    );
  }

  const categorias = {
    principal: {
      title: 'Recomendaciones Principales',
      data: recomendaciones.recomendacionPrincipal,
      color: 'from-green-500 to-emerald-600',
      icon: Star
    },
    alternativas: {
      title: 'Opciones Alternativas',
      data: recomendaciones.opcionesAlternativas,
      color: 'from-blue-500 to-cyan-600',
      icon: TrendingUp
    },
    exploratorias: {
      title: 'Carreras Exploratorias',
      data: recomendaciones.carrerasExploratorias,
      color: 'from-purple-500 to-violet-600',
      icon: Award
    }
  };

  const currentCategory = categorias[selectedCategory];

  return (
    <div className="space-y-8">
      {/* Header con navegaciÃ³n de categorÃ­as */}
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Recomendaciones Vocacionales</h2>
          <p className="text-purple-200">Carreras personalizadas segÃºn tu perfil PAES</p>
        </div>
        
        <Button 
          onClick={onActualizar}
          className="bg-gradient-to-r from-purple-500 to-blue-500"
        >
          Actualizar Recomendaciones
        </Button>
      </motion.div>

      {/* NavegaciÃ³n de CategorÃ­as */}
      <motion.div
        className="flex space-x-2 bg-black/20 backdrop-blur-xl rounded-xl p-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {Object.entries(categorias).map(([key, categoria]) => {
          const Icon = categoria.icon;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as unknown)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                selectedCategory === key 
                  ? `bg-gradient-to-r ${categoria.color} text-white shadow-lg` 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{categoria.title}</span>
              <Badge className="bg-white/20">
                {categoria.data?.length || 0}
              </Badge>
            </button>
          );
        })}
      </motion.div>

      {/* Lista de Carreras */}
      <motion.div
        key={selectedCategory}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {currentCategory.data?.map((carrera: unknown, index: number) => (
          <CareerCard
            key={carrera.nombre}
            carrera={carrera}
            index={index}
            categoryColor={currentCategory.color}
          />
        ))}
      </motion.div>
    </div>
  );
};

const CareerCard: FC<{
  carrera: unknown;
  index: number;
  categoryColor: string;
}> = ({ carrera, index, categoryColor }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border-slate-600/30 hover:border-slate-500/50 transition-all duration-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-white text-xl mb-2">{carrera.nombre}</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-slate-300">
                <div className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  {carrera.universidad}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {carrera.duracion}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-2xl font-bold bg-gradient-to-r ${categoryColor} bg-clip-text text-transparent`}>
                {carrera.compatibilidadGlobal}%
              </div>
              <div className="text-slate-400 text-xs">compatibilidad</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Barra de Compatibilidad */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-300">Compatibilidad General</span>
              <span className="text-sm font-medium text-white">{carrera.compatibilidadGlobal}%</span>
            </div>
            <Progress 
              value={carrera.compatibilidadGlobal} 
              className="h-2 bg-slate-700"
            />
          </div>

          {/* InformaciÃ³n BÃ¡sica */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Puntaje de Corte:</span>
              <span className="text-white font-medium">{carrera.puntajeCorte} pts</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Modalidad:</span>
              <Badge variant="outline" className="border-slate-500 text-slate-300">
                {carrera.modalidad}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">InstituciÃ³n:</span>
              <Badge variant="outline" className="border-slate-500 text-slate-300">
                {carrera.tipoInstitucion}
              </Badge>
            </div>
          </div>

          {/* Fortalezas Alineadas */}
          {carrera.fortalezasAlineadas?.length > 0 && (
            <div className="mb-4">
              <div className="text-sm text-slate-400 mb-2">Fortalezas Alineadas:</div>
              <div className="flex flex-wrap gap-1">
                {carrera.fortalezasAlineadas.slice(0, 3).map((fortaleza: string) => (
                  <Badge 
                    key={fortaleza}
                    className={`bg-gradient-to-r ${categoryColor} text-white text-xs`}
                  >
                    {fortaleza}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* DescripciÃ³n Expandible */}
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 border-t border-slate-600 pt-4"
            >
              <div>
                <div className="text-sm font-medium text-white mb-1">DescripciÃ³n:</div>
                <div className="text-sm text-slate-300">{carrera.descripcionCarrera}</div>
              </div>
              
              {carrera.campoLaboral?.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-white mb-1">Campo Laboral:</div>
                  <div className="flex flex-wrap gap-1">
                    {carrera.campoLaboral.map((campo: string) => (
                      <Badge key={campo} variant="outline" className="border-slate-500 text-slate-300 text-xs">
                        {campo}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {carrera.recomendacionPersonalizada && (
                <div>
                  <div className="text-sm font-medium text-white mb-1">RecomendaciÃ³n Personalizada:</div>
                  <div className="text-sm text-slate-300 italic">{carrera.recomendacionPersonalizada}</div>
                </div>
              )}
            </motion.div>
          )}

          {/* Acciones */}
          <div className="flex space-x-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              {expanded ? 'Menos Info' : 'MÃ¡s Info'}
            </Button>
            
            <Button
              size="sm"
              className={`bg-gradient-to-r ${categoryColor} text-white`}
            >
              <Heart className="w-4 h-4 mr-1" />
              Guardar
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

