
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LEARNING_CYCLE_PHASES_ORDER, TLearningCyclePhase, getLearningCyclePhaseDisplayName } from "@/types/system-types";
import { advanceToNextLearningPhase, setLearningPhase } from "@/services/node/learning-cycle-service";
import { toast } from "@/components/ui/use-toast";
import { ArrowRight, Check } from "lucide-react";

export const PhaseManager = () => {
  const { profile } = useAuth();
  const [selectedPhase, setSelectedPhase] = useState<TLearningCyclePhase>("SKILL_TRAINING");
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePhaseChange = (phase: TLearningCyclePhase) => {
    setSelectedPhase(phase);
  };

  const handleSetPhase = async () => {
    if (!profile?.id) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para cambiar la fase",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const success = await setLearningPhase(profile.id, selectedPhase);
      
      if (success) {
        toast({
          title: "Fase actualizada",
          description: `Tu fase de aprendizaje ha sido actualizada a ${getLearningCyclePhaseDisplayName(selectedPhase)}`,
        });
        
        // Recargar la página para reflejar los cambios
        window.location.reload();
      } else {
        throw new Error("No se pudo actualizar la fase");
      }
    } catch (error) {
      console.error("Error updating phase:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la fase de aprendizaje",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAdvancePhase = async () => {
    if (!profile?.id) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para avanzar de fase",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const nextPhase = await advanceToNextLearningPhase(profile.id);
      
      if (nextPhase) {
        toast({
          title: "Fase avanzada",
          description: `Has avanzado a la fase: ${getLearningCyclePhaseDisplayName(nextPhase)}`,
        });
        
        // Recargar la página para reflejar los cambios
        window.location.reload();
      } else {
        throw new Error("No se pudo avanzar a la siguiente fase");
      }
    } catch (error) {
      console.error("Error advancing phase:", error);
      toast({
        title: "Error",
        description: "No se pudo avanzar a la siguiente fase",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Fase de Aprendizaje</CardTitle>
        <CardDescription>Cambia o avanza la fase actual de aprendizaje</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Seleccionar fase específica:</label>
          <div className="flex gap-2">
            <Select value={selectedPhase} onValueChange={handlePhaseChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una fase" />
              </SelectTrigger>
              <SelectContent>
                {LEARNING_CYCLE_PHASES_ORDER.map((phase) => (
                  <SelectItem key={phase} value={phase}>
                    {getLearningCyclePhaseDisplayName(phase)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSetPhase} disabled={isUpdating} className="gap-2">
              <Check className="h-4 w-4" />
              Establecer
            </Button>
          </div>
        </div>
        
        <div className="pt-2">
          <Button 
            onClick={handleAdvancePhase} 
            disabled={isUpdating} 
            variant="default" 
            className="w-full gap-2"
          >
            Avanzar a siguiente fase 
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
