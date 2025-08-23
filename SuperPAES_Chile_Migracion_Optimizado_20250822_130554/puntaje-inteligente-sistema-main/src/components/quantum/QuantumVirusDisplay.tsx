// 🦠 QuantumVirusDisplay.tsx - Visualización del Virus Cuántico PAES 360°
// Leonardo da Vinci: "Ver es creer, infectar es evolucionar"
// Context7 + Modo Secuencial + Visualización Viral en Tiempo Real

import React, { useState, useEffect } from 'react';
import { useQuantumVirusPAES360 } from '../../services/quantum/QuantumVirusPAES360';
import { PAESSubject, ViralNetworkStatus } from '../../types/quantum-virus-types';

interface QuantumVirusDisplayProps {
  userId: string;
  studentProfile: {
    id: string;
    currentScore: number;
    scores: Partial<Record<PAESSubject, number>>;
    targets: Partial<Record<PAESSubject, number>>;
    strengths: string[];
    weaknesses: string[];
    learningStyle: string;
    studyTime: number;
  };
  aspirations: {
    carreraObjetivo: string;
    puntajeObjetivo: number;
    universidadPreferida: string;
    tiempoDisponible: number;
    fortalezas: string[];
    debilidades: string[];
  };
}

const QuantumVirusDisplay: React.FC<QuantumVirusDisplayProps> = ({
  userId,
  studentProfile,
  aspirations
}) => {
  const {
    virus,
    viralStatus,
    infectExercise,
    getQuantumAnalysis,
    getBenchmarkComparison,
    getSkillMapping,
    getPrerequisiteAnalysis
  } = useQuantumVirusPAES360(studentProfile, aspirations);

  const [selectedSubject, setSelectedSubject] = useState<PAESSubject>('competencia_lectora');
  const [viralActivity, setViralActivity] = useState<string[]>([]);

  // 🦠 Simular infección automática de ejercicios
  useEffect(() => {
    const interval = setInterval(() => {
      const mockExercise = {
        id: `exercise_${Date.now()}`,
        subject: selectedSubject,
        question: `Ejercicio de ${selectedSubject}`,
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 'A',
        difficulty: 'INTERMEDIO' as const,
        bloomLevel: 'understand' as const,
        hasVisualContent: Math.random() > 0.5,
        estimatedTime: 120
      };

      const result = infectExercise(mockExercise.id, mockExercise);
      
      if (result.success) {
        setViralActivity(prev => [
          `🦠 Infectado: ${mockExercise.id} | Mutación: ${result.mutationOccurred ? '✅' : '❌'}`,
          ...prev.slice(0, 9)
        ]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedSubject, infectExercise]);

  const benchmark = getBenchmarkComparison();
  const skillMapping = getSkillMapping(selectedSubject);
  const prerequisites = getPrerequisiteAnalysis();

  return (
    <div className="quantum-virus-display bg-black/90 text-white p-6 rounded-xl border border-green-500/30">
      {/* 🧬 Header del Virus Cuántico */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-400 mb-2 flex items-center gap-2">
          🦠 Virus Cuántico PAES 360° - ACTIVO
          <span className="text-sm bg-green-500/20 px-2 py-1 rounded">
            Context7 + Secuencial
          </span>
        </h2>
        <p className="text-gray-300">
          Propagación automática por materias, skills y prerequisitos | Benchmark personalizado vs nacional
        </p>
      </div>

      {/* 📊 Status Viral en Tiempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-900/30 p-4 rounded-lg border border-green-500/30">
          <div className="text-green-300 text-sm">Ejercicios Infectados</div>
          <div className="text-2xl font-bold text-green-400">{viralStatus.infectedCount}</div>
          <div className="text-xs text-green-200">Auto-propagación activa</div>
        </div>
        
        <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
          <div className="text-blue-300 text-sm">Rutas de Propagación</div>
          <div className="text-2xl font-bold text-blue-400">{viralStatus.propagationPaths}</div>
          <div className="text-xs text-blue-200">Conexiones cuánticas</div>
        </div>
        
        <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
          <div className="text-purple-300 text-sm">Etapa Evolutiva</div>
          <div className="text-2xl font-bold text-purple-400">{viralStatus.evolutionStage}</div>
          <div className="text-xs text-purple-200">Mutaciones registradas</div>
        </div>
        
        <div className="bg-red-900/30 p-4 rounded-lg border border-red-500/30">
          <div className="text-red-300 text-sm">Potencia Viral</div>
          <div className="text-2xl font-bold text-red-400">{Math.round(viralStatus.viralPotency * 100)}%</div>
          <div className="text-xs text-red-200">Capacidad de infección</div>
        </div>
      </div>

      {/* 🎯 Selector de Materia */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-3">⚛️ Análisis por Materia (Protones)</h3>
        <div className="flex flex-wrap gap-2">
          {(['competencia_lectora', 'matematica_m1', 'matematica_m2', 'historia', 'ciencias_tp'] as PAESSubject[]).map(subject => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                selectedSubject === subject
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {subject.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 📊 Análisis de Skills por Materia */}
      {skillMapping && (
        <div className="mb-6">
          <h4 className="text-md font-bold text-green-400 mb-3">
            🔬 Skills Infectados - {selectedSubject.replace('_', ' ').toUpperCase()}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="text-sm text-gray-300 mb-2">Nivel de Maestría</div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${skillMapping.masteryLevel}%` }}
                ></div>
              </div>
              <div className="text-xs text-green-300 mt-1">{Math.round(skillMapping.masteryLevel)}%</div>
            </div>
            
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="text-sm text-gray-300 mb-2">Skills Principales</div>
              <div className="flex flex-wrap gap-1">
                {skillMapping.coreSkills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🌀 Prerequisitos en Órbita (Electrones) */}
      <div className="mb-6">
        <h4 className="text-md font-bold text-blue-400 mb-3">🌀 Prerequisitos en Órbita (Electrones)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {prerequisites.map((orbit, index) => (
            <div key={index} className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
              <div className="text-blue-300 text-sm mb-2">Órbita Nivel {orbit.orbitLevel}</div>
              <div className="text-xs text-blue-200 mb-2">
                Velocidad: {Math.round(orbit.rotationSpeed * 100)}%
              </div>
              <div className="text-xs text-blue-200">
                Túnel Cuántico: {orbit.quantumTunnel ? '✅' : '❌'}
              </div>
              <div className="mt-2">
                <div className="text-xs text-gray-300">{orbit.prerequisites.length} prerequisitos</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📈 Benchmark vs Nacional (Núcleo) */}
      <div className="mb-6">
        <h4 className="text-md font-bold text-yellow-400 mb-3">🎯 Núcleo: Benchmark vs Nacional</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/30">
            <div className="text-yellow-300 text-sm mb-2">Puntaje Actual vs Nacional</div>
            <div className="flex items-center gap-4">
              <div>
                <div className="text-lg font-bold text-white">{benchmark.studentScore}</div>
                <div className="text-xs text-yellow-200">Tu puntaje</div>
              </div>
              <div className="text-yellow-400">vs</div>
              <div>
                <div className="text-lg font-bold text-gray-300">{benchmark.nationalAverage}</div>
                <div className="text-xs text-gray-400">Promedio nacional</div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/30">
            <div className="text-yellow-300 text-sm mb-2">Evolución Viral</div>
            <div className="text-lg font-bold text-yellow-400">
              {Math.round(benchmark.evolutionRate * 100)}% / día
            </div>
            <div className="text-xs text-yellow-200">Tasa de mejora automática</div>
          </div>
        </div>
      </div>

      {/* 🦠 Actividad Viral en Tiempo Real */}
      <div>
        <h4 className="text-md font-bold text-red-400 mb-3">🦠 Log de Infecciones (Tiempo Real)</h4>
        <div className="bg-gray-900/50 p-4 rounded-lg border border-red-500/30 max-h-40 overflow-y-auto">
          {viralActivity.length === 0 ? (
            <div className="text-gray-400 text-sm">Esperando infecciones automáticas...</div>
          ) : (
            viralActivity.map((activity, index) => (
              <div key={index} className="text-xs text-green-300 mb-1 font-mono">
                {activity}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🌟 Context7 Indicator */}
      <div className="mt-4 text-center">
        <div className="text-xs text-gray-400">
          🧠 Context7 Activo | 🔄 Modo Secuencial | ⚛️ Propagación Cuántica Infinita
        </div>
      </div>
    </div>
  );
};

export default QuantumVirusDisplay;