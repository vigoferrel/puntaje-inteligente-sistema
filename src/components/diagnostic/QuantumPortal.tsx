
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Sphere, Ring, Text } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Brain, 
  Atom, 
  Zap, 
  Target, 
  Rocket,
  Eye,
  Cpu
} from 'lucide-react';

interface QuantumPortalProps {
  onEnterDiagnostic: () => void;
  userProfile: any;
  systemMetrics: any;
}

const QuantumOrb: React.FC = () => {
  return (
    <group>
      <Sphere args={[2, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#3B82F6" 
          transparent 
          opacity={0.3}
          wireframe
        />
      </Sphere>
      
      {/* Anillos orbitales */}
      {[1, 2, 3].map((i) => (
        <group key={i} rotation={[Math.PI / 4, 0, 0]}>
          <Ring args={[2.5 + i * 0.5, 2.7 + i * 0.5, 32]} rotation={[Math.PI / 2, 0, 0]}>
            <meshBasicMaterial color="#8B5CF6" transparent opacity={0.6} />
          </Ring>
        </group>
      ))}
      
      {/* Partículas flotantes */}
      {Array.from({ length: 50 }).map((_, i) => (
        <Sphere key={i} args={[0.05]} position={[
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ]}>
          <meshBasicMaterial color="#06B6D4" />
        </Sphere>
      ))}
      
      <Text
        position={[0, 5, 0]}
        fontSize={1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        PORTAL CUÁNTICO
      </Text>
    </group>
  );
};

export const QuantumPortal: React.FC<QuantumPortalProps> = ({
  onEnterDiagnostic,
  userProfile,
  systemMetrics
}) => {
  const [scanPhase, setScanPhase] = useState<'idle' | 'scanning' | 'analyzing' | 'ready'>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [neuralActivity, setNeuralActivity] = useState(0);

  const startNeuralScan = async () => {
    setScanPhase('scanning');
    
    // Simulación de escaneo neural
    for (let i = 0; i <= 100; i += 2) {
      setScanProgress(i);
      setNeuralActivity(Math.random() * 100);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    setScanPhase('analyzing');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setScanPhase('ready');
  };

  const diagnosticSequence = [
    {
      title: "Escaneo Neurológico",
      description: "Analizando patrones de aprendizaje únicos",
      icon: Brain,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Calibración Cuántica",
      description: "Sincronizando con base de datos PAES",
      icon: Atom,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Activación IA",
      description: "Inicializando asistente personalizado",
      icon: Cpu,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Portal Listo",
      description: "Preparado para diagnóstico avanzado",
      icon: Rocket,
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black relative overflow-hidden">
      {/* Fondo de partículas */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-center min-h-screen relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto p-8">
          
          {/* Portal 3D */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-96 h-96 relative">
              <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <QuantumOrb />
              </Canvas>
              
              {/* Efectos de overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-32 h-32 border-2 border-blue-400 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-center mt-8"
            >
              <h1 className="text-4xl font-bold text-white mb-4">
                PORTAL DIAGNÓSTICO
              </h1>
              <p className="text-xl text-blue-300 mb-8">
                Entrada al universo de inteligencia académica
              </p>

              {scanPhase === 'idle' && (
                <Button
                  onClick={startNeuralScan}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg holographic-button"
                >
                  <Eye className="w-6 h-6 mr-3" />
                  Iniciar Escaneo Neural
                </Button>
              )}
            </motion.div>
          </div>

          {/* Panel de información */}
          <div className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-lg border-blue-500/30">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Centro de Diagnóstico Avanzado
                </h2>
                <p className="text-gray-300 mb-6">
                  Bienvenido al sistema más avanzado de evaluación académica. 
                  Nuestro portal cuántico analizará tu perfil de aprendizaje y 
                  creará un universo personalizado de conocimiento.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-600/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">5</div>
                    <div className="text-sm text-blue-300">Materias PAES</div>
                  </div>
                  <div className="text-center p-3 bg-purple-600/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">16</div>
                    <div className="text-sm text-purple-300">Habilidades</div>
                  </div>
                  <div className="text-center p-3 bg-green-600/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">∞</div>
                    <div className="text-sm text-green-300">Ejercicios IA</div>
                  </div>
                  <div className="text-center p-3 bg-orange-600/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-400">24/7</div>
                    <div className="text-sm text-orange-300">LectoGuía</div>
                  </div>
                </div>

                {/* Secuencia de diagnóstico */}
                <div className="space-y-3">
                  {diagnosticSequence.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = 
                      (scanPhase === 'scanning' && index === 0) ||
                      (scanPhase === 'analyzing' && index <= 1) ||
                      (scanPhase === 'ready' && index <= 3);
                    
                    return (
                      <motion.div
                        key={index}
                        className={`flex items-center p-3 rounded-lg transition-all ${
                          isActive 
                            ? 'bg-gradient-to-r ' + step.color + ' bg-opacity-20' 
                            : 'bg-gray-800/50'
                        }`}
                        animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Icon className={`w-6 h-6 mr-3 ${
                          isActive ? 'text-white animate-pulse' : 'text-gray-500'
                        }`} />
                        <div>
                          <div className={`font-medium ${
                            isActive ? 'text-white' : 'text-gray-400'
                          }`}>
                            {step.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {step.description}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Progreso de escaneo */}
                {scanPhase !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6"
                  >
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Progreso Neural</span>
                      <span>{scanProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                    
                    {scanPhase === 'scanning' && (
                      <div className="mt-2 text-center text-blue-300 text-sm">
                        Actividad neural: {Math.round(neuralActivity)}%
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Botón de entrada */}
                {scanPhase === 'ready' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 text-center"
                  >
                    <Button
                      onClick={onEnterDiagnostic}
                      size="lg"
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg holographic-button"
                    >
                      <Rocket className="w-6 h-6 mr-3" />
                      Entrar al Universo PAES
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
