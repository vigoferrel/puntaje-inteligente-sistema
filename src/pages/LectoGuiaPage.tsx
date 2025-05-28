
import React from 'react';
import { LectoGuiaUnified } from '@/modules/lectoguia/LectoGuiaUnified';
import { useNavigate } from 'react-router-dom';

export const LectoGuiaPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <LectoGuiaUnified 
      onNavigate={navigate}
    />
  );
};
