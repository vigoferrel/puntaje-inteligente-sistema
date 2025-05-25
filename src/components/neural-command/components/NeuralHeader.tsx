
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NeuralHeaderProps {
  isIntersectionalReady: boolean;
}

export const NeuralHeader: React.FC<NeuralHeaderProps> = ({ isIntersectionalReady }) => {
  const { user } = useAuth();

  return (
    <motion.div 
      className="text-center mb-8"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center justify-center space-x-3 mb-4">
        <Brain className="w-10 h-10 text-blue-400" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-poppins">
          Centro de Comando Neural PAES
        </h1>
        <Zap className="w-8 h-8 text-yellow-400" />
      </div>
      <p className="text-xl text-blue-200 mb-4 font-poppins">
        Ecosistema Neural Unificado • {user?.email || 'Comandante Neural'}
      </p>
      <Badge className="bg-green-600 text-white font-poppins">
        {isIntersectionalReady ? 'Todas las Dimensiones Conectadas' : 'Activando Neural...'}
      </Badge>
    </motion.div>
  );
};
