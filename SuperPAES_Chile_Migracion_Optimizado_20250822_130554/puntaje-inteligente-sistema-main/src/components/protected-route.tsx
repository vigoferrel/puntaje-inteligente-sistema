/* eslint-disable react-refresh/only-export-components */
import React, { FC, ReactNode, useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/SupabaseAuth";

export const ProtectedRoute: FC<{ children: ReactNode }> = ({ 
  children 
}) => {
  const { user, loading } = useAuth();

  // CORRECCION: Timeout maximo de 2 segundos para loading
  const [forceLoad, setForceLoad] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setForceLoad(true);
    }, 2000); // Maximo 2 segundos de loading
    
    return () => clearTimeout(timer);
  }, []);

  if (loading && !forceLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user && !forceLoad) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

