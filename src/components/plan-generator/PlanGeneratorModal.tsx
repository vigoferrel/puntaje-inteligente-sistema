
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Target, Clock, Brain } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { generateVirtualLearningPlan } from '@/services/learning/virtual-plan-service';
import { toast } from '@/components/ui/use-toast';

interface PlanGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlanCreated: (plan: any) => void;
}

export const PlanGeneratorModal: React.FC<PlanGeneratorModalProps> = ({
  open,
  onOpenChange,
  onPlanCreated
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [planConfig, setPlanConfig] = useState({
    title: '',
    description: '',
    focusArea: 'general',
    targetDuration: '30',
    difficulty: 'mixed',
    studyGoal: 'improve_weak_areas'
  });

  const focusAreas = [
    { id: 'general', label: 'Preparación General PAES', icon: BookOpen },
    { id: 'competencia_lectora', label: 'Competencia Lectora', icon: Brain },
    { id: 'matematicas', label: 'Matemáticas', icon: Target },
    { id: 'ciencias', label: 'Ciencias', icon: Brain },
    { id: 'historia', label: 'Historia y Ciencias Sociales', icon: BookOpen }
  ];

  const studyGoals = [
    { id: 'improve_weak_areas', label: 'Mejorar áreas débiles', description: 'Enfócate en habilidades que necesitan refuerzo' },
    { id: 'strengthen_strong_areas', label: 'Fortalecer áreas fuertes', description: 'Perfecciona tus mejores habilidades' },
    { id: 'comprehensive_review', label: 'Repaso integral', description: 'Cubre todas las áreas de manera equilibrada' },
    { id: 'exam_preparation', label: 'Preparación específica PAES', description: 'Enfoque intensivo para el examen' }
  ];

  const handleGeneratePlan = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Debes estar autenticado para generar un plan",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const planTitle = planConfig.title || `Plan ${focusAreas.find(f => f.id === planConfig.focusArea)?.label}`;
      const planDescription = planConfig.description || 
        `Plan personalizado enfocado en ${focusAreas.find(f => f.id === planConfig.focusArea)?.label.toLowerCase()}. ` +
        `Duración estimada: ${planConfig.targetDuration} días.`;

      const generatedPlan = await generateVirtualLearningPlan(
        user.id,
        planTitle,
        planDescription
      );

      if (generatedPlan) {
        onPlanCreated(generatedPlan);
        onOpenChange(false);
        toast({
          title: "¡Plan creado exitosamente!",
          description: `Tu plan "${planTitle}" está listo para comenzar.`
        });
        
        // Reset form
        setStep(1);
        setPlanConfig({
          title: '',
          description: '',
          focusArea: 'general',
          targetDuration: '30',
          difficulty: 'mixed',
          studyGoal: 'improve_weak_areas'
        });
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el plan. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="plan-title">Nombre del Plan (opcional)</Label>
        <Input
          id="plan-title"
          placeholder="Mi Plan de Estudio PAES"
          value={planConfig.title}
          onChange={(e) => setPlanConfig(prev => ({ ...prev, title: e.target.value }))}
        />
      </div>

      <div className="space-y-3">
        <Label>Área de Enfoque</Label>
        <RadioGroup
          value={planConfig.focusArea}
          onValueChange={(value) => setPlanConfig(prev => ({ ...prev, focusArea: value }))}
        >
          {focusAreas.map((area) => (
            <div key={area.id} className="flex items-center space-x-2">
              <RadioGroupItem value={area.id} id={area.id} />
              <label
                htmlFor={area.id}
                className="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                <area.icon className="h-4 w-4" />
                <span>{area.label}</span>
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setStep(2)}>
          Siguiente
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label>Objetivo de Estudio</Label>
        <RadioGroup
          value={planConfig.studyGoal}
          onValueChange={(value) => setPlanConfig(prev => ({ ...prev, studyGoal: value }))}
        >
          {studyGoals.map((goal) => (
            <Card key={goal.id} className="cursor-pointer hover:bg-gray-50">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={goal.id} id={goal.id} />
                  <div className="flex-1">
                    <label
                      htmlFor={goal.id}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {goal.label}
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {goal.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="target-duration">Duración objetivo (días)</Label>
        <Input
          id="target-duration"
          type="number"
          min="7"
          max="90"
          value={planConfig.targetDuration}
          onChange={(e) => setPlanConfig(prev => ({ ...prev, targetDuration: e.target.value }))}
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(1)}>
          Anterior
        </Button>
        <Button onClick={() => setStep(3)}>
          Siguiente
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="plan-description">Descripción (opcional)</Label>
        <Textarea
          id="plan-description"
          placeholder="Describe tus objetivos específicos para este plan..."
          value={planConfig.description}
          onChange={(e) => setPlanConfig(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">Resumen de tu Plan</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span>Área: {focusAreas.find(f => f.id === planConfig.focusArea)?.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span>Objetivo: {studyGoals.find(g => g.id === planConfig.studyGoal)?.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>Duración: {planConfig.targetDuration} días</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(2)}>
          Anterior
        </Button>
        <Button onClick={handleGeneratePlan} disabled={loading}>
          {loading ? "Generando..." : "Crear Plan"}
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generar Plan de Estudio</DialogTitle>
          <DialogDescription>
            Crea un plan personalizado basado en tu progreso y objetivos.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Paso {step} de 3</span>
            <Badge variant="outline">{Math.round((step / 3) * 100)}%</Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </DialogContent>
    </Dialog>
  );
};
