
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Scissors, 
  Activity, 
  Heart, 
  Eye, 
  Zap, 
  Thermometer,
  Timer,
  AlertTriangle,
  CheckCircle,
  Monitor,
  Stethoscope,
  Settings,
  Play,
  Pause,
  Square
} from 'lucide-react';

interface PatientVitals {
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  oxygenSaturation: number;
  respiratoryRate: number;
}

interface SurgicalTool {
  id: string;
  name: string;
  icon: React.ReactNode;
  isActive: boolean;
  precision: number;
}

interface ProcedureStep {
  id: string;
  name: string;
  duration: number;
  completed: boolean;
  critical: boolean;
}

export const SurgeonWindow: React.FC = () => {
  const [isOperating, setIsOperating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [operationTimer, setOperationTimer] = useState(0);
  const [selectedTool, setSelectedTool] = useState<string>('scalpel');
  const [alertLevel, setAlertLevel] = useState<'normal' | 'warning' | 'critical'>('normal');
  const timerRef = useRef<NodeJS.Timeout>();

  const [patientVitals, setPatientVitals] = useState<PatientVitals>({
    heartRate: 72,
    bloodPressure: '120/80',
    temperature: 36.5,
    oxygenSaturation: 98,
    respiratoryRate: 16
  });

  const surgicalTools: SurgicalTool[] = [
    { id: 'scalpel', name: 'Bisturí', icon: <Scissors className="w-4 h-4" />, isActive: true, precision: 95 },
    { id: 'electrocautery', name: 'Electrocauterio', icon: <Zap className="w-4 h-4" />, isActive: false, precision: 88 },
    { id: 'forceps', name: 'Fórceps', icon: <Eye className="w-4 h-4" />, isActive: false, precision: 92 },
    { id: 'suction', name: 'Aspirador', icon: <Activity className="w-4 h-4" />, isActive: false, precision: 85 }
  ];

  const procedureSteps: ProcedureStep[] = [
    { id: '1', name: 'Preparación del campo quirúrgico', duration: 300, completed: false, critical: false },
    { id: '2', name: 'Incisión inicial', duration: 180, completed: false, critical: true },
    { id: '3', name: 'Disección de tejidos', duration: 450, completed: false, critical: true },
    { id: '4', name: 'Identificación de estructuras', duration: 240, completed: false, critical: true },
    { id: '5', name: 'Procedimiento principal', duration: 600, completed: false, critical: true },
    { id: '6', name: 'Hemostasia', duration: 200, completed: false, critical: false },
    { id: '7', name: 'Sutura por planos', duration: 350, completed: false, critical: false }
  ];

  const [steps, setSteps] = useState(procedureSteps);

  // Simulación de vitales en tiempo real
  useEffect(() => {
    const vitalsInterval = setInterval(() => {
      setPatientVitals(prev => ({
        heartRate: prev.heartRate + (Math.random() - 0.5) * 4,
        bloodPressure: prev.bloodPressure,
        temperature: prev.temperature + (Math.random() - 0.5) * 0.2,
        oxygenSaturation: Math.max(95, Math.min(100, prev.oxygenSaturation + (Math.random() - 0.5) * 2)),
        respiratoryRate: prev.respiratoryRate + (Math.random() - 0.5) * 2
      }));

      // Determinar nivel de alerta basado en vitales
      const newAlertLevel = 
        patientVitals.heartRate > 100 || patientVitals.oxygenSaturation < 95 ? 'critical' :
        patientVitals.heartRate > 90 || patientVitals.oxygenSaturation < 97 ? 'warning' : 'normal';
      
      setAlertLevel(newAlertLevel);
    }, 2000);

    return () => clearInterval(vitalsInterval);
  }, [patientVitals]);

  // Timer de operación
  useEffect(() => {
    if (isOperating) {
      timerRef.current = setInterval(() => {
        setOperationTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOperating]);

  const startOperation = useCallback(() => {
    setIsOperating(true);
    setOperationTimer(0);
    setCurrentStep(0);
  }, []);

  const pauseOperation = useCallback(() => {
    setIsOperating(false);
  }, []);

  const stopOperation = useCallback(() => {
    setIsOperating(false);
    setOperationTimer(0);
    setCurrentStep(0);
    setSteps(procedureSteps);
  }, []);

  const completeCurrentStep = useCallback(() => {
    setSteps(prev => prev.map((step, index) => 
      index === currentStep ? { ...step, completed: true } : step
    ));
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, steps.length]);

  const selectTool = useCallback((toolId: string) => {
    setSelectedTool(toolId);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getVitalStatus = (vital: keyof PatientVitals) => {
    switch (vital) {
      case 'heartRate':
        return patientVitals.heartRate > 100 ? 'critical' : patientVitals.heartRate > 90 ? 'warning' : 'normal';
      case 'oxygenSaturation':
        return patientVitals.oxygenSaturation < 95 ? 'critical' : patientVitals.oxygenSaturation < 97 ? 'warning' : 'normal';
      case 'temperature':
        return patientVitals.temperature > 38 || patientVitals.temperature < 36 ? 'warning' : 'normal';
      default:
        return 'normal';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-500 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Stethoscope className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Centro Quirúrgico Virtual
            </h1>
          </div>
          <p className="text-muted-foreground">
            Sistema de simulación quirúrgica avanzado
          </p>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Panel de Control de Cirugía
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    onClick={startOperation}
                    disabled={isOperating}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar Cirugía
                  </Button>
                  <Button
                    onClick={pauseOperation}
                    disabled={!isOperating}
                    variant="outline"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pausar
                  </Button>
                  <Button
                    onClick={stopOperation}
                    variant="destructive"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Finalizar
                  </Button>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    <span className="font-mono text-lg">{formatTime(operationTimer)}</span>
                  </div>
                  <Badge className={getStatusColor(alertLevel)}>
                    {alertLevel === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {alertLevel === 'normal' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {alertLevel.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Vitals */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Heart className="w-5 h-5" />
                  Constantes Vitales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-3 rounded-lg ${getStatusColor(getVitalStatus('heartRate'))}`}>
                    <div className="text-sm font-medium">Frecuencia Cardíaca</div>
                    <div className="text-2xl font-bold">{Math.round(patientVitals.heartRate)}</div>
                    <div className="text-xs">BPM</div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-blue-100 text-blue-700">
                    <div className="text-sm font-medium">Presión Arterial</div>
                    <div className="text-xl font-bold">{patientVitals.bloodPressure}</div>
                    <div className="text-xs">mmHg</div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${getStatusColor(getVitalStatus('temperature'))}`}>
                    <div className="text-sm font-medium flex items-center gap-1">
                      <Thermometer className="w-3 h-3" />
                      Temperatura
                    </div>
                    <div className="text-xl font-bold">{patientVitals.temperature.toFixed(1)}°C</div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${getStatusColor(getVitalStatus('oxygenSaturation'))}`}>
                    <div className="text-sm font-medium">Saturación O₂</div>
                    <div className="text-2xl font-bold">{Math.round(patientVitals.oxygenSaturation)}%</div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-purple-100 text-purple-700">
                  <div className="text-sm font-medium">Frecuencia Respiratoria</div>
                  <div className="text-xl font-bold">{Math.round(patientVitals.respiratoryRate)} RPM</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Surgical Tools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <Scissors className="w-5 h-5" />
                  Instrumentos Quirúrgicos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {surgicalTools.map((tool) => (
                  <div
                    key={tool.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTool === tool.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                    onClick={() => selectTool(tool.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {tool.icon}
                        <span className="font-medium">{tool.name}</span>
                      </div>
                      {selectedTool === tool.id && (
                        <CheckCircle className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Precisión</span>
                        <span>{tool.precision}%</span>
                      </div>
                      <Progress value={tool.precision} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Procedure Steps */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Settings className="w-5 h-5" />
                  Pasos del Procedimiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg border-2 ${
                      index === currentStep && isOperating
                        ? 'border-purple-500 bg-purple-50'
                        : step.completed
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : index === currentStep && isOperating ? (
                          <Activity className="w-4 h-4 text-purple-500 animate-pulse" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                        )}
                        <span className={`text-sm ${step.critical ? 'font-bold' : 'font-medium'}`}>
                          {step.name}
                        </span>
                      </div>
                      {step.critical && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Duración estimada: {Math.floor(step.duration / 60)}:{(step.duration % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                ))}
                
                {isOperating && currentStep < steps.length && (
                  <Button 
                    onClick={completeCurrentStep}
                    className="w-full mt-4"
                    variant="outline"
                  >
                    Completar Paso Actual
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Patient Visualization Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-2 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-700">
                <Eye className="w-5 h-5" />
                Visualización del Paciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="text-center space-y-4">
                  <div className="w-32 h-48 bg-gradient-to-b from-pink-200 to-pink-300 rounded-full mx-auto relative">
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-pink-400 rounded-full"></div>
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-red-300 rounded-lg"></div>
                    {isOperating && (
                      <motion.div
                        className="absolute inset-0 border-4 border-green-400 rounded-full"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-indigo-700">
                      Campo Quirúrgico
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isOperating 
                        ? `Realizando: ${steps[currentStep]?.name}` 
                        : 'Listo para comenzar cirugía'
                      }
                    </p>
                  </div>
                </div>
                
                {alertLevel === 'critical' && (
                  <motion.div
                    className="absolute inset-0 bg-red-500 bg-opacity-20"
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
