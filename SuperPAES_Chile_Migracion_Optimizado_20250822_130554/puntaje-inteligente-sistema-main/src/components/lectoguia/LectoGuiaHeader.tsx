/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { useLectoGuia } from "../../contexts/LectoGuiaContext";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Brain, Dumbbell, LineChart, Trophy, Target, Clock, Zap } from "lucide-react";
import { ConnectionStatusIndicator } from "./ConnectionStatusIndicator";
import { TestTypeSelector } from "./test-selector";
import { useOpenRouter } from "../../hooks/use-openrouter";
import { TPAESPrueba, getPruebaDisplayName } from "../../types/system-types";
import { motion } from "framer-motion";

export const LectoGuiaHeader: FC = () => {
  const { 
    activeTab, 
    setActiveTab,
    selectedPrueba,
    setSelectedTestId,
    skillLevels,
    nodeProgress,
    nodes 
  } = useLectoGuia();
  const { connectionStatus, resetConnectionStatus } = useOpenRouter();
  
  // Calcular mÃ©tricas del tipo de prueba seleccionado
  const testNodes = nodes.filter(node => node.prueba === selectedPrueba);
  
  const completedNodes = Object.entries(nodeProgress)
    .filter(([nodeId, progress]) => 
      testNodes.some(node => node.id === nodeId) && progress.status === 'completed'
    ).length;
  
  const totalNodes = testNodes.length;
  const overallProgress = totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0;
  
  // Obtener habilidades del tipo de prueba actual
  const testSkills = Object.entries(skillLevels).filter(([skill, level]) => {
    // Filtrar habilidades relevantes segÃºn el tipo de prueba
    const skillsByTest = {
      'COMPETENCIA_LECTORA': ['TRACK_LOCATE', 'INTERPRET_RELATE', 'EVALUATE_REFLECT'],
      'MATEMATICA_1': ['SOLVE_PROBLEMS', 'REPRESENT'],
      'MATEMATICA_2': ['MODEL', 'SOLVE_PROBLEMS'],
      'CIENCIAS': ['INTERPRET_RELATE', 'EVALUATE_REFLECT', 'MODEL'],
      'HISTORIA': ['TRACK_LOCATE', 'INTERPRET_RELATE', 'EVALUATE_REFLECT']
    };
    
    return skillsByTest[selectedPrueba || 'COMPETENCIA_LECTORA']?.includes(skill) || false;
  });
  
  const avgSkillLevel = testSkills.length > 0 
    ? testSkills.reduce((sum, [_, level]) => sum + level, 0) / testSkills.length 
    : 0;

  const handleTestSelect = (test: TPAESPrueba) => {
    const testIdMap = {
      'COMPETENCIA_LECTORA': 1,
      'MATEMATICA_1': 2,
      'MATEMATICA_2': 3,
      'CIENCIAS': 4,
      'HISTORIA': 5
    };
    setSelectedTestId(testIdMap[test]);
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Header principal con mÃ©tricas */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <motion.h1 
              className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              LectoGuÃ­a
            </motion.h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {selectedPrueba ? getPruebaDisplayName(selectedPrueba) : 'ComprensiÃ³n Lectora'}
            </Badge>
          </div>
          
          {/* MÃ©tricas rÃ¡pidas */}
          <motion.div 
            className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-1.5">
              <Target className="h-4 w-4 text-green-500" />
              <span>{completedNodes}/{totalNodes} nodos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>{Math.round(avgSkillLevel * 100)}% habilidad promedio</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-blue-500" />
              <span>{testSkills.length} habilidades activas</span>
            </div>
          </motion.div>
          
          {/* Barra de progreso general */}
          <motion.div 
            className="w-full max-w-md"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-muted-foreground">
                Progreso en {selectedPrueba ? getPruebaDisplayName(selectedPrueba) : 'ComprensiÃ³n Lectora'}
              </span>
              <span className="text-xs font-medium text-primary">
                {Math.round(overallProgress)}%
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </motion.div>
        </div>
        
        <div className="flex items-center gap-2">
          <ConnectionStatusIndicator 
            status={connectionStatus}
            onRetry={resetConnectionStatus}
          />
        </div>
      </div>
      
      {/* Selector de tipo de prueba */}
      <TestTypeSelector
        selectedTest={selectedPrueba || 'COMPETENCIA_LECTORA'}
        onTestSelect={handleTestSelect}
      />
      
      {/* NavegaciÃ³n de pestaÃ±as */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 bg-muted/30">
          <TabsTrigger 
            value="chat" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <Brain className="h-4 w-4" />
            <span className="hidden md:inline">Asistente</span>
          </TabsTrigger>
          <TabsTrigger 
            value="exercise" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <Dumbbell className="h-4 w-4" />
            <span className="hidden md:inline">Ejercicios</span>
          </TabsTrigger>
          <TabsTrigger 
            value="progress" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <LineChart className="h-4 w-4" />
            <span className="hidden md:inline">Progreso</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

