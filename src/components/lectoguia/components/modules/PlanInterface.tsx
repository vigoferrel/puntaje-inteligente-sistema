
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus } from 'lucide-react';

interface PlanInterfaceProps {
  planIntegration: any;
  onAction: (action: any) => void;
  onNavigate: (module: string, context?: any) => void;
}

export const PlanInterface: React.FC<PlanInterfaceProps> = ({
  planIntegration,
  onAction,
  onNavigate
}) => {
  return (
    <div className="space-y-6">
      <Card className="bg-white/5 backdrop-blur border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Mi Plan de Estudio
          </CardTitle>
        </CardHeader>
        <CardContent>
          {planIntegration.currentPlan ? (
            <div>
              <h3 className="text-white font-medium mb-2">
                {planIntegration.currentPlan.title}
              </h3>
              <p className="text-white/70 mb-4">
                {planIntegration.currentPlan.description}
              </p>
              <Button onClick={() => onNavigate('plan')}>
                Ver Plan Completo
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-white/70 mb-4">
                No tienes un plan de estudio activo. Te ayudo a crear uno personalizado.
              </p>
              <Button onClick={() => onAction({ 
                type: 'CREATE_PLAN',
                payload: { 
                  title: 'Mi Plan PAES 2024',
                  description: 'Plan personalizado basado en diagnósticos'
                }
              })}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Plan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
