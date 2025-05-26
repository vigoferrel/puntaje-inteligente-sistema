
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, TrendingUp, Calculator, Target, Sparkles,
  PiggyBank, GraduationCap, ChartBar, CreditCard
} from 'lucide-react';
import { ScholarshipCalculator } from './ScholarshipCalculator';
import { PAESCostSimulator } from './PAESCostSimulator';
import { FinancialPredictor } from './FinancialPredictor';

const sections = [
  {
    id: 'calculator',
    title: 'Calculadora de Becas',
    subtitle: 'Simula tus opciones de financiamiento',
    icon: Calculator,
    color: 'from-green-600 to-emerald-600',
    description: 'Calcula becas disponibles según tu puntaje PAES proyectado'
  },
  {
    id: 'simulator',
    title: 'Simulador de Costos PAES 2025',
    subtitle: 'Proyecciones financieras precisas',
    icon: ChartBar,
    color: 'from-blue-600 to-cyan-600',
    description: 'Simula costos totales de carrera según puntaje y universidad'
  },
  {
    id: 'predictor',
    title: 'Predictor Financiero',
    subtitle: 'IA predictiva para decisiones',
    icon: TrendingUp,
    color: 'from-purple-600 to-pink-600',
    description: 'Análisis predictivo de ROI educacional y opciones vocacionales'
  }
];

export const AdvancedFinancialCenter: React.FC = () => {
  const [activeSection, setActiveSection] = useState('calculator');
  const [userProfile, setUserProfile] = useState({
    expectedScore: 650,
    familyIncome: 'middle',
    region: 'metropolitana'
  });

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'calculator':
        return <ScholarshipCalculator userProfile={userProfile} />;
      case 'simulator':
        return <PAESCostSimulator userProfile={userProfile} />;
      case 'predictor':
        return <FinancialPredictor userProfile={userProfile} />;
      default:
        return <ScholarshipCalculator userProfile={userProfile} />;
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Header */}
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-3xl">Centro Financiero PAES 2025</CardTitle>
                    <p className="text-green-200 text-lg">
                      Simulaciones inteligentes para tu futuro universitario
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-green-300">Puntaje Proyectado</div>
                  <div className="text-3xl font-bold text-white">{userProfile.expectedScore}</div>
                  <Badge className="mt-2 bg-green-600 text-white">
                    Predicción IA Activa
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 ${
                      isActive 
                        ? `bg-gradient-to-br ${section.color}/30 border-white/40 shadow-2xl` 
                        : 'bg-black/20 border-white/10 hover:border-white/30'
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${section.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">{section.title}</h3>
                          <p className="text-white/70 text-sm">{section.subtitle}</p>
                        </div>
                      </div>
                      
                      <p className="text-white/80 text-sm mb-4">
                        {section.description}
                      </p>
                      
                      <Button 
                        className={`w-full ${
                          isActive 
                            ? `bg-gradient-to-r ${section.color} text-white` 
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                        variant={isActive ? 'default' : 'outline'}
                      >
                        {isActive ? 'Activo' : 'Activar'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Active Section Content */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderActiveSection()}
          </motion.div>

          {/* Quick Stats */}
          <Card className="bg-black/20 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <PiggyBank className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-400">15+</div>
                  <div className="text-white/60 text-sm">Becas Disponibles</div>
                </div>
                <div>
                  <GraduationCap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-400">50+</div>
                  <div className="text-white/60 text-sm">Universidades</div>
                </div>
                <div>
                  <CreditCard className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-400">200+</div>
                  <div className="text-white/60 text-sm">Carreras</div>
                </div>
                <div>
                  <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-400">95%</div>
                  <div className="text-white/60 text-sm">Precisión IA</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
};
