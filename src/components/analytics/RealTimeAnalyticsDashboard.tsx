import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AnalyticsData {
  activeUsers: number;
  totalSessions: number;
  averageSessionTime: number;
  completionRate: number;
  subjectPerformance: Array<{
    subject: string;
    score: number;
    students: number;
  }>;
  dailyProgress: Array<{
    date: string;
    users: number;
    sessions: number;
  }>;
  topSubjects: Array<{
    subject: string;
    percentage: number;
    color: string;
  }>;
}

const RealTimeAnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    activeUsers: 0,
    totalSessions: 0,
    averageSessionTime: 0,
    completionRate: 0,
    subjectPerformance: [],
    dailyProgress: [],
    topSubjects: []
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular datos de analytics en tiempo real
    const loadAnalyticsData = async () => {
      try {
        // Simulación de datos reales
        const mockData: AnalyticsData = {
          activeUsers: 1247,
          totalSessions: 8923,
          averageSessionTime: 45,
          completionRate: 78,
          subjectPerformance: [
            { subject: 'Matemáticas', score: 85, students: 450 },
            { subject: 'Ciencias', score: 78, students: 380 },
            { subject: 'Historia', score: 82, students: 320 },
            { subject: 'Lenguaje', score: 88, students: 420 }
          ],
          dailyProgress: [
            { date: 'Lun', users: 1200, sessions: 8500 },
            { date: 'Mar', users: 1350, sessions: 9200 },
            { date: 'Mié', users: 1100, sessions: 7800 },
            { date: 'Jue', users: 1400, sessions: 9500 },
            { date: 'Vie', users: 1250, sessions: 8800 },
            { date: 'Sáb', users: 900, sessions: 6500 },
            { date: 'Dom', users: 800, sessions: 5800 }
          ],
          topSubjects: [
            { subject: 'Matemáticas', percentage: 35, color: '#3B82F6' },
            { subject: 'Ciencias', percentage: 28, color: '#10B981' },
            { subject: 'Lenguaje', percentage: 22, color: '#F59E0B' },
            { subject: 'Historia', percentage: 15, color: '#EF4444' }
          ]
        };

        setAnalyticsData(mockData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading analytics data:', error);
        setIsLoading(false);
      }
    };

    loadAnalyticsData();

    // Actualizar datos cada 30 segundos
    const interval = setInterval(() => {
      setAnalyticsData(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        totalSessions: prev.totalSessions + Math.floor(Math.random() * 50)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

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
        <h2 className="text-2xl font-bold text-gray-900">Analytics en Tiempo Real</h2>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          En Vivo
        </Badge>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              +12%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              En los últimos 30 minutos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesiones Totales</CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              +8%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalSessions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Hoy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.averageSessionTime} min</div>
            <p className="text-xs text-muted-foreground">
              Por sesión
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Completación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.completionRate}%</div>
            <Progress value={analyticsData.completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rendimiento por Materia */}
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Materia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.subjectPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Progreso Diario */}
        <Card>
          <CardHeader>
            <CardTitle>Progreso Diario</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.dailyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="sessions" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución de Materias */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Materias</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.topSubjects}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ subject, percentage }) => `${subject} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {analyticsData.topSubjects.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Actividad Reciente */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Nuevo usuario registrado</p>
                  <p className="text-sm text-muted-foreground">Hace 2 minutos</p>
                </div>
                <Badge variant="outline">Registro</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Diagnóstico completado</p>
                  <p className="text-sm text-muted-foreground">Hace 5 minutos</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Matemáticas
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Ejercicio resuelto</p>
                  <p className="text-sm text-muted-foreground">Hace 8 minutos</p>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Ciencias
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeAnalyticsDashboard;
