import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGlobalStore } from '@/store/globalStore';

describe('GlobalStore', () => {
  beforeEach(() => {
    // Reset store antes de cada test
    const { actions } = useGlobalStore.getState();
    actions.resetStore();
  });

  it('debería tener el estado inicial correcto', () => {
    const { result } = renderHook(() => useGlobalStore());
    const state = result.current;

    expect(state.system.isInitialized).toBe(false);
    expect(state.system.isLoading).toBe(false);
    expect(state.system.error).toBe(null);
    expect(state.user).toBe(null);
    expect(state.learningNodes).toEqual([]);
    expect(state.ui.isDarkMode).toBe(true);
    expect(state.ui.cinematicMode).toBe(true);
  });

  it('debería permitir establecer un usuario', () => {
    const { result } = renderHook(() => useGlobalStore());
    
    const testUser = {
      id: 'test-user-1',
      email: 'test@example.com',
      name: 'Test User'
    };

    act(() => {
      result.current.actions.setUser(testUser);
    });

    expect(result.current.user).toEqual(testUser);
  });

  it('debería permitir agregar nodos de aprendizaje', () => {
    const { result } = renderHook(() => useGlobalStore());
    
    const testNodes = [
      {
        id: 'node-1',
        code: 'COMP_LECT_1',
        title: 'Comprensión Lectora Básica',
        subject_area: 'COMPETENCIA_LECTORA',
        tier_priority: 'TIER_1'
      },
      {
        id: 'node-2',
        code: 'MAT_ALG_1',
        title: 'Álgebra Básica',
        subject_area: 'MATEMATICA_1',
        tier_priority: 'TIER_1'
      }
    ];

    act(() => {
      result.current.actions.setLearningNodes(testNodes);
    });

    expect(result.current.learningNodes).toEqual(testNodes);
    expect(result.current.learningNodes).toHaveLength(2);
  });

  it('debería permitir actualizar el progreso de un nodo', () => {
    const { result } = renderHook(() => useGlobalStore());
    
    const progressData = {
      node_id: 'node-1',
      user_id: 'user-1',
      mastery_level: 0.75,
      completed_exercises: 15,
      last_activity: new Date().toISOString()
    };

    act(() => {
      result.current.actions.updateNodeProgress('node-1', progressData);
    });

    expect(result.current.userProgress['node-1']).toEqual(progressData);
  });

  it('debería permitir agregar notificaciones', () => {
    const { result } = renderHook(() => useGlobalStore());
    
    const notification = {
      type: 'success' as const,
      message: 'Test notification'
    };

    act(() => {
      result.current.actions.addNotification(notification);
    });

    expect(result.current.ui.notifications).toHaveLength(1);
    expect(result.current.ui.notifications[0].message).toBe('Test notification');
    expect(result.current.ui.notifications[0].type).toBe('success');
    expect(result.current.ui.notifications[0].id).toBeDefined();
  });

  it('debería permitir remover notificaciones', () => {
    const { result } = renderHook(() => useGlobalStore());
    
    // Agregar notificación
    act(() => {
      result.current.actions.addNotification({
        type: 'info',
        message: 'Test notification'
      });
    });

    const notificationId = result.current.ui.notifications[0].id;

    // Remover notificación
    act(() => {
      result.current.actions.removeNotification(notificationId);
    });

    expect(result.current.ui.notifications).toHaveLength(0);
  });

  it('debería permitir alternar el modo oscuro', () => {
    const { result } = renderHook(() => useGlobalStore());
    
    expect(result.current.ui.isDarkMode).toBe(true);

    act(() => {
      result.current.actions.toggleDarkMode();
    });

    expect(result.current.ui.isDarkMode).toBe(false);

    act(() => {
      result.current.actions.toggleDarkMode();
    });

    expect(result.current.ui.isDarkMode).toBe(true);
  });

  it('debería manejar el logout correctamente', () => {
    const { result } = renderHook(() => useGlobalStore());
    
    // Establecer usuario y datos
    act(() => {
      result.current.actions.setUser({ id: 'user-1', email: 'test@example.com' });
      result.current.actions.setCurrentPlan({ id: 'plan-1', title: 'Test Plan' });
      result.current.actions.updateNodeProgress('node-1', { progress: 0.5 });
    });

    // Verificar que los datos están establecidos
    expect(result.current.user).toBeTruthy();
    expect(result.current.currentPlan).toBeTruthy();
    expect(Object.keys(result.current.userProgress)).toHaveLength(1);

    // Hacer logout
    act(() => {
      result.current.actions.logout();
    });

    // Verificar que los datos se limpiaron
    expect(result.current.user).toBe(null);
    expect(result.current.currentPlan).toBe(null);
    expect(result.current.userProgress).toEqual({});
    expect(result.current.system.isInitialized).toBe(false);
  });
});
