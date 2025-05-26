
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Brain, Target, Sparkles, DollarSign, BarChart3 } from 'lucide-react';

interface FinancialPredictorProps {
  userProfile: {
    expectedScore: number;
    familyIncome: string;
    region: string;
  };
}

export const FinancialPredictor: React.FC<FinancialPredictorProps> = ({ userProfile }) => {
  const [prediction, setPrediction] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePrediction = async () => {
    setIsGenerating(true);
    
    // Simular análisis IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const predictions = {
      roi: {
        medicine: { investment: 60000000, avgSalary: 2500000, paybackYears: 8, roi: 320 },
        engineering: { investment: 35000000, avgSalary: 1800000, paybackYears: 6, roi: 280 },
        law: { investment: 25000000, avgSalary: 1400000, paybackYears: 5, roi: 240 },
        psychology: { investment: 20000000, avgSalary: 1000000, paybackYears: 7, roi: 180 }
      },
      recommendations: [
        {
          career: 'Ingeniería Civil',
          score: 92,
          reasoning: 'Excelente ROI, alta demanda laboral, compatible con tu puntaje proyectado',
          salaryRange: '$1.200.000 - $2.400.000',
          jobSecurity: 95
        },
        {
          career: 'Medicina',
          score: 88,
          reasoning: 'ROI excepcional a largo plazo, alta estabilidad, requiere puntaje alto',
          salaryRange: '$1.800.000 - $3.500.000',
          jobSecurity: 98
        },
        {
          career: 'Psicología',
          score: 75,
          reasoning: 'ROI moderado, crecimiento profesional diverso, accesible con tu puntaje',
          salaryRange: '$700.000 - $1.500.000',
          jobSecurity: 78
        }
      ],
      marketTrends: {
        techGrowth: 25,
        healthGrowth: 18,
        sustainabilityGrowth: 30,
        digitalTransformation: 40
      }
    };
    
    setPrediction(predictions);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Trigger */}
      <Card className="bg-black/40 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Predictor Financiero IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-white/80 mb-4">
              Análisis predictivo basado en tu perfil académico, tendencias del mercado laboral y datos históricos
            </p>
            <Button 
              onClick={generatePrediction}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Analizando con IA...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Generar Predicción IA
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {prediction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* ROI Analysis */}
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Análisis ROI por Carrera
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(prediction.roi).map(([career, data]) => (
                  <Card key={career} className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <h4 className="text-white font-bold capitalize mb-3">{career}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/70">Inversión total:</span>
                          <span className="text-white">${data.investment.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Salario promedio:</span>
                          <span className="text-green-400">${data.avgSalary.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Recuperación:</span>
                          <span className="text-blue-400">{data.paybackYears} años</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span className="text-white">ROI:</span>
                          <span className="text-purple-400">{data.roi}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                Recomendaciones Personalizadas IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prediction.recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.career}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-white/20">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-white font-bold">{rec.career}</h4>
                            <Badge className="mt-1 bg-purple-600 text-white">
                              Score: {rec.score}/100
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-white/70">Seguridad Laboral</div>
                            <div className="text-lg font-bold text-green-400">{rec.jobSecurity}%</div>
                          </div>
                        </div>
                        
                        <p className="text-white/80 text-sm mb-3">{rec.reasoning}</p>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/70">Rango salarial:</span>
                          <span className="text-green-400 font-medium">{rec.salaryRange}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Trends */}
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Tendencias del Mercado 2025-2030
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    +{prediction.marketTrends.techGrowth}%
                  </div>
                  <div className="text-white/70 text-sm">Tecnología</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    +{prediction.marketTrends.healthGrowth}%
                  </div>
                  <div className="text-white/70 text-sm">Salud</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">
                    +{prediction.marketTrends.sustainabilityGrowth}%
                  </div>
                  <div className="text-white/70 text-sm">Sustentabilidad</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    +{prediction.marketTrends.digitalTransformation}%
                  </div>
                  <div className="text-white/70 text-sm">Digital</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
