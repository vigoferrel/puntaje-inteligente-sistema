
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, HelpCircle, Book, Users, Settings, Zap, 
  ChevronDown, ChevronRight, MessageCircle, Star,
  Target, Brain, Calendar, Award, ArrowRight
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  popular: boolean;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: '¿Cómo funciona el sistema de progreso?',
    answer: 'Tu progreso se calcula basándose en los ejercicios completados, tiempo de estudio y rendimiento en evaluaciones. Cada materia tiene nodos de conocimiento que debes dominar para avanzar.',
    category: 'progreso',
    popular: true
  },
  {
    id: '2',
    question: '¿Qué es la proyección PAES?',
    answer: 'La proyección PAES es una estimación de tu puntaje esperado basada en tu rendimiento actual. Se actualiza automáticamente conforme mejoras en cada materia.',
    category: 'evaluacion',
    popular: true
  },
  {
    id: '3',
    question: '¿Cómo uso LectoGuía IA?',
    answer: 'LectoGuía es tu asistente de comprensión lectora. Puedes enviarle textos para análisis, hacer preguntas sobre lecturas, y recibir explicaciones personalizadas.',
    category: 'herramientas',
    popular: true
  },
  {
    id: '4',
    question: '¿Puedo estudiar sin conexión?',
    answer: 'Algunas funciones están disponibles offline, pero necesitas conexión para sincronizar progreso, acceder a nuevos ejercicios y usar la IA.',
    category: 'tecnico',
    popular: false
  },
  {
    id: '5',
    question: '¿Cómo se organizan las materias?',
    answer: 'Cada materia PAES está dividida en temas específicos con ejercicios graduales. Puedes seguir la ruta sugerida o elegir temas según tus necesidades.',
    category: 'materias',
    popular: true
  },
  {
    id: '6',
    question: '¿Qué significa el nivel neural?',
    answer: 'El nivel neural indica tu dominio general del sistema. Aumenta conforme completas ejercicios, mejoras en evaluaciones y mantienes una racha de estudio.',
    category: 'progreso',
    popular: false
  },
  {
    id: '7',
    question: '¿Cómo interpretar las métricas del dashboard?',
    answer: 'El dashboard muestra tu progreso por materia, proyección PAES, racha de estudio y nivel neural. Los colores indican tu estado: verde=bueno, amarillo=regular, rojo=necesita atención.',
    category: 'dashboard',
    popular: true
  },
  {
    id: '8',
    question: '¿Puedo resetear mi progreso?',
    answer: 'Puedes reiniciar el progreso de materias específicas desde configuración, pero se recomienda continuar desde donde dejaste para mantener tu historial de aprendizaje.',
    category: 'configuracion',
    popular: false
  }
];

const categories = [
  { id: 'todos', name: 'Todas las categorías', icon: HelpCircle, color: '#00FFFF' },
  { id: 'progreso', name: 'Progreso y Niveles', icon: Target, color: '#00FF88' },
  { id: 'evaluacion', name: 'Evaluaciones', icon: Award, color: '#FF8800' },
  { id: 'herramientas', name: 'Herramientas IA', icon: Brain, color: '#8833FF' },
  { id: 'materias', name: 'Materias PAES', icon: Book, color: '#FF3366' },
  { id: 'dashboard', name: 'Dashboard', icon: Star, color: '#FFAA00' },
  { id: 'tecnico', name: 'Soporte Técnico', icon: Settings, color: '#666666' },
  { id: 'configuracion', name: 'Configuración', icon: Settings, color: '#999999' }
];

export const HelpCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="h-full p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="bg-gradient-to-r from-black/40 via-purple-900/40 to-black/40 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/30">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <HelpCircle className="w-8 h-8 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-white mb-2">Centro de Ayuda</h1>
          <p className="text-cyan-400 mb-6">Encuentra respuestas a tus dudas sobre PAES Command</p>
          
          {/* Buscador */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar en preguntas frecuentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Estadísticas rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Preguntas Frecuentes', value: faqData.length, icon: MessageCircle },
          { label: 'Categorías', value: categories.length - 1, icon: Book },
          { label: 'Respuestas Populares', value: faqData.filter(f => f.popular).length, icon: Star },
          { label: 'Soporte 24/7', value: 'Activo', icon: Zap }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-white/10">
                <CardContent className="p-4 text-center">
                  <Icon className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categorías */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-white/10">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-white mb-4">Categorías</h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.id;
                  const count = category.id === 'todos' 
                    ? faqData.length 
                    : faqData.filter(f => f.category === category.id).length;
                  
                  return (
                    <Button
                      key={category.id}
                      variant={isSelected ? "default" : "ghost"}
                      className={`w-full justify-start h-auto p-3 ${
                        isSelected 
                          ? 'bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-500/50' 
                          : 'text-white hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <Icon 
                        className="w-4 h-4 mr-3" 
                        style={{ color: isSelected ? category.color : '#94a3b8' }} 
                      />
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium">{category.name}</div>
                        <div className="text-xs opacity-70">{count} preguntas</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lista de FAQs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-3"
        >
          <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  Preguntas Frecuentes
                </h3>
                <Badge className="bg-cyan-600/20 text-cyan-400 border border-cyan-500/50">
                  {filteredFAQs.length} resultados
                </Badge>
              </div>

              {filteredFAQs.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white mb-2">
                    No se encontraron resultados
                  </h4>
                  <p className="text-gray-400">
                    Intenta con otros términos de búsqueda o selecciona una categoría diferente.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFAQs.map((faq, index) => {
                    const isExpanded = expandedItems.includes(faq.id);
                    const categoryData = categories.find(c => c.id === faq.category);
                    
                    return (
                      <motion.div
                        key={faq.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="border border-white/10 rounded-lg overflow-hidden hover:border-cyan-500/30 transition-all"
                      >
                        <Button
                          variant="ghost"
                          className="w-full h-auto p-4 text-left justify-start hover:bg-white/5"
                          onClick={() => toggleExpanded(faq.id)}
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-white font-medium">{faq.question}</span>
                                {faq.popular && (
                                  <Badge className="bg-yellow-600/20 text-yellow-400 text-xs">
                                    <Star className="w-3 h-3 mr-1" />
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                {categoryData && (
                                  <Badge 
                                    className="text-xs"
                                    style={{ 
                                      backgroundColor: `${categoryData.color}20`,
                                      color: categoryData.color,
                                      borderColor: `${categoryData.color}50`
                                    }}
                                  >
                                    {categoryData.name}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </Button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t border-white/10"
                            >
                              <div className="p-4 bg-white/5">
                                <p className="text-gray-300 leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Contacto adicional */}
              <div className="mt-8 p-4 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 rounded-lg border border-cyan-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium mb-1">
                      ¿No encontraste lo que buscabas?
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Contáctanos para obtener ayuda personalizada
                    </p>
                  </div>
                  <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contactar Soporte
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
