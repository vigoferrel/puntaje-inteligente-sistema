
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyPlanStateProps {
  onCreatePlan: () => void;
}

export function EmptyPlanState({ onCreatePlan }: EmptyPlanStateProps) {
  const [creating, setCreating] = useState(false);

  const handleCreatePlan = () => {
    setCreating(true);
    onCreatePlan();
  };

  // Reset creating state after a timeout (in case the callback doesn't reset it)
  useEffect(() => {
    if (creating) {
      const timer = setTimeout(() => {
        setCreating(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [creating]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Ningún plan seleccionado</CardTitle>
          <CardDescription>
            No tienes ningún plan de estudio activo actualmente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Un plan de estudio te ayudará a organizar tu aprendizaje y prepararte
            efectivamente para la PAES. Crea tu primer plan para comenzar.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleCreatePlan}
            disabled={creating}
            className="w-full"
          >
            {creating ? (
              <>
                <span className="mr-2">Creando plan...</span>
                <RefreshCw className="h-4 w-4 animate-spin" />
              </>
            ) : (
              "Crear mi primer plan"
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
