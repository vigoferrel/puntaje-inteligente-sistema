/* eslint-disable react-refresh/only-export-components */

import React, { useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { 
  Calculator, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';

interface ScholarshipCalculatorProps {
  onMetricsUpdate: (metrics: unknown) => void;
}

export const ScholarshipCalculator: React.FC<ScholarshipCalculatorProps> = ({
  onMetricsUpdate
}) => {
  const [formData, setFormData] = useState({
    puntajeLectora: '',
    puntajeM1: '',
    nem: '',
    decilSocioeconomico: '',
    tipoEstablecimiento: '',
    rankingEstablecimiento: '',
    tipoCarrera: '',
    tieneDTE: false,
    esHijoProfessor: false
  });

  const [results, setResults] = useState([]);
  const [promedioObligatorias, setPromedioObligatorias] = useState(0);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    if (formData.puntajeLectora && formData.puntajeM1) {
      const promedio = (parseInt(formData.puntajeLectora) + parseInt(formData.puntajeM1)) / 2;
      setPromedioObligatorias(promedio);
    }
  }, [formData.puntajeLectora, formData.puntajeM1]);

  useEffect(() => {
    calculateScholarships();
  }, [formData, promedioObligatorias]);

  const calculateScholarships = async () => {
    setCalculating(true);
    
    // Simular cÃ¡lculo con delay para efecto cinematogrÃ¡fico
    await new Promise(resolve => setTimeout(resolve, 1000));

    const scholarships = [
      {
        nombre: "Gratuidad",
        monto: "100% MatrÃ­cula + Arancel",
        elegible: formData.decilSocioeconomico && parseInt(formData.decilSocioeconomico) <= 6,
        impacto: 4500000,
        tipo: "principal"
      },
      {
        nombre: "Beca VocaciÃ³n de Profesor",
        monto: "100% MatrÃ­cula + Arancel",
        elegible: formData.tipoCarrera === "pedagogia" && promedioObligatorias >= 595,
        impacto: 4500000,
        tipo: "merito"
      },
      {
        nombre: "Beca Excelencia AcadÃ©mica",
        monto: "$1.150.000 anuales",
        elegible: parseInt(formData.rankingEstablecimiento || '0') <= 10 && 
                 (formData.tipoEstablecimiento === "municipal" || formData.tipoEstablecimiento === "subvencionado"),
        impacto: 1150000,
        tipo: "merito"
      },
      {
        nombre: "Beca DTE",
        monto: "$1.150.000 anuales",
        elegible: formData.tieneDTE,
        impacto: 1150000,
        tipo: "merito"
      }
    ];

    setResults(scholarships);
    
    const eligibleScholarships = scholarships.filter(s => s.elegible);
    const totalSavings = eligibleScholarships.reduce((acc, s) => acc + s.impacto, 0);
    
    onMetricsUpdate({
      potentialSavings: totalSavings,
      eligibleScholarships: eligibleScholarships.length,
      currentProgress: 75,
      targetScore: 750,
      daysToDeadline: 45,
      optimizationLevel: 85
    });

    setCalculating(false);
  };

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getScholarshipColor = (tipo: string) => {
    switch(tipo) {
      case 'principal': return 'from-green-500 to-emerald-500';
      case 'merito': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
          <Calculator className="w-8 h-8 mr-3 text-cyan-400" />
          Calculadora de Becas PAES 2025
        </h2>
        <p className="text-blue-200">
          Sistema de evaluaciÃ³n inteligente para maximizar tus oportunidades
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Formulario */}
        <Card className="bg-black/60 backdrop-blur-lg border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Info className="w-5 w-5 mr-2 text-cyan-400" />
              Datos de Entrada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Competencia Lectora
                </label>
                <input
                  type="number"
                  min="100"
                  max="1000"
                  className="w-full px-3 py-2 bg-white/10 border border-cyan-500/30 rounded-md text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="450-900"
                  value={formData.puntajeLectora}
                  onChange={(e) => handleInputChange('puntajeLectora', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  MatemÃ¡tica M1
                </label>
                <input
                  type="number"
                  min="100"
                  max="1000"
                  className="w-full px-3 py-2 bg-white/10 border border-cyan-500/30 rounded-md text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="450-900"
                  value={formData.puntajeM1}
                  onChange={(e) => handleInputChange('puntajeM1', e.target.value)}
                />
              </div>
            </div>

            {promedioObligatorias > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-400/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-cyan-200 font-medium">Promedio Obligatorias:</span>
                  <span className="text-2xl font-bold text-cyan-400">
                    {promedioObligatorias.toFixed(0)} pts
                  </span>
                </div>
                <Progress 
                  value={(promedioObligatorias / 850) * 100} 
                  className="mt-2 h-2"
                />
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Decil SocioeconÃ³mico
                </label>
                <select
                  className="w-full px-3 py-2 bg-white/10 border border-cyan-500/30 rounded-md text-white focus:ring-2 focus:ring-cyan-400"
                  value={formData.decilSocioeconomico}
                  onChange={(e) => handleInputChange('decilSocioeconomico', e.target.value)}
                >
                  <option value="" className="text-black">Seleccionar</option>
                  {[1,2,3,4,5,6,7,8,9,10].map(decil => (
                    <option key={decil} value={decil} className="text-black">
                      Decil {decil}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Tipo Carrera
                </label>
                <select
                  className="w-full px-3 py-2 bg-white/10 border border-cyan-500/30 rounded-md text-white focus:ring-2 focus:ring-cyan-400"
                  value={formData.tipoCarrera}
                  onChange={(e) => handleInputChange('tipoCarrera', e.target.value)}
                >
                  <option value="" className="text-black">Seleccionar</option>
                  <option value="pedagogia" className="text-black">PedagogÃ­a</option>
                  <option value="universitaria" className="text-black">Universitaria</option>
                  <option value="tecnica" className="text-black">TÃ©cnica</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center text-white">
                <input
                  type="checkbox"
                  className="mr-3 w-4 h-4 rounded border-cyan-500/30 bg-white/10 text-cyan-400 focus:ring-cyan-400"
                  checked={formData.tieneDTE}
                  onChange={(e) => handleInputChange('tieneDTE', e.target.checked)}
                />
                <span>Obtuve DTE en la PAES</span>
              </label>

              <label className="flex items-center text-white">
                <input
                  type="checkbox"
                  className="mr-3 w-4 h-4 rounded border-cyan-500/30 bg-white/10 text-cyan-400 focus:ring-cyan-400"
                  checked={formData.esHijoProfessor}
                  onChange={(e) => handleInputChange('esHijoProfessor', e.target.checked)}
                />
                <span>Soy hijo/a de profesor</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <Card className="bg-black/60 backdrop-blur-lg border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-cyan-400" />
              Resultados del AnÃ¡lisis
              {calculating && (
                <motion.div
                  className="ml-auto"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-5 h-5 text-yellow-400" />
                </motion.div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {calculating ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <div className="text-cyan-400 text-lg mb-4">Analizando oportunidades...</div>
                <Progress value={75} className="w-full" />
              </motion.div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {results.map((scholarship: unknown, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-l-4 ${
                      scholarship.elegible 
                        ? 'border-green-400 bg-green-500/10' 
                        : 'border-red-400 bg-red-500/10'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          {scholarship.elegible ? (
                            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400 mr-2" />
                          )}
                          <h3 className="font-semibold text-white">{scholarship.nombre}</h3>
                        </div>
                        
                        <Badge 
                          className={`bg-gradient-to-r ${getScholarshipColor(scholarship.tipo)} text-white mb-2`}
                        >
                          {scholarship.tipo.toUpperCase()}
                        </Badge>
                        
                        <p className="text-cyan-200 font-medium">{scholarship.monto}</p>
                      </div>
                      
                      {scholarship.elegible && (
                        <div className="text-right">
                          <div className="text-green-400 font-bold">
                            ${(scholarship.impacto / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-xs text-green-300">Ahorro anual</div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

