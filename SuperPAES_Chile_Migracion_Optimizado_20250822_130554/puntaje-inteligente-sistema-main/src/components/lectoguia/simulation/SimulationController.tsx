/* eslint-disable react-refresh/only-export-components */

import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Card, CardContent } from '../../../components/ui/card';
import { SimulationSelector } from './SimulationSelector';
import { SimulationInterface } from './SimulationInterface';
import { SimulationResults } from './SimulationResults';
import { useSimulation } from '../../../hooks/lectoguia/use-simulation';
import { Loader2 } from 'lucide-react';

/**
 * Controlador principal para manejar todo el flujo de simulaciones PAES
 */
export const SimulationController: React.FC = () => {
  const [stage, setStage] = useState<'select' | 'running' | 'results'>('select');
  
  const {
    selectedSimulation,
    currentQuestion,
    answers,
    timeRemaining,
    simulationResults,
    isLoading,
    handleSelectSimulation,
    handleStartSimulation,
    handleAnswerSelect,
    handleFinishSimulation,
    handleNavigation
  } = useSimulation();
  
  // Mostrar el componente apropiado segÃºn la etapa de la simulaciÃ³n
  const renderContent = () => {
    switch (stage) {
      case 'select':
        return (
          <SimulationSelector 
            onSelectSimulation={handleSelectSimulation}
            onStartSimulation={() => {
              handleStartSimulation();
              setStage('running');
            }}
            selectedSimulation={selectedSimulation}
            isLoading={isLoading}
          />
        );
      case 'running':
        return (
          <SimulationInterface
            currentQuestion={currentQuestion}
            answers={answers}
            timeRemaining={timeRemaining}
            onAnswerSelect={handleAnswerSelect}
            onFinish={() => {
              handleFinishSimulation();
              setStage('results');
            }}
            onNavigateQuestion={handleNavigation}
            totalQuestions={selectedSimulation?.questionCount || 0}
            currentQuestionIndex={currentQuestion?.index || 0}
          />
        );
      case 'results':
        return (
          <SimulationResults
            results={simulationResults}
            onReturnToSelector={() => setStage('select')}
          />
        );
    }
  };

  return (
    <div className="w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <Card className="bg-card">
        <CardContent className="p-4 md:p-6">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

