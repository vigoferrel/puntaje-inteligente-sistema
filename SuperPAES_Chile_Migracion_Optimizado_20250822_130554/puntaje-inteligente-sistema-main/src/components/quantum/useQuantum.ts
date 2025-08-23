/* eslint-disable react-refresh/only-export-components */
// ðŸ§  useQuantum.ts - Hook Ãšnico Universal
// Context7 + Pensamiento Secuencial + TrilogÃ­a CuÃ¡ntica + CIRUGÃA MÃNIMA
// Rafael (Visual/3D) + Michelangelo (MÃ©tricas) + Leonardo (Neural/IA)
// ðŸ”¬ CONEXIONES SINÃ‰RGICAS: Ejercicios â†” Contexto â†” Bloom â†” OCR â†” Agentes

// ðŸ“¤ Exportar tipos para uso en otros componentes
export type { BloomLevel, ExerciseContext, SynergicOptions };
export type { Exercise } from '../../types/ai-types';

// ðŸŒŒ EDUCATIONAL MULTIVERSE - Nuevos tipos para los 5 Learning Modes
export type LearningMode = 'classic' | 'spotify' | 'immersive' | 'diagnostic' | 'gamified';
export type LearningDimension = 'temporal' | 'analytics' | 'social' | 'archive';

export interface LearningModeConfig {
  mode: LearningMode;
  enabled: boolean;
  preferences: {
    audioEnabled?: boolean;
    visualEffects?: boolean;
    adaptiveSpeed?: boolean;
    bloomLevel?: BloomLevel;
    spotifyStyle?: boolean;
    immersiveLevel?: 'basic' | 'advanced' | 'ultra';
  };
}

export interface AdaptiveLearningCompanion {
  id: string;
  type: 'bloom' | 'audio' | 'visual' | 'progress' | 'motivation' | 'spotify' | 'ocr';
  message: string;
  action?: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: number;
  context?: string;
}

export interface LearningExperience {
  exercise: Exercise;
  mode: LearningMode;
  context: ExerciseContext;
  companions: AdaptiveLearningCompanion[];
  dimensions: LearningDimension[];
  audioEnabled: boolean;
  visualEnhanced: boolean;
  adaptiveMetrics: {
    engagement: number;
    comprehension: number;
    retention: number;
  };
}

export interface MultiverseState {
  currentMode: LearningMode;
  availableModes: LearningModeConfig[];
  activeDimensions: LearningDimension[];
  currentExperience: LearningExperience | null;
  companions: AdaptiveLearningCompanion[];
  isTransitioning: boolean;
}

import { useState, useEffect, useCallback, useMemo } from 'react';
import { leonardoSpineExpanded } from '../../core/leonardo-anatomy/bone/LeonardoSpineExpanded';
import { SmartExerciseBankPAES } from '../../services/paes/SmartExerciseBankPAES';
import { ExerciseGenerationServicePAES } from '../../services/paes/ExerciseGenerationServicePAES';
import { openRouterService } from '../../services/openrouter/core';
import { TPAESPrueba, TPAESHabilidad } from '../../types/system-types';
import { Exercise } from '../../types/ai-types';

// ðŸŒŒ EDUCATIONAL MULTIVERSE - Imports de servicios existentes
import { LeonardoAudioService, leonardoAudioService } from '../../services/leonardo/audio-sintetico';
import { LeonardoOCRService } from '../../services/leonardo/ocr-classification';
// ðŸ”§ QUANTUM SERVICES ULTRAMINIMALISTAS - Context7 + Leonardo "Menos es MÃ¡s"
import { quantumCalendarService } from '../../services/quantum/QuantumCalendarService';
import { quantumNotificationService } from '../../services/quantum/QuantumNotificationService';
import { quantumGuideService } from '../../services/quantum/QuantumGuideService';
// Nota: SpotifyPAES se importarÃ¡ cuando creemos el componente integrado

type MaestroType = 'rafael' | 'michelangelo' | 'leonardo' | 'benchmark';
type ContentType = 'texto' | 'grafico' | 'tabla' | 'ocr' | 'ejercicio';
type PruebaPAES = 'competencia_lectora' | 'matematica_m1' | 'matematica_m2' | 'historia' | 'ciencias_tp';
type BloomLevel = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';

// ðŸ”¬ CIRUGÃA MÃNIMA: Interfaces para conexiones sinÃ©rgicas
interface ExerciseContext {
  exerciseId: string;
  type: ContentType;
  bloomLevel: BloomLevel;
  difficulty: string;
  prueba: PruebaPAES;
  hasVisualContent: boolean;
  agentRecommendation?: string;
}

interface SynergicOptions {
  bloomLevel?: BloomLevel;
  agentInsight?: string;
  ocrReady?: boolean;
  autoGenerateExercise?: boolean;
  visualEnhancement?: boolean;
}

interface AspiracionesEstudiante {
  carreraObjetivo: string;
  puntajeObjetivo: number;
  universidadPreferida: string;
  tiempoDisponible: number;
  fortalezas: string[];
  debilidades: string[];
}

// ðŸŽ¯ Interfaces TypeScript para reemplazar 'any'
interface BaseContent {
  type: ContentType;
  prueba: PruebaPAES;
  pruebaName: string;
  data: {
    title: string;
    description: string;
    timestamp: string;
  };
}

interface ContextualContent extends BaseContent {
  enhanced: 'rafael-3d' | 'michelangelo-metrics' | 'leonardo-ai';
  visualElements?: {
    has3D: boolean;
    universeType: string;
    interactiveModels: boolean;
    visualComplexity: string;
  };
  rafaelFeatures?: string[];
  metricsData?: {
    progresoActual: number;
    puntajeProyectado: number;
    tiempoEstimado: number;
    dificultadRelativa: number;
  };
  michelangeloFeatures?: string[];
  aiInsights?: {
    recomendacion: string;
    adaptacion: string;
    prediccion: string;
    personalizacion: string;
  };
  leonardoFeatures?: string[];
  // ðŸ”¬ NUEVAS: Propiedades sinÃ©rgicas
  bloomInsights?: {
    level: BloomLevel;
    description: string;
    suggestedActions: string[];
  };
  agentRecommendation?: string;
}

interface Microcertificacion {
  id: string;
  nombre: string;
  progreso: number;
  relevancia: 'alta' | 'media' | 'baja';
}

interface AgenteVocacional {
  carreraObjetivo: string;
  compatibilidad: number;
  recomendaciones: string[];
  probabilidadIngreso: number;
}

interface CalendarioEvento {
  fecha: Date;
  evento: string;
  tipo: 'evaluacion' | 'estudio' | 'revision';
  prioridad: 'alta' | 'media' | 'baja';
}

interface SistemasPuntajes {
  actual: number;
  objetivo: number;
  proyectado: number;
  probabilidad: number;
  tiempoEstimado: number;
}

interface ProgresoData {
  global: number;
  porPrueba: Record<PruebaPAES, number>;
  tendencia: 'mejorando' | 'estable' | 'declinando';
  ultimaActualizacion: string;
}

interface QuantumState {
  // Estado de maestros cuÃ¡nticos
  activeMaestro: MaestroType | 'benchmark';
  rafaelActive: boolean;
  michelangeloActive: boolean;
  leonardoActive: boolean;
  benchmarkActive: boolean;
  
  // Arsenal educativo PAES
  currentPruebaPAES: PruebaPAES;
  contextualContent: ContextualContent | null;
  aspiracionesEstudiante: AspiracionesEstudiante;
  
  // MÃ©tricas cuÃ¡nticas en tiempo real
  consciousnessLevel: number;
  quantumCoherence: number;
// ðŸŒŒ EDUCATIONAL MULTIVERSE - Estado expandido
  multiverse: MultiverseState;
  systemHealth: number;
  
  // ðŸ”§ QUANTUM SERVICES ULTRAMINIMALISTAS - Estado integrado
  calendar: {
    todayEvents: number;
    nextMilestone: Date | null;
    streak: number;
  };
  notifications: {
    unread: number;
    lastNotification: string | null;
  };
  guidance: {
    isActive: boolean;
    completedTours: number;
    needsHelp: boolean;
  };
  
  // Estado de transiciÃ³n
  isTransitioning: boolean;
}

interface ArsenalEducativo {
  pruebasPAES: PruebaPAES[];
  microcertificaciones: Microcertificacion[];
  agenteVocacional: AgenteVocacional;
  calendario: CalendarioEvento[];
  sistemasPuntajes: SistemasPuntajes;
  progreso: ProgresoData;
}

// ðŸŽ¯ Interfaz extendida para ejercicios del Spotify Player
interface SpotifyExercise {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  question?: string;
  options?: string[];
  correctAnswer?: string;
  skill?: string;
  prueba?: string;
  hasVisualContent?: boolean;
}

// ðŸ›¡ï¸ DEFENSIVE PROGRAMMING - FunciÃ³n para valores por defecto
const getDefaultAspiraciones = (): AspiracionesEstudiante => ({
  carreraObjetivo: "IngenierÃ­a Civil Industrial",
  puntajeObjetivo: 750,
  universidadPreferida: "Universidad de Chile",
  tiempoDisponible: 25,
  fortalezas: ["MatemÃ¡ticas", "FÃ­sica", "AnÃ¡lisis LÃ³gico"],
  debilidades: ["ComprensiÃ³n Lectora", "Historia", "RedacciÃ³n"]
});

export const useQuantum = (userId: string, aspiraciones?: AspiracionesEstudiante) => {
  // ðŸ§¬ CONTEXT7 + PENSAMIENTO SECUENCIAL - ValidaciÃ³n de parÃ¡metros crÃ­ticos MEMOIZADA
  const validatedAspiraciones = useMemo(() => {
    const base = aspiraciones || getDefaultAspiraciones();
    
    if (!base.debilidades || !base.fortalezas) {
      console.warn('âš ï¸ Aspiraciones incompletas, usando valores por defecto');
      return { ...getDefaultAspiraciones(), ...base };
    }
    
    return base;
  }, [aspiraciones]);
  const [currentExercise, setCurrentExercise] = useState<SpotifyExercise | null>(null);
  const [quantumState, setQuantumState] = useState<QuantumState>({
    activeMaestro: 'leonardo',
    rafaelActive: false,
    michelangeloActive: false,
    leonardoActive: true,
    benchmarkActive: false,
    currentPruebaPAES: 'competencia_lectora',
    contextualContent: null,
    aspiracionesEstudiante: validatedAspiraciones,
    // ðŸŒŒ EDUCATIONAL MULTIVERSE - Estado inicial
    multiverse: {
      currentMode: 'classic',
      availableModes: [
        { mode: 'classic', enabled: true, preferences: { bloomLevel: 'understand' } },
        { mode: 'spotify', enabled: true, preferences: { audioEnabled: true, spotifyStyle: true } },
        { mode: 'immersive', enabled: true, preferences: { visualEffects: true, immersiveLevel: 'advanced' } },
        { mode: 'diagnostic', enabled: true, preferences: { adaptiveSpeed: true } },
        { mode: 'gamified', enabled: true, preferences: { visualEffects: true, bloomLevel: 'apply' } }
      ],
      activeDimensions: ['temporal'],
      currentExperience: null,
      companions: [],
      isTransitioning: false
    },
    // ðŸ”§ QUANTUM SERVICES ULTRAMINIMALISTAS - Estado inicial
    calendar: {
      todayEvents: 0,
      nextMilestone: null,
      streak: 0
    },
    notifications: {
      unread: 0,
      lastNotification: null
    },
    guidance: {
      isActive: false,
      completedTours: 0,
      needsHelp: false
    },
    consciousnessLevel: 75,
    quantumCoherence: 85,
    systemHealth: 90,
    isTransitioning: false
  });

  // ðŸŽ¨ Actualizar variables CSS cuÃ¡nticas
  const updateCSSVariables = useCallback((maestro: MaestroType | 'none') => {
    const root = document.documentElement;
    
    // Reset todas las variables cuÃ¡nticas
    root.style.setProperty('--rafael-visual', '0');
    root.style.setProperty('--michelangelo-metrics', '0');
    root.style.setProperty('--leonardo-neural', '0');
    
    // Activar la variable del maestro seleccionado
    if (maestro !== 'none') {
      const suffix = getMaestroSuffix(maestro);
      root.style.setProperty(`--${maestro}-${suffix}`, '1');
      
      // Actualizar background activo
      const bgVar = `--${maestro}-bg`;
      root.style.setProperty('--active-bg', `var(${bgVar})`);
    }
  }, []);

  // ðŸ”„ Context7 + Pensamiento Secuencial - Activar Maestro
  const activateMaestro = useCallback((maestro: MaestroType) => {
    if (quantumState.isTransitioning || quantumState.activeMaestro === maestro) return;

    console.log(`ðŸ§  Context7: Activando maestro ${maestro}`);
    
    // Iniciar transiciÃ³n
    setQuantumState(prev => ({ ...prev, isTransitioning: true }));
    
    // Agregar clase de transiciÃ³n al DOM
    document.documentElement.classList.add('quantum-transitioning');

    // Desactivar todos los maestros
    setTimeout(() => {
      setQuantumState(prev => ({
        ...prev,
        rafaelActive: false,
        michelangeloActive: false,
        leonardoActive: false,
        benchmarkActive: false
      }));

      // Actualizar variables CSS inmediatamente
      updateCSSVariables('none');
    }, 100);

    // Activar el maestro seleccionado
    setTimeout(() => {
      setQuantumState(prev => ({
        ...prev,
        activeMaestro: maestro,
        [`${maestro}Active`]: true,
        isTransitioning: false
      }));

      // Actualizar variables CSS del maestro activo
      updateCSSVariables(maestro);
      
      // Remover clase de transiciÃ³n
      document.documentElement.classList.remove('quantum-transitioning');
      
      // Notificar a Leonardo Spine Expandido
      leonardoSpineExpanded.queueQuantumOperation({
        type: 'trilogia-sync',
        userId,
        priority: 'high'
      });

      console.log(`âœ… Context7: Maestro ${maestro} activado`);
    }, 300);
  }, [userId, quantumState.isTransitioning, quantumState.activeMaestro, updateCSSVariables]);

  const getMaestroSuffix = (maestro: MaestroType): string => {
    switch (maestro) {
      case 'rafael': return 'visual';
      case 'michelangelo': return 'metrics';
      case 'leonardo': return 'neural';
      case 'benchmark': return 'benchmark';
      default: return 'neural';
    }
  };

  // ðŸ§  Generar contenido segÃºn maestro activo + SINERGIA
  const generateContextualContent = (
    type: ContentType,
    prueba: PruebaPAES,
    maestro: MaestroType,
    aspiraciones: AspiracionesEstudiante,
    synergicOptions: SynergicOptions = {} // NUEVA: Opciones sinÃ©rgicas
  ): ContextualContent => {
    const baseContent = getBaseContent(type, prueba);
    
    let enhancedContent: ContextualContent;
    
    switch (maestro) {
      case 'rafael':
        enhancedContent = enhanceWithVisual3D(baseContent, prueba, synergicOptions);
        break;
      case 'michelangelo':
        enhancedContent = enhanceWithMetrics(baseContent, aspiraciones, prueba, synergicOptions);
        break;
      case 'leonardo':
        enhancedContent = enhanceWithAI(baseContent, aspiraciones, prueba, synergicOptions);
        break;
      default:
        enhancedContent = {
          ...baseContent,
          enhanced: 'leonardo-ai'
        };
    }
    
    // NUEVA: Enriquecimiento sinÃ©rgico con Bloom + Agentes
    if (synergicOptions.bloomLevel) {
      enhancedContent.bloomInsights = {
        level: synergicOptions.bloomLevel,
        description: getBloomDescription(synergicOptions.bloomLevel),
        suggestedActions: getBloomActions(synergicOptions.bloomLevel)
      };
    }
    
    if (synergicOptions.agentInsight) {
      enhancedContent.agentRecommendation = synergicOptions.agentInsight;
    }
    
    return enhancedContent;
  };

  // ðŸ”¬ CONEXIÃ“N 1: EJERCICIO â†’ CONTEXTO INTELIGENTE (CirugÃ­a MÃ­nima)
  const enrichExerciseContext = useCallback(async (exercise: Exercise | ExerciseContext) => {
    if (!exercise) return;
    
    const exerciseId = 'id' in exercise ? exercise.id :
                      'exerciseId' in exercise ? exercise.exerciseId :
                      `exercise-${Date.now()}`;
    console.log('ðŸ”¬ CIRUGÃA MÃNIMA: Enriqueciendo contexto desde ejercicio', exerciseId);
    
    try {
      // Detectar tipo de contenido contextual basado en el ejercicio
      const contextType = detectExerciseContextType(exercise);
      const bloomLevel = detectBloomLevel(exercise);
      const agentRecommendation = await getAgentRecommendation(exercise);
      
      // Auto-poblar ventana contextual con informaciÃ³n sinÃ©rgica
      const synergicOptions: SynergicOptions = {
        bloomLevel,
        agentInsight: agentRecommendation,
        ocrReady: ('hasVisualContent' in exercise ? exercise.hasVisualContent : false) || false,
        visualEnhancement: quantumState.activeMaestro === 'rafael'
      };
      
      // Obtener prueba de manera segura
      const prueba = ('prueba' in exercise ? exercise.prueba : quantumState.currentPruebaPAES) as PruebaPAES;
      
      // Cargar contenido contextual enriquecido usando generateContextualContent directamente
      const content = generateContextualContent(
        contextType,
        prueba,
        quantumState.activeMaestro,
        quantumState.aspiracionesEstudiante,
        synergicOptions
      );
      
      setQuantumState(prev => ({
        ...prev,
        contextualContent: content,
        currentPruebaPAES: prueba
      }));
      
      // Notificar a Leonardo Spine sobre la conexiÃ³n sinÃ©rgica
      leonardoSpineExpanded.queueQuantumOperation({
        type: 'neural-prediction',
        userId,
        priority: 'medium',
        data: { exerciseId, contextType, bloomLevel }
      });
      
    } catch (error) {
      console.error('âŒ Error enriqueciendo contexto:', error);
    }
  }, [quantumState.activeMaestro, quantumState.currentPruebaPAES, quantumState.aspiracionesEstudiante, userId]);

  // ðŸ”¬ CONEXIÃ“N 2: CONTEXTO â†’ EJERCICIO GENERADO (CirugÃ­a MÃ­nima)
  const generateExerciseFromContext = useCallback(async (contextType: ContentType, prueba: PruebaPAES, options: SynergicOptions = {}) => {
    console.log('ðŸ”¬ CIRUGÃA MÃNIMA: Generando ejercicio desde contexto', { contextType, prueba, options });
    
    try {
      // Construir prompt contextualizado usando Bloom + Agentes
      const exercisePrompt = buildContextualExercisePrompt(contextType, prueba, options.bloomLevel, options.agentInsight);
      
      // Generar ejercicio usando el sistema existente
      const exercise = await ExerciseGenerationServicePAES.generatePAESExercise({
        prueba: mapPruebaPAESToTPAES(prueba) as TPAESPrueba,
        skill: getSkillFromBloomLevel(options.bloomLevel || 'understand') as TPAESHabilidad,
        difficulty: options.bloomLevel === 'create' ? 'AVANZADO' : 'INTERMEDIO',
        includeVisuals: options.ocrReady || false
      });
      
      if (exercise) {
        console.log('âœ… Ejercicio generado desde contexto:', exercise.id);
        
        // Crear ciclo sinÃ©rgico: nuevo ejercicio â†’ enriquecer contexto
        setTimeout(() => enrichExerciseContext(exercise), 1000);
      }
      
      return exercise;
    } catch (error) {
      console.error('âŒ Error generando ejercicio desde contexto:', error);
      return null;
    }
  }, [enrichExerciseContext]);

  // ðŸŽ¯ Cargar contenido contextual MEJORADO con sinergia
  const loadContextualContent = useCallback((type: ContentType, pruebaPAES: PruebaPAES, options: SynergicOptions = {}) => {
    console.log(`ðŸ“Š Cargando contenido SINÃ‰RGICO: ${type} para ${pruebaPAES}`, options);
    
    const content = generateContextualContent(
      type,
      pruebaPAES,
      quantumState.activeMaestro,
      validatedAspiraciones,
      options // NUEVA: Opciones sinÃ©rgicas
    );
    
    setQuantumState(prev => ({
      ...prev,
      contextualContent: content,
      currentPruebaPAES: pruebaPAES
    }));
    
    // NUEVA: Auto-generar ejercicio si estÃ¡ habilitado
    if (options.autoGenerateExercise) {
      setTimeout(() => generateExerciseFromContext(type, pruebaPAES, options), 500);
    }
  }, [
    quantumState.activeMaestro,
    validatedAspiraciones,
    generateExerciseFromContext
  ]);

  // ðŸŒŒ EDUCATIONAL MULTIVERSE - Funciones de los 5 Learning Modes
  
  const switchLearningMode = useCallback((newMode: LearningMode) => {
    if (quantumState.multiverse.isTransitioning || quantumState.multiverse.currentMode === newMode) return;
    
    console.log(`ðŸŒŒ MULTIVERSE: Cambiando a modo ${newMode}`);
    
    setQuantumState(prev => ({
      ...prev,
      multiverse: {
        ...prev.multiverse,
        isTransitioning: true
      }
    }));
    
    // TransiciÃ³n suave entre modos
    setTimeout(() => {
      setQuantumState(prev => ({
        ...prev,
        multiverse: {
          ...prev.multiverse,
          currentMode: newMode,
          isTransitioning: false,
          companions: generateModeCompanions(newMode)
        }
      }));
      
      // Notificar cambio de modo a Leonardo Spine
      leonardoSpineExpanded.queueQuantumOperation({
        type: 'trilogia-sync',
        userId,
        priority: 'high',
        data: { newMode, timestamp: Date.now() }
      });
      
      console.log(`âœ… MULTIVERSE: Modo ${newMode} activado`);
    }, 300);
  }, [quantumState.multiverse.isTransitioning, quantumState.multiverse.currentMode, userId]);
  
  const createLearningExperience = useCallback(async (exercise: Exercise, mode?: LearningMode) => {
    const currentMode = mode || quantumState.multiverse.currentMode;
    console.log(`ðŸŒŒ MULTIVERSE: Creando experiencia de aprendizaje en modo ${currentMode}`);
    
    try {
      // Detectar contexto del ejercicio
      const context: ExerciseContext = {
        exerciseId: String(exercise.id || `exercise-${Date.now()}`),
        type: detectExerciseContextType(exercise),
        bloomLevel: detectBloomLevel(exercise),
        difficulty: exercise.difficulty || 'INTERMEDIO',
        prueba: exercise.prueba as PruebaPAES || quantumState.currentPruebaPAES,
        hasVisualContent: exercise.hasVisualContent || false,
        agentRecommendation: await getAgentRecommendation(exercise)
      };
      
      // Generar companions adaptativos segÃºn el modo
      const companions = await generateAdaptiveCompanions(exercise, currentMode, context);
      
      // Determinar dimensiones activas segÃºn el modo
      const dimensions = getModeActiveDimensions(currentMode);
      
      // Configurar audio y visuales segÃºn el modo
      const audioEnabled = await configureAudioForMode(currentMode, exercise);
      const visualEnhanced = configureVisualsForMode(currentMode, exercise);
      
      // Crear experiencia de aprendizaje
      const experience: LearningExperience = {
        exercise,
        mode: currentMode,
        context,
        companions,
        dimensions,
        audioEnabled,
        visualEnhanced,
        adaptiveMetrics: {
          engagement: 0,
          comprehension: 0,
          retention: 0
        }
      };
      
      setQuantumState(prev => ({
        ...prev,
        multiverse: {
          ...prev.multiverse,
          currentExperience: experience,
          companions: companions
        }
      }));
      
      console.log(`âœ… MULTIVERSE: Experiencia creada para ejercicio ${exercise.id}`);
      return experience;
      
    } catch (error) {
      console.error('âŒ Error creando experiencia de aprendizaje:', error);
      return null;
    }
  }, [quantumState.multiverse.currentMode, quantumState.currentPruebaPAES]);
  
  const updateLearningMetrics = useCallback((metrics: Partial<LearningExperience['adaptiveMetrics']>) => {
    setQuantumState(prev => ({
      ...prev,
      multiverse: {
        ...prev.multiverse,
        currentExperience: prev.multiverse.currentExperience ? {
          ...prev.multiverse.currentExperience,
          adaptiveMetrics: {
            ...prev.multiverse.currentExperience.adaptiveMetrics,
            ...metrics
          }
        } : null
      }
    }));
  }, []);

  // ðŸ“Š Monitoreo de signos vitales cuÃ¡nticos - MEJORADO CON FALLBACKS
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        // ðŸ” Verificar si leonardoSpineExpanded estÃ¡ disponible y listo
        if (leonardoSpineExpanded && typeof leonardoSpineExpanded.getVitalSigns === 'function') {
          const vitalSigns = leonardoSpineExpanded.getVitalSigns();
          
          // ðŸ›¡ï¸ Validar que los signos vitales sean vÃ¡lidos
          if (vitalSigns && typeof vitalSigns === 'object') {
            const consciousness = typeof vitalSigns.systemConsciousness === 'number' ? vitalSigns.systemConsciousness : 0.75;
            const coherence = typeof vitalSigns.quantumCoherence === 'number' ? vitalSigns.quantumCoherence : 0.85;
            const health = typeof vitalSigns.overallHealth === 'number' ? vitalSigns.overallHealth : 0.90;
            
            setQuantumState(prev => ({
              ...prev,
              consciousnessLevel: Math.round(consciousness * 100),
              quantumCoherence: Math.round(coherence * 100),
              systemHealth: Math.round(health * 100)
            }));
          } else {
            throw new Error('Signos vitales invÃ¡lidos');
          }
        } else {
          throw new Error('leonardoSpineExpanded no disponible');
        }
      } catch (error) {
        console.warn('âš ï¸ Error obteniendo signos vitales, usando simulaciÃ³n:', error);
        
        // ðŸŽ¯ Usar valores simulados realistas que mejoran gradualmente
        setQuantumState(prev => {
          const baseConsciousness = Math.max(75, prev.consciousnessLevel);
          const baseCoherence = Math.max(80, prev.quantumCoherence);
          const baseHealth = Math.max(85, prev.systemHealth);
          
          return {
            ...prev,
            consciousnessLevel: Math.min(100, baseConsciousness + Math.random() * 3),
            quantumCoherence: Math.min(100, baseCoherence + Math.random() * 2),
            systemHealth: Math.min(100, baseHealth + Math.random() * 1.5)
          };
        });
      }
    }, 3000); // Reducido a 3 segundos para mejor responsividad

    return () => clearInterval(interval);
  }, []);

  // ðŸŽ¯ Arsenal educativo integrado - ESTÃTICO CON VALORES POR DEFECTO
  const arsenalEducativo: ArsenalEducativo = useMemo(() => {
    console.log('ðŸš€ Recalculando arsenalEducativo (optimizado)');
    const defaultAspiraciones = getDefaultAspiraciones();
    return {
      pruebasPAES: [
        'competencia_lectora',
        'matematica_m1',
        'matematica_m2',
        'historia',
        'ciencias_tp'
      ],
      microcertificaciones: generateMicrocertificaciones(defaultAspiraciones),
      agenteVocacional: generateVocationalInsights(defaultAspiraciones),
      calendario: generateCalendarioIA(defaultAspiraciones),
      sistemasPuntajes: generatePuntajesProyectados(defaultAspiraciones),
      progreso: generateProgresoIntegral(defaultAspiraciones)
    };
  }, []); // SIN DEPENDENCIAS - ESTÃTICO CON VALORES POR DEFECTO

  // ðŸ”§ QUANTUM SERVICES INTEGRATION - Ultraminimalista
  const initializeQuantumServices = useCallback(async () => {
    if (!userId) return;

    try {
      // Inicializar servicios cuÃ¡nticos
      quantumCalendarService.setUserId(userId);
      quantumNotificationService.setUserId(userId);
      quantumGuideService.setUserId(userId);

      // Cargar estado inicial de servicios
      const [calendarSummary, notifications, completedTours] = await Promise.all([
        quantumCalendarService.getProgressSummary(),
        quantumNotificationService.getNotifications(5),
        Promise.resolve(quantumGuideService.getCompletedTours())
      ]);

      // Actualizar estado cuÃ¡ntico con datos de servicios
      setQuantumState(prev => ({
        ...prev,
        calendar: {
          todayEvents: calendarSummary.todayProgress?.exercisesCompleted || 0,
          nextMilestone: calendarSummary.nextMilestone?.date || null,
          streak: calendarSummary.todayProgress?.streak || 0
        },
        notifications: {
          unread: notifications.filter(n => !n.read).length,
          lastNotification: notifications[0]?.title || null
        },
        guidance: {
          isActive: quantumGuideService.isGuidanceActive(),
          completedTours: completedTours.length,
          needsHelp: false
        }
      }));

      console.log('ðŸ”§ Servicios cuÃ¡nticos inicializados');
    } catch (error) {
      console.warn('âš ï¸ Error inicializando servicios cuÃ¡nticos:', error);
    }
  }, [userId]);

  // ðŸ“Š TRACKING AUTOMÃTICO DE PROGRESO
  const trackExerciseProgress = useCallback(async (exerciseData: {
    exerciseId: string;
    prueba: string;
    timeSpent: number;
    score: number;
    isCorrect: boolean;
  }) => {
    try {
      // Track en calendario
      await quantumCalendarService.trackProgress({
        exerciseId: exerciseData.exerciseId,
        prueba: exerciseData.prueba,
        timeSpent: exerciseData.timeSpent,
        score: exerciseData.score
      });

      // Notificar progreso si es significativo
      if (exerciseData.isCorrect && exerciseData.score > 80) {
        await quantumNotificationService.notifyProgress({
          exercisesCompleted: quantumState.calendar.todayEvents + 1,
          streak: quantumState.calendar.streak,
          averageScore: exerciseData.score,
          prueba: exerciseData.prueba,
          improvement: exerciseData.score - 70 // Simulado
        });
      }

      // Actualizar estado local
      setQuantumState(prev => ({
        ...prev,
        calendar: {
          ...prev.calendar,
          todayEvents: prev.calendar.todayEvents + 1
        }
      }));

    } catch (error) {
      console.warn('ðŸ“Š Error tracking progreso:', error);
    }
  }, [quantumState.calendar]);

  // ðŸ¤– GUÃA INTELIGENTE AUTOMÃTICA
  const handleUserInteraction = useCallback(async (interaction: {
    action: string;
    page: string;
    timeSpent: number;
    success: boolean;
  }) => {
    try {
      // Detectar si necesita ayuda
      await quantumGuideService.detectHelpNeeded({
        currentPage: interaction.page,
        timeSpent: interaction.timeSpent,
        clicksWithoutProgress: interaction.success ? 0 : 1,
        errorCount: interaction.success ? 0 : 1
      });

      // Enviar notificaciÃ³n de guÃ­a si es primera visita
      if (interaction.action === 'first_visit') {
        await quantumNotificationService.sendGuidanceNotification({
          userAction: 'first_visit',
          currentPage: interaction.page,
          timeSpent: 0
        });
      }

    } catch (error) {
      console.warn('ðŸ¤– Error en guÃ­a inteligente:', error);
    }
  }, []);

  // ðŸš€ InicializaciÃ³n del sistema cuÃ¡ntico
  useEffect(() => {
    console.log('ðŸ§  Inicializando sistema cuÃ¡ntico...');
    
    // Configurar variables CSS iniciales
    updateCSSVariables(quantumState.activeMaestro);
    
    // Inicializar Leonardo Spine si no estÃ¡ listo
    if (!leonardoSpineExpanded.isReady()) {
      console.log('âš¡ Esperando Leonardo Spine...');
    }

    // Inicializar servicios cuÃ¡nticos
    initializeQuantumServices();
    
    return () => {
      console.log('ðŸ”„ Limpiando sistema cuÃ¡ntico...');
    };
  }, [updateCSSVariables, quantumState.activeMaestro, initializeQuantumServices]);

  return {
    // ðŸŽµ SPOTIFY CUÃNTICO - Estado del ejercicio actual
    currentExercise,
    setCurrentExercise,
    
    // Estado cuÃ¡ntico
    quantumState,
    activeMaestro: quantumState.activeMaestro,
    isTransitioning: quantumState.isTransitioning,
    
    // Acciones principales
    activateMaestro,
    loadContextualContent,
    
    // ðŸ”¬ NUEVAS: Conexiones sinÃ©rgicas (CirugÃ­a MÃ­nima)
    enrichExerciseContext,
    generateExerciseFromContext,
    
    // ðŸŒŒ EDUCATIONAL MULTIVERSE - Funciones del multiverse
    switchLearningMode,
    createLearningExperience,
    updateLearningMetrics,
    multiverse: quantumState.multiverse,
    
    // ðŸ”§ QUANTUM SERVICES ULTRAMINIMALISTAS - API integrada
    trackExerciseProgress,
    handleUserInteraction,
    calendar: quantumState.calendar,
    notifications: quantumState.notifications,
    guidance: quantumState.guidance,
    
    // Servicios directos (para uso avanzado)
    quantumServices: {
      calendar: quantumCalendarService,
      notifications: quantumNotificationService,
      guide: quantumGuideService
    },
    
    // Arsenal educativo
    arsenalEducativo,
    
    // MÃ©tricas en tiempo real
    consciousnessLevel: quantumState.consciousnessLevel,
    quantumCoherence: quantumState.quantumCoherence,
    systemHealth: quantumState.systemHealth,
    
    // Contenido contextual
    contextualContent: quantumState.contextualContent,
    currentPruebaPAES: quantumState.currentPruebaPAES,
    
    // Estado de maestros
    rafaelActive: quantumState.rafaelActive,
    michelangeloActive: quantumState.michelangeloActive,
    leonardoActive: quantumState.leonardoActive,
    benchmarkActive: quantumState.benchmarkActive
  };
};

// ðŸ› ï¸ Funciones auxiliares para generar contenido

const getBaseContent = (type: ContentType, prueba: PruebaPAES): BaseContent => {
  const pruebaNames = {
    competencia_lectora: 'Competencia Lectora',
    matematica_m1: 'MatemÃ¡tica M1',
    matematica_m2: 'MatemÃ¡tica M2',
    historia: 'Historia y Ciencias Sociales',
    ciencias_tp: 'Ciencias TP'
  };

  return {
    type,
    prueba,
    pruebaName: pruebaNames[prueba],
    data: {
      title: `${type.toUpperCase()} - ${pruebaNames[prueba]}`,
      description: `Contenido de ${type} para la prueba ${pruebaNames[prueba]}`,
      timestamp: new Date().toISOString()
    }
  };
};

const enhanceWithVisual3D = (content: BaseContent, prueba: PruebaPAES, options: SynergicOptions = {}): ContextualContent => ({
  ...content,
  enhanced: 'rafael-3d',
  visualElements: {
    has3D: true,
    universeType: 'educational',
    interactiveModels: true,
    visualComplexity: options.visualEnhancement ? 'ultra-high' : 'high'
  },
  rafaelFeatures: [
    'Modelos 3D interactivos',
    'Universos educativos inmersivos',
    'Banco de imÃ¡genes contextual',
    'Ejercicios visuales de calidad',
    ...(options.ocrReady ? ['OCR cuÃ¡ntico integrado', 'AnÃ¡lisis visual automÃ¡tico'] : [])
  ]
});

const enhanceWithMetrics = (content: BaseContent, aspiraciones: AspiracionesEstudiante, prueba: PruebaPAES, options: SynergicOptions = {}): ContextualContent => ({
  ...content,
  enhanced: 'michelangelo-metrics',
  metricsData: {
    progresoActual: Math.floor(Math.random() * 40) + 60,
    puntajeProyectado: aspiraciones.puntajeObjetivo - Math.floor(Math.random() * 50),
    tiempoEstimado: Math.floor(Math.random() * 30) + 15,
    dificultadRelativa: options.bloomLevel ? getBloomDifficulty(options.bloomLevel) : Math.floor(Math.random() * 3) + 1
  },
  michelangeloFeatures: [
    'Dashboard hologrÃ¡fico en tiempo real',
    'MÃ©tricas de progreso personalizadas',
    'Analytics avanzados de rendimiento',
    'Visualizaciones predictivas',
    ...(options.bloomLevel ? [`AnÃ¡lisis cognitivo ${options.bloomLevel}`] : [])
  ]
});

const enhanceWithAI = (content: BaseContent, aspiraciones: AspiracionesEstudiante, prueba: PruebaPAES, options: SynergicOptions = {}): ContextualContent => ({
  ...content,
  enhanced: 'leonardo-ai',
  aiInsights: {
    recomendacion: `Basado en tu objetivo de ${aspiraciones.puntajeObjetivo} puntos, te recomiendo enfocarte en esta Ã¡rea`,
    adaptacion: options.agentInsight || 'Contenido adaptado a tu estilo de aprendizaje y fortalezas',
    prediccion: 'IA predictiva sugiere 85% de probabilidad de mejora',
    personalizacion: `Optimizado para ${aspiraciones.carreraObjetivo}`
  },
  leonardoFeatures: [
    '5 Agentes neurales activos',
    'IA contextual adaptativa',
    'Sistema de recomendaciones inteligente',
    'AnÃ¡lisis predictivo personalizado',
    ...(options.bloomLevel ? [`TaxonomÃ­a Bloom: ${options.bloomLevel}`] : [])
  ]
});

const generateMicrocertificaciones = (aspiraciones: AspiracionesEstudiante): Microcertificacion[] => {
  // ðŸ›¡ï¸ DEFENSIVE PROGRAMMING - ValidaciÃ³n crÃ­tica
  if (!aspiraciones || !aspiraciones.debilidades || !aspiraciones.fortalezas) {
    console.warn('âš ï¸ generateMicrocertificaciones: aspiraciones invÃ¡lidas, usando valores por defecto');
    return [
      {
        id: 'cert-001',
        nombre: 'Especialista en Competencia Lectora',
        progreso: 75,
        relevancia: 'media'
      },
      {
        id: 'cert-002',
        nombre: 'Maestro MatemÃ¡tico PAES',
        progreso: 60,
        relevancia: 'media'
      }
    ];
  }

  return [
    {
      id: 'cert-001',
      nombre: 'Especialista en Competencia Lectora',
      progreso: 75,
      relevancia: aspiraciones.debilidades.includes('ComprensiÃ³n Lectora') ? 'alta' : 'media'
    },
    {
      id: 'cert-002',
      nombre: 'Maestro MatemÃ¡tico PAES',
      progreso: 60,
      relevancia: aspiraciones.fortalezas.includes('MatemÃ¡ticas') ? 'alta' : 'media'
    }
  ];
};

const generateVocationalInsights = (aspiraciones: AspiracionesEstudiante): AgenteVocacional => {
  // ðŸ›¡ï¸ DEFENSIVE PROGRAMMING - ValidaciÃ³n crÃ­tica
  if (!aspiraciones || !aspiraciones.carreraObjetivo || !aspiraciones.debilidades || !aspiraciones.fortalezas) {
    console.warn('âš ï¸ generateVocationalInsights: aspiraciones invÃ¡lidas, usando valores por defecto');
    return {
      carreraObjetivo: "IngenierÃ­a Civil Industrial",
      compatibilidad: 85,
      recomendaciones: [
        "EnfÃ³cate en mejorar Ã¡reas dÃ©biles para alcanzar tu objetivo",
        "Aprovecha tus fortalezas naturales",
        "PrepÃ¡rate especÃ­ficamente para tu universidad objetivo"
      ],
      probabilidadIngreso: 78
    };
  }

  const debilidad = aspiraciones.debilidades.length > 0 ? aspiraciones.debilidades[0] : "Ã¡reas de mejora";
  const fortaleza = aspiraciones.fortalezas.length > 0 ? aspiraciones.fortalezas[0] : "habilidades";
  const universidad = aspiraciones.universidadPreferida || "tu universidad objetivo";
  const puntaje = aspiraciones.puntajeObjetivo || 750;

  return {
    carreraObjetivo: aspiraciones.carreraObjetivo,
    compatibilidad: 85,
    recomendaciones: [
      `EnfÃ³cate en ${debilidad} para alcanzar ${puntaje} puntos`,
      `Tu fortaleza en ${fortaleza} te da ventaja competitiva`,
      `${universidad} requiere preparaciÃ³n especÃ­fica en estas Ã¡reas`
    ],
    probabilidadIngreso: 78
  };
};

const generateCalendarioIA = (aspiraciones: AspiracionesEstudiante): CalendarioEvento[] => [
  {
    fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    evento: 'Simulacro PAES Personalizado',
    tipo: 'evaluacion',
    prioridad: 'alta'
  },
  {
    fecha: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    evento: 'SesiÃ³n de refuerzo en Ã¡reas dÃ©biles',
    tipo: 'estudio',
    prioridad: 'media'
  }
];

const generatePuntajesProyectados = (aspiraciones: AspiracionesEstudiante): SistemasPuntajes => {
  // ðŸ›¡ï¸ DEFENSIVE PROGRAMMING - ValidaciÃ³n crÃ­tica
  if (!aspiraciones || typeof aspiraciones.puntajeObjetivo !== 'number' || typeof aspiraciones.tiempoDisponible !== 'number') {
    console.warn('âš ï¸ generatePuntajesProyectados: aspiraciones invÃ¡lidas, usando valores por defecto');
    return {
      actual: 700,
      objetivo: 750,
      proyectado: 730,
      probabilidad: 82,
      tiempoEstimado: 30
    };
  }

  return {
    actual: aspiraciones.puntajeObjetivo - 50,
    objetivo: aspiraciones.puntajeObjetivo,
    proyectado: aspiraciones.puntajeObjetivo - 20,
    probabilidad: 82,
    tiempoEstimado: Math.ceil(aspiraciones.tiempoDisponible * 1.2)
  };
};

const generateProgresoIntegral = (aspiraciones: AspiracionesEstudiante): ProgresoData => {
  // ðŸ›¡ï¸ DEFENSIVE PROGRAMMING - ValidaciÃ³n crÃ­tica
  if (!aspiraciones || !aspiraciones.debilidades || !aspiraciones.fortalezas) {
    console.warn('âš ï¸ generateProgresoIntegral: aspiraciones invÃ¡lidas, usando valores por defecto');
    return {
      global: 68,
      porPrueba: {
        competencia_lectora: 60,
        matematica_m1: 70,
        matematica_m2: 65,
        historia: 55,
        ciencias_tp: 65
      },
      tendencia: 'mejorando',
      ultimaActualizacion: new Date().toISOString()
    };
  }

  return {
    global: 68,
    porPrueba: {
      competencia_lectora: aspiraciones.debilidades.includes('ComprensiÃ³n Lectora') ? 45 : 75,
      matematica_m1: aspiraciones.fortalezas.includes('MatemÃ¡ticas') ? 85 : 60,
      matematica_m2: aspiraciones.fortalezas.includes('MatemÃ¡ticas') ? 80 : 55,
      historia: aspiraciones.debilidades.includes('Historia') ? 40 : 70,
      ciencias_tp: 65
    },
    tendencia: 'mejorando',
    ultimaActualizacion: new Date().toISOString()
  };
};

// ðŸ”¬ FUNCIONES AUXILIARES SINÃ‰RGICAS (CirugÃ­a MÃ­nima)

const detectExerciseContextType = (exercise: Exercise | ExerciseContext | Record<string, unknown>): ContentType => {
  const hasVisual = 'hasVisualContent' in exercise ? exercise.hasVisualContent : false;
  const text = 'text' in exercise ? exercise.text as string : ('question' in exercise ? exercise.question as string : '');
  const options = 'options' in exercise ? exercise.options as string[] : [];
  const prueba = 'prueba' in exercise ? exercise.prueba as string : '';
  
  if (hasVisual || text?.includes('grÃ¡fico') || text?.includes('imagen')) {
    return 'grafico';
  }
  if (text?.includes('tabla') || options?.some((opt: string) => opt.includes('tabla'))) {
    return 'tabla';
  }
  if (prueba?.includes('matematica')) {
    return 'grafico'; // MatemÃ¡ticas suelen necesitar visualizaciÃ³n
  }
  return 'texto'; // Default
};

const detectBloomLevel = (exercise: Exercise | ExerciseContext | Record<string, unknown>): BloomLevel => {
  const question = ('question' in exercise ? exercise.question as string :
                   'text' in exercise ? exercise.text as string : '').toLowerCase();
  
  if (question.includes('crear') || question.includes('diseÃ±ar') || question.includes('proponer')) {
    return 'create';
  }
  if (question.includes('evaluar') || question.includes('juzgar') || question.includes('criticar')) {
    return 'evaluate';
  }
  if (question.includes('analizar') || question.includes('comparar') || question.includes('contrastar')) {
    return 'analyze';
  }
  if (question.includes('aplicar') || question.includes('resolver') || question.includes('calcular')) {
    return 'apply';
  }
  if (question.includes('explicar') || question.includes('interpretar') || question.includes('resumir')) {
    return 'understand';
  }
  return 'remember'; // Default
};

const getAgentRecommendation = async (exercise: Exercise | ExerciseContext | Record<string, unknown>): Promise<string> => {
  const agentInsights = [
    'EnfÃ³cate en la comprensiÃ³n conceptual antes de resolver',
    'Utiliza tÃ©cnicas de visualizaciÃ³n para este tipo de problema',
    'Conecta este ejercicio con conocimientos previos',
    'Practica la estrategia paso a paso',
    'Identifica patrones similares en otros ejercicios'
  ];
  
  // SimulaciÃ³n de recomendaciÃ³n inteligente
  return agentInsights[Math.floor(Math.random() * agentInsights.length)];
};

const buildContextualExercisePrompt = (
  contextType: ContentType,
  prueba: PruebaPAES,
  bloomLevel?: BloomLevel,
  agentInsight?: string
): string => {
  const pruebaMap = {
    competencia_lectora: 'Competencia Lectora',
    matematica_m1: 'MatemÃ¡tica M1',
    matematica_m2: 'MatemÃ¡tica M2',
    historia: 'Historia',
    ciencias_tp: 'Ciencias'
  };
  
  const bloomActions = {
    remember: 'recordar y reconocer',
    understand: 'comprender y explicar',
    apply: 'aplicar y resolver',
    analyze: 'analizar y descomponer',
    evaluate: 'evaluar y juzgar',
    create: 'crear y sintetizar'
  };
  
  return `Genera un ejercicio PAES de ${pruebaMap[prueba]} que requiera ${bloomActions[bloomLevel || 'understand']}
  y estÃ© relacionado con contenido de tipo ${contextType}.
  ${agentInsight ? `ConsideraciÃ³n pedagÃ³gica: ${agentInsight}` : ''}
  El ejercicio debe ser autÃ©ntico y seguir el formato oficial PAES.`;
};

const mapPruebaPAESToTPAES = (prueba: PruebaPAES): string => {
  const mapping = {
    competencia_lectora: 'COMPETENCIA_LECTORA',
    matematica_m1: 'MATEMATICA_1',
    matematica_m2: 'MATEMATICA_2',
    historia: 'HISTORIA_GEOGRAFIA',
    ciencias_tp: 'CIENCIAS_TP'
  };
  return mapping[prueba] || 'COMPETENCIA_LECTORA';
};

const getSkillFromBloomLevel = (bloomLevel: BloomLevel): string => {
  const skillMapping = {
    remember: 'TRACK_LOCATE',
    understand: 'INTERPRET_RELATE',
    apply: 'SOLVE_PROBLEMS',
    analyze: 'PROCESS_ANALYZE',
    evaluate: 'EVALUATE_REFLECT',
    create: 'ARGUE_COMMUNICATE'
  };
  return skillMapping[bloomLevel] || 'INTERPRET_RELATE';
};

const getBloomDescription = (level: BloomLevel): string => {
  const descriptions = {
    remember: 'Recordar informaciÃ³n y conceptos bÃ¡sicos',
    understand: 'Comprender significados y relaciones',
    apply: 'Aplicar conocimientos en situaciones nuevas',
    analyze: 'Analizar y descomponer informaciÃ³n',
    evaluate: 'Evaluar y emitir juicios fundamentados',
    create: 'Crear y sintetizar nuevas ideas'
  };
  return descriptions[level];
};

const getBloomActions = (level: BloomLevel): string[] => {
  const actions = {
    remember: ['Memorizar', 'Reconocer', 'Identificar', 'Listar'],
    understand: ['Explicar', 'Interpretar', 'Resumir', 'Clasificar'],
    apply: ['Resolver', 'Implementar', 'Ejecutar', 'Usar'],
    analyze: ['Comparar', 'Contrastar', 'Examinar', 'Categorizar'],
    evaluate: ['Juzgar', 'Criticar', 'Validar', 'Defender'],
    create: ['DiseÃ±ar', 'Construir', 'Planificar', 'Producir']
  };
  return actions[level];
};

const getBloomDifficulty = (level: BloomLevel): number => {
  const difficulty = {
    remember: 1,
    understand: 2,
    apply: 2,
    analyze: 3,
    evaluate: 3,
    create: 3
  };
  return difficulty[level];
};

// ðŸŒŒ EDUCATIONAL MULTIVERSE - Funciones auxiliares

const generateModeCompanions = (mode: LearningMode): AdaptiveLearningCompanion[] => {
  const baseCompanions: Record<LearningMode, AdaptiveLearningCompanion[]> = {
    classic: [
      {
        id: 'classic-guide',
        type: 'bloom',
        message: 'EnfÃ³cate en la comprensiÃ³n paso a paso',
        priority: 'medium',
        timestamp: Date.now()
      }
    ],
    spotify: [
      {
        id: 'spotify-audio',
        type: 'spotify',
        message: 'Audio contextual activado para mejor retenciÃ³n',
        priority: 'high',
        timestamp: Date.now()
      },
      {
        id: 'spotify-rhythm',
        type: 'audio',
        message: 'Ritmo de aprendizaje sincronizado',
        priority: 'medium',
        timestamp: Date.now()
      }
    ],
    immersive: [
      {
        id: 'immersive-visual',
        type: 'visual',
        message: 'Experiencia 3D activada para mÃ¡xima inmersiÃ³n',
        priority: 'high',
        timestamp: Date.now()
      },
      {
        id: 'immersive-ocr',
        type: 'ocr',
        message: 'AnÃ¡lisis visual inteligente disponible',
        priority: 'medium',
        timestamp: Date.now()
      }
    ],
    diagnostic: [
      {
        id: 'diagnostic-progress',
        type: 'progress',
        message: 'Monitoreo adaptativo de progreso activo',
        priority: 'high',
        timestamp: Date.now()
      },
      {
        id: 'diagnostic-bloom',
        type: 'bloom',
        message: 'AnÃ¡lisis cognitivo en tiempo real',
        priority: 'medium',
        timestamp: Date.now()
      }
    ],
    gamified: [
      {
        id: 'gamified-motivation',
        type: 'motivation',
        message: 'Â¡DesafÃ­o activado! Gana puntos por cada respuesta correcta',
        priority: 'high',
        timestamp: Date.now()
      },
      {
        id: 'gamified-visual',
        type: 'visual',
        message: 'Efectos visuales de gamificaciÃ³n activos',
        priority: 'medium',
        timestamp: Date.now()
      }
    ]
  };
  
  return baseCompanions[mode] || [];
};

const generateAdaptiveCompanions = async (
  exercise: Exercise,
  mode: LearningMode,
  context: ExerciseContext
): Promise<AdaptiveLearningCompanion[]> => {
  const baseCompanions = generateModeCompanions(mode);
  
  // Agregar companions especÃ­ficos segÃºn el contexto del ejercicio
  const contextualCompanions: AdaptiveLearningCompanion[] = [];
  
  if (context.hasVisualContent) {
    contextualCompanions.push({
      id: 'visual-context',
      type: 'visual',
      message: 'Contenido visual detectado - anÃ¡lisis mejorado disponible',
      priority: 'medium',
      timestamp: Date.now(),
      context: context.exerciseId
    });
  }
  
  if (context.bloomLevel === 'create' || context.bloomLevel === 'evaluate') {
    contextualCompanions.push({
      id: 'advanced-bloom',
      type: 'bloom',
      message: `Nivel cognitivo avanzado: ${context.bloomLevel}`,
      priority: 'high',
      timestamp: Date.now(),
      context: context.exerciseId
    });
  }
  
  return [...baseCompanions, ...contextualCompanions];
};

const getModeActiveDimensions = (mode: LearningMode): LearningDimension[] => {
  const dimensionMap: Record<LearningMode, LearningDimension[]> = {
    classic: ['temporal'],
    spotify: ['temporal', 'analytics'],
    immersive: ['temporal', 'analytics', 'social'],
    diagnostic: ['temporal', 'analytics'],
    gamified: ['temporal', 'analytics', 'social']
  };
  
  return dimensionMap[mode] || ['temporal'];
};

const configureAudioForMode = async (mode: LearningMode, exercise: Exercise): Promise<boolean> => {
  switch (mode) {
    case 'spotify':
      // Integrar con LeonardoAudioService para modo Spotify
      try {
        const audioSegment = await leonardoAudioService.generateExplanationAudio(
          exercise.prueba || 'competencia_lectora',
          exercise.question || exercise.text || '',
          'intermediate'
        );
        return !!audioSegment.audioUrl;
      } catch (error) {
        console.warn('âš ï¸ Error configurando audio Spotify:', error);
        return false;
      }
    
    case 'immersive':
      // Audio inmersivo para experiencias 3D
      try {
        const audioSegment = await leonardoAudioService.generateQuestionAudio(
          exercise.question || exercise.text || '',
          exercise.prueba || 'competencia_lectora'
        );
        return !!audioSegment.audioUrl;
      } catch (error) {
        console.warn('âš ï¸ Error configurando audio inmersivo:', error);
        return false;
      }
    
    case 'gamified':
      // Efectos de sonido para gamificaciÃ³n
      return true;
    
    default:
      return false;
  }
};

const configureVisualsForMode = (mode: LearningMode, exercise: Exercise): boolean => {
  switch (mode) {
    case 'immersive':
      return true; // Siempre activar visuales en modo inmersivo
    
    case 'gamified':
      return true; // Efectos visuales para gamificaciÃ³n
    
    case 'spotify':
      return exercise.hasVisualContent || false; // Solo si el ejercicio tiene contenido visual
    
    case 'diagnostic':
      return exercise.hasVisualContent || false; // Visuales para anÃ¡lisis
    
    default:
      return false;
  }
};

export default useQuantum;

