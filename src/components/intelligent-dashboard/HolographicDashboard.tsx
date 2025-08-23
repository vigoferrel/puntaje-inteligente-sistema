
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, Zap, TrendingUp, Target, Brain,
  Activity, BarChart3, Eye
} from 'lucide-react';

interface HolographicDashboardProps {
  metrics: any;
  patterns: any;
}

export const HolographicDashboard: React.FC<HolographicDashboardProps> = ({
  metrics,
  patterns
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.02;
      
      // Limpiar con efecto de desvanecimiento
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Dibujar ondas holográficas
      for (let i = 0; i < 5; i++) {
        const radius = 30 + i * 25 + Math.sin(time + i) * 10;
        const alpha = 0.3 - i * 0.05;
        
        ctx.strokeStyle = `rgba(100, 255, 255, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Partículas flotantes (métricas)
      const particleCount = 8;
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + time * 0.5;
        const distance = 80 + Math.sin(time * 2 + i) * 20;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        // Efecto de brillo
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
        gradient.addColorStop(0, 'rgba(255, 100, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 100, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 6 + Math.sin(time * 3 + i) * 2, 0, Math.PI * 2);
        ctx.fill();

        // Líneas de conexión
        ctx.strokeStyle = 'rgba(100, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      // Texto holográfico central
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round(metrics.averagePerformance)}%`, centerX, centerY);
      
      ctx.fillStyle = 'rgba(100, 255, 255, 0.7)';
      ctx.font = '12px Arial';
      ctx.fillText('Rendimiento Global', centerX, centerY + 20);

      // Efectos de escaneo
      const scanLine = (time * 100) % canvas.height;
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, scanLine);
      ctx.lineTo(canvas.width, scanLine);
      ctx.stroke();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [metrics]);

  const holographicMetrics = [
    {
      label: 'Eficiencia Neural',
      value: Math.round(metrics.learningVelocity * 100),
      unit: '%',
      trend: 'up',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      label: 'Precisión IA',
      value: Math.round(metrics.predictionAccuracy),
      unit: '%',
      trend: 'up',
      color: 'from-purple-400 to-pink-500'
    },
    {
      label: 'Tiempo Optimizado',
      value: Math.round(metrics.totalStudyTime / 60),
      unit: 'hrs',
      trend: 'stable',
      color: 'from-green-400 to-emerald-500'
    },
    {
      label: 'Nodos Activos',
      value: metrics.nodesCompleted,
      unit: '',
      trend: 'up',
      color: 'from-orange-400 to-red-500'
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-black/60 to-slate-900/60 backdrop-blur-xl border-cyan-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3">
          <Eye className="w-6 h-6 text-cyan-400" />
          Dashboard Holográfico
          <Badge className="bg-gradient-to-r from-cyan-600 to-purple-600">
            Neural
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Canvas holográfico principal */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-48 bg-gradient-to-br from-gray-900/30 to-cyan-900/10 rounded-lg border border-cyan-500/30"
          />
          
          {/* Overlay de información */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-2 left-2 text-xs text-cyan-300">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span>SISTEMA ACTIVO</span>
              </div>
            </div>
            
            <div className="absolute top-2 right-2 text-xs text-cyan-300">
              <div className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                <span>TIEMPO REAL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas holográficas */}
        <div className="grid grid-cols-2 gap-3">
          {holographicMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden"
            >
              <div className="p-3 bg-gradient-to-br from-white/5 to-white/10 rounded-lg border border-white/20 backdrop-blur-sm">
                {/* Efecto de brillo holográfico */}
                <div className={`absolute inset-0 bg-gradient-to-r ${metric.color} opacity-20 animate-pulse`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-300">{metric.label}</span>
                    <div className="flex items-center gap-1">
                      {metric.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-400" />}
                      {metric.trend === 'stable' && <Target className="w-3 h-3 text-blue-400" />}
                    </div>
                  </div>
                  
                  <div className={`text-xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                    {metric.value}{metric.unit}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Análisis predictivo holográfico */}
        <div className="p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg border border-purple-500/30">
          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            Proyección Neural
          </h4>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Progreso Proyectado:</span>
                <span className="text-purple-400">+{Math.round(metrics.learningVelocity * 25)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tiempo Optimizado:</span>
                <span className="text-green-400">-{Math.round(15 + metrics.predictionAccuracy / 10)}%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Precisión Futura:</span>
                <span className="text-cyan-400">{Math.round(metrics.predictionAccuracy + 5)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Nivel Estimado:</span>
                <span className="text-yellow-400">Avanzado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Estado del sistema holográfico */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-lg border border-green-500/30">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sparkles className="w-5 h-5 text-green-400" />
              <div className="absolute inset-0 w-5 h-5 bg-green-400 rounded-full animate-ping opacity-30"></div>
            </div>
            <div>
              <div className="text-sm font-medium text-green-400">Sistema Neural Óptimo</div>
              <div className="text-xs text-green-300">Todas las redes funcionando</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">100% Operativo</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
