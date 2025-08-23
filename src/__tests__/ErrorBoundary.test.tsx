import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Componente que lanza error para testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  // Suprimir console.error para tests limpios
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it('debería renderizar children cuando no hay error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('debería mostrar UI de error cuando hay un error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error del Sistema')).toBeInTheDocument();
    expect(screen.getByText(/Se produjo un error inesperado/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reintentar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Inicio/i })).toBeInTheDocument();
  });

  it('debería mostrar fallback personalizado cuando se proporciona', () => {
    const customFallback = <div>Custom error fallback</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error fallback')).toBeInTheDocument();
    expect(screen.queryByText('Error del Sistema')).not.toBeInTheDocument();
  });

  it('debería llamar onError callback cuando se proporciona', () => {
    const onErrorMock = vi.fn();

    render(
      <ErrorBoundary onError={onErrorMock}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onErrorMock).toHaveBeenCalledTimes(1);
    expect(onErrorMock).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it('debería mostrar detalles técnicos en desarrollo', () => {
    // Simular entorno de desarrollo
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Detalles técnicos')).toBeInTheDocument();

    // Restaurar entorno
    process.env.NODE_ENV = originalEnv;
  });

  it('debería recuperarse cuando se hace click en Reintentar', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Verificar que se muestra el error
    expect(screen.getByText('Error del Sistema')).toBeInTheDocument();

    // Hacer click en reintentar
    const retryButton = screen.getByRole('button', { name: /Reintentar/i });
    retryButton.click();

    // Re-renderizar sin error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
    expect(screen.queryByText('Error del Sistema')).not.toBeInTheDocument();
  });
});
