
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign, TrendingUp, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface FinancialScenario {
  paesScore: number;
  monthlyIncome: number;
  scholarshipAmount: number;
  universityFee: number;
  totalCost: number;
  coveragePercentage: number;
}

export const PAESFinancialCalculator: React.FC = () => {
  const { user, profile } = useAuth();
  const [scenario, setScenario] = useState<FinancialScenario>({
    paesScore: 600,
    monthlyIncome: 500000,
    scholarshipAmount: 0,
    universityFee: 3000000,
    totalCost: 0,
    coveragePercentage: 0
  });

  const [calculationResults, setCalculationResults] = useState({
    scholarshipEligible: false,
    monthlyPayment: 0,
    yearsToPayOff: 0,
    totalInterest: 0
  });

  useEffect(() => {
    calculateFinancialScenario();
  }, [scenario.paesScore, scenario.monthlyIncome, scenario.universityFee]);

  const calculateFinancialScenario = () => {
    // Calcular elegibilidad para becas basado en puntaje PAES
    const scholarshipEligible = scenario.paesScore >= 650;
    
    // Calcular monto de beca basado en puntaje
    let scholarshipAmount = 0;
    if (scenario.paesScore >= 750) {
      scholarshipAmount = scenario.universityFee * 0.8; // 80% de beca
    } else if (scenario.paesScore >= 700) {
      scholarshipAmount = scenario.universityFee * 0.6; // 60% de beca
    } else if (scenario.paesScore >= 650) {
      scholarshipAmount = scenario.universityFee * 0.4; // 40% de beca
    }

    // Calcular costo total después de beca
    const totalCost = scenario.universityFee - scholarshipAmount;
    const coveragePercentage = (scholarshipAmount / scenario.universityFee) * 100;

    // Calcular financiamiento
    const monthlyPayment = totalCost / 60; // 5 años de pago
    const yearsToPayOff = totalCost / (scenario.monthlyIncome * 0.3) / 12; // 30% del ingreso
    const totalInterest = monthlyPayment * 60 - totalCost;

    setScenario(prev => ({
      ...prev,
      scholarshipAmount,
      totalCost,
      coveragePercentage
    }));

    setCalculationResults({
      scholarshipEligible,
      monthlyPayment,
      yearsToPayOff,
      totalInterest
    });
  };

  const getScoreLevel = (score: number) => {
    if (score >= 750) return { level: 'Excelente', color: 'bg-green-500' };
    if (score >= 700) return { level: 'Muy Bueno', color: 'bg-blue-500' };
    if (score >= 650) return { level: 'Bueno', color: 'bg-yellow-500' };
    if (score >= 600) return { level: 'Regular', color: 'bg-orange-500' };
    return { level: 'Bajo', color: 'bg-red-500' };
  };

  const scoreLevel = getScoreLevel(scenario.paesScore);

  return (
    <div className="space-y-6">
      {/* Entrada de Datos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Calculadora Financiera PAES
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paesScore">Puntaje PAES Proyectado</Label>
              <Input
                id="paesScore"
                type="number"
                value={scenario.paesScore}
                onChange={(e) => setScenario(prev => ({
                  ...prev,
                  paesScore: Number(e.target.value)
                }))}
                min="150"
                max="900"
              />
              <div className="mt-2">
                <Badge className={scoreLevel.color}>
                  {scoreLevel.level}
                </Badge>
              </div>
            </div>

            <div>
              <Label htmlFor="monthlyIncome">Ingreso Familiar Mensual</Label>
              <Input
                id="monthlyIncome"
                type="number"
                value={scenario.monthlyIncome}
                onChange={(e) => setScenario(prev => ({
                  ...prev,
                  monthlyIncome: Number(e.target.value)
                }))}
                placeholder="500000"
              />
            </div>

            <div>
              <Label htmlFor="universityFee">Arancel Anual Universidad</Label>
              <Input
                id="universityFee"
                type="number"
                value={scenario.universityFee}
                onChange={(e) => setScenario(prev => ({
                  ...prev,
                  universityFee: Number(e.target.value)
                }))}
                placeholder="3000000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados de Becas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Elegibilidad para Becas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h4 className="font-medium">Estado de Beca</h4>
                <p className="text-sm text-gray-600">
                  {calculationResults.scholarshipEligible 
                    ? 'Elegible para beca de excelencia académica'
                    : 'No elegible para beca (puntaje mínimo: 650)'}
                </p>
              </div>
              <Badge variant={calculationResults.scholarshipEligible ? "default" : "destructive"}>
                {calculationResults.scholarshipEligible ? 'Elegible' : 'No Elegible'}
              </Badge>
            </div>

            {calculationResults.scholarshipEligible && (
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-bold text-2xl text-green-600">
                    ${scenario.scholarshipAmount.toLocaleString('es-CL')}
                  </h4>
                  <p className="text-sm text-gray-600">Monto de Beca Anual</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-bold text-2xl text-blue-600">
                    {Math.round(scenario.coveragePercentage)}%
                  </h4>
                  <p className="text-sm text-gray-600">Cobertura del Arancel</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Proyección Financiera */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Proyección de Financiamiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-bold text-xl">
                ${scenario.totalCost.toLocaleString('es-CL')}
              </h4>
              <p className="text-sm text-gray-600">Costo Total Anual</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-bold text-xl">
                ${Math.round(calculationResults.monthlyPayment).toLocaleString('es-CL')}
              </h4>
              <p className="text-sm text-gray-600">Pago Mensual Estimado</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-bold text-xl">
                {Math.round(calculationResults.yearsToPayOff)} años
              </h4>
              <p className="text-sm text-gray-600">Tiempo de Pago</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recomendaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Recomendaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scenario.paesScore < 650 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800">Mejora tu puntaje PAES</h4>
                <p className="text-sm text-yellow-700">
                  Aumentar tu puntaje a 650+ te haría elegible para becas de excelencia académica.
                </p>
              </div>
            )}
            
            {scenario.paesScore >= 650 && scenario.paesScore < 700 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800">Aumenta tu beca</h4>
                <p className="text-sm text-blue-700">
                  Alcanzar 700+ puntos incrementaría tu beca al 60% del arancel.
                </p>
              </div>
            )}
            
            {scenario.paesScore >= 700 && scenario.paesScore < 750 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800">Beca máxima disponible</h4>
                <p className="text-sm text-green-700">
                  Con 750+ puntos accederías a la beca máxima del 80%.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
