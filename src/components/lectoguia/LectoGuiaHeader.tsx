
import React from "react";
import { useLectoGuia } from "@/contexts/LectoGuiaContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Dumbbell, LineChart } from "lucide-react";
import { ConnectionStatusIndicator } from "./ConnectionStatusIndicator";
import { useOpenRouter } from "@/hooks/use-openrouter";

export const LectoGuiaHeader: React.FC = () => {
  const { activeTab, setActiveTab } = useLectoGuia();
  const { connectionStatus, resetConnectionStatus } = useOpenRouter();
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">LectoGuía</h1>
        <div className="flex items-center gap-2">
          <ConnectionStatusIndicator 
            status={connectionStatus}
            onRetry={resetConnectionStatus}
          />
        </div>
      </div>
      
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat" className="flex items-center gap-1.5">
            <Brain className="h-4 w-4" />
            <span className="hidden md:inline">Asistente</span>
          </TabsTrigger>
          <TabsTrigger value="exercise" className="flex items-center gap-1.5">
            <Dumbbell className="h-4 w-4" />
            <span className="hidden md:inline">Ejercicios</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-1.5">
            <LineChart className="h-4 w-4" />
            <span className="hidden md:inline">Progreso</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
