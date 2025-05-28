
import React, { createContext, useContext } from 'react';

interface CinematicState {
  immersionLevel: 'minimal' | 'standard' | 'full';
  effectsEnabled: boolean;
}

interface CinematicContextType {
  state: CinematicState;
}

const CinematicContext = createContext<CinematicContextType>({
  state: { immersionLevel: 'standard', effectsEnabled: true }
});

export const useCinematic = () => {
  return useContext(CinematicContext);
};

export const CinematicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const state: CinematicState = {
    immersionLevel: 'standard',
    effectsEnabled: true
  };

  return (
    <CinematicContext.Provider value={{ state }}>
      {children}
    </CinematicContext.Provider>
  );
};
