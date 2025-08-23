
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Calculator, 
  Globe, 
  Microscope, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { TPAESPrueba } from '@/types/system-types';

interface PAESTestData {
  id: number;
  name: string;
  code: TPAESPrueba;
  description?: string;
  skills: any[];
  nodeCount: number;
  userProgress: number;
  weaknessLevel: 'high' | 'medium' | 'low' | 'none';
}

interface PAESTestSelectorProps {
  paesTests: PAESTestData[];
  selectedTests: TPAESPrueba[];
  onTestToggle: (testCode: TPAESPrueba) => void;
  loading?: boolean;
}

export const PAESTestSelector: React.FC<PAESTestSelectorProps> = ({
  paesTests,
  selectedTests,
  onTestToggle,
  loading = false
}) => {
  
  // Mapeo de iconos para cada prueba PAES
  const getTestIcon = (code: TPAESPrueba) => {
    switch (code) {
      case 'COMPETENCIA_LECTORA':
        return BookOpen;
      case 'MATEMATICA_1':
      case 'MATEMATICA_2':
        return Calculator;
      case 'HISTORIA':
        return Globe;
      case 'CIENCIAS':
        return Microscope;
      default:
        return BookOpen;
    }
  };

  // Colores según el nivel de debilidad
  const getWeaknessColor = (level: string) => {
    switch (level) {
      case 'high':
        return {
          border: 'border-red-500/50',
          bg: 'bg-red-600/10',
          text: 'text-red-400',
          badgeColor: 'bg-red-600/20 text-red-400'
        };
      case 'medium':
        return {
          border: 'border-yellow-500/50',
          bg: 'bg-yellow-600/10',
          text: 'text-yellow-400',
          badgeColor: 'bg-yellow-600/20 text-yellow-400'
        };
      case 'low':
        return {
          border: 'border-blue-500/50',
          bg: 'bg-blue-600/10',
          text: 'text-blue-400',
          badgeColor: 'bg-blue-600/20 text-blue-400'
        };
      default:
        return {
          border: 'border-green-500/50',
          bg: 'bg-green-600/10',
          text: 'text-green-400',
          badgeColor: 'bg-green-600/20 text-green-400'
        };
    }
  };

  // Icono de estado según nivel de debilidad
  const getStatusIcon = (level: string, progress: number) => {
    if (level === 'high') return AlertTriangle;
    if (level === 'medium') return TrendingDown;
    if (progress > 70) return CheckCircle;
    return TrendingUp;
  };

  // Etiqueta de estado
  const getStatusLabel = (level: string, progress: number) => {
    if (level === 'high') return 'Crítico';
    if (level === 'medium') return 'Mejorar';
    if (progress > 80) return 'Sólido';
    if (progress > 60) return 'En desarrollo';
    return 'Inicial';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          Selecciona las Pruebas PAES para tu Plan
        </h3>
        <p className="text-gray-400 text-sm">
          Basado en tu diagnóstico, te recomendamos enfocarte en las áreas marcadas como críticas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paesTests.map((test, index) => {
          const TestIcon = getTestIcon(test.code);
          const StatusIcon = getStatusIcon(test.weaknessLevel, test.userProgress);
          const colors = getWeaknessColor(test.weaknessLevel);
          const isSelected = selectedTests.includes(test.code);
          
          return (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`
                  cursor-pointer transition-all duration-200 bg-gray-800 border-2
                  ${isSelected 
                    ? `${colors.border} ${colors.bg} shadow-lg scale-105` 
                    : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'
                  }
                `}
                onClick={() => onTestToggle(test.code)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <TestIcon className={`h-6 w-6 ${
                        isSelected ? colors.text : 'text-gray-400'
                      }`} />
                      <div>
                        <CardTitle className={`text-sm font-medium ${
                          isSelected ? 'text-white' : 'text-gray-300'
                        }`}>
                          {test.name}
                        </CardTitle>
                      </div>
                    </div>
                    
                    <StatusIcon className={`h-5 w-5 ${colors.text}`} />
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 space-y-3">
                  {/* Estado y progreso */}
                  <div className="flex items-center justify-between">
                    <Badge className={`text-xs ${colors.badgeColor} border-0`}>
                      {getStatusLabel(test.weaknessLevel, test.userProgress)}
                    </Badge>
                    <span className={`text-sm font-medium ${colors.text}`}>
                      {test.userProgress}%
                    </span>
                  </div>
                  
                  {/* Barra de progreso */}
                  <Progress 
                    value={test.userProgress} 
                    className="h-2"
                  />
                  
                  {/* Información adicional */}
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{test.skills.length} habilidades</span>
                    <span>{test.nodeCount} nodos</span>
                  </div>
                  
                  {/* Descripción si está disponible */}
                  {test.description && (
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {test.description}
                    </p>
                  )}
                  
                  {/* Indicador de selección */}
                  {isSelected && (
                    <div className="flex items-center gap-2 mt-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-xs text-green-400 font-medium">
                        Incluido en tu plan
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      {/* Resumen de selección */}
      {selectedTests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">
              Plan Seleccionado
            </span>
          </div>
          <p className="text-sm text-gray-300">
            Has seleccionado {selectedTests.length} prueba{selectedTests.length !== 1 ? 's' : ''} PAES. 
            El sistema generará un plan integrado considerando las habilidades transversales.
          </p>
        </motion.div>
      )}
    </div>
  );
};
