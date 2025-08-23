/* eslint-disable react-refresh/only-export-components */

import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Slider } from '../../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Calculator, DollarSign, Award, TrendingUp } from 'lucide-react';

interface ScholarshipCalculatorProps {
  userProfile: {
    expectedScore: number;
    familyIncome: string;
    region: string;
  };
}

export const ScholarshipCalculator: React.FC<ScholarshipCalculatorProps> = ({ userProfile }) => {
  const [score, setScore] = useState(userProfile.expectedScore);
  const [income, setIncome] = useState(userProfile.familyIncome);
  const [region, setRegion] = useState(userProfile.region);
  const [selectedCareer, setSelectedCareer] = useState('');

  const calculateScholarships = () => {
    // SimulaciÃ³n de cÃ¡lculo de becas basado en puntaje
    const scholarships = [];
    
    if (score >= 700) {
      scholarships.push({
        name: 'Beca de Excelencia AcadÃ©mica',
        coverage: '100%',
        amount: '$2.500.000',
        type: 'merit',
        requirements: 'Puntaje PAES â‰¥ 700'
      });
    }
    
    if (score >= 600) {
      scholarships.push({
        name: 'Beca Nuevo Milenio',
        coverage: '75%',
        amount: '$1.875.000',
        type: 'merit',
        requirements: 'Puntaje PAES â‰¥ 600 + ranking'
      });
    }
    
    if (income === 'low') {
      scholarships.push({
        name: 'Beca Bicentenario',
        coverage: '100%',
        amount: '$2.500.000',
        type: 'need',
        requirements: 'Vulnerabilidad socioeconÃ³mica'
      });
    }
    
    if (income === 'middle') {
      scholarships.push({
        name: 'Beca Juan GÃ³mez Millas',
        coverage: '50%',
        amount: '$1.250.000',
        type: 'need',
        requirements: 'Ingresos familiares medios'
      });
    }

    return scholarships;
  };

  const scholarships = calculateScholarships();

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <Card className="bg-black/40 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            ConfiguraciÃ³n de CÃ¡lculo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Puntaje PAES Proyectado: {score}
              </label>
              <Slider
                value={[score]}
                onValueChange={(value) => setScore(value[0])}
                max={850}
                min={150}
                step={10}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Nivel de Ingresos Familiares
              </label>
              <Select value={income} onValueChange={setIncome}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Bajos (â‰¤ $400.000)</SelectItem>
                  <SelectItem value="middle">Medios ($400.000 - $1.200.000)</SelectItem>
                  <SelectItem value="high">Altos (&gt; $1.200.000)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                RegiÃ³n
              </label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metropolitana">RegiÃ³n Metropolitana</SelectItem>
                  <SelectItem value="valparaiso">ValparaÃ­so</SelectItem>
                  <SelectItem value="biobio">BiobÃ­o</SelectItem>
                  <SelectItem value="otras">Otras Regiones</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90">
            Recalcular Becas Disponibles
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scholarships.map((scholarship, index) => (
          <motion.div
            key={scholarship.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-white/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">{scholarship.name}</h3>
                    <Badge className={`mt-1 ${
                      scholarship.type === 'merit' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-purple-600 text-white'
                    }`}>
                      {scholarship.type === 'merit' ? 'Por MÃ©rito' : 'Por Necesidad'}
                    </Badge>
                  </div>
                  <Award className="w-8 h-8 text-yellow-400" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Cobertura:</span>
                    <span className="text-white font-bold">{scholarship.coverage}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Monto Anual:</span>
                    <span className="text-green-400 font-bold">{scholarship.amount}</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-white/70 text-sm">Requisitos:</span>
                    <p className="text-white text-sm mt-1">{scholarship.requirements}</p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-white/30 text-white hover:bg-white/10"
                >
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <Card className="bg-black/20 backdrop-blur-xl border-white/10">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">
                ${scholarships.reduce((sum, s) => sum + parseInt(s.amount.replace(/[$.,]/g, '')), 0).toLocaleString()}
              </div>
              <div className="text-white/60 text-sm">Total Potencial Anual</div>
            </div>
            <div>
              <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-400">{scholarships.length}</div>
              <div className="text-white/60 text-sm">Becas Elegibles</div>
            </div>
            <div>
              <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">
                {scholarships.length > 0 ? Math.round(scholarships.reduce((sum, s) => sum + parseInt(s.coverage), 0) / scholarships.length) : 0}%
              </div>
              <div className="text-white/60 text-sm">Cobertura Promedio</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

