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
  Shield,
  GraduationCap,
  Calendar,
  Settings,
  History,
  FlaskConical
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

export function AppSidebar() {
  const dashboardData = useCinematicDashboard();
  const currentPlan = useGlobalStore(state => state.currentPlan);
  const [showPAESSubjects, setShowPAESSubjects] = React.useState(false);

  const getPhaseStatus = (phase: string) => {
    const stats = dashboardData.stats;
    switch (phase) {
      case 'diagnostic':
        return stats.diagnostics > 0 ? 'completed' : 'pending';
      case 'planning':
        return stats.currentPlan > 0 ? 'completed' : stats.diagnostics > 0 ? 'available' : 'locked';
      case 'study':
        return stats.nodes > 0 ? 'in_progress' : stats.currentPlan > 0 ? 'available' : 'locked';
      case 'evaluation':
        return stats.nodes > 50 ? 'available' : 'locked';
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
      case 'locked':
        return <div className="w-2 h-2 bg-gray-600 rounded-full" />;
      default:
        return null;
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
    <Sidebar className="font-luxury border-r border-cyan-500/20 bg-black/90 backdrop-blur-xl">
      <SidebarHeader className="p-6 border-b border-cyan-500/20">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 shadow-lg shadow-cyan-500/30">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-lg font-semibold text-white tracking-wide">PAES Command</span>
            <div className="text-xs text-cyan-400 font-light">Sistema IA</div>
          </div>
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-2">
        {/* Workflow Principal */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-cyan-400 px-2 py-3 flex items-center space-x-2 tracking-wide">
            <Sparkles className="w-3 h-3" />
            <span>Workflow de Aprendizaje</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {workflowItems.map((item, index) => {
                const status = getPhaseStatus(item.phase);
                const isDisabled = status === 'locked';
                
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className={isDisabled ? 'opacity-40 cursor-not-allowed' : ''}>
                        <NavLink 
                          to={isDisabled ? '#' : item.url}
                          className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                              isActive && !isDisabled 
                                ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/20" 
                                : "text-gray-300 hover:text-white hover:bg-white/5"
                            }`
                          }
                          onClick={(e) => isDisabled && e.preventDefault()}
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1">{item.title}</span>
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
                  transition={{ delay: (workflowItems.length + index) * 0.1 }}
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

        {/* Materias PAES - Solo cuando hay plan activo */}
        {currentPlan && (
          <SidebarGroup>
            <Collapsible open={showPAESSubjects} onOpenChange={setShowPAESSubjects}>
              <SidebarGroupLabel className="text-xs font-medium text-green-400 px-2 py-3">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto text-green-400 hover:text-green-300 font-medium tracking-wide">
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
                              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-400 hover:text-white hover:bg-white/5"
                            >
                              <subject.icon className="h-3 w-3" />
                              <div className="flex-1">
                                <div>{subject.name}</div>
                                <div className="text-xs text-gray-500 font-light">{subject.nodes} nodos</div>
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
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-cyan-500/20">
        <motion.div 
          className="rounded-xl bg-gradient-to-r from-gray-900/80 via-cyan-900/30 to-purple-900/30 p-4 backdrop-blur-md border border-cyan-500/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-xs font-medium text-cyan-300 flex items-center space-x-2 mb-2">
            <Brain className="w-3 h-3" />
            <span>Sistema Neural PAES</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">277</div>
          <div className="text-xs text-gray-400 font-light">nodos activos</div>
          
          {dashboardData.stats.currentPlan > 0 && (
            <div className="flex gap-1 mt-3">
              <Badge variant="destructive" className="text-xs px-2 py-0.5 font-medium">
                Diagnóstico ✓
              </Badge>
              <Badge className="text-xs px-2 py-0.5 bg-cyan-600 font-medium">
                Plan Activo
              </Badge>
            </div>
          )}
        </motion.div>
      </SidebarFooter>
    </Sidebar>
  );
}
