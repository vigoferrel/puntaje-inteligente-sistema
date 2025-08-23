/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Switch } from '../../../components/ui/switch';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { MaterialGenerationConfig } from '../types/learning-material-types';
import { Settings, Brain, Clock } from 'lucide-react';

interface ConfigurationPanelProps {
  config: MaterialGenerationConfig;
  onConfigChange: (updates: Partial<MaterialGenerationConfig>) => void;
  showAdvancedSettings: boolean;
}

export const ConfigurationPanel: FC<ConfigurationPanelProps> = ({
  config,
  onConfigChange,
  showAdvancedSettings
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          ConfiguraciÃ³n de GeneraciÃ³n
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ConfiguraciÃ³n BÃ¡sica */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Cantidad</Label>
            <Input
              type="number"
              min="1"
              max="50"
              value={config.count}
              onChange={(e) => onConfigChange({ count: parseInt(e.target.value) || 1 })}
            />
          </div>
          
          <div>
            <Label>Dificultad</Label>
            <Select 
              value={config.difficulty} 
              onValueChange={(value) => onConfigChange({ difficulty: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basico">BÃ¡sico</SelectItem>
                <SelectItem value="intermedio">Intermedio</SelectItem>
                <SelectItem value="avanzado">Avanzado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ConfiguraciÃ³n Avanzada */}
        {showAdvancedSettings && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4" />
              <Label className="font-semibold">ConfiguraciÃ³n Avanzada</Label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nivel del Usuario</Label>
                <Select 
                  value={config.userLevel || 'intermediate'} 
                  onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                    onConfigChange({ userLevel: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Principiante</SelectItem>
                    <SelectItem value="intermediate">Intermedio</SelectItem>
                    <SelectItem value="advanced">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  Tiempo Disponible (min)
                </Label>
                <Input
                  type="number"
                  min="5"
                  max="180"
                  value={config.timeAvailable || 30}
                  onChange={(e) => onConfigChange({ timeAvailable: parseInt(e.target.value) || 30 })}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Modo Personalizado</Label>
                <p className="text-xs text-muted-foreground">
                  Adapta el contenido basado en tu progreso y debilidades
                </p>
              </div>
              <Switch
                checked={config.personalizedMode || false}
                onCheckedChange={(checked) => onConfigChange({ personalizedMode: checked })}
              />
            </div>
          </div>
        )}

        {/* API */}
        {showAdvancedSettings && (
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key de OpenRouter</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Ingresa tu API Key"
                  value={config.apiKey}
                  onChange={(e) => onConfigChange({ apiKey: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  ObtÃ©n tu clave en{' '}
                  <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="underline">
                    openrouter.ai
                  </a>
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

