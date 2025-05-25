import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, Target, Map, TrendingUp, Star, Zap, 
  BookOpen, Users, Award, Compass, Rocket,
  Eye, BarChart3, Network, GraduationCap
} from 'lucide-react';
import { useSuperPAES } from '@/hooks/use-super-paes';
import { SuperPAESSkillMap3D } from './SuperPAESSkillMap3D';
import { VocationalRecommendations } from './VocationalRecommendations';
import { CompetencyAnalysis } from './CompetencyAnalysis';
import { ProgressVisualization } from './ProgressVisualization';
import { useCinematic, CinematicTransition } from '@/components/cinematic/CinematicTransitionSystem';
import { useUnifiedPAES } from '@/core/unified-data-hub/UnifiedPAESHub';

export const SuperPAESMain: React.FC = () => {
  const {
    analisisVocacional,
    recomendacionesVocacionales,
    mapaCompetencias,
    loading,
    error,
    activeView,
    cambiarVista,
    actualizarAnalisis,
    generarNuevasRecomendaciones,
    obtenerEstadisticas
  } = useSuperPAES();

  const { startTransition } = useCinematic();
  const { syncWithSuper, getIntersectionalMetrics } = useUnifiedPAES();

  // Sync with unified system
  React.useEffect(() => {
    if (analisisVocacional && mapaCompetencias) {
      syncWithSuper({
        competencias: mapaCompetencias,
        recomendaciones: recomendacionesVocacionales
      });
    }
  }, [analisisVocacional, mapaCompetencias, recomendacionesVocacionales, syncWithSuper]);

  const estadisticas = obtenerEstadisticas();
  const intersectionalMetrics = getIntersectionalMetrics();

  // Convert competencias to skills format for the 3D map
  const skillsForMap = mapaCompetencias.map(competencia => ({
    name: competencia.nombre,
    level: Number(competencia.nivel) / 100, // Convert to 0-1 range with proper type conversion
    color: competencia.colorVisualizacion || '#3B82F6'
  }));

  const handleSkillClick = (skillName: string) => {
    console.log('Skill clicked:', skillName);
    // Enhanced skill interaction with cinematic transition
    startTransition('universe', { duration: 600, preloadTarget: true });
  };

  if (loading && !analisisVocacional) {
    return (
      <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          className="text-center text-white space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="w-20 h-20 border-4 border-purple-400 border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="text-3xl font-bold">Activando SuperPAES</div>
          <div className="text-purple-300">Analizando tu perfil vocacional...</div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gradient-to-br from-red-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Zap className="w-6 h-6" />
              Error SuperPAES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={actualizarAnalisis} className="w-full">
              Reintentar Análisis
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <CinematicTransition scene="superpaes">
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Header SuperPAES */}
        <motion.div 
          className="relative overflow-hidden"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl" />
          <div className="relative container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Brain className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-bold text-white">SuperPAES</h1>
                  <p className="text-purple-200">Sistema Avanzado de Orientación Vocacional</p>
                </div>
              </div>
              
              {estadisticas && (
                <div className="flex space-x-4">
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-3xl font-bold text-yellow-400">{estadisticas.competenciasDestacadas}</div>
                    <div className="text-xs text-purple-200">Competencias Destacadas</div>
                  </motion.div>
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-3xl font-bold text-green-400">{estadisticas.carrerasRecomendadas}</div>
                    <div className="text-xs text-purple-200">Carreras Recomendadas</div>
                  </motion.div>
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-3xl font-bold text-blue-400">{estadisticas.promedioCompatibilidad}%</div>
                    <div className="text-xs text-purple-200">Compatibilidad</div>
                  </motion.div>
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-3xl font-bold text-cyan-400">{Math.round(intersectionalMetrics.overallSynergy)}%</div>
                    <div className="text-xs text-purple-200">Sinergia Global</div>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Navegación de Vistas */}
        <div className="container mx-auto px-6">
          <motion.div 
            className="bg-black/20 backdrop-blur-xl rounded-2xl p-2 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex space-x-2">
              {[
                { id: 'overview', label: 'Resumen', icon: Eye },
                { id: 'competencias', label: 'Competencias', icon: Target },
                { id: 'mapa3d', label: 'Mapa 3D', icon: Map },
                { id: 'recomendaciones', label: 'Carreras', icon: GraduationCap },
                { id: 'analisis', label: 'Análisis', icon: BarChart3 }
              ].map(({ id, label, icon: Icon }) => (
                <motion.button
                  key={id}
                  onClick={() => cambiarVista(id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeView === id 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Contenido Principal */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              {activeView === 'overview' && (
                <SuperPAESOverview 
                  analisis={analisisVocacional}
                  recomendaciones={recomendacionesVocacionales}
                  estadisticas={estadisticas}
                  onCambiarVista={cambiarVista}
                />
              )}
              
              {activeView === 'competencias' && (
                <CompetencyAnalysis 
                  competencias={mapaCompetencias}
                  analisis={analisisVocacional}
                />
              )}
              
              {activeView === 'mapa3d' && (
                <SuperPAESSkillMap3D 
                  skills={skillsForMap}
                  onSkillClick={handleSkillClick}
                />
              )}
              
              {activeView === 'recomendaciones' && (
                <VocationalRecommendations 
                  recomendaciones={recomendacionesVocacionales}
                  onActualizar={generarNuevasRecomendaciones}
                />
              )}
              
              {activeView === 'analisis' && (
                <ProgressVisualization 
                  analisis={analisisVocacional}
                  recomendaciones={recomendacionesVocacionales}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </CinematicTransition>
  );
};

// Componente de Resumen
const SuperPAESOverview: React.FC<{
  analisis: any;
  recomendaciones: any;
  estadisticas: any;
  onCambiarVista: (vista: string) => void;
}> = ({ analisis, recomendaciones, estadisticas, onCambiarVista }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Panel de Competencias Destacadas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-xl border-purple-300/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-400" />
              Competencias Destacadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analisis?.competenciasDestacadas.slice(0, 3).map((comp: any, index: number) => (
                <motion.div
                  key={comp.nombre}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <div>
                    <div className="text-white font-medium">{comp.nombre}</div>
                    <div className="text-purple-200 text-sm">{comp.descripcion}</div>
                  </div>
                  <Badge 
                    className="bg-gradient-to-r from-green-500 to-emerald-500"
                    style={{ backgroundColor: comp.colorVisualizacion }}
                  >
                    {comp.nivel}
                  </Badge>
                </motion.div>
              ))}
            </div>
            <Button 
              className="w-full mt-4 bg-gradient-to-r from-purple-500 to-blue-500"
              onClick={() => onCambiarVista('competencias')}
            >
              Ver Análisis Completo
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Panel de Recomendaciones Top */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-xl border-blue-300/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-400" />
              Carreras Recomendadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recomendaciones?.recomendacionPrincipal.slice(0, 3).map((carrera: any, index: number) => (
                <motion.div
                  key={carrera.nombre}
                  className="p-3 rounded-lg bg-white/10"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{carrera.nombre}</div>
                      <div className="text-blue-200 text-sm">{carrera.universidad}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">{carrera.compatibilidadGlobal}%</div>
                      <div className="text-blue-200 text-xs">compatibilidad</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <Button 
              className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-500"
              onClick={() => onCambiarVista('recomendaciones')}
            >
              Explorar Todas las Carreras
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Panel de Acciones Rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-xl border-indigo-300/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Rocket className="w-6 h-6 text-indigo-400" />
              Acciones Recomendadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <motion.div
                className="p-3 rounded-lg bg-white/10 cursor-pointer hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCambiarVista('mapa3d')}
              >
                <div className="flex items-center gap-3">
                  <Map className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-white font-medium">Explorar Mapa 3D</div>
                    <div className="text-indigo-200 text-sm">Visualiza tus competencias</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                className="p-3 rounded-lg bg-white/10 cursor-pointer hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCambiarVista('analisis')}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-white font-medium">Ver Análisis Detallado</div>
                    <div className="text-purple-200 text-sm">Insights profundos de tu perfil</div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {estadisticas && (
              <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-300/30">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{estadisticas.nivelVocacional}</div>
                  <div className="text-green-200 text-sm">Nivel Vocacional</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
