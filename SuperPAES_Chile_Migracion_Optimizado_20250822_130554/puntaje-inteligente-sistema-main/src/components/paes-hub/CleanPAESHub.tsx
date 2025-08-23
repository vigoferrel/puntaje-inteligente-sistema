/* eslint-disable react-refresh/only-export-components */

import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Calculator, 
  FlaskConical, 
  Scroll 
} from 'lucide-react';
import { PAESSubjectCard } from './PAESSubjectCard';
import { BalancedPAESMetrics } from './BalancedPAESMetrics';
import { CompetenciaLectoraIntegration } from './CompetenciaLectoraIntegration';
import { MathematicsIntegration } from '../../components/paes-mathematics/MathematicsIntegration';
import { SciencesIntegration } from '../../components/paes-sciences/SciencesIntegration';
import { HistoryIntegration } from '../../components/paes-history/HistoryIntegration';
import { QuickNavigationWidget } from '../../components/super-paes/QuickNavigationWidget';
import { useNavigate } from 'react-router-dom';

interface PAESSubject {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<unknown>;
  progress: number;
  color: string;
  projectedScore: number;
  criticalAreas: number;
  strengths: number;
  route: string;
}

const paesSubjects: PAESSubject[] = [
  {
    id: 'competencia-lectora',
    name: 'Competencia Lectora',
    description: 'ComprensiÃ³n y anÃ¡lisis textual',
    icon: BookOpen,
    progress: 75,
    color: 'from-blue-500 to-blue-600',
    projectedScore: 670,
    criticalAreas: 2,
    strengths: 8,
    route: '/lectoguia'
  },
  {
    id: 'matematica-m1',
    name: 'MatemÃ¡tica M1',
    description: '7Â° bÃ¡sico a 2Â° medio',
    icon: Calculator,
    progress: 68,
    color: 'from-green-500 to-green-600',
    projectedScore: 645,
    criticalAreas: 4,
    strengths: 6,
    route: '/mathematics'
  },
  {
    id: 'matematica-m2',
    name: 'MatemÃ¡tica M2',
    description: '3Â° y 4Â° medio',
    icon: Calculator,
    progress: 58,
    color: 'from-emerald-500 to-emerald-600',
    projectedScore: 590,
    criticalAreas: 6,
    strengths: 4,
    route: '/mathematics'
  },
  {
    id: 'ciencias',
    name: 'Ciencias',
    description: 'FÃ­sica, QuÃ­mica y BiologÃ­a',
    icon: FlaskConical,
    progress: 72,
    color: 'from-purple-500 to-purple-600',
    projectedScore: 680,
    criticalAreas: 3,
    strengths: 7,
    route: '/sciences'
  },
  {
    id: 'historia',
    name: 'Historia y C. Sociales',
    description: 'Pensamiento crÃ­tico e histÃ³rico',
    icon: Scroll,
    progress: 63,
    color: 'from-amber-500 to-amber-600',
    projectedScore: 620,
    criticalAreas: 5,
    strengths: 5,
    route: '/history'
  }
];

export const CleanPAESHub: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>('overview');
  const [selectedSubject, setSelectedSubject] = useState<PAESSubject | null>(null);
  const navigate = useNavigate();

  const handleSubjectSelect = (subject: PAESSubject) => {
    setSelectedSubject(subject);
    setActiveModule(subject.id);
    
    // Capturar evento de selecciÃ³n
    console.log(`ðŸ“Š Sujeto seleccionado: ${subject.name} - Navegando a: ${subject.route}`);
    
    // La navegaciÃ³n ya se maneja en PAESSubjectCard
  };

  const renderModuleContent = () => {
    if (activeModule === 'overview') {
      return (
        <div className="space-y-8">
          <BalancedPAESMetrics subjects={paesSubjects} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paesSubjects.map((subject, index) => (
              <PAESSubjectCard
                key={subject.id}
                subject={subject}
                index={index}
                onSelect={handleSubjectSelect}
              />
            ))}
          </div>

          <QuickNavigationWidget />
        </div>
      );
    }

    switch (activeModule) {
      case 'competencia-lectora':
        return <CompetenciaLectoraIntegration />;
      case 'matematica-m1':
      case 'matematica-m2':
        return <MathematicsIntegration />;
      case 'ciencias':
        return <SciencesIntegration />;
      case 'historia':
        return <HistoryIntegration />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8 text-cyan-400" />
            Hub PAES 2025
          </h1>
          <p className="text-white/70 text-lg">
            PreparaciÃ³n equilibrada para las 5 pruebas PAES
          </p>
        </motion.div>

        {activeModule !== 'overview' && (
          <div className="mb-6">
            <Button
              onClick={() => setActiveModule('overview')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              â† Volver al Hub
            </Button>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderModuleContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

