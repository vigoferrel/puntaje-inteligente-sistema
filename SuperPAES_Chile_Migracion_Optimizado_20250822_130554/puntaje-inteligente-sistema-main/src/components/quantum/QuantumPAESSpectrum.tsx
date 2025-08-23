// 🌈 QuantumPAESSpectrum.tsx - Espectro Visual de las 5 Pruebas PAES
// Context7 + Pensamiento Secuencial | Representación de frecuencias educativas

import React from 'react';
import { useQuantumFunnel } from '../../hooks/useQuantumFunnel';
import '../../styles/QuantumDNAVisual.css';

/**
 * Interface para datos de cada prueba PAES
 */
interface PAESTest {
  name: string;
  code: string;
  frequency: string;
  wavelength: string;
  progress: number;
  color: string;
  description: string;
}

/**
 * Componente del Espectro PAES Cuántico
 * Representa las 5 pruebas como ondas de frecuencia educativa
 */
const QuantumPAESSpectrum: React.FC = () => {
  const {
    currentUser,
    getSubjectProgress,
    generateExercise,
    isLoading
  } = useQuantumFunnel();

  // Definición del espectro PAES con frecuencias educativas
  const paesSpectrum: PAESTest[] = [
    {
      name: 'Competencia Lectora',
      code: 'CL',
      frequency: '380-450 THz',
      wavelength: '700-800 nm',
      progress: getSubjectProgress('lenguaje')?.correct || 0,
      color: '#4338ca', // Violeta-azul
      description: 'Comprensión, análisis e interpretación textual'
    },
    {
      name: 'Competencia Matemática 1',
      code: 'M1',
      frequency: '450-520 THz',
      wavelength: '580-700 nm',
      progress: getSubjectProgress('matematicas')?.correct || 0,
      color: '#059669', // Verde
      description: 'Números, álgebra y funciones'
    },
    {
      name: 'Competencia Matemática 2',
      code: 'M2',
      frequency: '520-570 THz',
      wavelength: '530-580 nm',
      progress: getSubjectProgress('matematicas')?.correct || 0,
      color: '#d97706', // Amarillo-naranja
      description: 'Geometría, probabilidad y estadística'
    },
    {
      name: 'Historia y Ciencias Sociales',
      code: 'HCS',
      frequency: '570-620 THz',
      wavelength: '480-530 nm',
      progress: getSubjectProgress('ciencias')?.correct || 0,
      color: '#dc2626', // Rojo-naranja
      description: 'Historia, geografía y formación ciudadana'
    },
    {
      name: 'Ciencias',
      code: 'CS',
      frequency: '620-750 THz',
      wavelength: '400-480 nm',
      progress: getSubjectProgress('ciencias')?.correct || 0,
      color: '#7c2d12', // Rojo profundo
      description: 'Biología, química y física'
    }
  ];

  const handleGenerateExercise = (testCode: string) => {
    const subjectMap: Record<string, string> = {
      'CL': 'lenguaje',
      'M1': 'matematicas',
      'M2': 'matematicas',
      'HCS': 'ciencias',
      'CS': 'ciencias'
    };
    
    const subject = subjectMap[testCode];
    if (subject) {
      generateExercise(subject);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>
          Calibrando Espectro PAES Cuántico...
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      
      {/* Header del Espectro */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          background: 'linear-gradient(90deg, #4338ca, #059669, #d97706, #dc2626, #7c2d12)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          marginBottom: '1rem'
        }}>
          Espectro PAES Cuántico
        </h1>
        <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.125rem' }}>
          5 Frecuencias Educativas | Ondas de Conocimiento | Análisis Espectral
        </div>
      </div>

      {/* Representación Visual del Espectro */}
      <div style={{ 
        height: '200px', 
        background: 'linear-gradient(90deg, #4338ca 0%, #059669 25%, #d97706 50%, #dc2626 75%, #7c2d12 100%)',
        borderRadius: '16px',
        marginBottom: '3rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Ondas de frecuencia */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `repeating-linear-gradient(
            90deg,
            transparent 0px,
            rgba(255,255,255,0.1) 10px,
            transparent 20px,
            rgba(255,255,255,0.1) 30px
          )`,
          animation: 'quantum-wave 4s linear infinite'
        }} />
        
        {/* Marcadores de frecuencia */}
        {paesSpectrum.map((test, index) => (
          <div
            key={test.code}
            style={{
              position: 'absolute',
              left: `${(index / 4) * 100}%`,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 'bold',
              textShadow: '0 0 10px rgba(0,0,0,0.8)',
              padding: '0.5rem'
            }}
          >
            {test.code}
            <br />
            {test.frequency}
          </div>
        ))}
      </div>

      {/* Análisis Detallado de Cada Prueba */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {paesSpectrum.map((test, index) => (
          <div
            key={test.code}
            style={{
              background: `linear-gradient(135deg, ${test.color}20, ${test.color}10)`,
              border: `2px solid ${test.color}40`,
              borderRadius: '16px',
              padding: '1.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Efecto de onda de fondo */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at ${50 + index * 10}% 50%, ${test.color}15 0%, transparent 70%)`,
              animation: `quantum-pulse ${3 + index * 0.5}s ease-in-out infinite`
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Header de la prueba */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <h3 style={{ 
                    color: test.color, 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold',
                    margin: 0
                  }}>
                    {test.name}
                  </h3>
                  <div style={{
                    background: test.color,
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}>
                    {test.code}
                  </div>
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                  {test.description}
                </div>
              </div>

              {/* Datos espectrales */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ 
                  background: 'rgba(0, 0, 0, 0.3)', 
                  padding: '0.75rem', 
                  borderRadius: '8px' 
                }}>
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem' }}>
                    Frecuencia
                  </div>
                  <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: 'bold' }}>
                    {test.frequency}
                  </div>
                </div>
                <div style={{ 
                  background: 'rgba(0, 0, 0, 0.3)', 
                  padding: '0.75rem', 
                  borderRadius: '8px' 
                }}>
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem' }}>
                    Longitud de Onda
                  </div>
                  <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: 'bold' }}>
                    {test.wavelength}
                  </div>
                </div>
              </div>

              {/* Progreso del usuario */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '0.5rem' 
                }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
                    Progreso Cuántico
                  </span>
                  <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 'bold' }}>
                    {test.progress} ejercicios
                  </span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  background: 'rgba(255, 255, 255, 0.2)', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min((test.progress / 10) * 100, 100)}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${test.color}, ${test.color}80)`,
                    borderRadius: '4px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>

              {/* Botón de acción */}
              <button
                onClick={() => handleGenerateExercise(test.code)}
                style={{
                  width: '100%',
                  background: `linear-gradient(135deg, ${test.color}, ${test.color}80)`,
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 25px ${test.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Generar Ejercicio Cuántico
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer con información espectral */}
      <div style={{ 
        marginTop: '3rem', 
        textAlign: 'center',
        background: 'rgba(0, 0, 0, 0.4)',
        padding: '2rem',
        borderRadius: '16px'
      }}>
        <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Análisis Espectral Completo
        </div>
        <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1.5rem' }}>
          Cada prueba PAES opera en una frecuencia educativa específica, creando un espectro completo de conocimiento
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
          gap: '1rem' 
        }}>
          {paesSpectrum.map((test) => (
            <div
              key={test.code}
              style={{
                background: `linear-gradient(135deg, ${test.color}, ${test.color}80)`,
                color: 'white',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 'bold'
              }}
            >
              {test.code}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuantumPAESSpectrum;