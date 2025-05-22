
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export const LectoGuiaHeader = () => {
  return (
    <Card className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-none shadow-md overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-lg shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              LectoGuía AI
            </h1>
            <p className="text-muted-foreground mt-1">
              Tu asistente de Comprensión Lectora potenciado por inteligencia artificial
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
