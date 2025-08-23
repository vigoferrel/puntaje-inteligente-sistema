/* eslint-disable react-refresh/only-export-components */

import React, { useEffect, useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { BookOpen, Award, TrendingUp, Database } from 'lucide-react';
import { usePAESIntegration } from '../../../hooks/lectoguia/use-paes-integration';

interface PAESStatsCardProps {
  activeSubject: string;
}

export const PAESStatsCard: React.FC<PAESStatsCardProps> = ({ activeSubject }) => {
  const { loadPAESStats, hasPAESContent, subjectToExamMap } = usePAESIntegration();
  const [stats, setStats] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    const checkContentAndLoadStats = async () => {
      setLoading(true);
      
      try {
        // Verificar si hay contenido disponible
        const contentExists = await hasPAESContent(activeSubject);
        setHasContent(contentExists);
        
        if (contentExists) {
          // Obtener cÃ³digo de examen para la materia
          const examCode = subjectToExamMap[activeSubject];
          if (examCode) {
            const data = await loadPAESStats(examCode);
            setStats(data);
          }
        }
      } catch (error) {
        console.error('Error verificando contenido PAES:', error);
        setHasContent(false);
      } finally {
        setLoading(false);
      }
    };

    checkContentAndLoadStats();
  }, [activeSubject, hasPAESContent, loadPAESStats, subjectToExamMap]);

  if (!hasContent) {
    return null;
  }

  if (loading) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-blue-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-orange-700">
            <Database className="h-4 w-4" />
            <span className="text-sm">Error cargando datos PAES</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-green-800">
          <Award className="h-4 w-4" />
          Contenido Oficial PAES - Datos Reales
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-green-700">Examen:</span>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {stats.exam.codigo} ({stats.exam.aÃ±o})
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-700">Preguntas en BD:</span>
            <span className="font-medium text-green-800">
              {stats.questionsLoaded} / {stats.totalQuestions}
            </span>
          </div>
          <Progress 
            value={stats.loadingProgress} 
            className="h-2"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-green-600">
          <TrendingUp className="h-3 w-3" />
          <span>
            Conectado a base de datos Supabase
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-green-600">
          <BookOpen className="h-3 w-3" />
          <span>
            DuraciÃ³n oficial: {stats.exam.duracion_minutos} minutos
          </span>
        </div>

        <div className="bg-white p-2 rounded border border-green-200">
          <div className="text-xs text-green-700 font-medium">
            {stats.exam.nombre}
          </div>
          <div className="text-xs text-green-600">
            Tipo: {stats.exam.tipo}
          </div>
        </div>

        <div className="text-xs text-green-600 border-t border-green-200 pt-2">
          <Database className="h-3 w-3 inline mr-1" />
          Datos reales desde Supabase - Sin mocks
        </div>
      </CardContent>
    </Card>
  );
};

