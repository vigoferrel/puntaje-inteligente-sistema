/* eslint-disable react-refresh/only-export-components */

import React, { useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { supabase } from '../../../integrations/supabase/leonardo-auth-client';
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
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Slider } from '../../../components/ui/slider';
import { Progress } from '../../../components/ui/progress';
import { Target, Trophy, Calendar, BookOpen, Calculator, Globe, Microscope, Save } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
// DISABLED: // DISABLED: import { supabase } from '../../../integrations/supabase/unified-client';
import { toast } from '../../../components/ui/use-toast';

interface GoalConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface GoalScores {
  cl: number; // Competencia Lectora
  m1: number; // MatemÃ¡tica 1
  m2: number; // MatemÃ¡tica 2
  hcs: number; // Historia y Ciencias Sociales
  cs: number; // Ciencias
}

const PAES_TESTS = [
  { key: 'cl', name: 'Competencia Lectora', icon: BookOpen, color: 'text-blue-400', required: true },
  { key: 'm1', name: 'MatemÃ¡tica M1', icon: Calculator, color: 'text-green-400', required: true },
  { key: 'm2', name: 'MatemÃ¡tica M2', icon: Calculator, color: 'text-emerald-400', required: false },
  { key: 'hcs', name: 'Historia y Cs. Sociales', icon: Globe, color: 'text-yellow-400', required: false },
  { key: 'cs', name: 'Ciencias', icon: Microscope, color: 'text-purple-400', required: false }
];

export const GoalConfigModal: React.FC<GoalConfigModalProps> = ({
  open,
  onOpenChange
}) => {
  const { user, profile } = useAuth();
  const [goalType, setGoalType] = useState('comprehensive');
  const [targetDate, setTargetDate] = useState('');
  const [scores, setScores] = useState<GoalScores>({
    cl: 650,
    m1: 650,
    m2: 600,
    hcs: 600,
    cs: 600
  });
  const [priorityAreas, setPriorityAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && user?.id) {
      loadExistingGoals();
    }
  }, [open, user?.id]);

  const loadExistingGoals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user!.id)
        .eq('is_active', true)
        .single();

      if (data) {
        setGoalType(data.goal_type);
        setTargetDate(data.target_date || '');
        setScores({
          cl: data.target_score_cl || 650,
          m1: data.target_score_m1 || 650,
          m2: data.target_score_m2 || 600,
          hcs: data.target_score_hcs || 600,
          cs: data.target_score_cs || 600
        });
        setPriorityAreas(data.priority_areas || []);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateScore = (testKey: keyof GoalScores, value: number[]) => {
    setScores(prev => ({ ...prev, [testKey]: value[0] }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-400';
    if (score >= 700) return 'text-yellow-400';
    if (score >= 650) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 750) return 'Excelente';
    if (score >= 700) return 'Muy Bueno';
    if (score >= 650) return 'Bueno';
    if (score >= 600) return 'Regular';
    return 'BÃ¡sico';
  };

  const calculateAverageScore = () => {
    const relevantScores = PAES_TESTS
      .filter(test => test.required || scores[test.key as keyof GoalScores] > 500)
      .map(test => scores[test.key as keyof GoalScores]);
    
    return relevantScores.reduce((sum, score) => sum + score, 0) / relevantScores.length;
  };

  const togglePriorityArea = (area: string) => {
    setPriorityAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const saveGoals = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      // Desactivar metas anteriores
      await supabase
        .from('user_goals')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Crear nueva meta
      const { error } = await supabase
        .from('user_goals')
        .insert({
          user_id: user.id,
          goal_type: goalType,
          target_score_cl: scores.cl,
          target_score_m1: scores.m1,
          target_score_m2: scores.m2,
          target_score_hcs: scores.hcs,
          target_score_cs: scores.cs,
          target_date: targetDate || null,
          priority_areas: priorityAreas,
          is_active: true
        });

      if (error) throw error;

      // Actualizar perfil con puntaje objetivo principal
      await supabase
        .from('profiles')
        .update({ target_score: Math.round(calculateAverageScore()) })
        .eq('id', user.id);

      toast({
        title: "Â¡Metas guardadas!",
        description: "Tus objetivos PAES han sido configurados exitosamente"
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error saving goals:', error);
      toast({
        title: "Error",
        description: "No se pudieron guardar las metas",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const avgScore = calculateAverageScore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-400" />
            Configurar Metas PAES
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Define tus objetivos de puntaje para cada prueba PAES
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Resumen general */}
            <Card className="bg-purple-600/10 border-purple-600/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-purple-400" />
                    <span className="text-purple-400 font-medium">Meta General</span>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(avgScore)}`}>
                    {Math.round(avgScore)}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Promedio objetivo</span>
                  <Badge className={`${getScoreColor(avgScore).replace('text-', 'bg-').replace('400', '600/20')} border-0`}>
                    {getScoreLabel(avgScore)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Fecha objetivo */}
            <div>
              <Label htmlFor="targetDate" className="text-white mb-2 block">
                Fecha Objetivo (opcional)
              </Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <Input
                  id="targetDate"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Puntajes por prueba */}
            <div>
              <Label className="text-white text-base mb-4 block">Puntajes Objetivo por Prueba</Label>
              <div className="space-y-4">
                {PAES_TESTS.map((test) => {
                  const TestIcon = test.icon;
                  const score = scores[test.key as keyof GoalScores];
                  
                  return (
                    <Card key={test.key} className="bg-gray-700/50 border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <TestIcon className={`h-5 w-5 ${test.color}`} />
                            <div>
                              <span className="text-white font-medium">{test.name}</span>
                              {test.required && (
                                <Badge variant="outline" className="ml-2 text-xs border-blue-600/50 text-blue-400">
                                  Obligatoria
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                              {score}
                            </span>
                            <Badge className={`text-xs ${getScoreColor(score).replace('text-', 'bg-').replace('400', '600/20')} border-0`}>
                              {getScoreLabel(score)}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Slider
                            value={[score]}
                            onValueChange={(value) => updateScore(test.key as keyof GoalScores, value)}
                            max={850}
                            min={400}
                            step={10}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>400</span>
                            <span>625</span>
                            <span>850</span>
                          </div>
                        </div>

                        <Progress value={(score - 400) / 4.5} className="h-1 mt-2" />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Ãreas prioritarias */}
            <div>
              <Label className="text-white text-base mb-3 block">Ãreas Prioritarias (opcional)</Label>
              <div className="flex flex-wrap gap-2">
                {['Velocidad lectora', 'ComprensiÃ³n', 'ResoluciÃ³n de problemas', 'AnÃ¡lisis', 'MemorizaciÃ³n'].map((area) => (
                  <Badge
                    key={area}
                    variant={priorityAreas.includes(area) ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      priorityAreas.includes(area) 
                        ? 'bg-purple-600 text-white' 
                        : 'border-gray-600 text-gray-400 hover:border-purple-500'
                    }`}
                    onClick={() => togglePriorityArea(area)}
                  >
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={saveGoals}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Guardando...' : 'Guardar Metas'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};




