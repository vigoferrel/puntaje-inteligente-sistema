
import React from 'react';
import { PlanInteligente } from './PlanInteligente';
import { useAuth } from '@/contexts/AuthContext';
import { useLearningPlan } from '@/hooks/use-learning-plan';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Loader2 } from 'lucide-react';

export const PlanInteligenteWrapper: React.FC = () => {
  const { profile } = useAuth();
  const { createPlan, loading } = useLearningPlan();

  // Mock node progress for now - en el futuro se puede integrar con datos reales
  const mockNodeProgress = {};

  const handleCreatePlan = async () => {
    if (!profile?.id) return;
    
    try {
      await createPlan(
        `Plan Inteligente - ${new Date().toLocaleDateString()}`,
        'Plan generado automáticamente basado en análisis PAES'
      );
    } catch (error) {
      console.error('Error creating plan:', error);
    }
  };

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-300">Cargando Plan Inteligente...</p>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8 text-center">
          <Brain className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <p className="text-gray-300">Necesitas iniciar sesión para acceder al Plan Inteligente</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <PlanInteligente
      profile={profile}
      nodeProgress={mockNodeProgress}
      onCreatePlan={handleCreatePlan}
    />
  );
};
