﻿/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Calendar,
  Target,
  FileText,
  DollarSign,
  Users,
  Trophy
} from 'lucide-react';

export const CinematicTimeline: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const timelineEvents = [
    {
      date: "6 Enero 2025",
      title: "Resultados PAES",
      description: "PublicaciÃ³n oficial de resultados",
      status: "completed",
      priority: "critical",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500"
    },
    {
      date: "6-9 Enero 2025", 
      title: "Postulaciones Universidades",
      description: "Solo 4 dÃ­as para postular",
      status: "active",
      priority: "critical",
      icon: Target,
      color: "from-red-500 to-orange-500"
    },
    {
      date: "20 Enero 2025",
      title: "Resultados SelecciÃ³n",
      description: "ConfirmaciÃ³n de cupos universitarios",
      status: "upcoming",
      priority: "critical",
      icon: FileText,
      color: "from-blue-500 to-cyan-500"
    },
    {
      date: "13 Marzo 2025",
      title: "Cierre FUAS",
      description: "Ãšltima oportunidad para beneficios",
      status: "upcoming",
      priority: "critical",
      icon: DollarSign,
      color: "from-purple-500 to-pink-500"
    },
    {
      date: "21 Abril 2025",
      title: "VerificaciÃ³n RSH",
      description: "Nivel socioeconÃ³mico confirmado",
      status: "upcoming",
      priority: "important",
      icon: Users,
      color: "from-indigo-500 to-violet-500"
    },
    {
      date: "28 Mayo 2025",
      title: "AsignaciÃ³n Final Becas",
      description: "ConfirmaciÃ³n definitiva de beneficios",
      status: "upcoming",
      priority: "critical",
      icon: Trophy,
      color: "from-yellow-500 to-amber-500"
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-green-400 border-green-400';
      case 'active': return 'text-red-400 border-red-400 animate-pulse';
      case 'upcoming': return 'text-blue-400 border-blue-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'important': return 'bg-yellow-500 text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
          <Clock className="w-8 h-8 mr-3 text-orange-400" />
          Timeline CrÃ­tico PAES 2025
        </h2>
        <p className="text-orange-200">
          Fechas clave que no puedes fallar
        </p>
      </motion.div>

      <div className="relative">
        {/* LÃ­nea temporal principal */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 via-red-500 to-purple-500 rounded-full opacity-60"></div>

        <div className="space-y-6">
          {timelineEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Punto en la lÃ­nea temporal */}
              <div className={`absolute left-6 w-6 h-6 rounded-full border-4 bg-black ${getStatusColor(event.status)} flex items-center justify-center z-10`}>
                <event.icon className="w-3 h-3" />
              </div>

              {/* Tarjeta del evento */}
              <Card 
                className={`ml-16 bg-black/60 backdrop-blur-lg border-white/20 cursor-pointer transition-all duration-300 hover:border-orange-400/50 hover:shadow-2xl ${
                  selectedDate === event.date ? 'border-orange-400 shadow-2xl shadow-orange-500/20' : ''
                }`}
                onClick={() => setSelectedDate(selectedDate === event.date ? null : event.date)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{event.title}</h3>
                        <Badge className={getPriorityBadge(event.priority)}>
                          {event.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-gray-300 mb-2">{event.description}</p>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-300 font-medium">{event.date}</span>
                      </div>
                    </div>
                    
                    <div className={`w-4 h-4 rounded-full ${
                      event.status === 'completed' ? 'bg-green-400' :
                      event.status === 'active' ? 'bg-red-400 animate-pulse' :
                      'bg-blue-400'
                    }`}></div>
                  </div>

                  {/* InformaciÃ³n adicional expandible */}
                  <motion.div
                    initial={false}
                    animate={{ height: selectedDate === event.date ? 'auto' : 0, opacity: selectedDate === event.date ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    {selectedDate === event.date && (
                      <div className={`mt-4 p-4 bg-gradient-to-r ${event.color} bg-opacity-20 rounded-lg border border-white/10`}>
                        <h4 className="text-white font-bold mb-2">Detalles Importantes:</h4>
                        
                        {event.title === "Postulaciones Universidades" && (
                          <ul className="text-white/90 text-sm space-y-1">
                            <li>â€¢ Solo 4 dÃ­as para completar postulaciones</li>
                            <li>â€¢ MÃ¡ximo 10 carreras por estudiante</li>
                            <li>â€¢ Verificar ponderaciones especÃ­ficas</li>
                            <li>â€¢ Confirmar requisitos adicionales</li>
                          </ul>
                        )}
                        
                        {event.title === "Cierre FUAS" && (
                          <ul className="text-white/90 text-sm space-y-1">
                            <li>â€¢ Ãšltima oportunidad para beneficios 2025</li>
                            <li>â€¢ Completar formulario antes de 14:00 hrs</li>
                            <li>â€¢ Verificar informaciÃ³n familiar actualizada</li>
                            <li>â€¢ Documentar situaciones especiales</li>
                          </ul>
                        )}
                        
                        {event.title === "AsignaciÃ³n Final Becas" && (
                          <ul className="text-white/90 text-sm space-y-1">
                            <li>â€¢ ConfirmaciÃ³n definitiva de todos los beneficios</li>
                            <li>â€¢ Revisar montos asignados</li>
                            <li>â€¢ Proceder con matrÃ­culas</li>
                            <li>â€¢ Preparar documentaciÃ³n para renovaciÃ³n</li>
                          </ul>
                        )}

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-white/70 text-xs">
                            {event.status === 'completed' ? 'âœ… Completado' :
                             event.status === 'active' ? 'ðŸ”¥ En curso' :
                             'â³ PrÃ³ximo'}
                          </span>
                          {event.priority === 'critical' && (
                            <div className="flex items-center space-x-1">
                              <AlertCircle className="w-4 h-4 text-red-400" />
                              <span className="text-red-300 text-xs font-bold">CRÃTICO</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contador de dÃ­as crÃ­ticos */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-8"
      >
        <Card className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-400/30">
          <CardContent className="p-6 text-center">
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 mr-2 text-red-400" />
              Alerta CrÃ­tica: FUAS
            </h3>
            <div className="text-4xl font-bold text-red-400 mb-2">45 dÃ­as</div>
            <p className="text-red-200">restantes para cierre FUAS (13 Marzo 2025)</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

