
import React from 'react';
import { LectoGuiaUnified } from '@/modules/lectoguia/LectoGuiaUnified';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const LectoGuiaPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <LectoGuiaUnified 
      userId={user?.id}
      onNavigate={navigate}
    />
  );
};
