
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardMetrics {
  completedNodes: number;
  weeklyProgress: number;
  totalStudyTime: number;
  currentStreak: number;
  nextDeadline?: Date;
}

interface SystemStatus {
  [key: string]: {
    status: 'ready' | 'loading' | 'error' | 'active' | 'initializing';
    data: string;
  };
}

interface DiagnosticData {
  learningNodes: Array<{ id: string; title: string; estimatedTimeMinutes: number }>;
  tier1Nodes: Array<{ id: string; title: string; estimatedTimeMinutes: number }>;
}

interface PlanData {
  plans: Array<{ id: string; title: string }>;
  currentPlan?: {
    title: string;
    description: string;
    progress?: { percentage: number };
  };
}

interface CalendarData {
  events: Array<{
    id: string;
    title: string;
    start_date: string;
    event_type: string;
  }>;
}

interface LectoGuiaData {
  enabled: boolean;
  sessionCount: number;
}

interface SmartRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  action: () => void;
}

export const useDashboardData = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const metrics: DashboardMetrics = {
    completedNodes: 8,
    weeklyProgress: 72,
    totalStudyTime: 145,
    currentStreak: 5,
    nextDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  };

  const systemStatus: SystemStatus = {
    lectoguia: { status: 'ready', data: 'v2.1' },
    diagnostico: { status: 'active', data: '3 tests' },
    calendario: { status: 'ready', data: '2 events' },
    ejercicios: { status: 'ready', data: 'Gen AI' },
    finanzas: { status: 'initializing', data: 'Loading...' }
  };

  const diagnosticData: DiagnosticData = {
    learningNodes: [
      { id: '1', title: 'Comprensión Lectora Básica', estimatedTimeMinutes: 25 },
      { id: '2', title: 'Álgebra Fundamental', estimatedTimeMinutes: 30 },
      { id: '3', title: 'Historia de Chile Siglo XX', estimatedTimeMinutes: 35 },
      { id: '4', title: 'Química Orgánica', estimatedTimeMinutes: 40 },
      { id: '5', title: 'Geometría Analítica', estimatedTimeMinutes: 45 }
    ],
    tier1Nodes: [
      { id: 't1', title: 'Análisis de Textos Narrativos', estimatedTimeMinutes: 20 },
      { id: 't2', title: 'Ecuaciones Cuadráticas', estimatedTimeMinutes: 25 },
      { id: 't3', title: 'Proceso de Independencia', estimatedTimeMinutes: 30 },
      { id: 't4', title: 'Reacciones Químicas', estimatedTimeMinutes: 35 },
      { id: 't5', title: 'Funciones Trigonométricas', estimatedTimeMinutes: 40 }
    ]
  };

  const planData: PlanData = {
    plans: [
      { id: 'plan1', title: 'Preparación PAES 2024' },
      { id: 'plan2', title: 'Refuerzo Matemáticas' }
    ],
    currentPlan: {
      title: 'Preparación PAES 2024',
      description: 'Plan integral para maximizar puntaje PAES',
      progress: { percentage: 68 }
    }
  };

  const calendarData: CalendarData = {
    events: [
      {
        id: 'e1',
        title: 'Evaluación Matemáticas',
        start_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        event_type: 'evaluacion'
      },
      {
        id: 'e2',
        title: 'Sesión LectoGuía',
        start_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        event_type: 'estudio'
      }
    ]
  };

  const lectoGuiaData: LectoGuiaData = {
    enabled: true,
    sessionCount: 12
  };

  const getSmartRecommendations: SmartRecommendation[] = [
    {
      id: 'r1',
      title: 'Completar Nodo Pendiente',
      description: 'Tienes un nodo de comprensión lectora sin terminar',
      priority: 'urgent',
      action: () => navigate('/lectoguia')
    },
    {
      id: 'r2',
      title: 'Evaluación Diagnóstica',
      description: 'Realiza una evaluación para actualizar tu progreso',
      priority: 'high',
      action: () => navigate('/diagnostico')
    },
    {
      id: 'r3',
      title: 'Revisar Calendario',
      description: 'Tienes eventos próximos programados',
      priority: 'medium',
      action: () => navigate('/calendario')
    },
    {
      id: 'r4',
      title: 'Generar Ejercicios',
      description: 'Practica con ejercicios personalizados',
      priority: 'medium',
      action: () => navigate('/ejercicios')
    },
    {
      id: 'r5',
      title: 'Planificación Financiera',
      description: 'Revisa opciones de financiamiento universitario',
      priority: 'low',
      action: () => navigate('/finanzas')
    },
    {
      id: 'r6',
      title: 'Actualizar Plan de Estudio',
      description: 'Ajusta tu plan según tu progreso actual',
      priority: 'medium',
      action: () => navigate('/plan')
    }
  ];

  const navigateToSection = (section: string) => {
    const routes = {
      lectoguia: '/lectoguia',
      diagnostico: '/diagnostico',
      ejercicios: '/ejercicios',
      calendario: '/calendario',
      finanzas: '/finanzas',
      plan: '/plan'
    };
    
    const route = routes[section as keyof typeof routes];
    if (route) {
      navigate(route);
    }
  };

  const isSystemReady = Object.values(systemStatus).every(
    status => status.status === 'ready' || status.status === 'active'
  );

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return {
    metrics,
    systemStatus,
    isLoading,
    isSystemReady,
    diagnosticData,
    planData,
    calendarData,
    lectoGuiaData,
    navigateToSection,
    getSmartRecommendations
  };
};
