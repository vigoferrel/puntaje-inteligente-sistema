
import React from 'react';
import { motion } from 'framer-motion';
import { useNeuralSystem } from '@/components/neural/NeuralSystemProvider';
import { HistoryIntegration } from '@/components/paes-history/HistoryIntegration';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function HistoryPage() {
  const { user } = useAuth();
  const { actions } = useNeuralSystem();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user?.id) {
      actions.captureEvent({
        type: 'navigation',
        data: {
          page: 'history',
          subject: 'historia',
          user_action: 'accessing_history_module'
        }
      });
    }
  }, [user?.id, actions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-orange-900">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-white hover:bg-white/10 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Hub Neural
            </Button>
            
            <h1 className="text-4xl font-bold text-white mb-2">
              Historia y Ciencias Sociales
            </h1>
            <p className="text-white/70 text-lg">
              Pensamiento crítico e histórico
            </p>
          </motion.div>

          <HistoryIntegration />
        </div>
      </div>
    </div>
  );
}
