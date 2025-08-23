/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState, ReactNode, useCallback } from 'react';
import { QuantumKidneyContext } from '../../contexts/QuantumKidneyContext';
import { useQuantumKidney } from '../../quantum/quantum-kidney-core';
import { useQuantumMarble } from '../../core/QuantumMarbleOrchestrator';
import type { QuantumKidneyStatus, QuantumKidneyStats, QuantumKidneyContextType } from '../../types/quantum-kidney';

interface QuantumKidneyProviderProps {
  children: ReactNode;
  autoActivate?: boolean;
  silent?: boolean;
}

export const QuantumKidneyProvider: React.FC<QuantumKidneyProviderProps> = ({
  children,
  autoActivate = true,
  silent = true
}) => {
  const { activate, deactivate, forceCleanup, optimize, status, stats, isActive } = useQuantumKidney();
  const marble = useQuantumMarble();

  const activateSystem = useCallback(async () => {
    try {
      await activate();
      marble.setState('quantum_kidney_active', true);
      if (!silent) console.log('Quantum Kidney activated');
    } catch (error) {
      console.error('Activation error:', error);
    }
  }, [activate, marble, silent]);

  useEffect(() => {
    if (autoActivate && !isActive) {
      activateSystem();
    }
  }, [autoActivate, isActive, activateSystem]);

  useEffect(() => {
    if (status && marble) {
      marble.setState('system_health', status.overallHealth);
      if (status.overallHealth < 50) {
        optimize();
      }
    }
  }, [status, marble, optimize]);

  const contextValue: QuantumKidneyContextType = {
    status,
    stats,
    isActive,
    activate: activateSystem,
    deactivate: () => {
      deactivate();
      marble.setState('quantum_kidney_active', false);
    },
    forceCleanup,
    optimize,
    getHealthStatus: () => status?.overallHealth || 0
  };

  return (
    <QuantumKidneyContext.Provider value={contextValue}>
      {children}
    </QuantumKidneyContext.Provider>
  );
};
