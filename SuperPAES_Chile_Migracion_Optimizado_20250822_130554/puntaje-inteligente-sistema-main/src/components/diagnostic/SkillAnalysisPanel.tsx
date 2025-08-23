/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { TrendingUp, TrendingDown, Minus, Target } from 'lucide-react';
import { TPAESPrueba, TPAESHabilidad, getPruebaDisplayName, getHabilidadDisplayName } from '../../types/system-types';
import { PAESTest, PAESSkill } from '../../types/unified-diagnostic';

interface SkillAnalysisPanelProps {
  skillAnalysis: Record<TPAESHabilidad, {
    level: number;
    trend: 'improving' | 'stable' | 'declining';
    exercises_completed: number;
    accuracy_rate: number;
    time_spent_minutes: number;
    recommendations: string[];
  }> | null;
  selectedPrueba: TPAESPrueba;
  onPruebaChange: (prueba: TPAESPrueba) => void;
  tests: PAESTest[];
  skills: PAESSkill[];
}

export const SkillAnalysisPanel: FC<SkillAnalysisPanelProps> = ({
  skillAnalysis,
  selectedPrueba,
  onPruebaChange,
  tests,
  skills
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const filteredSkills = skills.filter(skill => 
    skill.applicableTests.includes(selectedPrueba)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>AnÃ¡lisis de Habilidades</span>
            <Select value={selectedPrueba} onValueChange={(value) => onPruebaChange(value as TPAESPrueba)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tests.map((test) => (
                  <SelectItem key={test.id} value={test.code}>
                    {getPruebaDisplayName(test.code as TPAESPrueba)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredSkills.map((skill) => {
            const analysis = skillAnalysis?.[skill.skillType];
            
            return (
              <Card key={skill.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{getHabilidadDisplayName(skill.skillType)}</h4>
                    <p className="text-sm text-gray-600">{skill.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {analysis && getTrendIcon(analysis.trend)}
                    <Badge variant={analysis?.accuracy_rate >= 0.7 ? "default" : "destructive"}>
                      {analysis ? Math.round(analysis.accuracy_rate * 100) : 0}%
                    </Badge>
                  </div>
                </div>
                
                {analysis && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Ejercicios:</span>
                        <span className="ml-1 font-medium">{analysis.exercises_completed}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Tiempo:</span>
                        <span className="ml-1 font-medium">{analysis.time_spent_minutes}min</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Nivel:</span>
                        <span className="ml-1 font-medium">{Math.round(analysis.level * 100)}%</span>
                      </div>
                    </div>
                    
                    {analysis.recommendations.length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium mb-2">Recomendaciones:</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {analysis.recommendations.map((rec, index) => (
                            <li key={index}>â€¢ {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

