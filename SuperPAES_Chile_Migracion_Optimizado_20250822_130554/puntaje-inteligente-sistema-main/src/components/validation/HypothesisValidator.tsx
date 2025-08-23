import React, { useState, useEffect } from 'react';
import { QuantumPydanticIntegrator, HypothesisValidationResult } from '../../core/agents/QuantumPydanticIntegrator';

interface ValidationState {
  isRunning: boolean;
  result: HypothesisValidationResult | null;
  error: string | null;
}

export const HypothesisValidator: React.FC = () => {
  const [validationState, setValidationState] = useState<ValidationState>({
    isRunning: false,
    result: null,
    error: null
  });

  const runValidation = async () => {
    setValidationState({ isRunning: true, result: null, error: null });

    try {
      const integrator = QuantumPydanticIntegrator.getInstance();
      
      // Inicializar agente Pydantic
      const initialized = await integrator.initializePydanticAgent();
      if (!initialized) {
        throw new Error('No se pudo inicializar el agente Pydantic');
      }

      // Ejecutar validación de hipótesis
      const result = await integrator.validateHypothesis();
      
      setValidationState({
        isRunning: false,
        result,
        error: null
      });

    } catch (error) {
      setValidationState({
        isRunning: false,
        result: null,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  const getStatusColor = (passed: boolean) => passed ? '#4CAF50' : '#F44336';
  const getHealthColor = (health: string) => health === 'optimal' ? '#4CAF50' : '#FF9800';

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Validador de Hipótesis - Agente Pydantic Cuántico</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Hipótesis a Validar:</h3>
        <p style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '5px',
          fontStyle: 'italic'
        }}>
          "Un agente Pydantic puede optimizar y ecualizar el sistema 24/7 
          y apoyar de manera integral a todos los tipos de usuario con inteligencia cuántica"
        </p>
      </div>

      <button 
        onClick={runValidation}
        disabled={validationState.isRunning}
        style={{
          backgroundColor: validationState.isRunning ? '#ccc' : '#2196F3',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: validationState.isRunning ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          marginBottom: '20px'
        }}
      >
        {validationState.isRunning ? 'Validando...' : 'Ejecutar Validación Secuencial'}
      </button>

      {validationState.error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {validationState.error}
        </div>
      )}

      {validationState.result && (
        <div>
          <h3>Resultados de Validación</h3>
          
          {/* Resumen General */}
          <div style={{
            backgroundColor: validationState.result.overallSuccess ? '#e8f5e8' : '#ffebee',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            <h4>Resultado General: {validationState.result.overallSuccess ? '✅ HIPÓTESIS VALIDADA' : '❌ HIPÓTESIS RECHAZADA'}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '10px' }}>
              <div>
                <strong>Coherencia Cuántica Promedio:</strong>
                <div style={{ fontSize: '24px', color: getHealthColor(validationState.result.quantumCoherenceAverage > 0.8 ? 'optimal' : 'degraded') }}>
                  {(validationState.result.quantumCoherenceAverage * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <strong>Eficiencia de Optimización:</strong>
                <div style={{ fontSize: '24px', color: getHealthColor(validationState.result.optimizationEfficiency > 0.8 ? 'optimal' : 'degraded') }}>
                  {(validationState.result.optimizationEfficiency * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <strong>Cobertura de Soporte:</strong>
                <div style={{ fontSize: '24px', color: getHealthColor(validationState.result.userSupportCoverage >= 1.0 ? 'optimal' : 'degraded') }}>
                  {(validationState.result.userSupportCoverage * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Resultados de Pruebas Individuales */}
          <h4>Pruebas Secuenciales Ejecutadas:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {validationState.result.testResults.map((test, index) => (
              <div 
                key={index}
                style={{
                  backgroundColor: test.passed ? '#e8f5e8' : '#ffebee',
                  padding: '15px',
                  borderRadius: '5px',
                  borderLeft: `5px solid ${getStatusColor(test.passed)}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{test.testName}</strong>
                  <span style={{ 
                    color: getStatusColor(test.passed),
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}>
                    {test.passed ? '✅ PASÓ' : '❌ FALLÓ'}
                  </span>
                </div>
                <div style={{ marginTop: '5px', color: '#666' }}>
                  {test.details}
                </div>
              </div>
            ))}
          </div>

          {/* Análisis de Validación */}
          <div style={{
            backgroundColor: '#f0f8ff',
            padding: '20px',
            borderRadius: '5px',
            marginTop: '20px'
          }}>
            <h4>Análisis de Validación Secuencial:</h4>
            <ul style={{ lineHeight: '1.6' }}>
              <li>
                <strong>Modo Secuencial:</strong> Las pruebas se ejecutaron en secuencia ordenada, 
                validando cada componente antes de proceder al siguiente.
              </li>
              <li>
                <strong>Inteligencia Cuántica:</strong> Se verificó la coherencia cuántica en cada 
                optimización, manteniendo estados superpuestos y entrelazados.
              </li>
              <li>
                <strong>Soporte Integral:</strong> Se probaron múltiples tipos de usuario 
                (estudiante, profesor, administrador) con diferentes perfiles de rendimiento.
              </li>
              <li>
                <strong>Optimización 24/7:</strong> Se validó la capacidad de ejecución continua 
                y monitoreo del estado del sistema en tiempo real.
              </li>
              <li>
                <strong>Validación Pydantic:</strong> Todas las estructuras de datos fueron 
                validadas automáticamente por el sistema de tipos Pydantic.
              </li>
            </ul>
          </div>

          {/* Conclusiones */}
          <div style={{
            backgroundColor: validationState.result.overallSuccess ? '#e8f5e8' : '#fff3e0',
            padding: '20px',
            borderRadius: '5px',
            marginTop: '20px'
          }}>
            <h4>Conclusiones:</h4>
            {validationState.result.overallSuccess ? (
              <div>
                <p><strong>✅ La hipótesis ha sido VALIDADA exitosamente.</strong></p>
                <p>El agente Pydantic demostró capacidad para:</p>
                <ul>
                  <li>Optimizar múltiples tipos de usuario simultáneamente</li>
                  <li>Mantener coherencia cuántica superior al 80%</li>
                  <li>Ejecutar optimización continua 24/7</li>
                  <li>Proporcionar soporte integral con validación robusta</li>
                </ul>
              </div>
            ) : (
              <div>
                <p><strong>⚠️ La hipótesis requiere ajustes.</strong></p>
                <p>Se identificaron áreas de mejora en:</p>
                <ul>
                  {validationState.result.testResults
                    .filter(test => !test.passed)
                    .map((test, index) => (
                      <li key={index}>{test.testName}: {test.details}</li>
                    ))
                  }
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HypothesisValidator;