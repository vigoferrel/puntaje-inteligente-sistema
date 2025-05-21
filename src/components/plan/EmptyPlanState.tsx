
import React from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpenIcon, PlusCircleIcon } from "lucide-react";

interface EmptyPlanStateProps {
  onCreatePlan: () => void;
}

export const EmptyPlanState = ({ onCreatePlan }: EmptyPlanStateProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Crea tu Plan de Estudio</CardTitle>
        <CardDescription>
          Aún no tienes un plan de estudio personalizado. Vamos a crear uno basado en tu diagnóstico.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="py-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <BookOpenIcon className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Plan Personalizado</h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Crearemos un plan adaptado a tus necesidades según tu diagnóstico y carrera objetivo.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={onCreatePlan}>
          <PlusCircleIcon className="h-4 w-4 mr-2" />
          Crear mi Plan de Estudio
        </Button>
      </CardFooter>
    </Card>
  );
};
