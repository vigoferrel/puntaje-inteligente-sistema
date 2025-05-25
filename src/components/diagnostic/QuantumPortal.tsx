
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Zap, 
  Target, 
  Shield,
  Rocket,
  Eye,
  Activity,
  ChevronRight
} from 'lucide-react';

interface QuantumPortalProps {
  onEnterDiagnostic: () => void;
  userProfile: any;
  systemMetrics: any;
}

export const QuantumPortal: React.FC<QuantumPortalProps> = ({
  onEnterDiagnostic,
  userProfile,
  systemMetrics
}) => {
  const [portalEnergy, setPortalEnergy] = useState(0);
  const [quantumReady, setQuantumReady] = useState(false);

  useEffect(() => {
    const energySequence = async () => {
      for (let i = 0; i <= 100; i += 2) {
        setPortalEnergy(i);
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      setQuantumReady(true);
    };

    energySequence();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black relative overflow-hidden">
      {/* Quantum Effects with CSS */}
      <div className="absolute inset-0">
        {/* Animated particles */}
        <div className="quantum-particles">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Energy rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute border border-blue-400/30 rounded-full"
              style={{
                width: `${ring * 200}px`,
                height: `${ring * 200}px`,
              }}
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 5 + ring,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Portal Interface */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-4xl w-full"
        >
          <Card className="bg-black/80 backdrop-blur-lg border-blue-500/50 shadow-2xl">
            <CardContent className="p-8">
              
              {/* Portal Header */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mb-8"
              >
                <div className="relative mb-6">
                  <Brain className="w-20 h-20 text-blue-400 mx-auto animate-pulse" />
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
                </div>
                
                <h1 className="text-4xl font-bold text-white mb-4 tracking-wider">
                  PORTAL CUÁNTICO DE DIAGNÓSTICO
                </h1>
                <p className="text-blue-300 text-lg">
                  Iniciando evaluación neuroadaptativa PAES Pro
                </p>
              </motion.div>

              {/* Energy Status */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-blue-300">Energía Cuántica</span>
                  <span className="text-blue-400 font-mono">{portalEnergy}%</span>
                </div>
                
                <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${portalEnergy}%` }}
                    transition={{ duration: 0.1 }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </motion.div>
                </div>
              </motion.div>

              {/* System Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="bg-gray-900/50 p-4 rounded-lg border border-blue-500/30"
                >
                  <Activity className="w-6 h-6 text-green-400 mb-2" />
                  <div className="text-green-400 font-mono text-sm">SISTEMA ACTIVO</div>
                  <div className="text-white text-xs">Neural Networks Online</div>
                </motion.div>

                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  className="bg-gray-900/50 p-4 rounded-lg border border-purple-500/30"
                >
                  <Target className="w-6 h-6 text-purple-400 mb-2" />
                  <div className="text-purple-400 font-mono text-sm">IA PREPARADA</div>
                  <div className="text-white text-xs">Adaptive Learning Ready</div>
                </motion.div>

                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.6 }}
                  className="bg-gray-900/50 p-4 rounded-lg border border-yellow-500/30"
                >
                  <Zap className="w-6 h-6 text-yellow-400 mb-2" />
                  <div className="text-yellow-400 font-mono text-sm">DIAGNÓSTICO</div>
                  <div className="text-white text-xs">Assessment Module Loaded</div>
                </motion.div>
              </div>

              {/* User Profile */}
              {userProfile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 }}
                  className="bg-gray-900/30 p-4 rounded-lg border border-gray-600/30 mb-8"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold">Usuario Detectado</div>
                      <div className="text-blue-300 text-sm">{userProfile.email}</div>
                    </div>
                    <Badge variant="outline" className="border-green-400 text-green-400">
                      Autorizado
                    </Badge>
                  </div>
                </motion.div>
              )}

              {/* Enter Portal Button */}
              <AnimatePresence>
                {quantumReady && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="text-center"
                  >
                    <Button
                      onClick={onEnterDiagnostic}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-2xl transform transition-all duration-300 hover:scale-105"
                    >
                      <Rocket className="w-6 h-6 mr-3" />
                      INICIAR DIAGNÓSTICO CUÁNTICO
                      <ChevronRight className="w-6 h-6 ml-3" />
                    </Button>
                    
                    <p className="text-gray-400 text-sm mt-4">
                      Preparado para evaluación neuroadaptativa
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
