
import React from 'react';
import { LectoGuiaProvider } from '@/contexts/lectoguia';
import { LectoGuiaContent } from '@/components/lectoguia/LectoGuiaContent';
import { Navigation } from '@/modules/shared/Navigation';
import { useNeuralIntegration } from '@/hooks/use-neural-integration';

interface LectoGuiaUnifiedProps {
  userId?: string;
  onNavigate?: (path: string) => void;
}

export const LectoGuiaUnified: React.FC<LectoGuiaUnifiedProps> = ({ 
  userId, 
  onNavigate 
}) => {
  // Integración neural optimizada
  const {
    broadcastUserAction,
    notifyEngagement
  } = useNeuralIntegration('lectoguia', [
    'reading_comprehension',
    'exercise_generation',
    'progress_tracking'
  ]);

  React.useEffect(() => {
    if (userId) {
      broadcastUserAction('LECTOGUIA_SESSION_START', {
        user_id: userId,
        timestamp: Date.now()
      });
      
      notifyEngagement({
        type: 'module_access',
        module: 'lectoguia',
        user_id: userId
      });
    }
  }, [userId, broadcastUserAction, notifyEngagement]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <LectoGuiaProvider>
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <LectoGuiaContent />
          </div>
        </div>
      </LectoGuiaProvider>
      <Navigation />
    </div>
  );
};
