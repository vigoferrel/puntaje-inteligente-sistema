/* eslint-disable react-refresh/only-export-components */
// QuantumPAESExercises.tsx - Ejercicios PAES integrados
// Context7 + Modo Secuencial - Sistema de ejercicios unificado

import React, { useState, useEffect } from 'react';

interface PAESExercise {
  id: string;
  subject: string;
  difficulty: 'FACIL' | 'INTERMEDIO' | 'DIFICIL';
  question: string;
  completed: boolean;
  score?: number;
}

export const QuantumPAESExercises: React.FC = () => {
  const [exercises, setExercises] = useState<PAESExercise[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('matematica');
  const [isLoading, setIsLoading] = useState(true);

  const subjects = [
    { id: 'matematica', name: 'Matematica', icon: 'ðŸ”¢' },
    { id: 'lenguaje', name: 'Lenguaje', icon: 'ðŸ“' },
    { id: 'ciencias', name: 'Ciencias', icon: 'ðŸ§ª' },
    { id: 'historia', name: 'Historia', icon: 'ðŸ“œ' }
  ];

  // Context7: Cargar ejercicios por materia
  useEffect(() => {
    const loadExercises = async () => {
      setIsLoading(true);
ECHO est  desactivado.
      // Simular carga de ejercicios reales
      await new Promise(resolve => setTimeout(resolve, 800));
ECHO est  desactivado.
      const mockExercises: PAESExercise[] = [
        {
          id: '1',
          subject: selectedSubject,
          difficulty: 'FACIL',
          question: `Ejercicio de ${selectedSubject} - Nivel basico`,
          completed: true,
          score: 85
        },
        {
          id: '2',
          subject: selectedSubject,
          difficulty: 'INTERMEDIO',
          question: `Ejercicio de ${selectedSubject} - Nivel intermedio`,
          completed: false
        },
        {
          id: '3',
          subject: selectedSubject,
          difficulty: 'DIFICIL',
          question: `Ejercicio de ${selectedSubject} - Nivel avanzado`,
          completed: false
        }
      ];
ECHO est  desactivado.
      setExercises(mockExercises);
      setIsLoading(false);
    };

    loadExercises();
  }, [selectedSubject]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'FACIL': return '#22c55e';
      case 'INTERMEDIO': return '#f59e0b';
      case 'DIFICIL': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="quantum-paes-container">
      <div className="quantum-arsenal-header">
        <h3>ðŸŽ¯ Ejercicios PAES</h3>
        <span className="quantum-subject-count">
          {exercises.filter(e => e.completed).length} / {exercises.length} completados
        </span>
      </div>

      <div className="quantum-subject-selector">
        {subjects.map(subject => (
          <button
            key={subject.id}
            className={`quantum-subject-btn ${selectedSubject === subject.id ? 'active' : ''}`}
            onClick={() => setSelectedSubject(subject.id)}
          >
            <span>{subject.icon}</span>
            <span>{subject.name}</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="quantum-arsenal-loading">
          <div className="quantum-spinner"></div>
          <p>Cargando ejercicios...</p>
        </div>
      ) : (
        <div className="quantum-exercises-list">
          {exercises.map(exercise => (
            <div key={exercise.id} className="quantum-exercise-card">
              <div className="quantum-exercise-header">
                <span 
                  className="quantum-difficulty-badge"
                  style={{backgroundColor: getDifficultyColor(exercise.difficulty)}}
                >
                  {exercise.difficulty}
                </span>
                {exercise.completed && (
                  <span className="quantum-score-badge">
                    {exercise.score}
                  </span>
                )}
              </div>
              <p className="quantum-exercise-question">{exercise.question}</p>
              <button 
                className={`quantum-action-button ${exercise.completed ? 'completed' : 'pending'}`}
              >
                {exercise.completed ? 'Revisar' : 'Resolver'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuantumPAESExercises;

