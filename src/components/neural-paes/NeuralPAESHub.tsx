
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Target, BookOpen, FlaskConical, Scroll, Calculator, Zap, Eye, Heart, Activity } from 'lucide-react';
import { neuralTelemetryService } from '@/core/neural/NeuralTelemetryService';
import { useNeuralSystem } from '@/components/neural/NeuralSystemProvider';
import { NeuralMetricsDisplay } from './NeuralMetricsDisplay';
import { NeuralPAESCard } from './NeuralPAESCard';
import { NeuralNavigationWidget } from './NeuralNavigationWidget';
import { NeuralRecommendationsPanel } from './NeuralRecommendationsPanel';

interface NeuralDimension {
  id: string;
  name: string;
  value: number;
  status: 'optimal' | 'warning' | 'critical';
  description: string;
}

interface PAESSubjectNeural {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  progress: number;
  color: string;
  projectedScore: number;
  neuralMetrics: {
    engagement: number;
    coherence: number;
    efficiency: number;
    adaptability: number;
  };
  route: string;
}

const neuralDimensions: NeuralDimension[] = [
  { id: 'engagement', name: 'Engagement Neural', value: 85, status: 'optimal', description: 'Nivel de conexión cognitiva' },
  { id: 'coherence', name: 'Coherencia', value: 78, status: 'optimal', description: 'Consistencia del sistema' },
  { id: 'efficiency', name: 'Eficiencia', value: 92, status: 'optimal', description: 'Optimización de recursos' },
  { id: 'adaptability', name: 'Adaptabilidad', value: 88, status: 'optimal', description: 'Capacidad de ajuste' },
  { id: 'prediction', name: 'Predicción IA', value: 76, status: 'warning', description: 'Precisión predictiva' },
  { id: 'learning', name: 'Aprendizaje', value: 94, status: 'optimal', description: 'Velocidad de asimilación' },
  { id: 'emotion', name: 'Estado Emocional', value: 82, status: 'optimal', description: 'Balance emocional' },
  { id: 'focus', name: 'Concentración', value: 89, status: 'optimal', description: 'Foco atencional' }
];

const paesSubjectsNeural: PAESSubjectNeural[] = [
  {
    id: 'competencia-lectora',
    name: 'Competencia Lectora',
    description: 'Comprensión y análisis textual neural',
    icon: BookOpen,
    progress: 75,
    color: 'from-blue-500 to-blue-600',
    projectedScore: 670,
    neuralMetrics: { engagement: 85, coherence: 78, efficiency: 82, adaptability: 88 },
    route: '/lectoguia'
  },
  {
    id: 'matematica-m1',
    name: 'Matemática M1',
    description: '7° básico a 2° medio (Neural)',
    icon: Calculator,
    progress: 68,
    color: 'from-green-500 to-green-600',
    projectedScore: 645,
    neuralMetrics: { engagement: 72, coherence: 85, efficiency: 90, adaptability: 75 },
    route: '/mathematics'
  },
  {
    id: 'matematica-m2',
    name: 'Matemática M2',
    description: '3° y 4° medio (Neural)',
    icon: Calculator,
    progress: 58,
    color: 'from-emerald-500 to-emerald-600',
    projectedScore: 590,
    neuralMetrics: { engagement: 65, coherence: 70, efficiency: 78, adaptability: 82 },
    route: '/mathematics'
  },
  {
    id: 'ciencias',
    name: 'Ciencias',
    description: 'Física, Química y Biología (Neural)',
    icon: FlaskConical,
    progress: 72,
    color: 'from-purple-500 to-purple-600',
    projectedScore: 680,
    neuralMetrics: { engagement: 88, coherence: 82, efficiency: 85, adaptability: 92 },
    route: '/sciences'
  },
  {
    id: 'historia',
    name: 'Historia y C. Sociales',
    description: 'Pensamiento crítico neural',
    icon: Scroll,
    progress: 63,
    color: 'from-amber-500 to-amber-600',
    projectedScore: 620,
    neuralMetrics: { engagement: 78, coherence: 75, efficiency: 80, adaptability: 85 },
    route: '/history'
  }
];

export const NeuralPAESHub: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'neural' | 'subject'>('overview');
  const [selectedSubject, setSelectedSubject] = useState<PAESSubjectNeural | null>(null);
  const [neuralMetrics, setNeuralMetrics] = useState(neuralDimensions);
  const { state: neuralState, actions: neuralActions } = useNeuralSystem();

  useEffect(() => {
    // Capturar evento de entrada al hub neural
    neuralTelemetryService.captureNeuralEvent('navigation', {
      destination: 'neural_paes_hub',
      timestamp: Date.now(),
      user_intent: 'access_unified_system'
    }, {
      component: 'NeuralPAESHub',
      route: '/'
    });

    // Suscribirse a métricas en tiempo real
    const unsubscribe = neuralTelemetryService.subscribe((metrics) => {
      // Actualizar dimensiones neurales con métricas reales
      setNeuralMetrics(prev => prev.map(dim => ({
        ...dim,
        value: Math.round(metrics[dim.id as keyof typeof metrics] || dim.value),
        status: (metrics[dim.id as keyof typeof metrics] || 0) > 70 ? 'optimal' : 
                (metrics[dim.id as keyof typeof metrics] || 0) > 50 ? 'warning' : 'critical'
      })));
    });

    return () => unsubscribe();
  }, []);

  const handleSubjectSelect = (subject: PAESSubjectNeural) => {
    setSelectedSubject(subject);
    setActiveView('subject');
    
    neuralTelemetryService.captureNeuralEvent('learning', {
      subject: subject.id,
      action: 'select_subject',
      neural_metrics: subject.neuralMetrics
    });
  };

  const getOverallNeuralScore = () => {
    return Math.round(neuralMetrics.reduce((sum, metric) => sum + metric.value, 0) / neuralMetrics.length);
  };

  const renderNeuralDashboard = () => (
    <div className="space-y-6">
      {/* Neural Metrics Grid */}
      <NeuralMetricsDisplay 
        dimensions={neuralMetrics}
        overallScore={getOverallNeuralScore()}
      />

      {/* PAES Subjects with Neural Integration */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paesSubjectsNeural.map((subject, index) => (
          <NeuralPAESCard
            key={subject.id}
            subject={subject}
            index={index}
            onSelect={handleSubjectSelect}
            neuralState={neuralState}
          />
        ))}
      </div>

      {/* Neural Navigation & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NeuralNavigationWidget 
          subjects={paesSubjectsNeural}
          onNavigate={handleSubjectSelect}
        />
        <NeuralRecommendationsPanel 
          neuralMetrics={neuralMetrics}
          subjects={paesSubjectsNeural}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Neural Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              className="p-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-purple-600"
              animate={{ 
                boxShadow: ['0 0 20px rgba(6, 182, 212, 0.3)', '0 0 30px rgba(139, 92, 246, 0.4)', '0 0 20px rgba(6, 182, 212, 0.3)']
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-white">Neural PAES Hub</h1>
              <p className="text-white/70 text-lg">Sistema Neural Unificado v3.0</p>
            </div>
          </div>

          {/* Neural Status Bar */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              <span className="text-white/80 text-sm">Sistema: Activo</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-white/80 text-sm">Neural Score: {getOverallNeuralScore()}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              <span className="text-white/80 text-sm">Estado: Óptimo</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              <span className="text-white/80 text-sm">Telemetría: Live</span>
            </div>
          </div>

          {/* Navigation Pills */}
          <div className="flex justify-center gap-3">
            <Button
              onClick={() => setActiveView('overview')}
              className={`${activeView === 'overview' 
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600' 
                : 'bg-white/10 hover:bg-white/20'} text-white`}
            >
              Vista General Neural
            </Button>
            <Button
              onClick={() => setActiveView('neural')}
              className={`${activeView === 'neural' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                : 'bg-white/10 hover:bg-white/20'} text-white`}
            >
              Dimensiones Neurales
            </Button>
          </div>
        </motion.div>

        {/* Dynamic Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeView === 'overview' && renderNeuralDashboard()}
            {activeView === 'neural' && (
              <div className="text-center text-white">
                <h2 className="text-2xl font-bold mb-4">Análisis Neural Profundo</h2>
                <p className="text-white/70">Métricas neurales avanzadas en desarrollo...</p>
              </div>
            )}
            {activeView === 'subject' && selectedSubject && (
              <div className="space-y-6">
                <Button
                  onClick={() => setActiveView('overview')}
                  className="bg-white/10 hover:bg-white/20 text-white"
                >
                  ← Volver al Hub Neural
                </Button>
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                      <selectedSubject.icon className="w-6 h-6" />
                      {selectedSubject.name} - Vista Neural
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-white/80">
                    <p>Módulo neural específico para {selectedSubject.name} en desarrollo...</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
