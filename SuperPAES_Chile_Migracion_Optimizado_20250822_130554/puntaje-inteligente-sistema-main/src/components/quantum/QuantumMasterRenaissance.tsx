/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { useQuantumRenaissance } from '../../hooks/quantum/useQuantumRenaissance';
import type { BloomLevel, Exercise, SynergicOptions } from '../quantum/useQuantum';
import styles from '../../styles/UnifiedLayout.module.css';

type PruebaPAES = 'competencia_lectora' | 'matematica_m1' | 'matematica_m2' | 'historia' | 'ciencias_tp';
type ContentType = 'texto' | 'grafico' | 'tabla' | 'ocr' | 'ejercicio';

interface AspiracionesEstudiante {
  carreraObjetivo: string;
  puntajeObjetivo: number;
  universidadPreferida: string;
  tiempoDisponible: number;
  fortalezas: string[];
  debilidades: string[];
}

interface QuantumMasterRenaissanceProps {
  userId: string;
  aspiracionesEstudiante: AspiracionesEstudiante;
}

export const QuantumMasterRenaissance: React.FC<QuantumMasterRenaissanceProps> = ({
  userId,
  aspiracionesEstudiante
}) => {
  const {
    quantumState,
    activeMaestro,
    isTransitioning,
    activateMaestro,
    loadContextualContent,
    arsenalEducativo,
    consciousnessLevel,
    quantumCoherence,
    systemHealth,
    contextualContent,
    currentPruebaPAES,
    rafaelActive,
    michelangeloActive,
    leonardoActive,
    enrichExerciseContext,
    generateExerciseFromContext,
    multimodalIndicators,
    multimodalMetrics,
    isMultimodalActive,
    autoDetectionEnabled,
    toggleAutoDetection,
    clearMultimodalCache
  } = useQuantumRenaissance(userId, aspiracionesEstudiante);

  const formatPruebaName = (prueba: string): string => {
    const names: Record<string, string> = {
      competencia_lectora: 'Competencia Lectora',
      matematica_m1: 'MatemÃ¡tica M1',
      matematica_m2: 'MatemÃ¡tica M2',
      historia: 'Historia y CS',
      ciencias_tp: 'Ciencias TP'
    };
    return names[prueba] || prueba;
  };

  const getMaestroEmoji = (maestro: string): string => {
    const emojis: Record<string, string> = {
      rafael: 'ðŸŽ¨',
      michelangelo: 'ðŸ“Š',
      leonardo: 'ðŸ§ '
    };
    return emojis[maestro] || 'âš¡';
  };

  const getConsciousnessLevel = (level: number): string => {
    if (level >= 80) return 'High';
    if (level >= 50) return 'Medium';
    return 'Low';
  };

  const handlePruebaChange = (prueba: string) => {
    loadContextualContent('ejercicio', prueba as PruebaPAES);
  };

  const handleSynergicLoad = (type: ContentType, options?: Partial<SynergicOptions>) => {
    const synergicOptions: SynergicOptions = {
      bloomLevel: (options?.bloomLevel as BloomLevel) || 'apply',
      agentInsight: options?.agentInsight || 'AnÃ¡lisis automÃ¡tico',
      ocrReady: type === 'ocr',
      autoGenerateExercise: true,
      visualEnhancement: true,
      ...options
    };
    loadContextualContent(type, currentPruebaPAES, synergicOptions);
  };

  const handleEnrichContext = async () => {
    if (contextualContent?.data) {
      const exerciseData = {
        id: `context-${Date.now()}`,
        question: contextualContent.data.title || '',
        subject: currentPruebaPAES,
        difficulty: 'medium',
        skill: 'comprension',
        options: [],
        correctAnswer: '0',
        explanation: contextualContent.data.description || '',
        tags: [],
        metadata: {
          source: 'contextual_content',
          timestamp: contextualContent.data.timestamp
        }
      } as Exercise;
      
      const enrichedContext = await enrichExerciseContext(exerciseData);
      console.log('ðŸ”® Contexto enriquecido con Renaissance:', enrichedContext);
    }
  };

  const handleGenerateFromContext = async () => {
    if (contextualContent?.data) {
      const contextType = contextualContent.type;
      const options: SynergicOptions = {
        bloomLevel: 'apply',
        agentInsight: 'GeneraciÃ³n automÃ¡tica desde contexto actual con Renaissance',
        ocrReady: contextType === 'ocr',
        autoGenerateExercise: false,
        visualEnhancement: true
      };
      
      const newExercise = await generateExerciseFromContext(contextType, currentPruebaPAES, options);
      console.log('ðŸŽ¯ Ejercicio generado con Renaissance:', newExercise);
    }
  };

  return (
    <div className={`${styles.quantumMaster} ${styles[`consciousness${getConsciousnessLevel(consciousnessLevel)}`]} ${isTransitioning ? styles.transitioning : ''} ${isMultimodalActive ? styles.renaissanceActive : ''}`}>
      <div className={styles.quantumHeader}>
        <div className={styles.consciousnessDisplay}>
          <span title="Nivel de Consciencia">ðŸ§  {consciousnessLevel}%</span>
          <span title="Coherencia CuÃ¡ntica">âš¡ {quantumCoherence}%</span>
          <span title="Salud del Sistema">ðŸ’š {systemHealth}%</span>
          <span title="Maestro Activo">{getMaestroEmoji(activeMaestro)} {activeMaestro.toUpperCase()}</span>
          
          <div className={styles.multimodalIndicators}>
            {multimodalIndicators.audio && <span title="Audio disponible">ðŸŽµ</span>}
            {multimodalIndicators.ocr && <span title="OCR procesando">ðŸ‘ï¸</span>}
            {multimodalIndicators.gemini && <span title="Gemini 1.5 Flash activa">ðŸ¤–</span>}
            {multimodalIndicators.cache && <span title="Cache optimizado">ðŸ’°</span>}
            {multimodalIndicators.processing && <span title="Procesando">âš¡</span>}
          </div>
        </div>
        <div className={styles.aspirationsDisplay}>
          <h1 className={styles.textQuantumPrimary}>ðŸŒŒ SuperPAES Quantum Renaissance</h1>
          <div className={styles.aspirationsInfo}>
            <span>{aspiracionesEstudiante.carreraObjetivo}</span>
            <span>ðŸŽ¯ {aspiracionesEstudiante.puntajeObjetivo} pts</span>
            <span>ðŸ›ï¸ {aspiracionesEstudiante.universidadPreferida}</span>
            {isMultimodalActive && <span title="Renaissance activo">ðŸŽ¨ Renaissance</span>}
          </div>
        </div>
      </div>

      <div className={styles.quantumSidebar}>
        <h3>ðŸŽ¯ Arsenal Educativo PAES</h3>
        
        <h4>ðŸ“š 5 Pruebas PAES</h4>
        <ul className={styles.arsenalList}>
          {arsenalEducativo.pruebasPAES.map(prueba => (
            <li 
              key={prueba}
              className={`${styles.arsenalItem} ${currentPruebaPAES === prueba ? styles.arsenalItemActive : ''}`}
              onClick={() => handlePruebaChange(prueba)}
              title={`Cargar ejercicios de ${formatPruebaName(prueba)}`}
            >
              ðŸ“š {formatPruebaName(prueba)}
            </li>
          ))}
        </ul>
        
        <h4>ðŸ† Microcertificaciones</h4>
        <ul className={styles.arsenalList}>
          {arsenalEducativo.microcertificaciones.map((cert, index) => (
            <li 
              key={cert.id || index}
              className={styles.arsenalItem}
              title={`Progreso: ${cert.progreso}%`}
            >
              ðŸ† {cert.nombre}
              <small className={styles.arsenalItemPercentage}>
                {cert.progreso}%
              </small>
            </li>
          ))}
        </ul>
        
        <h4>ðŸŽ“ Agente Vocacional</h4>
        <div 
          className={`${styles.arsenalItem} ${styles.arsenalItemActive}`}
          title={`Compatibilidad: ${arsenalEducativo.agenteVocacional.compatibilidad}%`}
        >
          ðŸŽ“ OrientaciÃ³n IA
          <small className={styles.arsenalItemPercentage}>
            {arsenalEducativo.agenteVocacional.compatibilidad}%
          </small>
        </div>

        {isMultimodalActive && (
          <div className={styles.multimodalControlPanel}>
            <h4>ðŸŽ¨ Control Renaissance</h4>
            <div className={styles.arsenalItem}>
              <button 
                onClick={toggleAutoDetection}
                className={`${styles.btnQuantumSecondary} ${autoDetectionEnabled ? styles.active : ''}`}
                title="Toggle auto-detection"
              >
                ðŸ” Auto: {autoDetectionEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className={styles.arsenalItem}>
              <button 
                onClick={clearMultimodalCache}
                className={styles.btnQuantumSecondary}
                title="Clear cache"
              >
                ðŸ§¹ Clear Cache
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.quantumContent}>
        {rafaelActive && (
          <div className={`${styles.rafaelContent} ${styles.quantumFadeIn}`}>
            <h2>ðŸŽ¨ Arsenal Visual 3D Activado {multimodalIndicators.ocr && '+ OCR Renaissance'}</h2>
            <p>Sistema de visualizaciÃ³n avanzada para ejercicios PAES</p>
            
            <div className={styles.visualGrid}>
              <div className={styles.visualCard}>
                <h3>ðŸŒŒ Universos Educativos 3D</h3>
                <p>âœ¨ Modelos interactivos para {formatPruebaName(currentPruebaPAES)}</p>
                <p>ðŸŽ¯ Banco de imÃ¡genes contextual</p>
                {multimodalIndicators.ocr && <p>ðŸ‘ï¸ OCR inteligente integrado</p>}
              </div>
              <div className={styles.visualCard}>
                <h3>ðŸ“ GeometrÃ­a Interactiva</h3>
                <p>VisualizaciÃ³n 3D de problemas geomÃ©tricos</p>
                {multimodalIndicators.gemini && <p>ðŸ¤– AnÃ¡lisis con Gemini 1.5 Flash</p>}
              </div>
            </div>
          </div>
        )}

        {michelangeloActive && (
          <div className={`${styles.michelangeloContent} ${styles.quantumFadeIn}`}>
            <div className={styles.metricCard}>
              <h2>ðŸ“Š Centro de MÃ©tricas {isMultimodalActive && '+ Renaissance Analytics'}</h2>
              <p>AnÃ¡lisis en tiempo real del progreso acadÃ©mico</p>
            </div>
            
            <div className={styles.metricCard}>
              <h3>ðŸ“Š Progreso Global</h3>
              <div className={styles.metricValue}>{arsenalEducativo.progreso.global}%</div>
              <p>Tendencia: {arsenalEducativo.progreso.tendencia}</p>
            </div>
            
            {isMultimodalActive && (
              <>
                <div className={styles.metricCard}>
                  <h3>ðŸŽ¨ Procesamiento Renaissance</h3>
                  <div className={styles.metricValue}>{multimodalMetrics.processingTime}ms</div>
                  <p>Tiempo de respuesta</p>
                </div>
                
                <div className={styles.metricCard}>
                  <h3>ðŸ’° Cache Hit Rate</h3>
                  <div className={styles.metricValue}>{Math.round(multimodalMetrics.cacheHitRate)}%</div>
                  <p>OptimizaciÃ³n activa</p>
                </div>
              </>
            )}
          </div>
        )}

        {leonardoActive && (
          <div className={`${styles.leonardoContent} ${styles.quantumFadeIn}`}>
            <h2>ðŸ§  Sistema Neural Leonardo {multimodalIndicators.gemini && '+ Gemini 1.5 Flash'}</h2>
            <p>Inteligencia Artificial adaptativa para optimizaciÃ³n del aprendizaje</p>
            
            <div className={styles.neuralGrid}>
              <div className={styles.neuralCard}>
                <h3>âš¡ Agentes Neurales Orquestadores</h3>
                <p>ðŸŽ¯ PathFinder: Optimizando ruta para {aspiracionesEstudiante.carreraObjetivo}</p>
                <p>ðŸŒ¸ BloomNavigator: Navegando taxonomÃ­a cognitiva</p>
                {multimodalIndicators.gemini && <p>ðŸ¤– GeminiOrchestrator: IA multimodal avanzada</p>}
              </div>
              
              <div className={styles.neuralCard}>
                <h3>ðŸŽ¯ Recomendaciones IA</h3>
                {arsenalEducativo.agenteVocacional.recomendaciones.map((rec, index) => (
                  <p key={index}>â€¢ {rec}</p>
                ))}
                {isMultimodalActive && (
                  <p>â€¢ ðŸŽ¨ Capacidades multimodales optimizando experiencia</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.quantumContextual}>
        <div className={styles.contextualHeader}>
          <h3>ðŸ–¼ï¸ Ventana Contextual - {formatPruebaName(currentPruebaPAES)} {isMultimodalActive && 'ðŸŽ¨'}</h3>
          <div className={styles.contextualControls}>
            <button 
              className={styles.btnQuantum}
              onClick={() => loadContextualContent('texto', currentPruebaPAES)}
              title="Cargar texto"
            >
              ðŸ“
            </button>
            <button 
              className={styles.btnQuantum}
              onClick={() => loadContextualContent('grafico', currentPruebaPAES)}
              title="Cargar grÃ¡fico"
            >
              ðŸ“Š
            </button>
            <button 
              className={`${styles.btnQuantum} ${multimodalIndicators.ocr ? styles.active : ''}`}
              onClick={() => loadContextualContent('ocr', currentPruebaPAES)}
              title="Activar OCR Renaissance"
            >
              ðŸ“· {multimodalIndicators.ocr && 'âœ¨'}
            </button>
            <button
              className={styles.btnQuantumPrimary}
              onClick={() => loadContextualContent('ejercicio', currentPruebaPAES)}
              title="Cargar ejercicio"
            >
              ðŸŽ¯
            </button>
          </div>
          
          <div className={styles.synergicControls}>
            <button
              className={styles.btnQuantumSecondary}
              onClick={() => handleSynergicLoad('ejercicio', { bloomLevel: 'apply' })}
              title="Ejercicio con Bloom"
            >
              ðŸŒ¸ Bloom
            </button>
            <button
              className={`${styles.btnQuantumSecondary} ${multimodalIndicators.ocr ? styles.active : ''}`}
              onClick={() => handleSynergicLoad('ocr', { ocrReady: true })}
              title="OCR CuÃ¡ntico Renaissance"
            >
              ðŸ“· OCR+ {multimodalIndicators.ocr && 'ðŸŽ¨'}
            </button>
            <button
              className={styles.btnQuantumSecondary}
              onClick={handleEnrichContext}
              title="Enriquecer contexto"
            >
              ðŸ”® Enriquecer {isMultimodalActive && 'âœ¨'}
            </button>
            <button
              className={`${styles.btnQuantumSecondary} ${multimodalIndicators.gemini ? styles.active : ''}`}
              onClick={handleGenerateFromContext}
              title="Generar con Gemini"
            >
              âš¡ Generar {multimodalIndicators.gemini && 'ðŸ¤–'}
            </button>
          </div>
        </div>
        
        <div className={styles.contextualContent}>
          {contextualContent ? (
            <div className={styles.quantumFadeIn}>
              <h4>{contextualContent.data.title}</h4>
              <p><strong>Tipo:</strong> {contextualContent.type.toUpperCase()}</p>
              <p><strong>Prueba:</strong> {contextualContent.pruebaName}</p>
              <p><strong>Mejorado por:</strong> {contextualContent.enhanced} {isMultimodalActive && '+ Renaissance'}</p>
              
              {isMultimodalActive && (
                <div className={styles.renaissanceInfoBox}>
                  <strong>ðŸŽ¨ Renaissance Activo:</strong>
                  {multimodalIndicators.audio && <p>â€¢ ðŸŽµ Audio sintÃ©tico disponible</p>}
                  {multimodalIndicators.ocr && <p>â€¢ ðŸ‘ï¸ OCR procesando contenido visual</p>}
                  {multimodalIndicators.gemini && <p>â€¢ ðŸ¤– Gemini 1.5 Flash analizando</p>}
                  {multimodalIndicators.cache && <p>â€¢ ðŸ’° Optimizado desde cache</p>}
                  <p>â€¢ âš¡ Score de sinergia: {multimodalMetrics.synergyScore}%</p>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.contextualPlaceholder}>
              <p>ðŸŽ¯ Selecciona contenido del Arsenal Educativo</p>
              <p>ðŸ“š Elige una prueba PAES para comenzar</p>
              <p>âš¡ El contenido se adaptarÃ¡ segÃºn el maestro activo</p>
              {autoDetectionEnabled && <p>ðŸŽ¨ DetecciÃ³n automÃ¡tica Renaissance habilitada</p>}
            </div>
          )}
        </div>
      </div>

      <div className={styles.quantumMaestros}>
        <div 
          className={`${styles.maestroOrb} ${styles.maestroRafael} ${rafaelActive ? styles.maestroOrbActive : ''} ${multimodalIndicators.ocr ? styles.renaissanceEnhanced : ''}`}
          onClick={() => activateMaestro('rafael')}
          title="Rafael - Arsenal Visual 3D + OCR Renaissance"
        >
          ðŸŽ¨ {multimodalIndicators.ocr && 'âœ¨'}
        </div>
        <div 
          className={`${styles.maestroOrb} ${styles.maestroMichelangelo} ${michelangeloActive ? styles.maestroOrbActive : ''} ${isMultimodalActive ? styles.renaissanceEnhanced : ''}`}
          onClick={() => activateMaestro('michelangelo')}
          title="Michelangelo - Dashboard + Renaissance Analytics"
        >
          ðŸ“Š {isMultimodalActive && 'ðŸŽ¨'}
        </div>
        <div 
          className={`${styles.maestroOrb} ${styles.maestroLeonardo} ${leonardoActive ? styles.maestroOrbActive : ''} ${multimodalIndicators.gemini ? styles.renaissanceEnhanced : ''}`}
          onClick={() => activateMaestro('leonardo')}
          title="Leonardo - Sistema Neural IA + Gemini 1.5 Flash"
        >
          ðŸ§  {multimodalIndicators.gemini && 'ðŸ¤–'}
        </div>
      </div>

      <div className={styles.quantumMetrics}>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{consciousnessLevel}</div>
          <div className={styles.metricLabel}>Consciencia</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{quantumCoherence}</div>
          <div className={styles.metricLabel}>Coherencia</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{systemHealth}</div>
          <div className={styles.metricLabel}>Salud</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>âš¡</div>
          <div className={styles.metricLabel}>EnergÃ­a</div>
        </div>
        
        {isMultimodalActive && (
          <>
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>{Math.round(multimodalMetrics.processingTime)}ms</div>
              <div className={styles.metricLabel}>Renaissance</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>{Math.round(multimodalMetrics.cacheHitRate)}%</div>
              <div className={styles.metricLabel}>Cache</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>{multimodalMetrics.synergyScore}%</div>
              <div className={styles.metricLabel}>Sinergia</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuantumMasterRenaissance;
