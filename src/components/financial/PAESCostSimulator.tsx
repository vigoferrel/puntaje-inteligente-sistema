
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartBar, TrendingUp, DollarSign, GraduationCap } from 'lucide-react';

interface PAESCostSimulatorProps {
  userProfile: {
    expectedScore: number;
    familyIncome: string;
    region: string;
  };
}

export const PAESCostSimulator: React.FC<PAESCostSimulatorProps> = ({ userProfile }) => {
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedCareer, setSelectedCareer] = useState('');
  
  const universities = [
    { id: 'uchile', name: 'Universidad de Chile', type: 'public', prestige: 'high' },
    { id: 'puc', name: 'Pontificia Universidad Católica', type: 'private', prestige: 'high' },
    { id: 'usach', name: 'Universidad de Santiago', type: 'public', prestige: 'medium' },
    { id: 'udp', name: 'Universidad Diego Portales', type: 'private', prestige: 'medium' }
  ];

  const careers = [
    { id: 'medicina', name: 'Medicina', duration: 7, avgCost: 8500000, cutoffScore: 750 },
    { id: 'ingenieria', name: 'Ingeniería Civil', duration: 6, avgCost: 4500000, cutoffScore: 650 },
    { id: 'derecho', name: 'Derecho', duration: 5, avgCost: 3500000, cutoffScore: 600 },
    { id: 'psicologia', name: 'Psicología', duration: 5, avgCost: 3000000, cutoffScore: 580 }
  ];

  const calculateCosts = () => {
    if (!selectedUniversity || !selectedCareer) return null;

    const university = universities.find(u => u.id === selectedUniversity);
    const career = careers.find(c => c.id === selectedCareer);
    
    if (!university || !career) return null;

    const baseCost = career.avgCost;
    const multiplier = university.type === 'private' ? 1.5 : 1.0;
    const prestigeMultiplier = university.prestige === 'high' ? 1.2 : 1.0;
    
    const annualCost = baseCost * multiplier * prestigeMultiplier;
    const totalCost = annualCost * career.duration;
    
    // Calcular probabilidad de ingreso basada en puntaje
    const admissionProbability = userProfile.expectedScore >= career.cutoffScore 
      ? Math.min(95, ((userProfile.expectedScore - career.cutoffScore) / 50) * 30 + 70)
      : Math.max(5, ((userProfile.expectedScore / career.cutoffScore) * 50));

    return {
      university,
      career,
      annualCost,
      totalCost,
      admissionProbability,
      monthlyPayment: annualCost / 12,
      livingCosts: userProfile.region === 'metropolitana' ? 600000 : 400000
    };
  };

  const simulation = calculateCosts();

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card className="bg-black/40 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ChartBar className="w-5 h-5" />
            Simulador de Costos PAES 2025
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Universidad
              </label>
              <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Selecciona una universidad" />
                </SelectTrigger>
                <SelectContent>
                  {universities.map(uni => (
                    <SelectItem key={uni.id} value={uni.id}>
                      {uni.name} ({uni.type === 'public' ? 'Pública' : 'Privada'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Carrera
              </label>
              <Select value={selectedCareer} onValueChange={setSelectedCareer}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Selecciona una carrera" />
                </SelectTrigger>
                <SelectContent>
                  {careers.map(career => (
                    <SelectItem key={career.id} value={career.id}>
                      {career.name} (Puntaje corte: {career.cutoffScore})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90">
            Generar Simulación Detallada
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {simulation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-white/20">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  ${simulation.annualCost.toLocaleString()}
                </div>
                <div className="text-white/60 text-sm">Costo Anual</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-white/20">
              <CardContent className="p-4 text-center">
                <GraduationCap className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  ${simulation.totalCost.toLocaleString()}
                </div>
                <div className="text-white/60 text-sm">Costo Total Carrera</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-white/20">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {simulation.admissionProbability.toFixed(1)}%
                </div>
                <div className="text-white/60 text-sm">Prob. Ingreso</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-white/20">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  ${simulation.monthlyPayment.toLocaleString()}
                </div>
                <div className="text-white/60 text-sm">Pago Mensual</div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Breakdown */}
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Desglose Financiero Detallado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-3">Costos Académicos</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/70">Matrícula anual:</span>
                      <span className="text-white">${simulation.annualCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Duración carrera:</span>
                      <span className="text-white">{simulation.career.duration} años</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-white">Total académico:</span>
                      <span className="text-green-400">${simulation.totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-3">Costos de Vida</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/70">Gastos mensuales:</span>
                      <span className="text-white">${simulation.livingCosts.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Total vida (anual):</span>
                      <span className="text-white">${(simulation.livingCosts * 12).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-white">Total vida (carrera):</span>
                      <span className="text-orange-400">
                        ${(simulation.livingCosts * 12 * simulation.career.duration).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-white/20 pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-white">Inversión Total Proyectada:</span>
                  <span className="text-blue-400">
                    ${(simulation.totalCost + (simulation.livingCosts * 12 * simulation.career.duration)).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
