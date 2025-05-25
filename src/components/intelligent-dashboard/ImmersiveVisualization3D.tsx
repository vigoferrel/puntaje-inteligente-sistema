
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, Rotate3D, Zap, Target, Play, Pause,
  RotateCcw, ZoomIn, ZoomOut, Map
} from 'lucide-react';
import { StudentProfile, SkillNode } from '@/core/unified-education-system/EducationDataHub';

interface ImmersiveVisualization3DProps {
  skillNodes: SkillNode[];
  studentProfile: StudentProfile;
}

export const ImmersiveVisualization3D: React.FC<ImmersiveVisualization3DProps> = ({
  skillNodes,
  studentProfile
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [viewMode, setViewMode] = useState<'network' | 'galaxy' | 'tree'>('network');

  // Simulación del motor 3D
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let animationId: number;
    let rotation = 0;

    // Datos de nodos para visualización
    const nodePositions = skillNodes.map((node, index) => {
      const angle = (index / skillNodes.length) * Math.PI * 2;
      const radius = 120 + (node.masteryLevel / 100) * 60;
      
      return {
        ...node,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: (node.masteryLevel - 50) * 2,
        size: 8 + (node.masteryLevel / 100) * 12,
        angle: angle
      };
    });

    const animate = () => {
      // Limpiar canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Centro del canvas
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      if (isRotating) {
        rotation += 0.01;
      }

      // Dibujar conexiones entre nodos
      ctx.strokeStyle = 'rgba(100, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      
      nodePositions.forEach((node, i) => {
        const x1 = centerX + Math.cos(node.angle + rotation) * (120 + (node.masteryLevel / 100) * 60);
        const y1 = centerY + Math.sin(node.angle + rotation) * (120 + (node.masteryLevel / 100) * 60);

        // Conexiones a nodos prerequisito
        node.prerequisites.forEach(prereqId => {
          const prereqIndex = nodePositions.findIndex(n => n.id === prereqId);
          if (prereqIndex !== -1) {
            const prereq = nodePositions[prereqIndex];
            const x2 = centerX + Math.cos(prereq.angle + rotation) * (120 + (prereq.masteryLevel / 100) * 60);
            const y2 = centerY + Math.sin(prereq.angle + rotation) * (120 + (prereq.masteryLevel / 100) * 60);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        });
      });

      // Dibujar nodos
      nodePositions.forEach((node, i) => {
        const x = centerX + Math.cos(node.angle + rotation) * (120 + (node.masteryLevel / 100) * 60);
        const y = centerY + Math.sin(node.angle + rotation) * (120 + (node.masteryLevel / 100) * 60);

        // Color basado en dominio
        const hue = node.masteryLevel * 1.2; // 0 (rojo) a 120 (verde)
        const saturation = 80;
        const lightness = 50 + (node.masteryLevel / 100) * 30;

        // Efecto de brillo
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, node.size);
        gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness + 20}%, 0.9)`);
        gradient.addColorStop(0.7, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.7)`);
        gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness - 10}%, 0.3)`);

        // Dibujar nodo
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, node.size, 0, Math.PI * 2);
        ctx.fill();

        // Pulso para nodos seleccionados
        if (selectedNode?.id === node.id) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, node.size + 5 + Math.sin(Date.now() * 0.01) * 3, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Etiqueta del nodo
        if (node.size > 12) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(node.code, x, y + node.size + 15);
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Event listeners para interactividad
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Encontrar nodo clickeado
      const clickedNode = nodePositions.find(node => {
        const x = centerX + Math.cos(node.angle + rotation) * (120 + (node.masteryLevel / 100) * 60);
        const y = centerY + Math.sin(node.angle + rotation) * (120 + (node.masteryLevel / 100) * 60);
        const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
        return distance <= node.size;
      });

      if (clickedNode) {
        setSelectedNode(clickedNode);
      }
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('click', handleClick);
    };
  }, [skillNodes, isRotating, selectedNode]);

  return (
    <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-green-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3">
          <Eye className="w-6 h-6 text-green-400" />
          Mapa de Conocimiento 3D
          <Badge className="bg-gradient-to-r from-green-600 to-emerald-600">
            Inmersivo
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controles 3D */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsRotating(!isRotating)}
              className="border-green-500/50 text-white hover:bg-green-500/20"
            >
              {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedNode(null)}
              className="border-green-500/50 text-white hover:bg-green-500/20"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {(['network', 'galaxy', 'tree'] as const).map((mode) => (
              <Button
                key={mode}
                size="sm"
                variant={viewMode === mode ? "default" : "outline"}
                onClick={() => setViewMode(mode)}
                className={viewMode === mode ? 
                  "bg-gradient-to-r from-green-600 to-emerald-600" : 
                  "border-green-500/50 text-white hover:bg-green-500/20"
                }
              >
                {mode === 'network' && <Rotate3D className="w-4 h-4" />}
                {mode === 'galaxy' && <Zap className="w-4 h-4" />}
                {mode === 'tree' && <Map className="w-4 h-4" />}
              </Button>
            ))}
          </div>
        </div>

        {/* Canvas 3D */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-80 bg-gradient-to-br from-gray-900/50 to-green-900/20 rounded-lg border border-green-500/30 cursor-pointer"
          />
          
          {/* Overlay de información */}
          <div className="absolute top-4 left-4 space-y-2">
            <div className="flex items-center gap-2 text-xs text-green-300">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span>Alto Dominio (80%+)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-yellow-300">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span>Progreso Medio (50-80%)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-red-300">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span>Requiere Atención (&lt;50%)</span>
            </div>
          </div>

          {/* Instrucciones de interacción */}
          <div className="absolute bottom-4 right-4 text-xs text-green-300 text-right">
            <p>Click en nodos para detalles</p>
            <p>Rotación automática: {isRotating ? 'ON' : 'OFF'}</p>
          </div>
        </div>

        {/* Panel de información del nodo seleccionado */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-600/20 rounded-lg border border-green-500/30"
          >
            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-green-400" />
              {selectedNode.name}
            </h4>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Código:</span>
                <span className="text-green-400 ml-2">{selectedNode.code}</span>
              </div>
              <div>
                <span className="text-gray-400">Materia:</span>
                <span className="text-green-400 ml-2 capitalize">{selectedNode.subject}</span>
              </div>
              <div>
                <span className="text-gray-400">Dominio:</span>
                <span className="text-green-400 ml-2">{Math.round(selectedNode.masteryLevel)}%</span>
              </div>
              <div>
                <span className="text-gray-400">Dificultad:</span>
                <span className="text-green-400 ml-2 capitalize">{selectedNode.difficulty}</span>
              </div>
            </div>

            {selectedNode.prerequisites.length > 0 && (
              <div className="mt-3">
                <p className="text-gray-400 text-xs mb-1">Prerequisitos:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.prerequisites.map((prereq, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {prereq}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Estadísticas de red */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-2 bg-green-600/20 rounded">
            <div className="text-lg font-bold text-green-400">{skillNodes.length}</div>
            <div className="text-xs text-gray-400">Nodos Totales</div>
          </div>
          <div className="p-2 bg-green-600/20 rounded">
            <div className="text-lg font-bold text-green-400">
              {skillNodes.reduce((sum, node) => sum + node.prerequisites.length, 0)}
            </div>
            <div className="text-xs text-gray-400">Conexiones</div>
          </div>
          <div className="p-2 bg-green-600/20 rounded">
            <div className="text-lg font-bold text-green-400">
              {Math.round(skillNodes.reduce((sum, node) => sum + node.masteryLevel, 0) / skillNodes.length)}%
            </div>
            <div className="text-xs text-gray-400">Progreso Global</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
