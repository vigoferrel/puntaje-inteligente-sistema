import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Cpu, HardDrive, Zap, AlertTriangle, CheckCircle, TrendingUp, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PerformanceMetric {
  timestamp: number;
  cpu: number;
  memory: number;
  responseTime: number;
  renderCount: number;
  errorRate: number;
}

interface ComponentHealth {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  renderTime: number;
  memoryUsage: number;
  errorCount: number;
  lastUpdate: number;
}

export const RealTimePerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [componentHealth, setComponentHealth] = useState<ComponentHealth[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1m' | '5m' | '15m'>('5m');
  const intervalRef = useRef<NodeJS.Timeout>();

  // Simulación de métricas en tiempo real
  useEffect(() => {
    const collectMetrics = () => {
      const memory = (performance as any).memory;
      const now = Date.now();
      
      const newMetric: PerformanceMetric = {
        timestamp: now,
        cpu: Math.random() * 30 + 20, // Simulado
        memory: memory ? (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100 : Math.random() * 40 + 10,
        responseTime: Math.random() * 100 + 50,
        renderCount: Math.floor(Math.random() * 5) + 1,
        errorRate: Math.random() * 2
      };

      setMetrics(prev => {
        const maxDataPoints = selectedTimeRange === '1m' ? 60 : selectedTimeRange === '5m' ? 300 : 900;
        const updated = [...prev, newMetric].slice(-maxDataPoints);
        return updated;
      });

      // Actualizar salud de componentes
      const components = ['Dashboard', 'LectoGuía', 'Calendar', 'Financial', 'Neural'];
      setComponentHealth(components.map(name => ({
        name,
        status: Math.random() > 0.8 ? 'warning' : Math.random() > 0.95 ? 'critical' : 'healthy',
        renderTime: Math.random() * 50 + 5,
        memoryUsage: Math.random() * 20 + 5,
        errorCount: Math.floor(Math.random() * 3),
        lastUpdate: now
      })));
    };

    collectMetrics();
    intervalRef.current = setInterval(collectMetrics, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selectedTimeRange]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      case 'critical': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const currentMetrics = metrics[metrics.length - 1];

  if (!isExpanded) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-4 left-4 z-50"
      >
        <Card className="bg-black/90 backdrop-blur-xl border-cyan-500/30 w-80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-white">Performance Live</h3>
              </div>
              <Button
                onClick={() => setIsExpanded(true)}
                variant="ghost"
                size="sm"
                className="text-cyan-400 hover:text-white"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>

            {currentMetrics && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-800/50 p-2 rounded">
                  <div className="text-gray-400 flex items-center gap-1">
                    <HardDrive className="w-3 h-3" />
                    Memory
                  </div>
                  <div className="text-white font-mono">
                    {currentMetrics.memory.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-gray-800/50 p-2 rounded">
                  <div className="text-gray-400 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Response
                  </div>
                  <div className="text-white font-mono">
                    {currentMetrics.responseTime.toFixed(0)}ms
                  </div>
                </div>
                <div className="bg-gray-800/50 p-2 rounded">
                  <div className="text-gray-400 flex items-center gap-1">
                    <Cpu className="w-3 h-3" />
                    CPU
                  </div>
                  <div className="text-white font-mono">
                    {currentMetrics.cpu.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-gray-800/50 p-2 rounded">
                  <div className="text-gray-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Renders
                  </div>
                  <div className="text-white font-mono">
                    {currentMetrics.renderCount}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-3 flex flex-wrap gap-1">
              {componentHealth.slice(0, 3).map(component => (
                <Badge
                  key={component.name}
                  variant="outline"
                  className={`text-xs ${getStatusColor(component.status)} border-current`}
                >
                  {getStatusIcon(component.status)}
                  <span className="ml-1">{component.name}</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed inset-4 z-50 bg-black/95 backdrop-blur-xl rounded-lg border border-cyan-500/30 overflow-hidden"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Real-Time Performance Dashboard</h2>
              <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                Live
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {(['1m', '5m', '15m'] as const).map(range => (
                  <Button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    variant={selectedTimeRange === range ? "default" : "ghost"}
                    size="sm"
                    className="text-xs"
                  >
                    {range}
                  </Button>
                ))}
              </div>
              <Button
                onClick={() => setIsExpanded(false)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-12 gap-4 h-full">
            {/* Metrics Charts */}
            <div className="col-span-8 space-y-4">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    System Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                        stroke="#9CA3AF"
                      />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '6px'
                        }}
                      />
                      <Area type="monotone" dataKey="memory" stackId="1" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="cpu" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Response Time & Renders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                        stroke="#9CA3AF"
                      />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '6px'
                        }}
                      />
                      <Line type="monotone" dataKey="responseTime" stroke="#F59E0B" strokeWidth={2} />
                      <Line type="monotone" dataKey="renderCount" stroke="#EF4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Component Health */}
            <div className="col-span-4 space-y-4">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Component Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {componentHealth.map(component => (
                    <div key={component.name} className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{component.name}</span>
                        <Badge className={getStatusColor(component.status)} variant="outline">
                          {getStatusIcon(component.status)}
                          <span className="ml-1 capitalize">{component.status}</span>
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-gray-400">
                          <span>Render Time:</span>
                          <span className="text-white">{component.renderTime.toFixed(1)}ms</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>Memory:</span>
                          <span className="text-white">{component.memoryUsage.toFixed(1)}MB</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>Errors:</span>
                          <span className="text-white">{component.errorCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Current Status */}
              {currentMetrics && (
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-cyan-400" />
                      Current Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Memory Usage</span>
                        <span className="text-white text-sm">{currentMetrics.memory.toFixed(1)}%</span>
                      </div>
                      <Progress value={currentMetrics.memory} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">CPU Usage</span>
                        <span className="text-white text-sm">{currentMetrics.cpu.toFixed(1)}%</span>
                      </div>
                      <Progress value={currentMetrics.cpu} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Error Rate</span>
                        <span className="text-white text-sm">{currentMetrics.errorRate.toFixed(2)}%</span>
                      </div>
                      <Progress value={currentMetrics.errorRate * 10} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
