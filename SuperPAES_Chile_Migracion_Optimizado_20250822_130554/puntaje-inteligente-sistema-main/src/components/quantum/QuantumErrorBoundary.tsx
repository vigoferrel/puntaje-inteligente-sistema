/* eslint-disable react-refresh/only-export-components */
// ðŸ›¡ï¸ QuantumErrorBoundary.tsx - Error Boundary para Sistema CuÃ¡ntico
// Context7 + Pensamiento Secuencial - FASE 3: Resilencia y Error Handling

import React, { Component, ErrorInfo, ReactNode } from 'react';
import styles from './QuantumErrorBoundary.module.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class QuantumErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // ðŸ§¬ Context7: Capturar error y actualizar estado
    console.error('ðŸ›¡ï¸ QuantumErrorBoundary: Error capturado', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // ðŸ” Pensamiento Secuencial: Logging detallado para diagnÃ³stico
    console.error('ðŸ›¡ï¸ QuantumErrorBoundary: Error details', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    this.setState({
      error,
      errorInfo
    });

    // ðŸ“Š Reportar error a sistema de monitoreo (si existe)
    if (typeof window !== 'undefined' && 'reportError' in window) {
      (window as Window & { reportError?: (error: Error) => void }).reportError?.(error);
    }
  }

  private handleRetry = () => {
    // ðŸ”„ Reiniciar estado para intentar renderizar nuevamente
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // ðŸŽ¨ Fallback UI personalizado o por defecto
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.quantumErrorBoundary}>
          <div className={styles.errorIcon}>âš ï¸</div>
          <h2 className={styles.errorTitle}>
            Error en Sistema CuÃ¡ntico
          </h2>
          <p className={styles.errorDescription}>
            Se ha producido un error inesperado en el componente QuantumMaster.
            El sistema estÃ¡ intentando recuperarse automÃ¡ticamente.
          </p>
          
          <div className={styles.buttonContainer}>
            <button
              onClick={this.handleRetry}
              className={styles.retryButton}
            >
              ðŸ”„ Reintentar
            </button>
            <button
              onClick={() => window.location.reload()}
              className={styles.reloadButton}
            >
              ðŸ”ƒ Recargar PÃ¡gina
            </button>
          </div>

          {/* ðŸ” Detalles tÃ©cnicos (solo en desarrollo) */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className={styles.technicalDetails}>
              <summary className={styles.detailsSummary}>
                ðŸ”§ Detalles TÃ©cnicos (Desarrollo)
              </summary>
              <pre className={styles.detailsContent}>
                <strong>Error:</strong> {this.state.error.message}
                {'\n\n'}
                <strong>Stack:</strong>
                {'\n'}{this.state.error.stack}
                {this.state.errorInfo && (
                  <>
                    {'\n\n'}
                    <strong>Component Stack:</strong>
                    {'\n'}{this.state.errorInfo.componentStack}
                  </>
                )}
              </pre>
            </details>
          )}

          <div className={styles.footer}>
            ðŸ§¬ Context7 + Pensamiento Secuencial | Error Boundary Activo
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default QuantumErrorBoundary;
