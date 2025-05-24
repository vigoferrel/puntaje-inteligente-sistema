
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Award, TrendingUp } from 'lucide-react';
import { usePAESIntegration } from '@/hooks/lectoguia/use-paes-integration';

interface PAESStatsCardProps {
  activeSubject: string;
}

export const PAESStatsCard: React.FC<PAESStatsCardProps> = ({ activeSubject }) => {
  const { loadPAESStats, hasPAESContent } = usePAESIntegration();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasPAESContent(activeSubject)) {
      setLoading(true);
      loadPAESStats().then(data => {
        setStats(data);
        setLoading(false);
      });
    }
  }, [activeSubject, hasPAESContent, loadPAESStats]);

  if (!hasPAESContent(activeSubject)) {
    return null;
  }

  if (loading) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-green-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-green-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-green-800">
          <Award className="h-4 w-4" />
          Contenido Oficial PAES
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-green-700">Examen:</span>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {stats.exam.nombre} ({stats.exam.año})
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-700">Preguntas disponibles:</span>
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
            Preguntas oficiales del examen PAES {stats.exam.año}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-green-600">
          <BookOpen className="h-3 w-3" />
          <span>
            Duración original: {stats.exam.duracion_minutos} minutos
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
