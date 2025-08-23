
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  TrendingUp, 
  Target, 
  Brain,
  Calculator,
  Sparkles
} from 'lucide-react';

interface ScenarioSimulatorProps {
  currentMetrics: any;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  currentMetrics
}) => {
  const [scenarios, setScenarios] = useState([
    {
      name: "Escenario Actual",
      puntajeLectora: 650,
      puntajeM1: 680,
      studyHours: 20,
      potentialSavings: 2500000,
      probability: 75,
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Optimización +50pts",
      puntajeLectora: 700,
      puntajeM1: 730,
      studyHours: 35,
      potentialSavings: 4500000,
      probability: 85,
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Meta Excelencia",
      puntajeLectora: 750,
      puntajeM1: 780,
      studyHours: 50,
      potentialSavings: 6000000,
      probability: 95,
      color: "from-purple-500 to-pink-500"
    }
  ]);

  const [selectedScenario, setSelectedScenario] = useState(0);
  const [simulationActive, setSimulationActive] = useState(false);

  const runSimulation = () => {
    setSimulationActive(true);
    setTimeout(() => {
      setSimulationActive(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
          <Zap className="w-8 h-8 mr-3 text-purple-400" />
          Simulador de Escenarios
        </h2>
        <p className="text-purple-200">
          Explora diferentes estrategias y sus impactos financieros
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {scenarios.map((scenario, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
            onClick={() => setSelectedScenario(index)}
          >
            <Card className={`bg-black/60 backdrop-blur-lg border-2 transition-all duration-300 ${
              selectedScenario === index 
                ? 'border-purple-400 shadow-2xl shadow-purple-500/20' 
                : 'border-white/20 hover:border-purple-400/50'
            }`}>
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>{scenario.name}</span>
                  <Badge className={`bg-gradient-to-r ${scenario.color} text-white`}>
                    {scenario.probability}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-purple-400 text-sm">Lectora</div>
                      <div className="text-white text-xl font-bold">
                        {scenario.puntajeLectora}
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-purple-400 text-sm">M1</div>
                      <div className="text-white text-xl font-bold">
                        {scenario.puntajeM1}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-purple-400 text-sm mb-2">Ahorro Potencial</div>
                    <div className="text-green-400 text-2xl font-bold">
                      ${(scenario.potentialSavings / 1000000).toFixed(1)}M
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-purple-400 text-sm mb-2">Horas de Estudio</div>
                    <div className="text-blue-400 text-lg font-bold">
                      {scenario.studyHours}h/semana
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Panel de simulación interactiva */}
      <Card className="bg-black/60 backdrop-blur-lg border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="w-6 h-6 mr-2 text-purple-400" />
            Simulación Interactiva
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-purple-200 text-sm mb-3">
                  Puntaje Objetivo Lectora: {scenarios[selectedScenario].puntajeLectora}
                </label>
                <Slider
                  value={[scenarios[selectedScenario].puntajeLectora]}
                  onValueChange={(value) => {
                    const newScenarios = [...scenarios];
                    newScenarios[selectedScenario].puntajeLectora = value[0];
                    setScenarios(newScenarios);
                  }}
                  max={850}
                  min={400}
                  step={10}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-purple-200 text-sm mb-3">
                  Puntaje Objetivo M1: {scenarios[selectedScenario].puntajeM1}
                </label>
                <Slider
                  value={[scenarios[selectedScenario].puntajeM1]}
                  onValueChange={(value) => {
                    const newScenarios = [...scenarios];
                    newScenarios[selectedScenario].puntajeM1 = value[0];
                    setScenarios(newScenarios);
                  }}
                  max={850}
                  min={400}
                  step={10}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-purple-200 text-sm mb-3">
                  Horas de Estudio/Semana: {scenarios[selectedScenario].studyHours}h
                </label>
                <Slider
                  value={[scenarios[selectedScenario].studyHours]}
                  onValueChange={(value) => {
                    const newScenarios = [...scenarios];
                    newScenarios[selectedScenario].studyHours = value[0];
                    setScenarios(newScenarios);
                  }}
                  max={70}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-400/30">
                <h3 className="text-white font-bold mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-400" />
                  Resultados de Simulación
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-green-400 text-2xl font-bold">
                      ${((scenarios[selectedScenario].puntajeLectora + scenarios[selectedScenario].puntajeM1) * 3000).toLocaleString()}
                    </div>
                    <div className="text-green-300 text-sm">Ahorro Proyectado</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-400 text-2xl font-bold">
                      {Math.min(95, Math.round((scenarios[selectedScenario].puntajeLectora + scenarios[selectedScenario].puntajeM1) / 15))}%
                    </div>
                    <div className="text-blue-300 text-sm">Probabilidad Éxito</div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={runSimulation}
                disabled={simulationActive}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3"
              >
                {simulationActive ? (
                  <motion.div
                    className="flex items-center"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    Simulando...
                  </motion.div>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Ejecutar Simulación
                  </>
                )}
              </Button>

              {simulationActive && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-400/30"
                >
                  <div className="text-green-400 font-bold text-center">
                    ¡Simulación completada!
                  </div>
                  <div className="text-green-300 text-sm text-center mt-1">
                    Plan de estudio optimizado generado
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
