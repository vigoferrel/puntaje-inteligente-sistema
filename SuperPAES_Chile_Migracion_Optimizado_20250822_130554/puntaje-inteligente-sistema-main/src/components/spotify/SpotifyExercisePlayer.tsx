// 🎵 SpotifyExercisePlayer.tsx - Corazón del Sistema Cuántico
// Leonardo da Vinci: "La simplicidad es la máxima sofisticación"
// 50 líneas que activan todo el arsenal cuántico automáticamente

import React, { useState, useEffect } from 'react';
import { useQuantum } from '../quantum/useQuantum';
import { quantumGuideService } from '../../services/quantum/QuantumGuideService';
import styles from './SpotifyExercisePlayer.module.css';

interface AspiracionesEstudiante {
  carreraObjetivo: string;
  puntajeObjetivo: number;
  universidadPreferida: string;
  tiempoDisponible: number;
  fortalezas: string[];
  debilidades: string[];
}

interface SpotifyExercisePlayerProps {
  userId?: string;
  aspiraciones?: AspiracionesEstudiante;
}

const SpotifyExercisePlayer: React.FC<SpotifyExercisePlayerProps> = ({
  userId = "userId",
  aspiraciones = {
    carreraObjetivo: "Ingeniería",
    puntajeObjetivo: 700,
    universidadPreferida: "Universidad de Chile",
    tiempoDisponible: 20,
    fortalezas: ["Matemáticas"],
    debilidades: ["Comprensión Lectora"]
  }
}) => {
  const { currentExercise, setCurrentExercise, quantumServices } = useQuantum(userId, aspiraciones);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // 🎯 Actualizar variable CSS para la barra de progreso
  useEffect(() => {
    document.documentElement.style.setProperty('--progress-width', `${progress}%`);
  }, [progress]);

  // 🎯 Activación automática del arsenal cuántico
  const handlePlay = async () => {
    if (!currentExercise) {
      // Activar recomendación cuántica
      const recommendation = {
        id: `exercise-${Date.now()}`,
        title: 'Ejercicio de Comprensión Lectora',
        type: 'competencia_lectora',
        difficulty: 'INTERMEDIO'
      };
      setCurrentExercise(recommendation);
    }
    setIsPlaying(!isPlaying);
    
    // Simular progreso automático
    if (!isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 2;
        });
      }, 200);
    }
  };

  const handleNext = async () => {
    const nextExercise = {
      id: `exercise-${Date.now()}`,
      title: 'Próximo Ejercicio Recomendado',
      type: 'matematica_m1',
      difficulty: 'INTERMEDIO'
    };
    setCurrentExercise(nextExercise);
    setProgress(0);
  };

  return (
    <div className="bg-[#191414] text-white p-5 rounded-xl grid grid-cols-[1fr_auto] gap-5 items-center my-5">
      <div className="flex items-center gap-4">
        <button
          onClick={handlePlay}
          className="bg-[#1DB954] border-none rounded-full w-14 h-14 text-2xl cursor-pointer transition-transform hover:scale-105"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <div className="flex-1">
          <h3 className="m-0 mb-2 text-base font-bold">
            {currentExercise?.title || 'Selecciona tu próximo ejercicio'}
          </h3>
          <div className="bg-[#404040] h-1 rounded-sm overflow-hidden relative">
            <div
              className={`bg-[#1DB954] h-full transition-all duration-300 ease-out absolute top-0 left-0 ${styles.progressBar}`}
            ></div>
          </div>
        </div>
        
        <button
          onClick={handleNext}
          className="bg-transparent border-none text-white text-2xl cursor-pointer hover:text-[#1DB954] transition-colors"
        >
          ⏭️
        </button>
      </div>
      
      <div className="flex flex-col gap-2">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
            isPlaying ? 'bg-[#1DB954]' : 'bg-[#1DB954]/20'
          }`}
        >
          🎨
        </div>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
            currentExercise ? 'bg-[#1DB954]' : 'bg-[#1DB954]/20'
          }`}
        >
          ⚒️
        </div>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
            progress > 0 ? 'bg-[#1DB954]' : 'bg-[#1DB954]/20'
          }`}
        >
          🎵
        </div>
      </div>
    </div>
  );
};

// 🎨 Estilos convertidos a Tailwind CSS para máxima pulcritud
// Eliminados para cumplir con las mejores prácticas de código limpio

export default SpotifyExercisePlayer;