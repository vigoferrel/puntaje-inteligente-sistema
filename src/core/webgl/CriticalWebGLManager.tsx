
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ultraStableWebGL } from './UltraStableWebGLManager';

interface CriticalWebGLContextType {
  requestContext: (id: string, priority?: 'critical' | 'high' | 'medium' | 'low') => Promise<boolean>;
  releaseContext: (id: string) => void;
  canCreateContext: boolean;
  emergencyMode: boolean;
  deviceCapabilities: any;
}

const CriticalWebGLContext = createContext<CriticalWebGLContextType | undefined>(undefined);

export const useCriticalWebGL = () => {
  const context = useContext(CriticalWebGLContext);
  if (!context) {
    throw new Error('useCriticalWebGL must be used within CriticalWebGLProvider');
  }
  return context;
};

export const CriticalWebGLProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [canCreateContext, setCanCreateContext] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    isLowEnd: false,
    isMobile: false
  });

  useEffect(() => {
    const status = ultraStableWebGL.getStatus();
    setCanCreateContext(!status.emergencyMode);
    setEmergencyMode(status.emergencyMode);
    setDeviceCapabilities(status.deviceCapabilities);
  }, []);

  const requestContext = async (id: string, priority: 'critical' | 'high' | 'medium' | 'low' = 'medium') => {
    return await ultraStableWebGL.requestContext(id, priority);
  };

  const releaseContext = (id: string) => {
    ultraStableWebGL.releaseContext(id);
  };

  return (
    <CriticalWebGLContext.Provider value={{
      requestContext,
      releaseContext,
      canCreateContext,
      emergencyMode,
      deviceCapabilities
    }}>
      {children}
    </CriticalWebGLContext.Provider>
  );
};
