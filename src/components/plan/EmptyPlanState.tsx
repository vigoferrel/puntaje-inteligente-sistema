
import React from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpenIcon, PlusCircleIcon, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyPlanStateProps {
  onCreatePlan: () => void;
  loading?: boolean;
}

export const EmptyPlanState = ({ onCreatePlan, loading = false }: EmptyPlanStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mb-6 border-2 hover:border-primary/20 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-center">Crea tu Plan de Estudio</CardTitle>
          <CardDescription className="text-center">
            Aún no tienes un plan de estudio personalizado. Vamos a crear uno basado en tu diagnóstico.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-4 text-center">
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4"
              animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                repeatType: "reverse"
              }}
            >
              <BookOpenIcon className="h-8 w-8 text-primary" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">Plan Personalizado</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Crearemos un plan adaptado a tus necesidades según tu diagnóstico y carrera objetivo.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            onClick={onCreatePlan}
            disabled={loading}
            size="lg"
            className="px-6"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Creando plan...
              </>
            ) : (
              <>
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Crear mi Plan de Estudio
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
