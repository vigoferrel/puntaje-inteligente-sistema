/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserType } from '../../../types/cinematic-universe';
import { PAESUniverseDashboard } from '../../../components/paes-universe/PAESUniverseDashboard';
import { SuperPAESSkillMap3D } from '../../../components/super-paes/SuperPAESSkillMap3D';
import { Real3DEducationalUniverse } from '../../../components/real-3d/Real3DEducationalUniverse';
import { SuperPAESUniverseInterface } from '../../../components/revolutionary/SuperPAESUniverseInterface';
import { usePAESData } from '../../../hooks/use-paes-data';
import { useLearningNodes } from '../../../hooks/use-learning-nodes';
import { useAuth } from '../../../hooks/useAuth';

interface SuperPAESUniverseProps {
  userType: UserType;
  onUniverseChange: (universe: string) => void;
}

const SuperPAESLoader: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"
      />
      <h2 className="text-2xl font-bold text-white mb-2">
        Cargando SuperPAES Universe
      </h2>
      <p className="text-purple-300">Preparando sistema educativo avanzado...</p>
    </motion.div>
  </div>
);

export const SuperPAESUniverse: React.FC<SuperPAESUniverseProps> = ({
  userType,
  onUniverseChange
}) => {
  const { user, profile } = useAuth();
  const { tests: paesTestsData, skills: paesSkillsData, loading } = usePAESData();
  const {
    nodes,
    nodeProgress,
    fetchLearningNodes,
    fetchUserNodeProgress,
    loading: nodesLoading
  } = useLearningNodes();
  
  const [activeSection, setActiveSection] = useState('universe');
  const [isLoading, setIsLoading] = useState(true);

  // Cargar nodos automÃ¡ticamente al montar el componente
  useEffect(() => {
    const loadNodesAndProgress = async () => {
      try {
        console.log('ðŸ”„ Cargando nodos de aprendizaje...');
        
        // Cargar todos los nodos (sin filtros para obtener todos)
        await fetchLearningNodes();
        
        // Si hay usuario, cargar su progreso
        if (user?.id) {
          await fetchUserNodeProgress(user.id);
        }
        
        console.log('âœ… Nodos cargados exitosamente');
      } catch (error) {
        console.error('âŒ Error cargando nodos:', error);
      }
    };

    loadNodesAndProgress();
  }, [user?.id, fetchLearningNodes, fetchUserNodeProgress]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Datos mock para el mapa de habilidades 3D
  const skillsData = React.useMemo(() => {
    if (paesSkillsData.length > 0) {
      return paesSkillsData.map((skill, index) => {
        // Generar colores basados en el testCode
        const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316', '#EC4899'];
        const color = colors[index % colors.length];
        
        return {
          name: skill.name || skill.code,
          level: skill.performance / 100, // Convertir performance (0-100) a level (0-1)
          color: color
        };
      });
    }
    
    // Fallback con datos de ejemplo
    return [
      { name: 'ComprensiÃ³n Lectora', level: 0.85, color: '#3B82F6' },
      { name: 'AnÃ¡lisis Textual', level: 0.72, color: '#10B981' },
      { name: 'Ãlgebra', level: 0.68, color: '#8B5CF6' },
      { name: 'GeometrÃ­a', level: 0.75, color: '#F59E0B' },
      { name: 'EstadÃ­stica', level: 0.62, color: '#EF4444' },
      { name: 'FÃ­sica', level: 0.58, color: '#06B6D4' },
      { name: 'QuÃ­mica', level: 0.71, color: '#84CC16' },
      { name: 'BiologÃ­a', level: 0.79, color: '#F97316' },
      { name: 'Historia Universal', level: 0.66, color: '#EC4899' },
      { name: 'Historia de Chile', level: 0.73, color: '#8B5CF6' }
    ];
  }, [paesSkillsData]);

  const sections = [
    { id: 'universe', name: 'Universo PAES', icon: 'STAR', description: 'Dashboard galÃ¡ctico completo' },
    { id: 'revolutionary', name: 'Universo Revolucionario', icon: 'QUANTUM', description: 'Interfaz de clase mundial con 3D cuÃ¡ntico' },
    { id: 'skillmap', name: 'Mapa de Habilidades', icon: 'MAP', description: 'VisualizaciÃ³n 3D de competencias' },
    { id: 'neural', name: 'Universo Neural', icon: 'BRAIN', description: 'Sistema neural 3D avanzado' }
  ];

  const handleSkillClick = (skill: string) => {
    console.log('Skill seleccionada:', skill);
    // AquÃ­ puedes agregar navegaciÃ³n o acciones especÃ­ficas
  };

  const handleNodeClick = (nodeId: string) => {
    console.log('Nodo seleccionado:', nodeId);
    // AquÃ­ puedes agregar navegaciÃ³n o acciones especÃ­ficas
  };

  if (isLoading) {
    return <SuperPAESLoader />;
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'universe':
        return (
          <div className="h-screen">
            <PAESUniverseDashboard />
          </div>
        );
      
      case 'revolutionary':
        return (
          <div className="h-screen">
            <SuperPAESUniverseInterface
              subjects={[
                {
                  code: 'COMPETENCIA_LECTORA',
                  name: 'Competencia Lectora',
                  totalNodes: 30,
                  completedNodes: 18,
                  progress: 60,
                  projectedScore: 675,
                  criticalAreas: 3,
                  strengths: 8,
                  priority: 'medium' as const
                },
                {
                  code: 'MATEMATICA_1',
                  name: 'MatemÃ¡tica M1',
                  totalNodes: 25,
                  completedNodes: 12,
                  progress: 48,
                  projectedScore: 620,
                  criticalAreas: 6,
                  strengths: 4,
                  priority: 'high' as const
                },
                {
                  code: 'MATEMATICA_2',
                  name: 'MatemÃ¡tica M2',
                  totalNodes: 22,
                  completedNodes: 8,
                  progress: 36,
                  projectedScore: 590,
                  criticalAreas: 8,
                  strengths: 2,
                  priority: 'high' as const
                },
                {
                  code: 'CIENCIAS',
                  name: 'Ciencias',
                  totalNodes: 135,
                  completedNodes: 67,
                  progress: 50,
                  projectedScore: 655,
                  criticalAreas: 25,
                  strengths: 28,
                  priority: 'low' as const
                }
              ]}
              recommendations={[
                {
                  id: '1',
                  type: 'critical' as const,
                  title: 'Ãlgebra BÃ¡sica requiere atenciÃ³n',
                  description: 'Tienes dificultades en ecuaciones lineales.',
                  subject: 'MatemÃ¡tica M1',
                  estimatedTime: 45,
                  impact: 'high' as const
                },
                {
                  id: '2',
                  type: 'opportunity' as const,
                  title: 'Oportunidad en ComprensiÃ³n Lectora',
                  description: 'EstÃ¡s muy cerca de dominar textos argumentativos.',
                  subject: 'Competencia Lectora',
                  estimatedTime: 30,
                  impact: 'medium' as const
                }
              ]}
              tierData={[
                {
                  tier: 'tier1_critico',
                  name: 'Tier 1 - CrÃ­tico',
                  total: 89,
                  completed: 45,
                  inProgress: 12,
                  progress: 50.6,
                  estimatedTimeRemaining: 1980
                },
                {
                  tier: 'tier2_importante',
                  name: 'Tier 2 - Importante',
                  total: 108,
                  completed: 58,
                  inProgress: 15,
                  progress: 53.7,
                  estimatedTimeRemaining: 2250
                }
              ]}
              globalProgress={52.1}
              projectedScore={635}
            />
          </div>
        );
      
      case 'skillmap':
        return (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h2 className="text-3xl font-bold text-white mb-2">
                Mapa de Habilidades 3D
              </h2>
              <p className="text-purple-300">
                Explora tus competencias PAES en un entorno 3D interactivo
              </p>
            </motion.div>
            
            <SuperPAESSkillMap3D
              skills={skillsData}
              onSkillClick={handleSkillClick}
            />
          </div>
        );
      
      case 'neural':
        return (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h2 className="text-3xl font-bold text-white mb-2">
                Universo Neural 3D
              </h2>
              <p className="text-purple-300">
                Sistema neural avanzado con mÃ©tricas de aprendizaje
              </p>
            </motion.div>
            
            <RealEducationalUniverse
              onNodeClick={handleNodeClick}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 relative overflow-hidden">
      {/* Header con navegaciÃ³n */}
      {activeSection !== 'universe' && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 p-6"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                SuperPAES Universe
              </h1>
              <p className="text-purple-300 text-lg">
                Sistema Educativo PAES Avanzado - {userType}
              </p>
              {profile?.name && (
                <p className="text-white/70 text-sm mt-1">
                  Bienvenido, {profile.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 mb-8 overflow-x-auto">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-6 py-3 rounded-xl text-sm whitespace-nowrap transition-all ${
                  activeSection === section.id
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-white/10 text-white/70 hover:bg-white/15'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={section.description}
              >
                <span className="mr-2">[{section.icon}]</span>
                {section.name}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Contenido principal */}
      <div className={activeSection === 'universe' ? '' : 'relative z-10'}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {renderActiveSection()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Botones de navegaciÃ³n entre universos */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50"
      >
        <div className="flex flex-col gap-3">
          <motion.button
            onClick={() => onUniverseChange('dashboard')}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30 hover:bg-cyan-500/30 transition-all flex items-center justify-center font-bold"
            title="Dashboard Universe"
          >
            DB
          </motion.button>
          
          <motion.button
            onClick={() => onUniverseChange('neural-hub')}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-green-500/20 text-green-300 rounded-full border border-green-500/30 hover:bg-green-500/30 transition-all flex items-center justify-center font-bold"
            title="Neural Hub Universe"
          >
            NH
          </motion.button>
        </div>
      </motion.div>

      {/* Indicador de secciÃ³n activa */}
      {activeSection !== 'universe' && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-black/40 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
            <div className="text-white text-sm font-medium">
              {sections.find(s => s.id === activeSection)?.description}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SuperPAESUniverse;


