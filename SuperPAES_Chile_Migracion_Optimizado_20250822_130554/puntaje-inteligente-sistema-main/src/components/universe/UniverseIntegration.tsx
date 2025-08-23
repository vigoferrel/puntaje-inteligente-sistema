/* eslint-disable react-refresh/only-export-components */
// Optimizado con Context7 - React.memo aplicado
import React, { useEffect } from 'react'
import { memo } from 'react';
import { UniverseExerciseProvider, useUniverseExerciseContext } from './UniverseExerciseProvider';

interface UniverseIntegrationProps {
  children: React.ReactNode;
  universeId: string;
}

/**
 * Componente que detecta automáticamente el universo basado en la URL
 * y proporciona el banco de ejercicios correspondiente
 */
export const UniverseDetector = memo(({ children, universeId }: UniverseIntegrationProps) => {
  const { switchUniverse, currentUniverse } = useUniverseExerciseContext();

  useEffect(() => {
    if (currentUniverse !== universeId) {
      console.log(`🗺️ [UniverseIntegration] Detectado cambio de universo: ${currentUniverse} ➡️ ${universeId}`);
      switchUniverse(universeId);
    }
  }, [universeId, currentUniverse, switchUniverse]);

  return <>{children}</>;
});

/**
 * Wrapper principal que integra el banco de ejercicios con los universos
 */
export const UniverseIntegration = memo(({ children, universeId }: UniverseIntegrationProps) => {
  return (
    <UniverseExerciseProvider defaultUniverse={universeId}>
      <UniverseDetector universeId={universeId}>
        {children}
      </UniverseDetector>
    </UniverseExerciseProvider>
  );
});

/**
 * Hook para detectar el universo actual basado en la URL
 */
export const useUniverseDetection = (): string => {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  
  // Detectar universo basado en la ruta
  if (currentPath.includes('/dash') || currentPath.includes('/dashboard')) {
    return 'dash';
  } else if (currentPath.includes('/brain') || currentPath.includes('/neural')) {
    return 'brain';
  } else {
    return 'paes'; // Universo por defecto
  }
};

/**
 * Componente que muestra estadÃƒÂ­sticas rÃƒÂ¡pidas del banco de ejercicios
 */
export const ExerciseBankStats = memo(() => {
  const { exercises, universeConfig, loading } = useUniverseExerciseContext();

  if (loading || !universeConfig) return null;

  const skillCounts = exercises.reduce((acc, exercise) => {
    // @ts-ignore temporal, corregir tipo de exercise más adelante
    acc[exercise.skill] = (acc[exercise.skill] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const difficultyCounts = exercises.reduce((acc, exercise) => {
    // @ts-ignore temporal, corregir tipo de exercise más adelante
    acc[exercise.difficulty] = (acc[exercise.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <h4 className="font-semibold text-gray-800 mb-3">📚 Banco de Ejercicios - {universeConfig.name}</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total de ejercicios */}
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{exercises.length}</div>
          <div className="text-sm text-gray-500">Total Ejercicios</div>
        </div>

        {/* Por habilidad */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Por Habilidad:</div>
          <div className="space-y-1">
            {Object.entries(skillCounts).slice(0, 3).map(([skill, count]) => (
              <div key={skill} className="flex justify-between text-xs">
                <span className="text-gray-600">{skill.slice(0, 12)}...</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Por dificultad */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Por Dificultad:</div>
          <div className="space-y-1">
            {Object.entries(difficultyCounts).map(([difficulty, count]) => (
              <div key={difficulty} className="flex justify-between text-xs">
                <span className="text-gray-600 capitalize">{difficulty}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * Componente de navegaciÃƒÂ³n entre universos
 */
export const UniverseNavigator = memo(() => {
  const { currentUniverse, switchUniverse } = useUniverseExerciseContext();

  const universes = [
    { id: 'dash', name: 'DASH', icon: '📊', description: 'Dashboard Universe' },
    { id: 'paes', name: 'PAES', icon: '📝', description: 'SuperPAES Universe' },
    { id: 'brain', name: 'BRAIN', icon: '🧠', description: 'Neural Hub Universe' }
  ];

  return (
    <div className="flex space-x-2 mb-4">
      {universes.map(universe => (
        <button
          key={universe.id}
          onClick={() => switchUniverse(universe.id)}
          className={`
            flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
            ${currentUniverse === universe.id 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
          title={universe.description}
        >
          <span>{universe.icon}</span>
          <span>{universe.name}</span>
        </button>
      ))}
    </div>
  );
});

/**
 * Componente que muestra ejercicios disponibles para una habilidad especÃƒÂ­fica
 */
interface SkillExercisesProps {
  skill: string;
  limit?: number;
}

export const SkillExercises = memo(({ skill, limit = 5 }: SkillExercisesProps) => {
  const { exercises } = useUniverseExerciseContext();

  const skillExercises = exercises
    // @ts-ignore temporal, corregir tipo de exercise más adelante
    .filter(exercise => exercise.skill === skill)
    .slice(0, limit);

  if (skillExercises.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No hay ejercicios disponibles para la habilidad {skill}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h5 className="font-medium text-gray-800">Ejercicios - {skill}</h5>
      {skillExercises.map(exercise => (
        <div key={exercise.id} className="border rounded-lg p-3 hover:bg-gray-50">
          <div className="flex justify-between items-start mb-2">
            {/* @ts-ignore temporal, corregir tipo de exercise más adelante */}
            <h6 className="font-medium text-sm">{exercise.title}</h6>
            <span className={`
              px-2 py-1 text-xs rounded-full
              ${exercise.difficulty === 'basic' ? 'bg-green-100 text-green-800' :
                exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'}
            `}>
              {/* @ts-ignore temporal, corregir tipo de exercise más adelante */}
              {exercise.difficulty}
            </span>
          </div>
          {/* @ts-ignore temporal, corregir tipo de exercise más adelante */}
          <p className="text-sm text-gray-600 line-clamp-2">{exercise.content}</p>
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            {/* @ts-ignore temporal, corregir tipo de exercise más adelante */}
            <span>⏱️ {exercise.estimatedTime} min</span>
            {/* @ts-ignore temporal, corregir tipo de exercise más adelante */}
            <span>🎯 {exercise.prueba}</span>
          </div>
        </div>
      ))}
    </div>
  );
});

export default UniverseIntegration;
