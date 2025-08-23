/* eslint-disable react-refresh/only-export-components */

import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { 
  HelpCircle, Search, BookOpen, Target, Brain, 
  MessageCircle, Video, FileText, ExternalLink,
  ChevronDown, ChevronRight, Star, Users
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'Â¿CÃ³mo funciona el sistema de diagnÃ³stico PAES?',
    answer: 'El sistema de diagnÃ³stico utiliza inteligencia artificial para evaluar tu nivel actual en cada materia PAES. Realiza preguntas adaptativas que se ajustan a tu rendimiento en tiempo real, proporcionando una evaluaciÃ³n precisa de tus fortalezas y Ã¡reas a mejorar.',
    category: 'DiagnÃ³stico',
    helpful: 45
  },
  {
    id: '2',
    question: 'Â¿QuÃ© es LectoGuÃ­a y cÃ³mo me ayuda?',
    answer: 'LectoGuÃ­a es nuestro asistente de IA especializado en comprensiÃ³n lectora. Te ayuda a analizar textos complejos, identificar ideas principales, y desarrollar estrategias de lectura especÃ­ficas para la PAES de Competencia Lectora.',
    category: 'LectoGuÃ­a',
    helpful: 38
  },
  {
    id: '3',
    question: 'Â¿CÃ³mo interpreto mi puntaje proyectado?',
    answer: 'Tu puntaje proyectado se calcula basÃ¡ndose en tu rendimiento actual, progreso de estudio y anÃ¡lisis predictivo. Es una estimaciÃ³n que se actualiza constantemente conforme avanzas en tu preparaciÃ³n.',
    category: 'Puntajes',
    helpful: 52
  },
  {
    id: '4',
    question: 'Â¿Puedo cambiar mi plan de estudio?',
    answer: 'SÃ­, tu plan de estudio es completamente personalizable. Puedes ajustar horarios, prioridades de materias, y objetivos en cualquier momento desde la secciÃ³n de planificaciÃ³n.',
    category: 'Planes',
    helpful: 29
  },
  {
    id: '5',
    question: 'Â¿CÃ³mo funcionan los ejercicios adaptativos?',
    answer: 'Los ejercicios adaptativos se ajustan automÃ¡ticamente a tu nivel de conocimiento. Si respondes correctamente, la dificultad aumenta; si tienes errores, el sistema proporciona ejercicios de refuerzo para fortalecer conceptos base.',
    category: 'Ejercicios',
    helpful: 41
  }
];

const categories = ['Todas', 'DiagnÃ³stico', 'LectoGuÃ­a', 'Puntajes', 'Planes', 'Ejercicios'];

export const HelpCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="h-full p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Centro de Ayuda PAES</h1>
        </div>
        <p className="text-cyan-400 max-w-2xl mx-auto">
          Encuentra respuestas a tus preguntas sobre el sistema de preparaciÃ³n PAES.
          Nuestro equipo estÃ¡ aquÃ­ para ayudarte a maximizar tu rendimiento.
        </p>
      </motion.div>

      {/* BÃºsqueda y Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar en preguntas frecuentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category 
                ? "bg-gradient-to-r from-cyan-600 to-blue-600" 
                : "border-white/20 text-white hover:bg-white/10"
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Acciones RÃ¡pidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          {
            title: 'GuÃ­a de Inicio',
            description: 'Primeros pasos en el sistema',
            icon: BookOpen,
            color: 'from-green-500 to-teal-500'
          },
          {
            title: 'Tutoriales en Video',
            description: 'Aprende viendo paso a paso',
            icon: Video,
            color: 'from-purple-500 to-pink-500'
          },
          {
            title: 'Contactar Soporte',
            description: 'Habla con nuestro equipo',
            icon: MessageCircle,
            color: 'from-orange-500 to-red-500'
          }
        ].map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{action.title}</h3>
                  <p className="text-gray-300 text-sm">{action.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Preguntas Frecuentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <HelpCircle className="w-5 h-5 mr-2 text-cyan-400" />
              Preguntas Frecuentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No se encontraron preguntas que coincidan con tu bÃºsqueda.</p>
              </div>
            ) : (
              filteredFAQs.map((faq) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border border-white/10 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full p-4 text-left bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                        {faq.category}
                      </Badge>
                      <span className="text-white font-medium">{faq.question}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 text-sm text-gray-400">
                        <Star className="w-3 h-3" />
                        <span>{faq.helpful}</span>
                      </div>
                      {expandedFAQ === faq.id ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedFAQ === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-white/5 border-t border-white/10">
                          <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                              Â¿Te fue Ãºtil esta respuesta?
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10">
                                SÃ­
                              </Button>
                              <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                                No
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recursos Adicionales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-cyan-400" />
              Recursos Educativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Manual del Usuario PAES', type: 'PDF', size: '2.3 MB' },
                { title: 'Estrategias de Estudio Efectivo', type: 'PDF', size: '1.8 MB' },
                { title: 'GuÃ­a de ComprensiÃ³n Lectora', type: 'PDF', size: '3.1 MB' },
                { title: 'Tips para Maximizar Puntaje', type: 'PDF', size: '1.5 MB' }
              ].map((resource, index) => (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="text-white font-medium">{resource.title}</div>
                      <div className="text-sm text-gray-400">{resource.type} â€¢ {resource.size}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

