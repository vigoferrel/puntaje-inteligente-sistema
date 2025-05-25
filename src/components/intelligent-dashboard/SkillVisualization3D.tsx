
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, RotateCcw, ZoomIn, ZoomOut, Eye,
  Target, TrendingUp, Brain
} from 'lucide-react';
import { SkillNode } from '@/core/unified-education-system/EducationDataHub';

interface SkillVisualization3DProps {
  skillNodes: SkillNode[];
}

export const SkillVisualization3D: React.FC<SkillVisualization3DProps> = ({
  skillNodes
}) => {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [viewMode, setViewMode] = useState<'network' | 'hierarchy' | 'mastery'>('network');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return '#10B981'; // Verde
    if (mastery >= 60) return '#F59E0B'; // Amarillo
    if (mastery >= 40) return '#EF4444'; // Rojo
    return '#6B7280'; // Gris
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      'matematica': '#8B5CF6',
      'lenguaje': '#06B6D4',
      'ciencias': '#10B981',
      'historia': '#F59E0B'
    };
    return colors[subject as keyof typeof colors] || '#6B7280';
  };

  // Simulación de red 3D (en una implementación real usarías Three.js o similar)
  const renderSkillNetwork = () => {
    const nodes = skillNodes.slice(0, 20); // Limitar para rendimiento
    
    return (
      <div className="relative w-full h-96 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-5 gap-4 p-8">
            {nodes.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotateY: Math.sin(Date.now() / 1000 + index) * 10
                }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.2, z: 50 }}
                onClick={() => setSelectedNode(node)}
                className="relative group cursor-pointer"
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-lg transition-all"
                  style={{ 
                    backgroundColor: getMasteryColor(node.masteryLevel),
                    borderColor: getSubjectColor(node.subject),
                    boxShadow: `0 0 20px ${getMasteryColor(node.masteryLevel)}40`
                  }}
                >
                  <span className="text-white text-xs font-bold">
                    {Math.round(node.masteryLevel)}
                  </span>
                </div>
                
                {/* Conexiones simuladas */}
                <div className="absolute inset-0 pointer-events-none">
                  {node.prerequisites.slice(0, 2).map((prereq, preqIndex) => (
                    <div
                      key={prereq}
                      className="absolute w-px h-8 bg-cyan-400/30"
                      style={{
                        transform: `rotate(${45 + preqIndex * 90}deg)`,
                        transformOrigin: 'center bottom'
                      }}
                    />
                  ))}
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {node.name}
                  <br />
                  <span className="text-cyan-400">{node.subject}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Efectos de partículas simulados */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              initial={{ 
                x: Math.random() * 100 + '%', 
                y: Math.random() * 100 + '%',
                opacity: 0 
              }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [1, 1.5, 1]
              }}
              transition={{ 
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-purple-400" />
              Visualización 3D de Habilidades
            </CardTitle>
            <div className="flex items-center gap-2">
              {['network', 'hierarchy', 'mastery'].map(mode => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode(mode as any)}
                  className={viewMode === mode ? 'bg-purple-600' : 'text-white hover:bg-white/10'}
                >
                  {mode === 'network' && <Eye className="w-4 h-4 mr-1" />}
                  {mode === 'hierarchy' && <TrendingUp className="w-4 h-4 mr-1" />}
                  {mode === 'mastery' && <Target className="w-4 h-4 mr-1" />}
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Controles */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600">Dominado (80%+)</Badge>
              <Badge className="bg-yellow-600">En progreso (40-79%)</Badge>
              <Badge className="bg-red-600">Necesita refuerzo (&lt;40%)</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ZoomOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Visualización principal */}
          {renderSkillNetwork()}

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {skillNodes.filter(n => n.masteryLevel >= 80).length}
              </div>
              <div className="text-sm text-gray-400">Dominados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {skillNodes.filter(n => n.masteryLevel >= 40 && n.masteryLevel < 80).length}
              </div>
              <div className="text-sm text-gray-400">En progreso</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {skillNodes.filter(n => n.masteryLevel < 40).length}
              </div>
              <div className="text-sm text-gray-400">Por reforzar</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {skillNodes.length}
              </div>
              <div className="text-sm text-gray-400">Total nodos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Panel de detalle del nodo seleccionado */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Brain className="w-6 h-6 text-cyan-400" />
                {selectedNode.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Dominio actual</span>
                  <span className="text-white font-bold">{Math.round(selectedNode.masteryLevel)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${selectedNode.masteryLevel}%`,
                      backgroundColor: getMasteryColor(selectedNode.masteryLevel)
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold text-cyan-400">
                    {Math.round(selectedNode.diagnosticResults.accuracy)}%
                  </div>
                  <div className="text-xs text-gray-400">Precisión</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-400">
                    {Math.round(selectedNode.diagnosticResults.speed)}%
                  </div>
                  <div className="text-xs text-gray-400">Velocidad</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-400">
                    {Math.round(selectedNode.diagnosticResults.confidence)}%
                  </div>
                  <div className="text-xs text-gray-400">Confianza</div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Prerequisitos</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.prerequisites.length > 0 ? (
                    selectedNode.prerequisites.map(prereq => (
                      <Badge key={prereq} variant="outline" className="text-xs">
                        {prereq}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">Sin prerequisitos</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Recomendaciones IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedNode.aiRecommendations.nextActions.length > 0 ? (
                selectedNode.aiRecommendations.nextActions.map((action, index) => (
                  <div key={index} className="p-3 bg-purple-600/20 rounded-lg">
                    <p className="text-white text-sm">{action}</p>
                  </div>
                ))
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-600/20 rounded-lg">
                    <p className="text-white text-sm">
                      📚 Revisar conceptos fundamentales de {selectedNode.subject}
                    </p>
                  </div>
                  <div className="p-3 bg-green-600/20 rounded-lg">
                    <p className="text-white text-sm">
                      🎯 Practicar ejercicios de nivel {selectedNode.difficulty}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-600/20 rounded-lg">
                    <p className="text-white text-sm">
                      ⏱️ Tiempo recomendado: {selectedNode.aiRecommendations.studyTime} minutos
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
