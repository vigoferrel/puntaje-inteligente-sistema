/* eslint-disable react-refresh/only-export-components */

import React, { useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { supabase } from '../../integrations/supabase/leonardo-auth-client';
import { 
  Calculator, 
  PiggyBank, 
  TrendingUp, 
  DollarSign,
  Award,
  School,
  Target,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
// DISABLED: // DISABLED: import { supabase } from '../../integrations/supabase/unified-client';

interface ScholarshipData {
  id: string;
  nombre: string;
  institucion: string;
  tipo_beca: string;
  monto_maximo: number;
  porcentaje_cobertura: number;
  requisitos: unknown;
  puntaje_minimo_nem?: number;
  puntaje_minimo_ranking?: number;
  puntaje_minimo_competencia_lectora?: number;
  puntaje_minimo_matematica?: number;
  renta_maxima_familiar?: number;
  estado: string;
}

interface FinancialSimulation {
  careerCost: number;
  familyIncome: number;
  nemScore: number;
  rankingScore: number;
  paesScores: {
    competenciaLectora: number;
    matematica: number;
  };
  expectedScholarships: ScholarshipData[];
  projectedROI: number;
  monthlyPayment: number;
  totalDebt: number;
}

export const FinancialCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calculator');
  const [scholarships, setScholarships] = useState<ScholarshipData[]>([]);
  const [simulation, setSimulation] = useState<FinancialSimulation>({
    careerCost: 4500000,
    familyIncome: 800000,
    nemScore: 6.0,
    rankingScore: 650,
    paesScores: {
      competenciaLectora: 650,
      matematica: 600
    },
    expectedScholarships: [],
    projectedROI: 0,
    monthlyPayment: 0,
    totalDebt: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  // Cargar becas disponibles
  useEffect(() => {
    const loadScholarships = async () => {
      try {
        const { data, error } = await supabase
          .from('becas_financiamiento')
          .select('*')
          .eq('estado', 'activa')
          .order('monto_maximo', { ascending: false });

        if (error) {
          console.error('Error loading scholarships:', error);
          return;
        }

        setScholarships(data || []);
      } catch (error) {
        console.error('Error in loadScholarships:', error);
      }
    };

    loadScholarships();
  }, []);

  // Calcular becas elegibles basado en el perfil del estudiante
  const calculateEligibleScholarships = (studentProfile: unknown): ScholarshipData[] => {
    return scholarships.filter(scholarship => {
      // Verificar requisitos acadÃ©micos
      if (scholarship.puntaje_minimo_nem && studentProfile.nemScore < scholarship.puntaje_minimo_nem) {
        return false;
      }
      if (scholarship.puntaje_minimo_ranking && studentProfile.rankingScore < scholarship.puntaje_minimo_ranking) {
        return false;
      }
      if (scholarship.puntaje_minimo_competencia_lectora && 
          studentProfile.paesScores.competenciaLectora < scholarship.puntaje_minimo_competencia_lectora) {
        return false;
      }
      if (scholarship.puntaje_minimo_matematica && 
          studentProfile.paesScores.matematica < scholarship.puntaje_minimo_matematica) {
        return false;
      }
      
      // Verificar requisitos socioeconÃ³micos
      if (scholarship.renta_maxima_familiar && 
          studentProfile.familyIncome > scholarship.renta_maxima_familiar) {
        return false;
      }

      return true;
    });
  };

  // Simular escenario financiero completo
  const runFinancialSimulation = async () => {
    setIsLoading(true);
    
    try {
      const eligibleScholarships = calculateEligibleScholarships(simulation);
      
      // Calcular financiamiento total disponible
      const totalScholarshipAmount = eligibleScholarships.reduce((total, scholarship) => {
        const amount = scholarship.monto_maximo || 
          (simulation.careerCost * (scholarship.porcentaje_cobertura / 100));
        return total + amount;
      }, 0);

      // Calcular deuda restante despuÃ©s de becas
      const remainingDebt = Math.max(0, simulation.careerCost - totalScholarshipAmount);
      
      // Simular CAE (CrÃ©dito con Aval del Estado)
      const caeAmount = remainingDebt * 0.7; // Hasta 70% del costo
      const finalDebt = remainingDebt - caeAmount;
      
      // Calcular cuota mensual (tasa promedio CAE 4.5% anual, 20 aÃ±os)
      const monthlyRate = 0.045 / 12;
      const months = 20 * 12;
      const monthlyPayment = caeAmount > 0 ? 
        (caeAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
        (Math.pow(1 + monthlyRate, months) - 1) : 0;

      // Estimar ROI basado en ingresos proyectados por carrera
      const averageIncome = 800000; // Ingreso promedio estimado
      const lifetimeEarnings = averageIncome * 12 * 40; // 40 aÃ±os de trabajo
      const projectedROI = ((lifetimeEarnings - simulation.careerCost) / simulation.careerCost) * 100;

      setSimulation(prev => ({
        ...prev,
        expectedScholarships: eligibleScholarships,
        projectedROI,
        monthlyPayment,
        totalDebt: caeAmount
      }));

      // Guardar simulaciÃ³n en la base de datos
      const { data: user } = await supabase.auth.getUser();
      if (user?.user?.id) {
        await supabase
          .from('financial_simulations')
          .insert({
            user_id: user.user.id,
            simulation_name: 'SimulaciÃ³n PAES 2024',
            estimated_cost: simulation.careerCost,
            available_funding: totalScholarshipAmount,
            funding_sources: {
              scholarships: eligibleScholarships.map(s => ({
                name: s.nombre,
                amount: s.monto_maximo || (simulation.careerCost * (s.porcentaje_cobertura / 100))
              })),
              cae: caeAmount,
              familyContribution: finalDebt
            },
            projected_income: averageIncome,
            roi_analysis: {
              projectedROI,
              monthlyPayment,
              totalDebt: caeAmount,
              paybackPeriod: months
            }
          });
      }

    } catch (error) {
      console.error('Error running simulation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Centro Financiero PAES
            </h1>
            <p className="text-muted-foreground">Planifica tu financiamiento universitario inteligentemente</p>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="calculator" className="gap-2">
            <Calculator className="w-4 h-4" />
            Calculadora
          </TabsTrigger>
          <TabsTrigger value="scholarships" className="gap-2">
            <Award className="w-4 h-4" />
            Becas
          </TabsTrigger>
          <TabsTrigger value="simulation" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            SimulaciÃ³n
          </TabsTrigger>
          <TabsTrigger value="planning" className="gap-2">
            <Target className="w-4 h-4" />
            PlanificaciÃ³n
          </TabsTrigger>
        </TabsList>

        {/* Calculadora FUAS */}
        <TabsContent value="calculator">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-green-600" />
                  Calculadora FUAS 2024
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="career-cost">Costo Total Carrera</Label>
                    <Input
                      id="career-cost"
                      type="number"
                      value={simulation.careerCost}
                      onChange={(e) => setSimulation(prev => ({
                        ...prev,
                        careerCost: parseInt(e.target.value) || 0
                      }))}
                      placeholder="4.500.000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="family-income">Ingreso Familiar</Label>
                    <Input
                      id="family-income"
                      type="number"
                      value={simulation.familyIncome}
                      onChange={(e) => setSimulation(prev => ({
                        ...prev,
                        familyIncome: parseInt(e.target.value) || 0
                      }))}
                      placeholder="800.000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nem-score">NEM</Label>
                    <Input
                      id="nem-score"
                      type="number"
                      step="0.1"
                      max="7.0"
                      value={simulation.nemScore}
                      onChange={(e) => setSimulation(prev => ({
                        ...prev,
                        nemScore: parseFloat(e.target.value) || 0
                      }))}
                      placeholder="6.0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ranking-score">Ranking</Label>
                    <Input
                      id="ranking-score"
                      type="number"
                      max="1000"
                      value={simulation.rankingScore}
                      onChange={(e) => setSimulation(prev => ({
                        ...prev,
                        rankingScore: parseInt(e.target.value) || 0
                      }))}
                      placeholder="650"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cl-score">Competencia Lectora</Label>
                    <Input
                      id="cl-score"
                      type="number"
                      max="1000"
                      value={simulation.paesScores.competenciaLectora}
                      onChange={(e) => setSimulation(prev => ({
                        ...prev,
                        paesScores: {
                          ...prev.paesScores,
                          competenciaLectora: parseInt(e.target.value) || 0
                        }
                      }))}
                      placeholder="650"
                    />
                  </div>
                  <div>
                    <Label htmlFor="math-score">MatemÃ¡tica</Label>
                    <Input
                      id="math-score"
                      type="number"
                      max="1000"
                      value={simulation.paesScores.matematica}
                      onChange={(e) => setSimulation(prev => ({
                        ...prev,
                        paesScores: {
                          ...prev.paesScores,
                          matematica: parseInt(e.target.value) || 0
                        }
                      }))}
                      placeholder="600"
                    />
                  </div>
                </div>

                <Button 
                  onClick={runFinancialSimulation}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  {isLoading ? 'Calculando...' : 'Calcular Financiamiento'}
                </Button>
              </CardContent>
            </Card>

            {/* Resultados */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Resultados de SimulaciÃ³n
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-700">Becas Disponibles</div>
                    <div className="text-2xl font-bold text-green-600">
                      {simulation.expectedScholarships.length}
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-700">ROI Proyectado</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {simulation.projectedROI.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Costo Total</span>
                    <span className="font-medium">{formatCurrency(simulation.careerCost)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                    <span>Financiamiento Becas</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(simulation.expectedScholarships.reduce((total, s) => 
                        total + (s.monto_maximo || 0), 0))}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                    <span>Cuota Mensual CAE</span>
                    <span className="font-medium text-orange-600">
                      {formatCurrency(simulation.monthlyPayment)}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                    <span>Deuda Total</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(simulation.totalDebt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Becas Disponibles */}
        <TabsContent value="scholarships">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.map((scholarship) => (
              <motion.div
                key={scholarship.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{scholarship.nombre}</CardTitle>
                        <p className="text-sm text-muted-foreground">{scholarship.institucion}</p>
                      </div>
                      <Badge className={`${
                        scholarship.tipo_beca === 'merito' ? 'bg-blue-100 text-blue-700' :
                        scholarship.tipo_beca === 'necesidad' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {scholarship.tipo_beca}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Monto MÃ¡ximo</span>
                        <span className="font-medium">
                          {scholarship.monto_maximo ? 
                            formatCurrency(scholarship.monto_maximo) : 
                            `${scholarship.porcentaje_cobertura}%`}
                        </span>
                      </div>
                      
                      {scholarship.puntaje_minimo_nem && (
                        <div className="flex justify-between">
                          <span className="text-sm">NEM MÃ­nimo</span>
                          <span className="font-medium">{scholarship.puntaje_minimo_nem}</span>
                        </div>
                      )}
                      
                      {scholarship.puntaje_minimo_competencia_lectora && (
                        <div className="flex justify-between">
                          <span className="text-sm">Comp. Lectora</span>
                          <span className="font-medium">{scholarship.puntaje_minimo_competencia_lectora}</span>
                        </div>
                      )}
                      
                      {scholarship.renta_maxima_familiar && (
                        <div className="flex justify-between">
                          <span className="text-sm">Renta MÃ¡x. Familiar</span>
                          <span className="font-medium">
                            {formatCurrency(scholarship.renta_maxima_familiar)}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* SimulaciÃ³n Avanzada */}
        <TabsContent value="simulation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                SimulaciÃ³n Financiera Avanzada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">SimulaciÃ³n Avanzada</h3>
                <p className="text-muted-foreground mb-6">
                  PrÃ³ximamente: Simulaciones con mÃºltiples escenarios e IA predictiva
                </p>
                <Button disabled className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  PrÃ³ximamente
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PlanificaciÃ³n */}
        <TabsContent value="planning">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600" />
                PlanificaciÃ³n Financiera
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">PlanificaciÃ³n Personalizada</h3>
                <p className="text-muted-foreground mb-6">
                  PrÃ³ximamente: Planes de ahorro y estrategias de financiamiento personalizadas
                </p>
                <Button disabled className="gap-2">
                  <Target className="w-4 h-4" />
                  PrÃ³ximamente
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};




