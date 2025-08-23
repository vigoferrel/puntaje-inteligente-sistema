import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Mock component para testing
const TestComponent = () => {
  const { user, isLoading, signOut } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <div data-testid="user-info">
        {user ? `Usuario: ${user.email}` : 'No hay usuario'}
      </div>
      <button onClick={signOut} data-testid="signout-btn">
        Cerrar Sesión
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería renderizar el loading state inicialmente', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('debería mostrar usuario guest después de la inicialización', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toHaveTextContent('Usuario: guest@paes.local');
    });
  });

  it('debería permitir cerrar sesión', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Esperar a que cargue el usuario
    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toHaveTextContent('Usuario: guest@paes.local');
    });

    // Hacer click en cerrar sesión
    fireEvent.click(screen.getByTestId('signout-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toHaveTextContent('No hay usuario');
    });
  });

  it('debería manejar el modo emergencia', async () => {
    // Simular modo emergencia
    (window as any).__EMERGENCY_MODE__ = true;

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toHaveTextContent('Usuario: emergency@paes.local');
    });

    // Limpiar
    delete (window as any).__EMERGENCY_MODE__;
  });

  it('debería lanzar error si useAuth se usa fuera del provider', () => {
    // Suprimir console.error para este test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });
});
