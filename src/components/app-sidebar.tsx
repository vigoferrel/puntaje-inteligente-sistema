import React from "react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Home, 
  Target, 
  BookOpen, 
  Stethoscope,
  Brain,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Zap,
  TrendingUp,
  GraduationCap,
  Calendar,
  Settings,
  History,
  FlaskConical,
  ClipboardList,
  BarChart2,
  Dumbbell,
  Compass
} from "lucide-react";
import { useCinematicDashboard } from "@/hooks/dashboard/useCinematicDashboard";
import { useGlobalStore } from "@/store/globalStore";
import { motion } from "framer-motion";

const workflowItems = [
  {
    title: "Centro de Comando",
    url: "/",
    icon: Home,
    phase: "dashboard"
  },
  {
    title: "Diagnóstico IA",
    url: "/diagnostico",
    icon: Stethoscope,
    phase: "diagnostic"
  },
  {
    title: "SuperPAES Vocacional",
    url: "/superpaes",
    icon: Compass,
    phase: "coordination",
    badge: "Coordinador"
  },
  {
    title: "Plan Inteligente",
    url: "/plan",
    icon: Target,
    phase: "planning"
  },
  {
    title: "LectoGuía IA",
    url: "/lectoguia",
    icon: Brain,
    phase: "study"
  },
  {
    title: "Evaluación PAES",
    url: "/paes-dashboard",
    icon: TrendingUp,
    phase: "evaluation"
  }
];

const toolsItems = [
  {
    title: "Centro Financiero",
    url: "/centro-financiero",
    icon: DollarSign,
    badge: "2025"
  },
  {
    title: "Ejercicios IA",
    url: "/ejercicios",
    icon: Zap
  },
  {
    title: "Calendario",
    url: "/calendario",
    icon: Calendar,
    badge: "Nuevo"
  },
  {
    title: "Configuración",
    url: "/settings",
    icon: Settings
  }
];

const assessmentItems = [
  {
    title: "Evaluaciones",
    url: "/evaluaciones",
    icon: ClipboardList
  },
  {
    title: "Entrenamiento",
    url: "/entrenamiento",
    icon: Dumbbell
  },
  {
    title: "Análisis",
    url: "/analisis",
    icon: BarChart2
  }
];

export function AppSidebar() {
  const dashboardData = useCinematicDashboard();
  const currentPlan = useGlobalStore(state => state.currentPlan);
  const [showPAESSubjects, setShowPAESSubjects] = React.useState(false);

  const getPhaseStatus = (phase: string) => {
    const stats = dashboardData.stats;
    switch (phase) {
      case 'diagnostic':
        return stats.diagnostics > 0 ? 'completed' : 'available';
      case 'coordination':
        return 'available'; // SuperPAES siempre disponible como coordinador
      case 'planning':
        return stats.currentPlan > 0 ? 'completed' : 'available';
      case 'study':
        return stats.nodes > 0 ? 'in_progress' : 'available';
      case 'evaluation':
        return 'available'; // Siempre disponible
      default:
        return 'available';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />;
      case 'in_progress':
        return <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />;
      case 'available':
        return <div className="w-2 h-2 bg-yellow-400 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    }
  };

  const paesSubjects = [
    { name: "Comp. Lectora", nodes: 30, url: "/materia/competencia-lectora", icon: BookOpen },
    { name: "Matemática M1", nodes: 25, url: "/materia/matematica-m1", icon: Target },
    { name: "Matemática M2", nodes: 22, url: "/materia/matematica-m2", icon: Target },
    { name: "Ciencias", nodes: 135, url: "/materia/ciencias", icon: FlaskConical },
    { name: "Historia", nodes: 65, url: "/materia/historia", icon: History }
  ];

  return (
    <Sidebar className="font-luxury border-r border-premium-violet-500/20 premium-glass">
      <SidebarHeader className="p-6 border-b border-premium-violet-500/20 premium-header">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-premium-violet-500 to-emerald-premium-500 shadow-glow-violet">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-lg font-semibold premium-text-glow">PAES Command</span>
            <div className="text-xs text-emerald-premium-400 font-light">Sistema IA</div>
          </div>
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-2 scrollbar-premium">
        {/* Workflow Principal */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-premium-violet-400 px-2 py-3 flex items-center space-x-2 tracking-wide premium-gradient-text">
            <Sparkles className="w-3 h-3" />
            <span>Workflow de Aprendizaje</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {workflowItems.map((item, index) => {
                const status = getPhaseStatus(item.phase);
                const isCoordinator = item.phase === 'coordination';
                
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to={item.url}
                          className={({ isActive }) =>
                            `premium-nav-item ${isActive ? 'active' : ''}`
                          }
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1 text-contrast-high">{item.title}</span>
                          {item.badge && (
                            <Badge className="premium-badge text-xs px-1.5 py-0 h-4">
                              {item.badge}
                            </Badge>
                          )}
                          {getStatusBadge(status)}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Evaluación y Análisis */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-orange-400 px-2 py-3 flex items-center space-x-2 tracking-wide">
            <BarChart2 className="w-3 h-3" />
            <span>Evaluación y Análisis</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {assessmentItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (workflowItems.length + index) * 0.1 }}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                            isActive 
                              ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-500/30 shadow-lg shadow-orange-500/20" 
                              : "text-gray-300 hover:text-white hover:bg-white/5"
                          }`
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </motion.div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Herramientas */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-purple-400 px-2 py-3 flex items-center space-x-2 tracking-wide">
            <Zap className="w-3 h-3" />
            <span>Herramientas</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {toolsItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (workflowItems.length + assessmentItems.length + index) * 0.1 }}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                            isActive 
                              ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-500/20" 
                              : "text-gray-300 hover:text-white hover:bg-white/5"
                          }`
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <Badge variant="destructive" className="text-xs px-1.5 py-0 h-4 font-medium">
                            {item.badge}
                          </Badge>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </motion.div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Materias PAES */}
        <SidebarGroup>
          <Collapsible open={showPAESSubjects} onOpenChange={setShowPAESSubjects}>
            <SidebarGroupLabel className="text-xs font-medium text-emerald-premium-400 px-2 py-3">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto text-emerald-premium-400 hover:text-emerald-premium-300 font-medium tracking-wide">
                  <div className="flex items-center space-x-2">
                    <Target className="w-3 h-3" />
                    <span>Materias PAES</span>
                  </div>
                  {showPAESSubjects ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </Button>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {paesSubjects.map((subject, index) => (
                    <motion.div
                      key={subject.name}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink 
                            to={subject.url}
                            className="premium-nav-item text-xs"
                          >
                            <subject.icon className="h-3 w-3" />
                            <div className="flex-1">
                              <div className="text-contrast-high">{subject.name}</div>
                              <div className="text-xs text-contrast-medium">{subject.nodes} nodos</div>
                            </div>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-premium-violet-500/20 premium-header">
        <motion.div 
          className="premium-card p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-xs font-medium text-emerald-premium-400 flex items-center space-x-2 mb-2">
            <Brain className="w-3 h-3" />
            <span>Sistema Neural PAES</span>
          </div>
          <div className="text-2xl font-bold text-contrast-high mb-1">277</div>
          <div className="text-xs text-contrast-medium">nodos activos</div>
          
          <div className="flex gap-1 mt-3">
            <Badge className="premium-badge text-xs">
              Sistema Activo
            </Badge>
            <Badge className="premium-badge text-xs">
              IA Conectada
            </Badge>
          </div>
        </motion.div>
      </SidebarFooter>
    </Sidebar>
  );
}
