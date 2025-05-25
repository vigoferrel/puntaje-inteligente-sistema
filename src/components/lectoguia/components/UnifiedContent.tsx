
import React from 'react';
import { motion } from 'framer-motion';
import { ChatInterface } from './modules/ChatInterface';
import { ExerciseInterface } from './modules/ExerciseInterface';
import { PlanInterface } from './modules/PlanInterface';
import { DiagnosticInterface } from './modules/DiagnosticInterface';

interface UnifiedContentProps {
  context: any;
  systemState: any;
  diagnosticIntegration: any;
  planIntegration: any;
  onAction: (action: any) => void;
  onNavigate: (module: string, context?: any) => void;
}

export const UnifiedContent: React.FC<UnifiedContentProps> = ({
  context,
  systemState,
  diagnosticIntegration,
  planIntegration,
  onAction,
  onNavigate
}) => {
  const renderActiveModule = () => {
    switch (context.activeModule) {
      case 'chat':
        return (
          <ChatInterface
            context={context}
            diagnosticIntegration={diagnosticIntegration}
            planIntegration={planIntegration}
            onAction={onAction}
            onNavigate={onNavigate}
          />
        );
      
      case 'exercise':
        return (
          <ExerciseInterface
            context={context}
            onAction={onAction}
            onNavigate={onNavigate}
          />
        );
      
      case 'plan':
        return (
          <PlanInterface
            planIntegration={planIntegration}
            onAction={onAction}
            onNavigate={onNavigate}
          />
        );
      
      case 'diagnostic':
        return (
          <DiagnosticInterface
            diagnosticIntegration={diagnosticIntegration}
            onAction={onAction}
            onNavigate={onNavigate}
          />
        );
      
      default:
        return (
          <div className="text-center py-12">
            <p className="text-white/70">Módulo no encontrado</p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-[calc(100vh-200px)]"
    >
      {renderActiveModule()}
    </motion.div>
  );
};
