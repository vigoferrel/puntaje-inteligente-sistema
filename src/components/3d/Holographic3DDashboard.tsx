import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Box, 
  Eye, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Move,
  Layers,
  Globe
} from 'lucide-react';

interface HolographicData {
  totalNodes: number;
  exploredNodes: number;
  currentLevel: number;
  maxLevel: number;
  subjects: Array<{
    name: string;
    progress: number;
    nodes: number;
    color: string;
  }>;
  recentActivity: Array<{
    action: string;
    subject: string;
    timestamp: string;
    type: 'exploration' | 'completion' | 'discovery';
  }>;
  spatialMetrics: {
    distanceTraveled: number;
    nodesDiscovered: number;
    connectionsMade: number;
    timeInSpace: number;
  };
}

const Holographic3DDashboard: React.FC = () => {
  const [holographicData, setHolographicData] = useState<HolographicData>({
    totalNodes: 0,
    exploredNodes: 0,
    currentLevel: 1,
    maxLevel: 5,
    subjects: [],
    recentActivity: [],
    spatialMetrics: {
      distanceTraveled: 0,
      nodesDiscovered: 0,
      connectionsMade: 0,
      timeInSpace: 0
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'orbit' | 'fly' | 'explore'>('orbit');
  const [zoomLevel, setZoomLevel] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Simular datos holográficos
    const loadHolographicData = async () => {
      try {
        const mockData: HolographicData = {
          totalNodes: 847,
          exploredNodes: 234,
          currentLevel: 3,
          maxLevel: 5,
          subjects: [
            { name: 'Matemáticas', progress: 78, nodes: 245, color: '#3B82F6' },
            { name: 'Ciencias', progress: 65, nodes: 198, color: '#10B981' },
            { name: 'Historia', progress: 82, nodes: 156, color: '#F59E0B' },
            { name: 'Lenguaje', progress: 71, nodes: 248, color: '#EF4444' }
          ],
          recentActivity: [
            { action: 'Nodo descubierto', subject: 'Matemáticas', timestamp: 'Hace 2 min', type: 'discovery' },
            { action: 'Conexión establecida', subject: 'Ciencias', timestamp: 'Hace 5 min', type: 'exploration' },
            { action: 'Nivel completado', subject: 'Historia', timestamp: 'Hace 8 min', type: 'completion' },
            { action: 'Nueva ruta explorada', subject: 'Lenguaje', timestamp: 'Hace 12 min', type: 'exploration' }
          ],
          spatialMetrics: {
            distanceTraveled: 1247,
            nodesDiscovered: 234,
            connectionsMade: 156,
            timeInSpace: 2840
          }
        };

        setHolographicData(mockData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading holographic data:', error);
        setIsLoading(false);
      }
    };

    loadHolographicData();
  }, []);

  useEffect(() => {
    // Simulación básica de canvas 3D
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas
    canvas.width = 400;
    canvas.height = 300;

    // Función de animación
    const animate = () => {
      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar fondo holográfico
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar nodos holográficos
      const time = Date.now() * 0.001;
      for (let i = 0; i < 20; i++) {
        const x = canvas.width / 2 + Math.cos(time + i * 0.5) * 100;
        const y = canvas.height / 2 + Math.sin(time + i * 0.3) * 80;
        const size = 3 + Math.sin(time + i) * 2;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${0.3 + Math.sin(time + i) * 0.2})`;
        ctx.fill();

        // Conectar nodos
        if (i > 0) {
          const prevX = canvas.width / 2 + Math.cos(time + (i - 1) * 0.5) * 100;
          const prevY = canvas.height / 2 + Math.sin(time + (i - 1) * 0.3) * 80;
          
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 + Math.sin(time + i) * 0.1})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Holográfico 3D</h2>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Modo {viewMode}
        </Badge>
      </div>

      {/* Métricas Espaciales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nodos Explorados</CardTitle>
                         <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{holographicData.exploredNodes}</div>
            <p className="text-xs text-muted-foreground">
              de {holographicData.totalNodes} totales
            </p>
            <Progress 
              value={(holographicData.exploredNodes / holographicData.totalNodes) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nivel Actual</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{holographicData.currentLevel}</div>
            <p className="text-xs text-muted-foreground">
              de {holographicData.maxLevel} niveles
            </p>
            <Progress 
              value={(holographicData.currentLevel / holographicData.maxLevel) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distancia Recorrida</CardTitle>
            <Move className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{holographicData.spatialMetrics.distanceTraveled}</div>
            <p className="text-xs text-muted-foreground">
              unidades espaciales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo en Espacio</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(holographicData.spatialMetrics.timeInSpace)}</div>
            <p className="text-xs text-muted-foreground">
              tiempo total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visualización 3D */}
      <Card>
        <CardHeader>
          <CardTitle>Universo Educativo 3D</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'orbit' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('orbit')}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Órbita
            </Button>
            <Button
              variant={viewMode === 'fly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('fly')}
            >
              <Eye className="h-4 w-4 mr-1" />
              Vuelo
            </Button>
            <Button
              variant={viewMode === 'explore' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('explore')}
            >
              <Move className="h-4 w-4 mr-1" />
              Explorar
            </Button>
            <div className="flex items-center space-x-1 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-12 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="w-full h-80 border border-gray-200 rounded-lg bg-gradient-to-br from-blue-50 to-green-50"
            />
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
              Modo: {viewMode} | Zoom: {Math.round(zoomLevel * 100)}%
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progreso por Materia */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso por Materia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {holographicData.subjects.map((subject) => (
              <div key={subject.name} className="flex items-center space-x-4">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: subject.color }}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{subject.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {subject.nodes} nodos
                    </span>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                  <span className="text-xs text-muted-foreground">
                    {subject.progress}% completado
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actividad Reciente */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente en el Espacio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {holographicData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'discovery' ? 'bg-blue-500' :
                  activity.type === 'completion' ? 'bg-green-500' :
                  'bg-yellow-500'
                }`} />
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.subject} • {activity.timestamp}
                  </p>
                </div>
                <Badge variant="outline" className={
                  activity.type === 'discovery' ? 'bg-blue-50 text-blue-700' :
                  activity.type === 'completion' ? 'bg-green-50 text-green-700' :
                  'bg-yellow-50 text-yellow-700'
                }>
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Holographic3DDashboard;
