
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, TrendingUp, TrendingDown, Zap, 
  Brain, Award, AlertTriangle, CheckCircle
} from 'lucide-react';

interface CompetencyAnalysisProps {
  competencias: any[];
  analisis: any;
}

export const CompetencyAnalysis: React.FC<CompetencyAnalysisProps> = ({
  competencias,
  analisis
}) => {
  if (!competencias.length || !analisis) {
    return (
      <div className="text-center py-12">
        <div className="text-white/60">No hay datos de análisis disponibles</div>
      </div>
    );
  }

  const competenciasDestacadas = analisis.competenciasDestacadas || [];
  const competenciasEnDesarrollo = analisis.competenciasEnDesarrollo || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-white mb-2">Análisis de Competencias</h2>
        <p className="text-purple-200">Detalle completo de tus competencias transversales PAES</p>
      </motion.div>

      {/* Resumen General */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl border-green-300/30">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-400">{competenciasDestacadas.length}</div>
            <div className="text-green-200 text-sm">Destacadas</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-xl border-yellow-300/30">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-400">{competenciasEnDesarrollo.length}</div>
            <div className="text-yellow-200 text-sm">En Desarrollo</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border-blue-300/30">
          <CardContent className="p-4 text-center">
            <Brain className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">{competencias.length}</div>
            <div className="text-blue-200 text-sm">Total</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border-purple-300/30">
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-400">
              {Math.round(competencias.reduce((acc, comp) => acc + comp.puntaje, 0) / competencias.length)}
            </div>
            <div className="text-purple-200 text-sm">Promedio</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Competencias Destacadas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl border-green-300/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              Competencias Destacadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {competenciasDestacadas.map((competencia: any, index: number) => (
                <CompetencyCard
                  key={competencia.nombre}
                  competencia={competencia}
                  index={index}
                  type="destacada"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Competencias en Desarrollo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-xl border-yellow-300/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingDown className="w-6 h-6 text-yellow-400" />
              Competencias en Desarrollo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {competenciasEnDesarrollo.map((competencia: any, index: number) => (
                <CompetencyCard
                  key={competencia.nombre}
                  competencia={competencia}
                  index={index}
                  type="desarrollo"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Todas las Competencias */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border-blue-300/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-400" />
              Mapa Completo de Competencias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competencias
                .sort((a, b) => b.puntaje - a.puntaje)
                .map((competencia, index) => (
                  <CompetencyProgressBar
                    key={competencia.nombre}
                    competencia={competencia}
                    index={index}
                  />
                ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const CompetencyCard: React.FC<{
  competencia: any;
  index: number;
  type: 'destacada' | 'desarrollo';
}> = ({ competencia, index, type }) => {
  const colors = {
    destacada: {
      bg: 'from-green-500/10 to-emerald-500/10',
      border: 'border-green-300/30',
      text: 'text-green-400',
      icon: CheckCircle
    },
    desarrollo: {
      bg: 'from-yellow-500/10 to-orange-500/10',
      border: 'border-yellow-300/30',
      text: 'text-yellow-400',
      icon: AlertTriangle
    }
  };

  const config = colors[type];
  const Icon = config.icon;

  return (
    <motion.div
      className={`p-4 rounded-xl bg-gradient-to-br ${config.bg} border ${config.border}`}
      initial={{ opacity: 0, x: type === 'destacada' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${config.text}`} />
          <h3 className="text-white font-semibold">{competencia.nombre}</h3>
        </div>
        <Badge 
          className={`${config.text} bg-transparent border-current`}
          variant="outline"
        >
          {competencia.nivel}
        </Badge>
      </div>
      
      <p className="text-slate-300 text-sm mb-3">{competencia.descripcion}</p>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">Puntaje</span>
          <span className={`font-bold ${config.text}`}>{competencia.puntaje} pts</span>
        </div>
        
        <Progress 
          value={competencia.puntaje} 
          className="h-2"
        />
        
        {competencia.nodosSoporte && (
          <div className="mt-2">
            <div className="text-sm text-slate-400 mb-1">Nodos de soporte:</div>
            <div className="text-xs text-slate-300">{competencia.nodosSoporte.length} nodos</div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const CompetencyProgressBar: React.FC<{
  competencia: any;
  index: number;
}> = ({ competencia, index }) => {
  const getColorByLevel = (nivel: string) => {
    const colors = {
      'sobresaliente': 'text-green-400',
      'alto': 'text-blue-400',
      'medio': 'text-yellow-400',
      'bajo': 'text-red-400'
    };
    return colors[nivel as keyof typeof colors] || 'text-gray-400';
  };

  return (
    <motion.div
      className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: competencia.colorVisualizacion }}
          />
          <h4 className="text-white font-medium">{competencia.nombre}</h4>
          <Badge 
            className={`${getColorByLevel(competencia.nivel)} bg-transparent border-current text-xs`}
            variant="outline"
          >
            {competencia.nivel}
          </Badge>
        </div>
        <div className="text-right">
          <div className={`font-bold ${getColorByLevel(competencia.nivel)}`}>
            {competencia.puntaje}
          </div>
          <div className="text-slate-400 text-xs">pts</div>
        </div>
      </div>
      
      <Progress 
        value={competencia.puntaje} 
        className="h-2 mb-2"
      />
      
      <div className="flex justify-between text-xs text-slate-400">
        <span>{competencia.nodosSoporte?.length || 0} nodos</span>
        <span>{competencia.puntaje}% desarrollo</span>
      </div>
    </motion.div>
  );
};
