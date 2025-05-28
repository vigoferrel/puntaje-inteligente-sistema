
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Award, 
  Target,
  Info,
  Zap,
  Brain
} from 'lucide-react';

interface FinancialProfile {
  paesScore: number;
  familyIncome: number;
  region: string;
  careerType: string;
  universityType: string;
  expectedTuition: number;
}

interface ScholarshipResult {
  name: string;
  type: 'merit' | 'need' | 'regional';
  coverage: number;
  amount: number;
  requirements: string;
  probability: number;
}

interface FinancialProjection {
  totalCost: number;
  scholarshipAmount: number;
  netCost: number;
  monthlyPayment: number;
  paymentYears: number;
  totalInterest: number;
}

export const AdvancedFinancialCalculator: React.FC = () => {
  const [profile, setProfile] = useState<FinancialProfile>({
    paesScore: 650,
    familyIncome: 800000,
    region: 'metropolitana',
    careerType: 'stem',
    universityType: 'traditional',
    expectedTuition: 3500000
  });

  const [scholarships, setScholarships] = useState<ScholarshipResult[]>([]);
  const [projection, setProjection] = useState<FinancialProjection | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const calculateScholarships = () => {
    const results: ScholarshipResult[] = [];

    // Becas por mérito académico
    if (profile.paesScore >= 750) {
      results.push({
        name: 'Beca de Excelencia Académica',
        type: 'merit',
        coverage: 100,
        amount: profile.expectedTuition,
        requirements: 'Puntaje PAES ≥ 750',
        probability: 95
      });
    } else if (profile.paesScore >= 700) {
      results.push({
        name: 'Beca Nuevo Milenio',
        type: 'merit',
        coverage: 75,
        amount: profile.expectedTuition * 0.75,
        requirements: 'Puntaje PAES ≥ 700 + ranking escolar',
        probability: 85
      });
    } else if (profile.paesScore >= 650) {
      results.push({
        name: 'Beca Juan Gómez Millas',
        type: 'merit',
        coverage: 50,
        amount: profile.expectedTuition * 0.5,
        requirements: 'Puntaje PAES ≥ 650',
        probability: 70
      });
    }

    // Becas por necesidad socioeconómica
    if (profile.familyIncome <= 500000) {
      results.push({
        name: 'Beca Bicentenario',
        type: 'need',
        coverage: 100,
        amount: profile.expectedTuition,
        requirements: 'Ingresos familiares ≤ $500.000',
        probability: 90
      });
    } else if (profile.familyIncome <= 1000000) {
      results.push({
        name: 'Beca Estudiante Vulnerable',
        type: 'need',
        coverage: 80,
        amount: profile.expectedTuition * 0.8,
        requirements: 'Vulnerabilidad socioeconómica',
        probability: 75
      });
    }

    // Becas regionales
    if (profile.region !== 'metropolitana') {
      results.push({
        name: 'Beca Regional',
        type: 'regional',
        coverage: 30,
        amount: profile.expectedTuition * 0.3,
        requirements: 'Estudiantes de regiones',
        probability: 60
      });
    }

    // Becas especiales por carrera
    if (profile.careerType === 'stem') {
      results.push({
        name: 'Beca Vocación Científica',
        type: 'merit',
        coverage: 40,
        amount: profile.expectedTuition * 0.4,
        requirements: 'Carreras STEM',
        probability: 65
      });
    }

    return results;
  };

  const calculateProjection = (scholarshipResults: ScholarshipResult[]) => {
    // Tomar la mejor beca (mayor cobertura)
    const bestScholarship = scholarshipResults.reduce((best, current) => 
      current.coverage > best.coverage ? current : best, 
      { coverage: 0, amount: 0 } as ScholarshipResult
    );

    const scholarshipAmount = bestScholarship.amount || 0;
    const netCost = Math.max(0, profile.expectedTuition - scholarshipAmount);
    
    // Calcular financiamiento (CAE o crédito universitario)
    const interestRate = 0.04; // 4% anual
    const years = 6; // 6 años de pago típico
    const monthlyRate = interestRate / 12;
    const totalMonths = years * 12;
    
    const monthlyPayment = netCost > 0 ? 
      (netCost * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
      (Math.pow(1 + monthlyRate, totalMonths) - 1) : 0;

    const totalInterest = (monthlyPayment * totalMonths) - netCost;

    return {
      totalCost: profile.expectedTuition,
      scholarshipAmount,
      netCost,
      monthlyPayment,
      paymentYears: years,
      totalInterest: Math.max(0, totalInterest)
    };
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    // Simular cálculo
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const scholarshipResults = calculateScholarships();
    const projectionResults = calculateProjection(scholarshipResults);
    
    setScholarships(scholarshipResults);
    setProjection(projectionResults);
    setIsCalculating(false);
    setActiveStep(2);
  };

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-500';
    if (score >= 700) return 'text-blue-500';
    if (score >= 650) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'bg-green-500';
    if (probability >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Brain className="w-8 h-8 text-cyan-400" />
          Calculadora Financiera Inteligente
        </h2>
        <p className="text-cyan-200">
          Análisis predictivo de becas y financiamiento universitario
        </p>
      </motion.div>

      {/* Steps Indicator */}
      <div className="flex justify-center space-x-4 mb-8">
        {[1, 2].map((step) => (
          <div
            key={step}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              activeStep >= step 
                ? 'bg-cyan-600 text-white' 
                : 'bg-white/10 text-white/60'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">
              {step}
            </div>
            <span className="text-sm font-medium">
              {step === 1 ? 'Perfil' : 'Resultados'}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Configuración del Perfil */}
            <Card className="bg-black/40 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyan-400" />
                  Perfil del Estudiante
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white text-sm font-medium mb-3 block">
                      Puntaje PAES Proyectado: {profile.paesScore}
                    </Label>
                    <Slider
                      value={[profile.paesScore]}
                      onValueChange={(value) => setProfile(prev => ({ ...prev, paesScore: value[0] }))}
                      max={850}
                      min={150}
                      step={10}
                      className="w-full"
                    />
                    <div className={`text-center mt-2 font-bold ${getScoreColor(profile.paesScore)}`}>
                      {profile.paesScore >= 750 ? 'Excelente' : 
                       profile.paesScore >= 700 ? 'Muy Bueno' :
                       profile.paesScore >= 650 ? 'Bueno' : 'Regular'}
                    </div>
                  </div>

                  <div>
                    <Label className="text-white text-sm font-medium mb-3 block">
                      Ingreso Familiar Mensual
                    </Label>
                    <Input
                      type="number"
                      value={profile.familyIncome}
                      onChange={(e) => setProfile(prev => ({ ...prev, familyIncome: Number(e.target.value) }))}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="800000"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-sm font-medium mb-3 block">
                      Región
                    </Label>
                    <Select value={profile.region} onValueChange={(value) => setProfile(prev => ({ ...prev, region: value }))}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metropolitana">Región Metropolitana</SelectItem>
                        <SelectItem value="valparaiso">Valparaíso</SelectItem>
                        <SelectItem value="biobio">Biobío</SelectItem>
                        <SelectItem value="araucania">Araucanía</SelectItem>
                        <SelectItem value="otras">Otras Regiones</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white text-sm font-medium mb-3 block">
                      Tipo de Carrera
                    </Label>
                    <Select value={profile.careerType} onValueChange={(value) => setProfile(prev => ({ ...prev, careerType: value }))}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stem">STEM (Ciencias/Tecnología)</SelectItem>
                        <SelectItem value="health">Salud</SelectItem>
                        <SelectItem value="social">Ciencias Sociales</SelectItem>
                        <SelectItem value="arts">Artes/Humanidades</SelectItem>
                        <SelectItem value="business">Negocios</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white text-sm font-medium mb-3 block">
                      Tipo de Universidad
                    </Label>
                    <Select value={profile.universityType} onValueChange={(value) => setProfile(prev => ({ ...prev, universityType: value }))}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="traditional">Universidad Tradicional</SelectItem>
                        <SelectItem value="private">Universidad Privada</SelectItem>
                        <SelectItem value="cft">CFT</SelectItem>
                        <SelectItem value="ip">Instituto Profesional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white text-sm font-medium mb-3 block">
                      Arancel Anual Estimado
                    </Label>
                    <Input
                      type="number"
                      value={profile.expectedTuition}
                      onChange={(e) => setProfile(prev => ({ ...prev, expectedTuition: Number(e.target.value) }))}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="3500000"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleCalculate}
                  disabled={isCalculating}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90 text-white py-3"
                >
                  {isCalculating ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-spin" />
                      Calculando Becas y Financiamiento...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      Calcular Opciones de Financiamiento
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeStep === 2 && projection && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Resumen Financiero */}
            <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Resumen Financiero
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white/10 rounded-lg">
                    <div className="text-2xl font-bold text-white">
                      ${projection.totalCost.toLocaleString('es-CL')}
                    </div>
                    <div className="text-white/70 text-sm">Costo Total</div>
                  </div>
                  <div className="text-center p-4 bg-green-600/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">
                      ${projection.scholarshipAmount.toLocaleString('es-CL')}
                    </div>
                    <div className="text-white/70 text-sm">Becas</div>
                  </div>
                  <div className="text-center p-4 bg-blue-600/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">
                      ${projection.netCost.toLocaleString('es-CL')}
                    </div>
                    <div className="text-white/70 text-sm">Costo Neto</div>
                  </div>
                  <div className="text-center p-4 bg-purple-600/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">
                      ${Math.round(projection.monthlyPayment).toLocaleString('es-CL')}
                    </div>
                    <div className="text-white/70 text-sm">Pago Mensual</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Becas Disponibles */}
            <Card className="bg-black/40 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Becas Disponibles ({scholarships.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {scholarships.map((scholarship, index) => (
                    <motion.div
                      key={scholarship.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-white">{scholarship.name}</h3>
                        <Badge className={`${getProbabilityColor(scholarship.probability)} text-white`}>
                          {scholarship.probability}% prob.
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-white/70">Cobertura:</span>
                          <span className="text-white font-bold">{scholarship.coverage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Monto:</span>
                          <span className="text-green-400 font-bold">
                            ${scholarship.amount.toLocaleString('es-CL')}
                          </span>
                        </div>
                        <div className="mt-3">
                          <span className="text-white/70 text-xs">Requisitos:</span>
                          <p className="text-white text-xs mt-1">{scholarship.requirements}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Botones de Acción */}
            <div className="flex gap-4">
              <Button 
                onClick={() => setActiveStep(1)}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Recalcular
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90">
                Descargar Reporte Financiero
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
