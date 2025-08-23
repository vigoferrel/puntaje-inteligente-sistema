/* eslint-disable react-refresh/only-export-components */
// ðŸ§  BloomNavigator.tsx - Agente Neural de TaxonomÃ­a de Bloom
// Context7 + Pensamiento Secuencial + Bloom Cognitive Levels

import React, { useState, useEffect, useCallback } from 'react';
import { useQuantumEducationalArsenal } from '../../hooks/useQuantumEducationalArsenal';
import styles from './CuboFrontal.module.css';

// =====================================================================================
// ðŸŽ¯ INTERFACES TYPESCRIPT
// =====================================================================================

interface BloomLevel {
  id: number;
  name: string;
  description: string;
  icon: string;
  skills: string[];
  verbs: string[];
  difficulty: number;
  unlocked: boolean;
}

interface BloomProgress {
  currentLevel: number;
  totalXP: number;
  levelXP: number;
  nextLevelXP: number;
  completedSkills: string[];
  achievements: string[];
}

interface BloomNavigatorProps {
  onLevelSelect?: (level: BloomLevel) => void;
  currentSubject?: string;
  className?: string;
}

// =====================================================================================
// ðŸ§  NIVELES DE BLOOM CUÃNTICOS
// =====================================================================================

const BLOOM_LEVELS: BloomLevel[] = [
  {
    id: 1,
    name: 'Recordar',
    description: 'Recuperar informaciÃ³n de la memoria',
    icon: 'ðŸ§ ',
    skills: ['MemorizaciÃ³n', 'Reconocimiento', 'Recuerdo'],
    verbs: ['Definir', 'Listar', 'Nombrar', 'Identificar', 'Recordar'],
    difficulty: 1,
    unlocked: true
  },
  {
    id: 2,
    name: 'Comprender',
    description: 'Explicar ideas o conceptos',
    icon: 'ðŸ’¡',
    skills: ['InterpretaciÃ³n', 'EjemplificaciÃ³n', 'ClasificaciÃ³n'],
    verbs: ['Explicar', 'Describir', 'Interpretar', 'Resumir', 'Parafrasear'],
    difficulty: 2,
    unlocked: true
  },
  {
    id: 3,
    name: 'Aplicar',
    description: 'Usar informaciÃ³n en nuevas situaciones',
    icon: 'âš¡',
    skills: ['EjecuciÃ³n', 'ImplementaciÃ³n', 'Uso'],
    verbs: ['Aplicar', 'Demostrar', 'Usar', 'Ejecutar', 'Implementar'],
    difficulty: 3,
    unlocked: false
  },
  {
    id: 4,
    name: 'Analizar',
    description: 'Dividir informaciÃ³n en partes',
    icon: 'ðŸ”',
    skills: ['DiferenciaciÃ³n', 'OrganizaciÃ³n', 'AtribuciÃ³n'],
    verbs: ['Analizar', 'Comparar', 'Contrastar', 'Examinar', 'Categorizar'],
    difficulty: 4,
    unlocked: false
  },
  {
    id: 5,
    name: 'Evaluar',
    description: 'Hacer juicios basados en criterios',
    icon: 'âš–ï¸',
    skills: ['VerificaciÃ³n', 'CrÃ­tica', 'Juicio'],
    verbs: ['Evaluar', 'Criticar', 'Juzgar', 'Verificar', 'Validar'],
    difficulty: 5,
    unlocked: false
  },
  {
    id: 6,
    name: 'Crear',
    description: 'Producir trabajo nuevo y original',
    icon: 'ðŸŽ¨',
    skills: ['GeneraciÃ³n', 'PlanificaciÃ³n', 'ProducciÃ³n'],
    verbs: ['Crear', 'DiseÃ±ar', 'Construir', 'Planificar', 'Producir'],
    difficulty: 6,
    unlocked: false
  }
];

// =====================================================================================
// ðŸ§  COMPONENTE PRINCIPAL
// =====================================================================================

export const BloomNavigator: React.FC<BloomNavigatorProps> = ({
  onLevelSelect,
  currentSubject = 'General',
  className = ''
}) => {
  // ðŸ”— Hooks
  const {
    arsenalMetrics,
    trackMetric,
    generatePAESSimulation,
    isLoading
  } = useQuantumEducationalArsenal();

  // ðŸŽ¯ Estados
  const [selectedLevel, setSelectedLevel] = useState<BloomLevel>(BLOOM_LEVELS[0]);
  const [bloomProgress, setBloomProgress] = useState<BloomProgress>({
    currentLevel: 2,
    totalXP: 1250,
    levelXP: 250,
    nextLevelXP: 500,
    completedSkills: ['MemorizaciÃ³n', 'Reconocimiento', 'InterpretaciÃ³n'],
    achievements: ['Primer Recuerdo', 'ComprensiÃ³n BÃ¡sica']
  });
  const [bloomLevels, setBloomLevels] = useState<BloomLevel[]>(BLOOM_LEVELS);

  // ðŸŽ® Manejadores
  const handleLevelSelect = useCallback(async (level: BloomLevel) => {
    if (!level.unlocked) {
      await trackMetric('bloom_level_locked_attempt', level.id, {
        currentLevel: bloomProgress.currentLevel,
        targetLevel: level.id,
        subject: currentSubject
      });
      return;
    }

    setSelectedLevel(level);
    
    await trackMetric('bloom_level_selected', level.id, {
      levelName: level.name,
      difficulty: level.difficulty,
      subject: currentSubject
    });

    onLevelSelect?.(level);
  }, [bloomProgress.currentLevel, currentSubject, trackMetric, onLevelSelect]);

  const handleSkillPractice = useCallback(async (skill: string) => {
    await trackMetric('bloom_skill_practice', selectedLevel.id, {
      skill,
      level: selectedLevel.name,
      subject: currentSubject
    });

    // Simular ganancia de XP
    setBloomProgress(prev => {
      const newXP = prev.levelXP + 50;
      const levelUp = newXP >= prev.nextLevelXP;
      
      if (levelUp && prev.currentLevel < 6) {
        const newCurrentLevel = prev.currentLevel + 1;
        setBloomLevels(prevLevels => 
          prevLevels.map(level => 
            level.id <= newCurrentLevel 
              ? { ...level, unlocked: true }
              : level
          )
        );
        
        return {
          ...prev,
          currentLevel: newCurrentLevel,
          totalXP: prev.totalXP + 50,
          levelXP: 0,
          nextLevelXP: newCurrentLevel * 200,
          completedSkills: [...prev.completedSkills, skill]
        };
      }
      
      return {
        ...prev,
        totalXP: prev.totalXP + 50,
        levelXP: newXP,
        completedSkills: prev.completedSkills.includes(skill) 
          ? prev.completedSkills 
          : [...prev.completedSkills, skill]
      };
    });
  }, [selectedLevel, currentSubject, trackMetric]);

  const handleGenerateExercise = useCallback(async () => {
    const scores = {
      [currentSubject]: selectedLevel.difficulty * 150
    };
    
    await generatePAESSimulation(scores);
    
    await trackMetric('bloom_exercise_generated', selectedLevel.id, {
      level: selectedLevel.name,
      subject: currentSubject,
      difficulty: selectedLevel.difficulty
    });
  }, [selectedLevel, currentSubject, generatePAESSimulation, trackMetric]);

  // ðŸ”„ Efectos
  useEffect(() => {
    const engagementLevel = Math.floor(arsenalMetrics.engagement_score / 20) + 1;
    const unlockedLevel = Math.min(Math.max(engagementLevel, 2), 6);
    
    setBloomLevels(prevLevels => 
      prevLevels.map(level => ({
        ...level,
        unlocked: level.id <= unlockedLevel
      }))
    );
    
    setBloomProgress(prev => ({
      ...prev,
      currentLevel: unlockedLevel
    }));
  }, [arsenalMetrics.engagement_score]);

  // ðŸŽ¨ Clases CSS
  const containerClasses = [
    styles.bloomContainer,
    className
  ].filter(Boolean).join(' ');

  // ðŸ“Š Calcular progreso
  const progressPercentage = Math.min((bloomProgress.levelXP / bloomProgress.nextLevelXP) * 100, 100);
  const progressClass = `metricWidth${Math.round(progressPercentage / 10) * 10}`;

  // =====================================================================================
  // ðŸŽ¨ RENDERIZADO
  // =====================================================================================

  return (
    <div className={containerClasses}>
      <div className={styles.faceIcon}>ðŸ§ </div>
      <div className={styles.faceName}>Bloom Navigator</div>
      
      {/* ðŸ“Š Progreso Actual */}
      <div className={styles.faceData}>
        Nivel {bloomProgress.currentLevel}: {BLOOM_LEVELS[bloomProgress.currentLevel - 1]?.name}
      </div>

      {/* ðŸŽ¯ Barra de Progreso XP */}
      <div className={styles.faceMetric}>
        <div className={`${styles.metricBar} ${styles[progressClass]}`} />
      </div>
      
      <div className={styles.bloomProgressInfo}>
        XP: {bloomProgress.levelXP}/{bloomProgress.nextLevelXP}
      </div>

      {/* ðŸ§  Niveles de Bloom */}
      <div className={styles.bloomLevelsList}>
        {bloomLevels.map((level) => (
          <div
            key={level.id}
            onClick={() => handleLevelSelect(level)}
            className={`
              ${styles.bloomLevelItem}
              ${selectedLevel.id === level.id ? styles.bloomLevelItemSelected : ''}
              ${!level.unlocked ? styles.bloomLevelItemLocked : ''}
            `.trim()}
          >
            <div className={styles.bloomLevelTitle}>
              {level.icon} {level.name} {!level.unlocked && 'ðŸ”’'}
            </div>
            <div className={styles.bloomLevelMeta}>
              Dificultad: {level.difficulty}/6 â€¢ {level.skills.length} habilidades
            </div>
          </div>
        ))}
      </div>

      {/* ðŸŽ¯ Habilidades del Nivel Actual */}
      {selectedLevel.unlocked && (
        <div className={styles.bloomSkillsContainer}>
          <div className={styles.bloomSkillsTitle}>
            Habilidades: {selectedLevel.name}
          </div>
          
          <div className={styles.bloomSkillsDescription}>
            {selectedLevel.description}
          </div>
          
          <div className={styles.bloomSkillsGrid}>
            {selectedLevel.skills.map((skill) => (
              <button
                key={skill}
                onClick={() => handleSkillPractice(skill)}
                disabled={isLoading}
                className={`
                  ${styles.bloomSkillButton}
                  ${bloomProgress.completedSkills.includes(skill) ? styles.bloomSkillButtonCompleted : ''}
                `.trim()}
              >
                {skill} {bloomProgress.completedSkills.includes(skill) && 'âœ“'}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleGenerateExercise}
            disabled={isLoading}
            className={`${styles.createPlaylistButton} ${styles.bloomExerciseButton}`}
          >
            ðŸŽ¯ Generar Ejercicio {selectedLevel.name}
          </button>
        </div>
      )}

      {/* ðŸ“Š MÃ©trica Visual Principal */}
      <div className={styles.faceMetric}>
        <div className={`${styles.metricBar} ${styles[`metricWidth${Math.round(arsenalMetrics.engagement_score / 10) * 10}`]}`} />
      </div>
    </div>
  );
};

export default BloomNavigator;
