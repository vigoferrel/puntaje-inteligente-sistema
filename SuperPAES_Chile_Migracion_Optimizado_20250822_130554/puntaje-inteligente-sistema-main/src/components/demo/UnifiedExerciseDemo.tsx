/**
 * 🎯 UNIFIED EXERCISE DEMO
 * Componente de demostración del sistema unificado de ejercicios
 * Muestra cómo resolver el problema de textos faltantes
 */

import React, { useState } from 'react';
import { UnifiedExerciseView, CompetenciaLectoraView, MatematicaView, CienciasView } from '../unified/UnifiedExerciseView';
import { useUnifiedExerciseSystem } from '../../hooks/useUnifiedExerciseSystem';
import { QuantumMarble } from '../../core/QuantumMarbleOrchestrator';
import '../../styles/UnifiedExerciseView.css';

// 🎯 TIPOS DE DEMOSTRACIÓN
type DemoType = 'competencia-lectora' | 'matematica' | 'ciencias' | 'unified';

// 🎯 COMPONENTE DE DEMOSTRACIÓN
export const UnifiedExerciseDemo: React.FC = () => {
  const [demoType, setDemoType] = useState<DemoType>('competencia-lectora');
  const [showSystemInfo, setShowSystemInfo] = useState(false);
  const exerciseSystem = useUnifiedExerciseSystem();

  // 🎯 MANEJAR CAMBIO DE TIPO DE DEMO
  const handleDemoTypeChange = (type: DemoType) => {
    setDemoType(type);
    
    // 🎯 SINCRONIZAR CON QUANTUM MARBLE
    QuantumMarble.setState('demo_type_changed', {
      type,
      timestamp: Date.now()
    });
  };

  // 🎯 RENDERIZAR COMPONENTE SEGÚN TIPO
  const renderDemoComponent = () => {
    switch (demoType) {
      case 'competencia-lectora':
        return (
          <CompetenciaLectoraView
            skill="INTERPRET_RELATE"
            difficulty="INTERMEDIATE"
            autoGenerate={true}
            showControls={true}
          />
        );
      case 'matematica':
        return (
          <MatematicaView
            skill="SOLVE_PROBLEMS"
            difficulty="INTERMEDIATE"
            autoGenerate={true}
            showControls={true}
          />
        );
      case 'ciencias':
        return (
          <CienciasView
            skill="ANALYZE_DATA"
            difficulty="INTERMEDIATE"
            autoGenerate={true}
            showControls={true}
          />
        );
      case 'unified':
        return (
          <UnifiedExerciseView
            prueba="COMPETENCIA_LECTORA"
            skill="INTERPRET_RELATE"
            difficulty="INTERMEDIATE"
            autoGenerate={true}
            showControls={true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="unified-exercise-demo">
      {/* 🎯 HEADER DE DEMOSTRACIÓN */}
      <div className="demo-header">
        <h1>🎯 Sistema Unificado de Ejercicios PAES</h1>
        <p className="demo-subtitle">
          Solución al problema de textos faltantes en competencia lectora
        </p>
      </div>

      {/* 🎯 CONTROLES DE DEMOSTRACIÓN */}
      <div className="demo-controls">
        <div className="demo-type-selector">
          <h3>📚 Seleccionar Tipo de Prueba</h3>
          <div className="type-buttons">
            <button
              className={`type-button ${demoType === 'competencia-lectora' ? 'active' : ''}`}
              onClick={() => handleDemoTypeChange('competencia-lectora')}
            >
              📖 Competencia Lectora
            </button>
            <button
              className={`type-button ${demoType === 'matematica' ? 'active' : ''}`}
              onClick={() => handleDemoTypeChange('matematica')}
            >
              🔢 Matemática
            </button>
            <button
              className={`type-button ${demoType === 'ciencias' ? 'active' : ''}`}
              onClick={() => handleDemoTypeChange('ciencias')}
            >
              🔬 Ciencias
            </button>
            <button
              className={`type-button ${demoType === 'unified' ? 'active' : ''}`}
              onClick={() => handleDemoTypeChange('unified')}
            >
              ⚛️ Sistema Unificado
            </button>
          </div>
        </div>

        <div className="demo-info-toggle">
          <button
            className="info-toggle-button"
            onClick={() => setShowSystemInfo(!showSystemInfo)}
          >
            {showSystemInfo ? '🔽' : '🔼'} Información del Sistema
          </button>
        </div>
      </div>

      {/* 🎯 INFORMACIÓN DEL SISTEMA */}
      {showSystemInfo && (
        <div className="system-info">
          <div className="info-grid">
            <div className="info-card">
              <h4>🎯 Problema Resuelto</h4>
              <p>Los ejercicios de competencia lectora ahora incluyen textos de lectura obligatorios, resolviendo el problema de preguntas sin contexto.</p>
            </div>
            <div className="info-card">
              <h4>⚛️ Sistema Unificado</h4>
              <p>Un solo orquestador maneja todos los tipos de ejercicios, eliminando duplicaciones y fragmentación del código.</p>
            </div>
            <div className="info-card">
              <h4>🌌 Integración Cuántica</h4>
              <p>Sincronizado con Quantum Marble para estado global y optimización automática del rendimiento.</p>
            </div>
            <div className="info-card">
              <h4>📊 Estado del Sistema</h4>
              <div className="system-stats">
                <div className="stat-item">
                  <span>Cache:</span>
                  <span>{exerciseSystem.orchestratorState.cacheSize} ejercicios</span>
                </div>
                <div className="stat-item">
                  <span>Plantillas:</span>
                  <span>{exerciseSystem.orchestratorState.textTemplatesCount} disponibles</span>
                </div>
                <div className="stat-item">
                  <span>Estado:</span>
                  <span className={exerciseSystem.orchestratorState.isActive ? 'active' : 'inactive'}>
                    {exerciseSystem.orchestratorState.isActive ? '✅ Activo' : '❌ Inactivo'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🎯 COMPONENTE DE DEMOSTRACIÓN */}
      <div className="demo-component">
        {renderDemoComponent()}
      </div>

      {/* 🎯 FOOTER DE DEMOSTRACIÓN */}
      <div className="demo-footer">
        <div className="footer-content">
          <h3>🎯 Beneficios del Sistema Unificado</h3>
          <ul className="benefits-list">
            <li>✅ <strong>Textos obligatorios:</strong> Todos los ejercicios de competencia lectora incluyen textos de lectura</li>
            <li>✅ <strong>Sin duplicaciones:</strong> Un solo sistema maneja todos los tipos de ejercicios</li>
            <li>✅ <strong>Integración cuántica:</strong> Sincronizado con el orquestador global</li>
            <li>✅ <strong>Cache inteligente:</strong> Reutilización eficiente de ejercicios generados</li>
            <li>✅ <strong>Plantillas dinámicas:</strong> Textos variados para evitar repetición</li>
            <li>✅ <strong>Responsive design:</strong> Funciona perfectamente en todos los dispositivos</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// 🎯 ESTILOS ESPECÍFICOS PARA LA DEMOSTRACIÓN
const demoStyles = `
  .unified-exercise-demo {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    min-height: 100vh;
    color: white;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .demo-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .demo-header h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    background: linear-gradient(45deg, #4ecdc4, #44a08d);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .demo-subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
    margin: 0;
  }

  .demo-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .demo-type-selector h3 {
    margin: 0 0 1rem 0;
    color: #4ecdc4;
  }

  .type-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .type-button {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 2px solid transparent;
    padding: 10px 20px;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    font-weight: 600;
  }

  .type-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  .type-button.active {
    background: linear-gradient(45deg, #4ecdc4, #44a08d);
    border-color: #4ecdc4;
    box-shadow: 0 5px 15px rgba(78, 205, 196, 0.3);
  }

  .info-toggle-button {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
  }

  .info-toggle-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  }

  .system-info {
    background: rgba(255, 255, 255, 0.1);
    padding: 2rem;
    border-radius: 20px;
    margin-bottom: 2rem;
    backdrop-filter: blur(10px);
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .info-card {
    background: rgba(255, 255, 255, 0.05);
    padding: 1.5rem;
    border-radius: 15px;
    border-left: 4px solid #4ecdc4;
  }

  .info-card h4 {
    margin: 0 0 1rem 0;
    color: #4ecdc4;
  }

  .info-card p {
    margin: 0;
    line-height: 1.6;
  }

  .system-stats {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
  }

  .stat-item .active {
    color: #2ecc71;
  }

  .stat-item .inactive {
    color: #e74c3c;
  }

  .demo-component {
    margin-bottom: 3rem;
  }

  .demo-footer {
    background: rgba(255, 255, 255, 0.1);
    padding: 2rem;
    border-radius: 20px;
    backdrop-filter: blur(10px);
  }

  .footer-content h3 {
    margin: 0 0 1.5rem 0;
    color: #4ecdc4;
    text-align: center;
  }

  .benefits-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1rem;
  }

  .benefits-list li {
    background: rgba(255, 255, 255, 0.05);
    padding: 1rem;
    border-radius: 10px;
    border-left: 4px solid #2ecc71;
    line-height: 1.5;
  }

  .benefits-list strong {
    color: #4ecdc4;
  }

  @media (max-width: 768px) {
    .unified-exercise-demo {
      padding: 1rem;
    }

    .demo-header h1 {
      font-size: 2rem;
    }

    .demo-controls {
      flex-direction: column;
      align-items: stretch;
    }

    .type-buttons {
      justify-content: center;
    }

    .info-grid {
      grid-template-columns: 1fr;
    }

    .benefits-list {
      grid-template-columns: 1fr;
    }
  }
`;

// 🎯 INYECTAR ESTILOS
const styleSheet = document.createElement('style');
styleSheet.textContent = demoStyles;
document.head.appendChild(styleSheet);

export default UnifiedExerciseDemo;
