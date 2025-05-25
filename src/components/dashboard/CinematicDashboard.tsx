
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Text, Html } from '@react-three/drei';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, TrendingUp, Zap, Trophy, Brain, Star, 
  Calendar, BookOpen, Play, Rocket, Crown, Award
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ProgressSphere {
  subject: string;
  progress: number;
  color: string;
  position: [number, number, number];
}

const ProgressOrb: React.FC<ProgressSphere & { onClick: () => void }> = ({
  subject,
  progress,
  color,
  position,
  onClick
}) => {
  const orbRef = React.useRef<any>();

  React.useEffect(() => {
    if (orbRef.current) {
      orbRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={position}>
      <Sphere ref={orbRef} args={[0.8, 32, 32]} onClick={onClick}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </Sphere>
      <Html center>
        <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-center pointer-events-none">
          <div className="font-bold text-sm">{subject}</div>
          <div className="text-xs text-cyan-400">{progress}%</div>
        </div>
      </Html>
    </group>
  );
};

export const CinematicDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const progressData: ProgressSphere[] = [
    { subject: 'Matemática M1', progress: 65, color: '#00FF88', position: [2, 0, 0] },
    { subject: 'Matemática M2', progress: 45, color: '#8833FF', position: [-2, 0, 0] },
    { subject: 'Comp. Lectora', progress: 78, color: '#FF8800', position: [0, 2, 0] },
    { subject: 'Ciencias', progress: 55, color: '#FF3366', position: [0, -2, 0] },
    { subject: 'Historia', progress: 72, color: '#FFAA00', position: [0, 0, 2] }
  ];

  const overallProgress = Math.round(
    progressData.reduce((sum, item) => sum + item.progress, 0) / progressData.length
  );

  const projectedScore = Math.round(400 + (overallProgress / 100) * 450);

  return (
    <div className="h-full p-6 space-y-6 overflow-y-auto">
      {/* Header Cinematográfico */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="bg-gradient-to-r from-black/40 via-purple-900/40 to-black/40 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center"
              >
                <Crown className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Bienvenido, {profile?.name || 'Estudiante'}
                </h1>
                <p className="text-cyan-400">
                  {currentTime.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-4xl font-bold text-cyan-400">{projectedScore}</div>
              <div className="text-sm text-white opacity-80">Proyección PAES</div>
              <Badge className="mt-2 bg-gradient-to-r from-green-600 to-emerald-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                En progreso
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Métricas Principales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Progreso General', value: `${overallProgress}%`, icon: Target, color: 'from-cyan-500 to-blue-500' },
          { label: 'Racha de Estudio', value: '12 días', icon: Zap, color: 'from-yellow-500 to-orange-500' },
          { label: 'Ejercicios Resueltos', value: '847', icon: Trophy, color: 'from-green-500 to-emerald-500' },
          { label: 'Nivel Neural', value: 'Avanzado', icon: Brain, color: 'from-purple-500 to-pink-500' }
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-white/10 hover:border-cyan-500/50 transition-all">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">{metric.value}</div>
                  <div className="text-sm text-gray-300">{metric.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Visualización 3D de Progreso */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Canvas 3D */}
        <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-white/10 h-96">
          <CardContent className="p-0 h-full">
            <div className="relative h-full rounded-lg overflow-hidden">
              <Canvas camera={{ position: [0, 0, 8] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00FFFF" />
                
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
                
                {progressData.map((item, index) => (
                  <ProgressOrb
                    key={item.subject}
                    {...item}
                    onClick={() => console.log(`Navegando a ${item.subject}`)}
                  />
                ))}

                <Text
                  position={[0, 0, -4]}
                  fontSize={0.5}
                  color="#FFFFFF"
                  anchorX="center"
                  anchorY="middle"
                >
                  UNIVERSO PAES
                </Text>
              </Canvas>
              
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white">
                <div className="text-sm font-medium">Vista Galáctica</div>
                <div className="text-xs text-cyan-400">Haz clic en las esferas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Panel de Progreso Detallado */}
        <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-white/10">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              Progreso por Materia
            </h3>
            
            <div className="space-y-4">
              {progressData.map((item, index) => (
                <motion.div
                  key={item.subject}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{item.subject}</span>
                    <span className="text-sm font-bold" style={{ color: item.color }}>
                      {item.progress}%
                    </span>
                  </div>
                  <Progress 
                    value={item.progress} 
                    className="h-2"
                    style={{ 
                      background: 'rgba(255,255,255,0.1)',
                    }}
                  />
                </motion.div>
              ))}
            </div>

            <Button className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
              <Play className="w-4 h-4 mr-2" />
              Continuar Aprendizaje
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Acciones Rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          {
            title: 'LectoGuía IA',
            description: 'Asistente de comprensión lectora',
            icon: BookOpen,
            color: 'from-orange-500 to-red-500',
            action: 'Abrir Chat'
          },
          {
            title: 'Evaluación Diagnóstica',
            description: 'Mide tu nivel actual',
            icon: Target,
            color: 'from-blue-500 to-indigo-500',
            action: 'Iniciar Test'
          },
          {
            title: 'Plan de Estudio',
            description: 'Organiza tu preparación',
            icon: Calendar,
            color: 'from-green-500 to-teal-500',
            action: 'Ver Plan'
          }
        ].map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{action.title}</h4>
                  <p className="text-gray-300 text-sm mb-4">{action.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    {action.action}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
