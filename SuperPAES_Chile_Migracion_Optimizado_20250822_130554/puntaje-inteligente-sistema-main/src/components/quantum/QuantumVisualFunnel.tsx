// 🌌 QuantumVisualFunnel.tsx - Contenedor Maestro del Funnel Visual Cuántico
// Context7 + Pensamiento Secuencial | Integración completa ADN + Espectro PAES

import React, { useState } from 'react';
import QuantumDNAFunnel from './QuantumDNAFunnel';
import QuantumPAESSpectrum from './QuantumPAESSpectrum';
import '../../styles/QuantumDNAVisual.css';

/**
 * Componente maestro que integra todas las visualizaciones cuánticas
 * Combina el ADN del backend con el espectro PAES educativo
 */
const QuantumVisualFunnel: React.FC = () => {
  const [activeView, setActiveView] = useState<'dna' | 'spectrum' | 'combined'>('combined');

  return (
    <div className="quantum-dna-container">
      
      {/* 🎛️ Selector de Vista */}
      <div style={{ 
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: '1rem',
        borderRadius: '0 0 16px 16px',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1rem',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <button
            onClick={() => setActiveView('combined')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              background: activeView === 'combined' 
                ? 'linear-gradient(135deg, #1e3a8a, #7c3aed, #059669, #dc2626, #ea580c)'
                : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.875rem'
            }}
          >
            Vista Completa
          </button>
          <button
            onClick={() => setActiveView('dna')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              background: activeView === 'dna' 
                ? 'linear-gradient(135deg, #1e3a8a, #7c3aed)'
                : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.875rem'
            }}
          >
            ADN Backend
          </button>
          <button
            onClick={() => setActiveView('spectrum')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              background: activeView === 'spectrum' 
                ? 'linear-gradient(90deg, #4338ca, #059669, #d97706, #dc2626, #7c2d12)'
                : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.875rem'
            }}
          >
            Espectro PAES
          </button>
        </div>
      </div>

      {/* 🌌 Vista Combinada */}
      {activeView === 'combined' && (
        <div>
          {/* Header Unificado */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '3rem',
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.2), rgba(234, 88, 12, 0.2))',
            padding: '3rem 2rem',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #1e3a8a, #7c3aed, #059669, #dc2626, #ea580c)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              marginBottom: '1rem',
              animation: 'quantum-entanglement 8s ease-in-out infinite'
            }}>
              SuperPAES Quantum Funnel
            </h1>
            <div style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              fontSize: '1.25rem',
              marginBottom: '2rem'
            }}>
              Entrelazamiento Exponencial: ADN Backend × Espectro PAES
            </div>
            
            {/* Métricas Unificadas */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '1rem',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <div className="quantum-metric quantum-metric-data">
                5 Capas Backend
              </div>
              <div className="quantum-metric quantum-metric-exercise">
                5 Pruebas PAES
              </div>
              <div className="quantum-metric quantum-metric-analytics">
                IA Tiempo Real
              </div>
              <div className="quantum-metric quantum-metric-ui">
                825 Líneas Código
              </div>
            </div>
          </div>

          {/* Sección ADN Backend */}
          <div style={{ marginBottom: '4rem' }}>
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '2rem',
              padding: '1.5rem',
              background: 'rgba(30, 58, 138, 0.1)',
              borderRadius: '16px',
              border: '1px solid rgba(30, 58, 138, 0.3)'
            }}>
              <h2 style={{ 
                color: '#60a5fa', 
                fontSize: '2rem', 
                fontWeight: 'bold',
                marginBottom: '0.5rem'
              }}>
                ADN del Backend Cuántico
              </h2>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Arquitectura de 5 capas entrelazadas exponencialmente
              </div>
            </div>
            <QuantumDNAFunnel />
          </div>

          {/* Separador Visual */}
          <div style={{
            height: '4px',
            background: 'linear-gradient(90deg, #1e3a8a, #7c3aed, #059669, #dc2626, #ea580c)',
            borderRadius: '2px',
            margin: '4rem 0',
            animation: 'quantum-data-flow 3s linear infinite'
          }} />

          {/* Sección Espectro PAES */}
          <div>
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '2rem',
              padding: '1.5rem',
              background: 'rgba(67, 56, 202, 0.1)',
              borderRadius: '16px',
              border: '1px solid rgba(67, 56, 202, 0.3)'
            }}>
              <h2 style={{ 
                color: '#a78bfa', 
                fontSize: '2rem', 
                fontWeight: 'bold',
                marginBottom: '0.5rem'
              }}>
                Espectro Educativo PAES
              </h2>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                5 frecuencias de conocimiento en el espectro electromagnético educativo
              </div>
            </div>
            <QuantumPAESSpectrum />
          </div>
        </div>
      )}

      {/* 🧬 Vista Solo ADN */}
      {activeView === 'dna' && <QuantumDNAFunnel />}

      {/* 🌈 Vista Solo Espectro */}
      {activeView === 'spectrum' && <QuantumPAESSpectrum />}

      {/* 🔬 Footer Científico */}
      <div style={{ 
        marginTop: '4rem',
        padding: '3rem 2rem',
        background: 'rgba(0, 0, 0, 0.6)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          color: 'white',
          marginBottom: '1rem'
        }}>
          Teoría del Entrelazamiento Educativo Cuántico
        </div>
        <div style={{ 
          color: 'rgba(255, 255, 255, 0.8)', 
          fontSize: '1rem',
          marginBottom: '2rem',
          maxWidth: '800px',
          margin: '0 auto 2rem'
        }}>
          El Funnel Cuántico SuperPAES demuestra que cuando las capas tecnológicas (ADN Backend) 
          se entrelazan con las frecuencias educativas (Espectro PAES), el resultado es una 
          amplificación exponencial del aprendizaje, donde cada interacción genera nuevas 
          posibilidades de conocimiento.
        </div>
        
        {/* Ecuación Cuántica */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '1.5rem',
          borderRadius: '12px',
          fontFamily: 'monospace',
          fontSize: '1.125rem',
          color: '#60a5fa',
          marginBottom: '2rem'
        }}>
          Ψ(SuperPAES) = ∑(ADN_Backend × Espectro_PAES) × e^(iωt)
        </div>
        
        {/* Principios Fundamentales */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <div style={{ 
            background: 'rgba(30, 58, 138, 0.2)', 
            padding: '1rem', 
            borderRadius: '8px' 
          }}>
            <div style={{ color: '#60a5fa', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Principio de Superposición
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
              Múltiples estados de aprendizaje simultáneos
            </div>
          </div>
          <div style={{ 
            background: 'rgba(124, 58, 237, 0.2)', 
            padding: '1rem', 
            borderRadius: '8px' 
          }}>
            <div style={{ color: '#a78bfa', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Entrelazamiento Cuántico
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
              Conexiones instantáneas entre conceptos
            </div>
          </div>
          <div style={{ 
            background: 'rgba(5, 150, 105, 0.2)', 
            padding: '1rem', 
            borderRadius: '8px' 
          }}>
            <div style={{ color: '#34d399', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Colapso de Función de Onda
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
              Materialización del conocimiento
            </div>
          </div>
          <div style={{ 
            background: 'rgba(220, 38, 38, 0.2)', 
            padding: '1rem', 
            borderRadius: '8px' 
          }}>
            <div style={{ color: '#f87171', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Incertidumbre de Heisenberg
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
              Precisión vs velocidad de aprendizaje
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumVisualFunnel;