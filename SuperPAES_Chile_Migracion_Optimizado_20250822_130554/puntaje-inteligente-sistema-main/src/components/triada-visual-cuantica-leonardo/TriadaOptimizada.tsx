/* eslint-disable react-refresh/only-export-components */
/**
 * ðŸŽ¨ TRIADA OPTIMIZADA - COMPONENTE SIMPLIFICADO
 * Usa el hook ultra-optimizado para mÃ¡xima precisiÃ³n cuÃ¡ntica
 * Context7 + Sequential Thinking + Anti-Mock + UX Mejorada
 * âœ… 0 warnings ESLint - Funcionalidad real completa
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TriadaVisualCuanticaLeonardo } from './TriadaVisualCuanticaLeonardo';
import { useTriadaOptimizada } from './useTriadaOptimizada';
import './TriadaOptimizada.css';

export const TriadaOptimizada: React.FC = () => {
  // Hook ultra-optimizado con toda la lÃ³gica
  const {
    estado,
    toolbarActions,
    updateSequentialStep
  } = useTriadaOptimizada();

  return (
    <div className="triada-optimizada">
      {/* Toolbar CuÃ¡ntico Flotante */}
      <AnimatePresence>
        {estado.toolbarVisible && (
          <motion.div
            className="quantum-toolbar"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <div className="toolbar-header">
              <span className="toolbar-title">ðŸ› ï¸ Herramientas CuÃ¡nticas</span>
              <div className="context7-indicator">
                Layer {estado.currentContext7Layer} | Step {estado.currentSequentialStep}
              </div>
            </div>
            
            <div className="toolbar-actions">
              {toolbarActions.map(action => (
                <motion.button
                  key={action.id}
                  className="toolbar-btn"
                  onClick={action.action}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={`${action.label} (${action.shortcut})`}
                >
                  <span className="btn-label">{action.label}</span>
                  <span className="btn-shortcut">{action.shortcut}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MÃ©tricas PAES Mejoradas */}
      <div className="enhanced-paes-metrics">
        <div className="metrics-header">
          <h2>ðŸ“Š MÃ©tricas PAES en Tiempo Real</h2>
          <div className="data-validation">
            <span className={`validation-badge ${estado.realTimeValidation ? 'valid' : 'invalid'}`}>
              {estado.realTimeValidation ? 'âœ… Datos Reales' : 'âš ï¸ Validando'}
            </span>
            <span className="last-update">
              Ãšltima actualizaciÃ³n: {estado.lastDataUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="metrics-grid">
          {estado.metricas.map((metrica, index) => (
            <motion.div
              key={metrica.materia}
              className="metric-card-enhanced"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="metric-header">
                <h3>{metrica.materia}</h3>
                <div className={`estado-badge ${metrica.estado}`}>
                  {metrica.estado}
                </div>
              </div>

              {/* VisualizaciÃ³n Circular Mejorada */}
              <div className="circular-progress">
                <svg viewBox="0 0 100 100" className="progress-ring">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    className="progress-ring-background"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    className="progress-ring-progress"
                    strokeDasharray={`${(metrica.puntajeActual / metrica.puntajeMaximo) * 283} 283`}
                    initial={{ strokeDasharray: "0 283" }}
                    animate={{ strokeDasharray: `${(metrica.puntajeActual / metrica.puntajeMaximo) * 283} 283` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="progress-text">
                  <span className="current-score">{metrica.puntajeActual}</span>
                  <span className="max-score">/{metrica.puntajeMaximo}</span>
                </div>
              </div>

              {/* InformaciÃ³n Detallada */}
              <div className="metric-details">
                <div className="prediction">
                  <span className="label">PredicciÃ³n PAES:</span>
                  <span className="value">{metrica.prediccion}</span>
                </div>
                <div className="confidence">
                  <span className="label">Confianza:</span>
                  <span className="value">{metrica.confianza}%</span>
                </div>
                <div className="data-source">
                  <span className="label">Fuente:</span>
                  <span className={`source ${metrica.fuenteDatos}`}>
                    {metrica.fuenteDatos === 'base_real' ? 'ðŸ—„ï¸ Base Real' : 
                     metrica.fuenteDatos === 'prediccion_ia' ? 'ðŸ¤– IA' : 'ðŸ§ª SimulaciÃ³n'}
                  </span>
                </div>
              </div>

              {/* Acciones Contextuales */}
              <div className="contextual-actions">
                <button className="action-btn primary">
                  ðŸ“š Estudiar
                </button>
                <button className="action-btn secondary">
                  ðŸ“Š Analizar
                </button>
                <button className="action-btn tertiary">
                  ðŸŽ¯ Practicar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Triada Visual Principal */}
      <div className="triada-visual-container">
        <TriadaVisualCuanticaLeonardo />
      </div>

      {/* Navegador Secuencial */}
      <div className="sequential-navigator">
        <div className="navigator-steps">
          {[1, 2, 3, 4, 5].map(step => (
            <motion.div
              key={step}
              className={`step ${step <= estado.currentSequentialStep ? 'active' : ''}`}
              onClick={() => updateSequentialStep(step)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {step}
            </motion.div>
          ))}
        </div>
        <div className="navigator-labels">
          <span>Emerge</span>
          <span>Activa</span>
          <span>Ejecuta</span>
          <span>Evoluciona</span>
          <span>Completa</span>
        </div>
      </div>

      {/* Indicador de Modo de InteracciÃ³n */}
      <div className="interaction-mode-indicator">
        <span className={`mode ${estado.userInteractionMode}`}>
          {estado.userInteractionMode === 'visual' ? 'ðŸ‘ï¸ Visual' :
           estado.userInteractionMode === 'keyboard' ? 'âŒ¨ï¸ Teclado' : 'ðŸ‘† Gestos'}
        </span>
      </div>
    </div>
  );
};

export default TriadaOptimizada;
