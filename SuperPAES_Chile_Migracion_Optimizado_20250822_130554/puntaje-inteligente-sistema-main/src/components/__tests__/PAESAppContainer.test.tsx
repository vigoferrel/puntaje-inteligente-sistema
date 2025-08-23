import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PAESAppContainer from '../PAESAppContainer';
import { UnifiedAchievementProvider } from '../../core/gamification/UnifiedAchievementEngine';
import ErrorBoundary from '../ErrorBoundary';
import { vi } from 'vitest';

vi.mock('../3d/PAES3DExperience', () => ({
  default: () => <div>Mocked PAES3DExperience</div>,
}));

const TEST_USER_ID = 'test-user-id';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <UnifiedAchievementProvider userId={TEST_USER_ID}>
      <ErrorBoundary>
        {ui}
      </ErrorBoundary>
    </UnifiedAchievementProvider>
  );
};

describe('PAESAppContainer', () => {
  test('renderiza botones de navegación', () => {
    renderWithProviders(<PAESAppContainer />);
    expect(screen.getByText('Experiencia 3D')).toBeInTheDocument();
    expect(screen.getByText('Optimización Móvil')).toBeInTheDocument();
  });

  test('cambia a vista de optimización móvil al hacer click', () => {
    renderWithProviders(<PAESAppContainer />);
    fireEvent.click(screen.getByText('Optimización Móvil'));
    expect(screen.getByText('Optimización PAES - Móvil')).toBeInTheDocument();
  });

  test('cambia a vista de experiencia 3D al hacer click', () => {
    renderWithProviders(<PAESAppContainer />);
    fireEvent.click(screen.getByText('Optimización Móvil'));
    fireEvent.click(screen.getByText('Experiencia 3D'));
    // El texto 'Matemáticas' no está presente porque el componente 3D está mockeado
    // Se puede verificar que el mock se renderiza en su lugar
    expect(screen.getByText('Mocked PAES3DExperience')).toBeInTheDocument();
  });
});
