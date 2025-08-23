
import React from 'react';
import { SuperPAESMain } from '@/components/super-paes/SuperPAESMain';
import { motion } from 'framer-motion';
import { useIntersectional } from '@/contexts/IntersectionalProvider';
import { useAuth } from '@/contexts/AuthContext';

export default function SuperPAES() {
  const { user } = useAuth();
  const {
    isIntersectionalReady,
    adaptToUser
  } = useIntersectional();

  React.useEffect(() => {
    if (user?.id && isIntersectionalReady) {
      adaptToUser({
        superpaes_activation: true,
        neural_context: 'vocational_coordination',
        user_action: 'accessing_superpaes_system'
      });
      console.log('🧠 SuperPAES: Activando coordinación vocacional neural');
    }
  }, [user?.id, isIntersectionalReady, adaptToUser]);

  if (!isIntersectionalReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          className="text-center text-white space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full mx-auto animate-spin" />
          <div className="text-xl font-bold">Activando SuperPAES Neural</div>
          <div className="text-sm text-purple-200">Conectando al sistema nervioso central...</div>
        </motion.div>
      </div>
    );
  }

  return <SuperPAESMain />;
}
