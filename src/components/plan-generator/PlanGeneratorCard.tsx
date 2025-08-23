
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, BookOpen, Target, TrendingUp, Clock } from 'lucide-react';
import { PlanGeneratorModal } from './PlanGeneratorModal';

interface PlanGeneratorCardProps {
  onPlanCreated: (plan: any) => void;
  className?: string;
}

export const PlanGeneratorCard: React.FC<PlanGeneratorCardProps> = ({
  onPlanCreated,
  className
}) => {
  const [showModal, setShowModal] = useState(false);

  const features = [
    {
      icon: Target,
      title: "Personalizado",
      description: "Basado en tu progreso actual"
    },
    {
      icon: TrendingUp,
      title: "Adaptativo",
      description: "Se ajusta a tu rendimiento"
    },
    {
      icon: Clock,
      title: "Optimizado",
      description: "Secuencia ideal de aprendizaje"
    }
  ];

  return (
    <>
      <Card className={`hover:shadow-lg transition-all duration-300 border-2 border-dashed border-primary/30 hover:border-primary/50 ${className}`}>
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Generar Plan Personalizado</CardTitle>
          <CardDescription className="text-base">
            Crea un plan de estudio inteligente basado en tus objetivos y progreso actual
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-lg p-4 border border-primary/10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium text-sm">Plan Inteligente</h4>
                <p className="text-xs text-muted-foreground">
                  Analiza 89+ nodos de aprendizaje disponibles
                </p>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Nuevo
              </Badge>
            </div>
            
            <Button 
              onClick={() => setShowModal(true)}
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Crear Mi Plan
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              ⚡ Generación instantánea • 🎯 Completamente personalizado
            </p>
          </div>
        </CardContent>
      </Card>

      <PlanGeneratorModal
        open={showModal}
        onOpenChange={setShowModal}
        onPlanCreated={onPlanCreated}
      />
    </>
  );
};
