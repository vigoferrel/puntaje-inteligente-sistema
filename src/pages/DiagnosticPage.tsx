
import React from 'react';
import { DiagnosticUnified } from '@/modules/diagnostic/DiagnosticUnified';
import { useNavigate } from 'react-router-dom';

export const DiagnosticPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DiagnosticUnified 
      onNavigate={navigate}
    />
  );
};
