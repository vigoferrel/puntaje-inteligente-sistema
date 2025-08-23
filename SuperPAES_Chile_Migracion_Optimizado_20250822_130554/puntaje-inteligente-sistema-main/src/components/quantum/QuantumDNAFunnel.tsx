// 🧬 QuantumDNAFunnel.tsx - Visualización ADN Cuántico del Funnel SuperPAES
// Context7 + Pensamiento Secuencial | Diseño visual puro sin iconos

import React from 'react';
import { useQuantumFunnel } from '../../hooks/useQuantumFunnel';
import '../../styles/QuantumDNAVisual.css';

/**
 * Componente principal del Funnel Visual ADN Cuántico
 * Representa las 5 capas del backend como doble hélice educativa
 */
const QuantumDNAFunnel: React.FC = () => {
  const {
    currentUser,
    metrics,
    patterns,
    recommendations,
    isLoading,
    isInitialized
  } = useQuantumFunnel();

  if (isLoading || !isInitialized) {
    return (
      <div className="quantum-dna-container">
        <div className="quantum-dna-header">
          <div className="quantum-dna-title">Inicializando ADN Cuántico</div>
          <div className="quantum-dna-subtitle">Entrelazando las 5 capas del sistema...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="quantum-dna-container">
      
      {/* 🧬 Header con Doble Hélice ADN */}
      <div className="quantum-dna-header">
        <div className="quantum-dna-title">
          SuperPAES Quantum DNA System
        </div>
        <div className="quantum-dna-subtitle">
          Funnel Educativo de 5 Capas Entrelazadas Exponencialmente
        </div>
        
        {/* Representación Visual de Doble Hélice */}
        <div className="quantum-dna-helix">
          <div className="quantum-dna-strand">
            <div className="quantum-dna-base"></div>
            <div className="quantum-dna-base"></div>
            <div className="quantum-dna-base"></div>
            <div className="quantum-dna-base"></div>
          </div>
          <div className="quantum-dna-strand">
            <div className="quantum-dna-base"></div>
            <div className="quantum-dna-base"></div>
            <div className="quantum-dna-base"></div>
            <div className="quantum-dna-base"></div>
          </div>
        </div>

        {/* Métricas Cuánticas en Header */}
        {metrics && (
          <div style={{ marginTop: '2rem' }}>
            <span className="quantum-metric quantum-metric-analytics">
              Precisión: {metrics.accuracy}%
            </span>
            <span className="quantum-metric quantum-metric-exercise">
              Velocidad: {metrics.speed}
            </span>
            <span className="quantum-metric quantum-metric-ui">
              Consistencia: {metrics.consistency}
            </span>
            <span className="quantum-metric quantum-metric-data">
              Mejora: +{metrics.improvement}%
            </span>
          </div>
        )}
      </div>

      {/* 🔬 Capa 1: QuantumDataService - ADENINA */}
      <div className="quantum-layer quantum-layer-data">
        <h2 style={{ color: '#1e3a8a', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          ADENINA - Capa de Persistencia Universal
        </h2>
        <div style={{ color: 'white', marginBottom: '1rem' }}>
          <strong>QuantumDataService:</strong> Base fundamental del ADN educativo
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'rgba(30, 58, 138, 0.2)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ color: '#60a5fa', fontSize: '0.875rem' }}>Operaciones CRUD</div>
            <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>100% Activo</div>
          </div>
          <div style={{ background: 'rgba(30, 58, 138, 0.2)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ color: '#60a5fa', fontSize: '0.875rem' }}>localStorage</div>
            <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Persistente</div>
          </div>
          <div style={{ background: 'rgba(30, 58, 138, 0.2)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ color: '#60a5fa', fontSize: '0.875rem' }}>Patrón Singleton</div>
            <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Instancia Única</div>
          </div>
        </div>
      </div>

      {/* Conector Cuántico */}
      <div className="quantum-connector"></div>

      {/* 🔐 Capa 2: QuantumAuthService - TIMINA */}
      <div className="quantum-layer quantum-layer-auth">
        <h2 style={{ color: '#7c3aed', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          TIMINA - Capa de Identidad Cuántica
        </h2>
        <div style={{ color: 'white', marginBottom: '1rem' }}>
          <strong>QuantumAuthService:</strong> Autenticación inteligente y gestión de usuarios
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'rgba(124, 58, 237, 0.2)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ color: '#a78bfa', fontSize: '0.875rem' }}>Usuario Actual</div>
            <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>
              {currentUser ? currentUser.name : 'No autenticado'}
            </div>
          </div>
          <div style={{ background: 'rgba(124, 58, 237, 0.2)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ color: '#a78bfa', fontSize: '0.875rem' }}>Sesión</div>
            <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Activa</div>
          </div>
          <div style={{ background: 'rgba(124, 58, 237, 0.2)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ color: '#a78bfa', fontSize: '0.875rem' }}>Progreso Total</div>
            <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>
              {currentUser ? Object.keys(currentUser.progress).length : 0} materias
            </div>
          </div>
        </div>
      </div>

      {/* Conector Cuántico */}
      <div className="quantum-connector"></div>

      {/* 🎯 Capa 3: QuantumExerciseService - GUANINA */}
      <div className="quantum-layer quantum-layer-exercise">
        <h2 style={{ color: '#059669', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          GUANINA - Capa de Acción Educativa
        </h2>
        <div style={{ color: 'white', marginBottom: '1rem' }}>
          <strong>QuantumExerciseService:</strong> Generador dinámico de ejercicios personalizados
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'rgba(5, 150, 105, 0.2)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ color: '#34d399', fontSize: '0.875rem' }}>Materias PAES</div>
            <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>5 Competencias</div>
          </div>
          <div style={{ background: 'rgba(5, 150, 105, 0.2)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ color: '#34d399', fontSize: '0.875rem' }}>Dificultad</div>
            <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Adaptativa</div>
          </div>
          <div style={{ background: 'rgba(5, 150, 105, 0.2)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ color: '#34d399', fontSize: '0.875rem' }}>Generación</div>
            <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Tiempo Real</div>
          </div>
        </div>
      </div>

      {/* Conector Cuántico */}
      <div className="quantum-connector"></div>

      {/* 🤖 Capa 4: QuantumAnalyticsService - CITOSINA */}
      <div className="quantum-layer quantum-layer-analytics">
        <h2 style={{ color: '#dc2626', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          CITOSINA - Capa de Inteligencia Artificial
        </h2>
        <div style={{ color: 'white', marginBottom: '1rem' }}>
          <strong>QuantumAnalyticsService:</strong> IA en tiempo real con métricas avanzadas
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'rgba(220, 38, 38, 0.2)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ color: '#f87171', fontSize: '0.875rem' }}>Predicción IA</div>
            <div style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }}>
              {metrics?.prediction || 'Analizando...'}
            </div>
          </div>
          <div style={{ background: 'rgba(220, 38, 38, 0.2)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ color: '#f87171', fontSize: '0.875rem' }}>Materias Fuertes</div>
            <div style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }}>
              {patterns?.strongSubjects?.join(', ') || 'Calculando...'}
            </div>
          </div>
          <div style={{ background: 'rgba(220, 38, 38, 0.2)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ color: '#f87171', fontSize: '0.875rem' }}>Horario Óptimo</div>
            <div style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }}>
              {patterns?.optimalStudyTime || 'Analizando...'}
            </div>
          </div>
        </div>
        
        {/* Recomendaciones IA */}
        {recommendations.length > 0 && (
          <div style={{ marginTop: '1.5rem', background: 'rgba(220, 38, 38, 0.1)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ color: '#f87171', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Recomendaciones IA Cuánticas:
            </div>
            {recommendations.slice(0, 3).map((rec, index) => (
              <div key={index} style={{ color: 'white', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                • {rec}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conector Cuántico */}
      <div className="quantum-connector"></div>

      {/* 🎨 Capa 5: QuantumUIEnhancer - URACILO */}
      <div className="quantum-layer quantum-layer-ui">
        <h2 style={{ color: '#ea580c', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          URACILO - Capa de Transformación Visual
        </h2>
        <div style={{ color: 'white', marginBottom: '1rem' }}>
          <strong>QuantumUIEnhancer:</strong> Optimización visual inteligente y adaptativa
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'rgba(234, 88, 12, 0.2)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ color: '#fb923c', fontSize: '0.875rem' }}>Tema Dinámico</div>
            <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>ADN Cuántico</div>
          </div>
          <div style={{ background: 'rgba(234, 88, 12, 0.2)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ color: '#fb923c', fontSize: '0.875rem' }}>Optimización</div>
            <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Automática</div>
          </div>
          <div style={{ background: 'rgba(234, 88, 12, 0.2)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ color: '#fb923c', fontSize: '0.875rem' }}>Entrelazamiento</div>
            <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Máximo</div>
          </div>
        </div>
      </div>

      {/* 🧬 Footer con Estado Completo del ADN Cuántico */}
      <div style={{ 
        marginTop: '3rem', 
        padding: '2rem', 
        background: 'rgba(0, 0, 0, 0.4)', 
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          ADN Cuántico SuperPAES - Estado Completo
        </div>
        <div style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1.5rem' }}>
          5 Capas Entrelazadas | 825 Líneas de Código | Entrelazamiento Exponencial
        </div>
        
        {/* Estado de las 5 Capas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div className="quantum-metric quantum-metric-data">
            ADENINA - Data
          </div>
          <div className="quantum-metric quantum-metric-auth">
            TIMINA - Auth
          </div>
          <div className="quantum-metric quantum-metric-exercise">
            GUANINA - Exercise
          </div>
          <div className="quantum-metric quantum-metric-analytics">
            CITOSINA - Analytics
          </div>
          <div className="quantum-metric quantum-metric-ui">
            URACILO - UI
          </div>
        </div>
        
        <div style={{ marginTop: '1.5rem', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
          "El ADN educativo cuántico entrelaza conocimiento, tecnología y evolución en una sola estructura"
        </div>
      </div>
    </div>
  );
};

export default QuantumDNAFunnel;