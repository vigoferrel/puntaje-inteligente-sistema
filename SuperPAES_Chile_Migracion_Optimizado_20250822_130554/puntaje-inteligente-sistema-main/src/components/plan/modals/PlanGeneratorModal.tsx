/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../../../types/core';
import type { PlanCreationData } from '../../../types/learning-plan';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Badge } from '../../../components/ui/badge';
import { Checkbox } from '../../../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Brain, Target, Clock, BookOpen, Calculator, Globe, Microscope, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface PlanGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePlan: (planData: PlanCreationData) => void;
}

export const PlanGeneratorModal: React.FC<PlanGeneratorModalProps> = ({
  open,
  onOpenChange,
  onCreatePlan
}) => {
  const [planType, setPlanType] = useState<'diagnostic' | 'custom' | 'comprehensive'>('diagnostic');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('8');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [targetScore, setTargetScore] = useState('650');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const planTypes = [
    {
      id: 'diagnostic',
      title: 'Plan Basado en DiagnÃ³stico',
      description: 'Generado automÃ¡ticamente segÃºn tus resultados',
      icon: Brain,
      color: 'text-purple-400',
      recommended: true
    },
    {
      id: 'comprehensive',
      title: 'Plan Integral PAES',
      description: 'PreparaciÃ³n completa para todas las pruebas',
      icon: Target,
      color: 'text-blue-400'
    },
    {
      id: 'custom',
      title: 'Plan Personalizado',
      description: 'DiseÃ±a tu propio plan de estudios',
      icon: Zap,
      color: 'text-green-400'
    }
  ];

  const paesTests = [
    { code: 'COMPETENCIA_LECTORA', name: 'Competencia Lectora', icon: BookOpen, color: 'text-blue-400' },
    { code: 'MATEMATICA_1', name: 'MatemÃ¡tica M1', icon: Calculator, color: 'text-green-400' },
    { code: 'MATEMATICA_2', name: 'MatemÃ¡tica M2', icon: Calculator, color: 'text-emerald-400' },
    { code: 'HISTORIA', name: 'Historia y Cs. Sociales', icon: Globe, color: 'text-yellow-400' },
    { code: 'CIENCIAS', name: 'Ciencias', icon: Microscope, color: 'text-purple-400' }
  ];

  const handleTestToggle = (testCode: string) => {
    setSelectedTests(prev => 
      prev.includes(testCode) 
        ? prev.filter(t => t !== testCode)
        : [...prev, testCode]
    );
  };

  const handleCreatePlan = () => {
    const planData: PlanCreationData = {
      type: planType,
      title: title || `Plan ${planTypes.find(p => p.id === planType)?.title}`,
      description: description || planTypes.find(p => p.id === planType)?.description,
      duration: parseInt(duration),
      selectedTests: planType === 'comprehensive' ? paesTests.map(t => t.code) : selectedTests,
      targetScore: parseInt(targetScore),
      priority,
      // Los siguientes campos son necesarios según PlanCreationData, pero no presentes en PlanGeneratorModal.tsx
      // Se les asignarán valores predeterminados o lógicos para satisfacer el tipo
      targetDate: new Date().toISOString(), // Valor predeterminado
      subjects: selectedTests, // Utiliza los tests seleccionados como subjects
      difficulty: 'medium', // Valor predeterminado
      weeklyHours: 0, // Valor predeterminado
    };

    onCreatePlan(planData);
    onOpenChange(false);
    
    // Reset form
    setTitle('');
    setDescription('');
    setSelectedTests([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Crear Nuevo Plan de Estudio</DialogTitle>
          <DialogDescription className="text-gray-400">
            Configura tu plan personalizado de preparaciÃ³n PAES
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tipo de Plan */}
          <div>
            <Label className="text-white text-base mb-3 block">Tipo de Plan</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {planTypes.map((type, index) => {
                const TypeIcon = type.icon;
                const isSelected = planType === type.id;
                
                return (
                  <motion.div
                    key={type.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-200 border-2 relative ${
                        isSelected 
                          ? 'border-purple-500 bg-purple-600/10' 
                          : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                      }`}
                      onClick={() => setPlanType(type.id as 'diagnostic' | 'custom' | 'comprehensive')}
                    >
                      {type.recommended && (
                        <Badge className="absolute -top-2 -right-2 bg-yellow-600/20 text-yellow-400 border-yellow-600/50">
                          Recomendado
                        </Badge>
                      )}
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <TypeIcon className={`h-5 w-5 ${type.color}`} />
                          <CardTitle className="text-sm text-white">{type.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-gray-400">{type.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ConfiguraciÃ³n bÃ¡sica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-white">TÃ­tulo del Plan</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Mi Plan PAES 2024"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="duration" className="text-white">DuraciÃ³n (semanas)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="4">4 semanas</SelectItem>
                  <SelectItem value="6">6 semanas</SelectItem>
                  <SelectItem value="8">8 semanas</SelectItem>
                  <SelectItem value="12">12 semanas</SelectItem>
                  <SelectItem value="16">16 semanas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-white">DescripciÃ³n (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe los objetivos especÃ­ficos de tu plan..."
              className="bg-gray-700 border-gray-600 text-white"
              rows={3}
            />
          </div>

          {/* SelecciÃ³n de Pruebas PAES */}
          {planType !== 'comprehensive' && (
            <div>
              <Label className="text-white text-base mb-3 block">
                Pruebas PAES {planType === 'diagnostic' ? '(basadas en diagnÃ³stico)' : ''}
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {paesTests.map((test) => {
                  const TestIcon = test.icon;
                  const isSelected = selectedTests.includes(test.code);
                  
                  return (
                    <Card
                      key={test.code}
                      className={`cursor-pointer transition-all duration-200 border ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-600/10' 
                          : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                      }`}
                      onClick={() => handleTestToggle(test.code)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            checked={isSelected}
                            onChange={() => handleTestToggle(test.code)}
                          />
                          <TestIcon className={`h-4 w-4 ${test.color}`} />
                          <span className="text-sm text-white">{test.name}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* ConfiguraciÃ³n avanzada */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="targetScore" className="text-white">Puntaje Objetivo</Label>
              <Select value={targetScore} onValueChange={setTargetScore}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="500">500 - BÃ¡sico</SelectItem>
                  <SelectItem value="600">600 - Intermedio</SelectItem>
                  <SelectItem value="650">650 - Bueno</SelectItem>
                  <SelectItem value="700">700 - Muy Bueno</SelectItem>
                  <SelectItem value="750">750+ - Excelente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority" className="text-white">Prioridad</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as 'high' | 'medium' | 'low')}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="low">Baja - Estudio relajado</SelectItem>
                  <SelectItem value="medium">Media - Estudio constante</SelectItem>
                  <SelectItem value="high">Alta - Estudio intensivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleCreatePlan}
            className="bg-purple-600 hover:bg-purple-700"
            disabled={planType === 'custom' && selectedTests.length === 0}
          >
            <Zap className="h-4 w-4 mr-2" />
            Crear Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


