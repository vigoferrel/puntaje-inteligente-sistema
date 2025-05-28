
import React from 'react';
import { PlanningUnified } from '@/modules/planning/PlanningUnified';
import { useNavigate } from 'react-router-dom';

export const PlanningPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PlanningUnified 
      onNavigate={navigate}
    />
  );
};
