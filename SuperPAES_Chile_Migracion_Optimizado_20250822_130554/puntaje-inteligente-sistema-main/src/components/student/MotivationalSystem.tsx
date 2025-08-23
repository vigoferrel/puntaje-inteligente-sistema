// ???? SISTEMA MOTIVACIONAL CENTRADO EN EL ESTUDIANTE ????
// Creado por ROO & OSCAR FERREL - Los Arquitectos del Futuro Educativo

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBloom } from '../../hooks/useBloom';
import styles from '../../styles/MotivationalSystem.module.css';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Celebration {
  type: 'achievement' | 'level_up' | 'streak' | 'perfect_score' | 'improvement';
  title: string;
  message: string;
  icon: string;
  color: string;
  animation: string;
}

interface MotivationalMessage {
  type: 'encouragement' | 'tip' | 'celebration' | 'challenge';
  message: string;
  icon: string;
  color: string;
}

const MotivationalSystem: React.FC = () => {
  const { dashboard, stats } = useBloom();
  const [currentCelebration, setCurrentCelebration] = useState<Celebration | null>(null);
  const [motivationalMessage, setMotivationalMessage] = useState<MotivationalMessage | null>(null);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [studentMood, setStudentMood] = useState<'happy' | 'neutral' | 'struggling'>('neutral');

  const achievements: Achievement[] = [
    {
      id: 'first_step',
      title: '¡Primer Paso!',
      description: 'Completaste tu primera actividad',
      icon: '??',
      color: '#FF6B6B',
      points: 10,
      rarity: 'common'
    },
    {
      id: 'quick_learner',
      title: 'Aprendiz Rápido',
      description: 'Completaste una actividad en tiempo récord',
      icon: '?',
      color: '#4ECDC4',
      points: 25,
      rarity: 'rare'
    },
    {
      id: 'perfectionist',
      title: 'Perfeccionista',
      description: 'Obtuviste 100% en una actividad',
      icon: '??',
      color: '#45B7D1',
      points: 50,
      rarity: 'epic'
    },
    {
      id: 'bloom_master',
      title: 'Maestro Bloom',
      description: 'Desbloqueaste todos los niveles cognitivos',
      icon: '??',
      color: '#DDA0DD',
      points: 100,
      rarity: 'legendary'
    }
  ];

  // Memoizar el array de mensajes motivacionales para evitar re-renders
  const encouragementMessages: MotivationalMessage[] = useMemo(() => [
    {
      type: 'encouragement',
      message: '¡Vas increíble! Cada paso te acerca más a tu meta ??',
      icon: '??',
      color: '#FFD93D'
    },
    {
      type: 'tip',
      message: 'Recuerda: los errores son oportunidades de aprender ??',
      icon: '??',
      color: '#6BCF7F'
    },
    {
      type: 'celebration',
      message: '¡Tu progreso es impresionante! Sigue así ??',
      icon: '??',
      color: '#4ECDC4'
    },
    {
      type: 'challenge',
      message: '¿Listo para el siguiente desafío? ¡Tú puedes! ??',
      icon: '??',
      color: '#FF6B6B'
    }
  ], []); // Array vacío como dependencia porque el contenido es estático

  // Funciones memoizadas para evitar re-renders innecesarios
  const showEncouragementMessage = useCallback(() => {
    const encouragementMsg = encouragementMessages.find(m => m.type === 'encouragement');
    if (encouragementMsg) {
      setMotivationalMessage(encouragementMsg);
      setShowEncouragement(true);
      
      setTimeout(() => {
        setShowEncouragement(false);
        setMotivationalMessage(null);
      }, 4000);
    }
  }, [encouragementMessages]);

  const showRandomMotivationalMessage = useCallback(() => {
    const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
    setMotivationalMessage(randomMessage);
    
    setTimeout(() => {
      setMotivationalMessage(null);
    }, 3000);
  }, [encouragementMessages]);

  // Detectar logros y celebraciones
  useEffect(() => {
    if (!dashboard) return;

    if (!stats) return;

    // Detectar diferentes tipos de celebraciones
    if (stats.total_activities_completed === 1) {
      triggerCelebration({
        type: 'achievement',
        title: '¡Primer Logro!',
        message: '¡Felicitaciones! Completaste tu primera actividad. ¡Este es solo el comienzo de tu increíble viaje de aprendizaje!',
        icon: '??',
        color: '#FF6B6B',
        animation: 'confetti'
      });
    }

    if (stats.total_progress_percentage > 80) {
      setStudentMood('happy');
    } else if (stats.total_progress_percentage < 40) {
      setStudentMood('struggling');
      showEncouragementMessage();
    }

  }, [dashboard, stats, showEncouragementMessage]);

  // Mostrar mensajes motivacionales periódicamente
  useEffect(() => {
    const interval = setInterval(() => {
      if (!currentCelebration && Math.random() > 0.7) {
        showRandomMotivationalMessage();
      }
    }, 30000); // Cada 30 segundos

    return () => clearInterval(interval);
  }, [currentCelebration, showRandomMotivationalMessage]);

  const triggerCelebration = (celebration: Celebration) => {
    setCurrentCelebration(celebration);
    
    // Auto-hide después de 5 segundos
    setTimeout(() => {
      setCurrentCelebration(null);
    }, 5000);
  };


  const getMoodEmoji = () => {
    switch (studentMood) {
      case 'happy': return '??';
      case 'struggling': return '??';
      default: return '??';
    }
  };

  const getMoodMessage = () => {
    switch (studentMood) {
      case 'happy': return '¡Estás haciendo un trabajo fantástico!';
      case 'struggling': return 'Recuerda: cada experto fue una vez un principiante';
      default: return '¡Sigue adelante, lo estás haciendo bien!';
    }
  };

  return (
    <>
      {/* Celebration Modal */}
      <AnimatePresence>
        {currentCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.celebrationModal}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className={styles.celebrationContent}
            >
              {/* Confetti Animation */}
              {currentCelebration.animation === 'confetti' && (
                <div className={styles.confettiContainer}>
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: -100, x: Math.random() * 400, rotate: 0 }}
                      animate={{ 
                        y: 500, 
                        rotate: 360,
                        transition: { 
                          duration: 3,
                          delay: Math.random() * 2,
                          repeat: Infinity
                        }
                      }}
                      className={`${styles.confettiPiece} ${styles[`confettiColor${i % 6}`]}`}
                    />
                  ))}
                </div>
              )}

              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className={styles.celebrationIcon}
              >
                {currentCelebration.icon}
              </motion.div>

              <h2 className={styles.celebrationTitle}>
                {currentCelebration.title}
              </h2>

              <p className={styles.celebrationMessage}>
                {currentCelebration.message}
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentCelebration(null)}
                className={styles.celebrationButton}
              >
                ¡Continuar Aprendiendo! ??
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Motivational Message Toast */}
      <AnimatePresence>
        {motivationalMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, x: 50 }}
            className={styles.motivationalToast}
          >
            <div
              className={`${styles.toastContent} ${styles[`toastBorder${motivationalMessage.type.charAt(0).toUpperCase() + motivationalMessage.type.slice(1)}`]}`}
            >
              <div className={styles.toastInner}>
                <div className={styles.toastIcon}>{motivationalMessage.icon}</div>
                <div className="flex-1">
                  <p className={styles.toastMessage}>
                    {motivationalMessage.message}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mood Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className={styles.moodIndicator}
      >
        <div className={styles.moodContent}>
          <div className={styles.moodInner}>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={styles.moodEmoji}
            >
              {getMoodEmoji()}
            </motion.div>
            <div className={styles.moodText}>
              {getMoodMessage()}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Celebration */}
      {dashboard && (
        <div className={styles.progressCard}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.progressContent}
          >
            <div className={styles.progressInner}>
              <div className={styles.progressIcon}>??</div>
              <div>
                <div className={styles.progressTitle}>Tu Progreso</div>
                <div className={styles.progressStats}>
                  {dashboard.total_points} puntos • {dashboard.achievements.length} logros
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Achievement Unlock Animation */}
      <AnimatePresence>
        {showEncouragement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={styles.encouragementModal}
          >
            <div className={styles.encouragementContent}>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className={styles.encouragementIcon}
              >
                ?
              </motion.div>
              <h3 className={styles.encouragementTitle}>¡Ánimo!</h3>
              <p className={styles.encouragementText}>
                Cada paso cuenta. ¡Tú puedes lograrlo!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MotivationalSystem;
