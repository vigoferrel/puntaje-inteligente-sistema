import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  MessageSquare,
  X,
  Send,
  Lightbulb,
  BookOpen,
  Target,
  Trophy,
  Brain,
  Music,
  Eye,
  BarChart3,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Search,
  Star,
  PlayCircle,
  FileText,
  Video,
  ExternalLink,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share2,
  Settings
} from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import { useGamification } from '@/hooks/use-gamification';
import { useAIRecommendations } from '@/hooks/use-ai-recommendations';
import { useLocation, useNavigate } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface HelpTopic {
  id: string;
  title: string;
  description: string;
  category: 'getting-started' | 'ai' | 'gamification' | '3d' | 'spotify' | 'analytics' | 'advanced';
  icon: React.ElementType;
  priority: number;
  requiredLevel?: number;
  keywords: string[];
  content: {
    steps?: HelpStep[];
    tips?: string[];
    warnings?: string[];
    relatedTopics?: string[];
    videoUrl?: string;
    externalLinks?: { title: string; url: string }[];
  };
  contextualTriggers?: {
    routes?: string[];
    components?: string[];
    userActions?: string[];
  };
}

interface HelpStep {
  title: string;
  description: string;
  action?: {
    type: 'navigate' | 'highlight' | 'click' | 'input';
    target: string;
    value?: string;
  };
  screenshot?: string;
  interactive?: boolean;
}

interface AIResponse {
  id: string;
  message: string;
  type: 'answer' | 'suggestion' | 'tutorial' | 'warning';
  confidence: number;
  relatedTopics: string[];
  followUpQuestions?: string[];
  codeExamples?: Array<{
    language: string;
    code: string;
    explanation: string;
  }>;
  timestamp: string;
}

interface ConversationContext {
  currentRoute: string;
  userLevel: number;
  recentActions: string[];
  strugglingAreas: string[];
  preferences: {
    helpStyle: 'brief' | 'detailed' | 'tutorial';
    showAnimations: boolean;
    autoSuggest: boolean;
  };
}

// Base de conocimiento de ayuda
const helpTopics: HelpTopic[] = [
  {
    id: 'getting-started',
    title: 'Comenzando con PAES',
    description: 'Aprende los conceptos básicos del sistema PAES',
    category: 'getting-started',
    icon: BookOpen,
    priority: 10,
    keywords: ['inicio', 'comenzar', 'básico', 'tutorial', 'empezar'],
    content: {
      steps: [
        {
          title: 'Navegación Principal',
          description: 'Familiarízate con el menú de navegación lateral',
          action: { type: 'highlight', target: 'navigation-menu' }
        },
        {
          title: 'Dashboard Principal',
          description: 'Explora tu dashboard unificado con todas las métricas',
          action: { type: 'navigate', target: '/' }
        },
        {
          title: 'Configurar Perfil',
          description: 'Personaliza tu experiencia de aprendizaje',
          action: { type: 'navigate', target: '/profile' }
        }
      ],
      tips: [
        'Usa el buscador para encontrar funciones específicas',
        'Las notificaciones te guiarán hacia nuevas funcionalidades',
        'Tu nivel determina qué características están disponibles'
      ]
    },
    contextualTriggers: {
      routes: ['/'],
      userActions: ['first-login', 'new-user']
    }
  },

  {
    id: 'ai-recommendations',
    title: 'Recomendaciones de IA',
    description: 'Cómo funciona el sistema de recomendaciones inteligente',
    category: 'ai',
    icon: Brain,
    priority: 9,
    keywords: ['ia', 'inteligencia artificial', 'recomendaciones', 'personalizado', 'actividades'],
    content: {
      steps: [
        {
          title: 'Acceder a Recomendaciones',
          description: 'Ve al dashboard de IA desde el menú principal',
          action: { type: 'navigate', target: '/ai-recommendations' }
        },
        {
          title: 'Interpretar Recomendaciones',
          description: 'Cada recomendación tiene una puntuación de confianza y razón',
          interactive: true
        },
        {
          title: 'Personalizar Preferencias',
          description: 'Ajusta tus preferencias para mejorar las recomendaciones',
          action: { type: 'navigate', target: '/ai-recommendations?tab=preferences' }
        }
      ],
      tips: [
        'Las recomendaciones mejoran con tu uso del sistema',
        'Puedes marcar recomendaciones como útiles o no útiles',
        'El sistema aprende de tus patrones de estudio'
      ],
      warnings: [
        'Las recomendaciones requieren al menos 3 días de uso para ser precisas'
      ]
    },
    contextualTriggers: {
      routes: ['/ai-recommendations'],
      components: ['AIRecommendationDashboard']
    }
  },

  {
    id: 'gamification-system',
    title: 'Sistema de Gamificación',
    description: 'Logros, niveles y puntuación en PAES',
    category: 'gamification',
    icon: Trophy,
    priority: 8,
    keywords: ['logros', 'puntos', 'nivel', 'gamificacion', 'trofeos', 'ranking'],
    content: {
      steps: [
        {
          title: 'Ver Logros',
          description: 'Accede a tu colección de logros y progreso',
          action: { type: 'navigate', target: '/gamification' }
        },
        {
          title: 'Sistema de Puntos',
          description: 'Comprende cómo ganar y usar puntos',
          interactive: true
        },
        {
          title: 'Rankings y Competición',
          description: 'Compite con otros usuarios en el ranking',
          action: { type: 'highlight', target: 'rankings-section' }
        }
      ],
      tips: [
        'Los logros se desbloquean automáticamente',
        'Mantén tu racha diaria para bonificaciones',
        'Algunos logros desbloquean funciones especiales'
      ]
    },
    contextualTriggers: {
      routes: ['/gamification'],
      components: ['GamificationDashboard'],
      userActions: ['achievement-unlocked', 'level-up']
    }
  },

  {
    id: '3d-holographic',
    title: 'Dashboard 3D Holográfico',
    description: 'Visualizaciones inmersivas en 3D',
    category: '3d',
    icon: Eye,
    priority: 6,
    requiredLevel: 5,
    keywords: ['3d', 'holograma', 'visualizacion', 'inmersivo', 'realidad'],
    content: {
      steps: [
        {
          title: 'Activar Modo 3D',
          description: 'Habilita las visualizaciones holográficas',
          action: { type: 'click', target: '3d-toggle-button' }
        },
        {
          title: 'Navegación 3D',
          description: 'Aprende a navegar en el espacio tridimensional',
          interactive: true
        },
        {
          title: 'Personalizar Vista',
          description: 'Ajusta la configuración de visualización 3D',
          action: { type: 'navigate', target: '/3d-dashboard?settings=true' }
        }
      ],
      tips: [
        'Usa la rueda del ratón para zoom',
        'Arrastra para rotar la vista',
        'Las visualizaciones 3D requieren un navegador moderno'
      ],
      warnings: [
        'Las visualizaciones 3D pueden consumir más batería',
        'Reduce la calidad si experimentas lag'
      ]
    },
    contextualTriggers: {
      routes: ['/3d-dashboard'],
      components: ['Holographic3DDashboard']
    }
  },

  {
    id: 'spotify-integration',
    title: 'Integración Spotify PAES',
    description: 'Música adaptativa para estudiar',
    category: 'spotify',
    icon: Music,
    priority: 7,
    keywords: ['spotify', 'musica', 'estudio', 'concentracion', 'playlist'],
    content: {
      steps: [
        {
          title: 'Conectar Spotify',
          description: 'Vincula tu cuenta de Spotify al sistema PAES',
          action: { type: 'navigate', target: '/spotify-integration?connect=true' }
        },
        {
          title: 'Sesiones Musicales',
          description: 'Inicia sesiones de estudio con música adaptativa',
          interactive: true
        },
        {
          title: 'Personalizar Playlists',
          description: 'Ajusta las preferencias musicales por materia',
          action: { type: 'navigate', target: '/spotify/playlists' }
        }
      ],
      tips: [
        'La música se adapta a tu nivel de concentración',
        'Diferentes materias tienen estilos musicales optimizados',
        'Puedes pausar automáticamente en evaluaciones'
      ]
    },
    contextualTriggers: {
      routes: ['/spotify-integration', '/spotify/sessions', '/spotify/playlists'],
      components: ['SpotifyPAESDashboard']
    }
  },

  {
    id: 'analytics-predictivos',
    title: 'Analytics Predictivos',
    description: 'Análisis avanzado de tu rendimiento',
    category: 'analytics',
    icon: BarChart3,
    priority: 8,
    keywords: ['analytics', 'estadisticas', 'prediccion', 'rendimiento', 'progreso'],
    content: {
      steps: [
        {
          title: 'Dashboard Analytics',
          description: 'Explora tus métricas de rendimiento',
          action: { type: 'navigate', target: '/analytics' }
        },
        {
          title: 'Predicciones de Rendimiento',
          description: 'Entiende las proyecciones de tu progreso',
          interactive: true
        },
        {
          title: 'Alertas de Riesgo',
          description: 'Configura notificaciones para áreas problemáticas',
          action: { type: 'highlight', target: 'risk-alerts-section' }
        }
      ],
      tips: [
        'Los datos se actualizan en tiempo real',
        'Las predicciones mejoran con más datos históricos',
        'Usa los insights para planificar tu estudio'
      ]
    },
    contextualTriggers: {
      routes: ['/analytics'],
      components: ['RealTimeAnalyticsDashboard']
    }
  }
];

// Simulación de IA conversacional
class AIAssistant {
  private knowledge: HelpTopic[];
  private context: ConversationContext;

  constructor(knowledge: HelpTopic[], context: ConversationContext) {
    this.knowledge = knowledge;
    this.context = context;
  }

  async generateResponse(query: string): Promise<AIResponse> {
    // Simular procesamiento de IA
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowercaseQuery = query.toLowerCase();
    const relevantTopics = this.knowledge.filter(topic =>
      topic.keywords.some(keyword => lowercaseQuery.includes(keyword)) ||
      topic.title.toLowerCase().includes(lowercaseQuery) ||
      topic.description.toLowerCase().includes(lowercaseQuery)
    );

    let response: AIResponse;

    if (relevantTopics.length > 0) {
      const bestMatch = relevantTopics[0];
      response = {
        id: `ai-${Date.now()}`,
        message: this.generateContextualAnswer(query, bestMatch),
        type: 'answer',
        confidence: 0.85 + Math.random() * 0.15,
        relatedTopics: relevantTopics.slice(0, 3).map(t => t.id),
        followUpQuestions: this.generateFollowUpQuestions(bestMatch),
        timestamp: new Date().toISOString()
      };
    } else {
      response = {
        id: `ai-${Date.now()}`,
        message: this.generateGenericResponse(query),
        type: 'suggestion',
        confidence: 0.4 + Math.random() * 0.3,
        relatedTopics: this.getContextualTopics(),
        followUpQuestions: [
          '¿Necesitas ayuda con alguna función específica?',
          '¿Quieres ver un tutorial paso a paso?',
          '¿Te gustaría explorar las funciones disponibles?'
        ],
        timestamp: new Date().toISOString()
      };
    }

    return response;
  }

  private generateContextualAnswer(query: string, topic: HelpTopic): string {
    const responses = [
      `Te puedo ayudar con ${topic.title}. ${topic.description}`,
      `Sobre ${topic.title}: ${topic.description}`,
      `${topic.title} es una función importante. ${topic.description}`
    ];
    
    const baseResponse = responses[Math.floor(Math.random() * responses.length)];
    
    if (topic.content.steps && topic.content.steps.length > 0) {
      return baseResponse + ` Te guío paso a paso: ${topic.content.steps[0].title} - ${topic.content.steps[0].description}`;
    }
    
    if (topic.content.tips && topic.content.tips.length > 0) {
      return baseResponse + ` Consejo útil: ${topic.content.tips[0]}`;
    }
    
    return baseResponse;
  }

  private generateGenericResponse(query: string): string {
    const responses = [
      'Entiendo que necesitas ayuda. ¿Podrías ser más específico sobre qué función te interesa?',
      'Estoy aquí para ayudarte con cualquier aspecto del sistema PAES. ¿Qué te gustaría aprender?',
      'No encontré información específica sobre eso, pero puedo ayudarte con otras funciones del sistema.',
      'Parece que estás buscando información específica. Te sugiero explorar los temas de ayuda disponibles.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateFollowUpQuestions(topic: HelpTopic): string[] {
    const questions = [
      `¿Quieres ver un tutorial paso a paso sobre ${topic.title}?`,
      `¿Te gustaría conocer consejos avanzados para ${topic.title}?`,
      `¿Necesitas ayuda con algún aspecto específico de ${topic.title}?`
    ];
    return questions.slice(0, 2);
  }

  private getContextualTopics(): string[] {
    return this.knowledge
      .filter(topic => 
        topic.contextualTriggers?.routes?.includes(this.context.currentRoute) ||
        !topic.requiredLevel ||
        topic.requiredLevel <= this.context.userLevel
      )
      .slice(0, 3)
      .map(t => t.id);
  }
}

export const ContextualAIAssistant: React.FC<{ userId: string }> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'topics' | 'search'>('chat');
  const [currentQuery, setCurrentQuery] = useState('');
  const [conversation, setConversation] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    content: string | AIResponse;
    timestamp: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { gameStats } = useGamification();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Contexto de conversación
  const conversationContext: ConversationContext = useMemo(() => ({
    currentRoute: location.pathname,
    userLevel: gameStats?.level || 1,
    recentActions: [], // Se poblaria con acciones del usuario
    strugglingAreas: [], // Se poblaria con analytics
    preferences: {
      helpStyle: 'detailed',
      showAnimations: true,
      autoSuggest: true
    }
  }), [location.pathname, gameStats?.level]);

  // Inicializar AI Assistant
  const aiAssistant = useMemo(() => 
    new AIAssistant(helpTopics, conversationContext),
    [conversationContext]
  );

  // Temas filtrados por nivel del usuario
  const availableTopics = useMemo(() => 
    helpTopics.filter(topic => 
      !topic.requiredLevel || topic.requiredLevel <= (gameStats?.level || 1)
    ).sort((a, b) => b.priority - a.priority),
    [gameStats?.level]
  );

  // Temas contextuales para la ruta actual
  const contextualTopics = useMemo(() =>
    availableTopics.filter(topic =>
      topic.contextualTriggers?.routes?.includes(location.pathname)
    ),
    [availableTopics, location.pathname]
  );

  // Buscar temas
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return availableTopics;
    
    const query = searchQuery.toLowerCase();
    return availableTopics.filter(topic =>
      topic.title.toLowerCase().includes(query) ||
      topic.description.toLowerCase().includes(query) ||
      topic.keywords.some(keyword => keyword.includes(query))
    );
  }, [availableTopics, searchQuery]);

  // Auto-scroll del chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Sugerir ayuda contextual
  useEffect(() => {
    if (conversationContext.preferences.autoSuggest && contextualTopics.length > 0) {
      const timer = setTimeout(() => {
        if (conversation.length === 0) {
          const suggestion = contextualTopics[0];
          setConversation([{
            id: `suggestion-${Date.now()}`,
            type: 'ai',
            content: {
              id: `ai-suggestion-${Date.now()}`,
              message: `¡Hola! Veo que estás en ${suggestion.title}. ¿Te gustaría que te ayude a familiarizarte con esta función?`,
              type: 'suggestion',
              confidence: 0.9,
              relatedTopics: [suggestion.id],
              followUpQuestions: [
                'Sí, muéstrame cómo funciona',
                'No, gracias'
              ],
              timestamp: new Date().toISOString()
            } as AIResponse,
            timestamp: new Date().toISOString()
          }]);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [contextualTopics, conversation.length, conversationContext.preferences.autoSuggest]);

  const handleSendMessage = async () => {
    if (!currentQuery.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user' as const,
      content: currentQuery,
      timestamp: new Date().toISOString()
    };

    setConversation(prev => [...prev, userMessage]);
    setCurrentQuery('');
    setIsLoading(true);

    try {
      const aiResponse = await aiAssistant.generateResponse(currentQuery);
      const aiMessage = {
        id: aiResponse.id,
        type: 'ai' as const,
        content: aiResponse,
        timestamp: aiResponse.timestamp
      };

      setConversation(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUpClick = (question: string) => {
    setCurrentQuery(question);
    handleSendMessage();
  };

  const toggleTopicExpansion = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const executeTopicAction = (action: HelpStep['action']) => {
    if (!action) return;

    switch (action.type) {
      case 'navigate':
        navigate(action.target);
        setIsOpen(false);
        break;
      case 'highlight':
        // Implementar highlight de elemento
        console.log('Highlighting:', action.target);
        break;
      case 'click':
        // Simular click en elemento
        console.log('Clicking:', action.target);
        break;
    }
  };

  const TopicCard = ({ topic }: { topic: HelpTopic }) => {
    const isExpanded = expandedTopics.has(topic.id);
    const Icon = topic.icon;

    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader 
          className="cursor-pointer"
          onClick={() => toggleTopicExpansion(topic.id)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-3">
              <Icon className="h-5 w-5 text-blue-400" />
              {topic.title}
              {topic.requiredLevel && (
                <Badge variant="outline" className="text-xs">
                  Nivel {topic.requiredLevel}+
                </Badge>
              )}
            </CardTitle>
            {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
          </div>
          <p className="text-sm text-gray-400 mt-2">{topic.description}</p>
        </CardHeader>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="pt-0">
                {topic.content.steps && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-white flex items-center gap-2">
                      <PlayCircle className="h-4 w-4 text-green-400" />
                      Pasos a seguir:
                    </h4>
                    {topic.content.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-white text-sm">{step.title}</h5>
                          <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                          {step.action && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="mt-2 text-blue-400 hover:text-blue-300"
                              onClick={() => executeTopicAction(step.action)}
                            >
                              {step.action.type === 'navigate' ? 'Ir allí' :
                               step.action.type === 'highlight' ? 'Mostrar' :
                               step.action.type === 'click' ? 'Hacer clic' : 'Ejecutar'}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {topic.content.tips && topic.content.tips.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-white flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-yellow-400" />
                      Consejos útiles:
                    </h4>
                    <ul className="space-y-1">
                      {topic.content.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-yellow-400 mt-1">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {topic.content.warnings && topic.content.warnings.length > 0 && (
                  <div className="mt-4 p-3 bg-orange-900/20 border border-orange-500/30 rounded-lg">
                    <h4 className="font-medium text-orange-300 text-sm mb-2">⚠️ Importante:</h4>
                    <ul className="space-y-1">
                      {topic.content.warnings.map((warning, index) => (
                        <li key={index} className="text-sm text-orange-200">
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    );
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-20 right-4 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
        
        {contextualTopics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute bottom-16 right-0 mb-2 mr-2"
          >
            <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-lg shadow-lg max-w-48">
              💡 Ayuda disponible para esta sección
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-4 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Brain className="h-6 w-6 text-blue-400" />
              Asistente IA PAES
              <Badge variant="outline" className="text-xs">
                Beta
              </Badge>
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="h-full flex flex-col">
            <TabsList className="mx-4 mt-4">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat IA
              </TabsTrigger>
              <TabsTrigger value="topics" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Temas ({availableTopics.length})
              </TabsTrigger>
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Buscar
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="chat" className="h-full p-4 overflow-hidden">
                <div className="h-full flex flex-col">
                  {/* Chat messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {conversation.length === 0 && (
                      <div className="text-center text-gray-400 py-8">
                        <Brain className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                        <p>¡Hola! Soy tu asistente IA de PAES.</p>
                        <p className="text-sm mt-1">Pregúntame cualquier cosa sobre el sistema.</p>
                      </div>
                    )}

                    {conversation.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          'flex gap-3',
                          message.type === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {message.type === 'ai' && (
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <Brain className="h-4 w-4 text-white" />
                          </div>
                        )}
                        
                        <div
                          className={cn(
                            'max-w-[70%] p-3 rounded-lg',
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-800 text-gray-100'
                          )}
                        >
                          {message.type === 'user' ? (
                            <p>{message.content as string}</p>
                          ) : (
                            <div>
                              <p className="mb-2">{(message.content as AIResponse).message}</p>
                              
                              {(message.content as AIResponse).followUpQuestions && (
                                <div className="mt-3 space-y-2">
                                  {(message.content as AIResponse).followUpQuestions!.map((question, index) => (
                                    <Button
                                      key={index}
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleFollowUpClick(question)}
                                      className="w-full justify-start text-left text-xs"
                                    >
                                      {question}
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {message.type === 'user' && (
                          <div className="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {user?.email?.[0]?.toUpperCase() || 'U'}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <Brain className="h-4 w-4 text-white" />
                        </div>
                        <div className="ml-3 bg-gray-800 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                            <span className="text-gray-400 text-sm">Pensando...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input */}
                  <div className="flex gap-2">
                    <Input
                      value={currentQuery}
                      onChange={(e) => setCurrentQuery(e.target.value)}
                      placeholder="Pregúntame sobre PAES..."
                      className="flex-1 bg-gray-800 border-gray-600 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!currentQuery.trim() || isLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="topics" className="h-full overflow-y-auto p-4 space-y-4">
                {contextualTopics.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-yellow-400" />
                      Ayuda para esta sección
                    </h3>
                    <div className="space-y-3">
                      {contextualTopics.map(topic => (
                        <TopicCard key={topic.id} topic={topic} />
                      ))}
                    </div>
                    <Separator className="my-6" />
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Todos los temas de ayuda
                  </h3>
                  <div className="space-y-3">
                    {availableTopics.map(topic => (
                      <TopicCard key={topic.id} topic={topic} />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="search" className="h-full overflow-hidden p-4">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar temas de ayuda..."
                      className="pl-10 bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3">
                    {searchResults.length === 0 ? (
                      <div className="text-center text-gray-400 py-8">
                        <Search className="h-12 w-12 mx-auto mb-4" />
                        <p>No se encontraron resultados</p>
                        <p className="text-sm mt-1">Intenta con otros términos</p>
                      </div>
                    ) : (
                      searchResults.map(topic => (
                        <TopicCard key={topic.id} topic={topic} />
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};

export default ContextualAIAssistant;
