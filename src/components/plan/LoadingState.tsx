
import React from "react";
import { Card } from "@/components/ui/card";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = "Cargando plan de estudio..." }: LoadingStateProps) => {
  return (
    <Card className="p-8 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
        <p className="text-center text-muted-foreground">
          {message}
        </p>
      </div>
    </Card>
  );
};
