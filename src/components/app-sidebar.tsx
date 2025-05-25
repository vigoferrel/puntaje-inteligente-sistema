
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
  FileText,
  GraduationCap,
  Brain,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Zap,
  TrendingUp,
  Shield
} from "lucide-react";
import { useCinematicDashboard } from "@/hooks/dashboard/useCinematicDashboard";
import { useGlobalStore } from "@/store/globalStore";
import { motion } from "framer-motion";

const workflowItems = [
  {
    title: "Centro de Comando",
    url: "/",
    icon: Home,
    phase: "dashboard",
    description: "Panel de control principal"
  },
  {
    title: "Diagnóstico Inteligente",
    url: "/diagnostico",
    icon: Stethoscope,
    phase: "diagnostic",
    description: "Evaluación de habilidades"
  },
  {
    title: "Plan Personalizado",
    url: "/plan",
    icon: Target,
    phase: "planning",
    description: "Estrategia de estudio"
  },
  {
    title: "LectoGuía IA",
    url: "/lectoguia",
    icon: Brain,
    phase: "study",
    description: "Asistente de aprendizaje"
  },
  {
    title: "Evaluación Continua",
    url: "/paes-dashboard",
    icon: TrendingUp,
    phase: "evaluation",
    description: "Seguimiento de progreso"
  }
];

const toolsItems = [
  {
    title: "Centro Financiero",
    url: "/centro-financiero",
    icon: DollarSign,
    badge: "PAES 2025",
    color: "from-yellow-500 to-orange-500"
  },
  {
    title: "Generador de Ejercicios",
    url: "/ejercicios",
    icon: Zap,
    color: "from-purple-500 to-pink-500"
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
        return <Badge className="text-xs px-1 py-0 bg-green-600">✓</Badge>;
      case 'in_progress':
        return <Badge className="text-xs px-1 py-0 bg-blue-600">•••</Badge>;
      case 'available':
        return <Badge className="text-xs px-1 py-0 bg-yellow-600">→</Badge>;
      case 'locked':
        return <Badge className="text-xs px-1 py-0 bg-gray-600">🔒</Badge>;
      default:
        return null;
    }
  };

  const paesSubjects = [
    { name: "Competencia Lectora", nodes: 30, tier1: 14, url: "/materia/competencia-lectora", icon: BookOpen },
    { name: "Matemática M1", nodes: 25, tier1: 10, url: "/materia/matematica-m1", icon: FileText },
    { name: "Matemática M2", nodes: 22, tier1: 13, url: "/materia/matematica-m2", icon: FileText },
    { name: "Ciencias", nodes: 135, tier1: 33, url: "/materia/ciencias", icon: Shield },
    { name: "Historia", nodes: 65, tier1: 19, url: "/materia/historia", icon: BookOpen }
  ];

  return (
    <Sidebar className="cinematic-sidebar border-r border-cyan-500/30">
      <SidebarHeader className="p-4 cinematic-hologram">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 cinematic-glow-text">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div className="grid flex-1 text-left leading-tight">
            <span className="font-bold text-white cinematic-glow-text">PAES Command</span>
            <span className="text-xs text-cyan-200">Sistema Cinematográfico</span>
          </div>
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="px-2 cinematic-particle-bg">
        {/* Workflow Principal */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-cyan-400 px-2 py-2 flex items-center space-x-2">
            <Sparkles className="w-3 h-3" />
            <span>Workflow de Aprendizaje</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
                      <SidebarMenuButton asChild className={isDisabled ? 'opacity-50 cursor-not-allowed' : ''}>
                        <NavLink 
                          to={isDisabled ? '#' : item.url}
                          className={({ isActive }) =>
                            `flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all cinematic-nav-item ${
                              isActive && !isDisabled ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400" : "text-gray-300 hover:text-white"
                            }`
                          }
                          onClick={(e) => isDisabled && e.preventDefault()}
                        >
                          <item.icon className="h-4 w-4" />
                          <div className="flex-1">
                            <div className="font-medium">{item.title}</div>
                            <div className="text-xs text-gray-400">{item.description}</div>
                          </div>
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

        {/* Herramientas Especializadas */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-purple-400 px-2 py-2 flex items-center space-x-2">
            <Zap className="w-3 h-3" />
            <span>Herramientas Avanzadas</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
                          `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all cinematic-nav-item ${
                            isActive ? "bg-purple-500/20 text-purple-300 border-l-2 border-purple-400" : "text-gray-300 hover:text-white"
                          }`
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <Badge variant="destructive" className="text-xs px-1 py-0 h-4">
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
              <SidebarGroupLabel className="text-xs font-medium text-green-400 px-2 py-2">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto text-green-400 hover:text-green-300">
                    <div className="flex items-center space-x-2">
                      <Target className="w-3 h-3" />
                      <span>Plan PAES Activo</span>
                    </div>
                    {showPAESSubjects ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </Button>
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
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
                              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-all cinematic-nav-item text-gray-400 hover:text-white"
                            >
                              <subject.icon className="h-3 w-3" />
                              <div className="flex-1">
                                <div>{subject.name}</div>
                                <div className="flex gap-1 mt-1">
                                  <Badge variant="outline" className="text-xs px-1 py-0 h-3 text-gray-500 border-gray-600">
                                    {subject.nodes}n
                                  </Badge>
                                  <Badge variant="destructive" className="text-xs px-1 py-0 h-3">
                                    T1:{subject.tier1}
                                  </Badge>
                                </div>
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

      <SidebarFooter className="p-4 cinematic-hologram">
        <motion.div 
          className="rounded-lg bg-gradient-to-r from-gray-900/80 via-cyan-900/80 to-purple-900/80 p-3 backdrop-blur-md border border-cyan-500/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-xs font-medium text-cyan-300 flex items-center space-x-2">
            <Brain className="w-3 h-3" />
            <span>Sistema Neural PAES</span>
          </div>
          <div className="text-2xl font-bold text-white cinematic-glow-text">277</div>
          <div className="text-xs text-gray-400">nodos de aprendizaje activos</div>
          
          {dashboardData.stats.currentPlan > 0 && (
            <div className="flex gap-1 mt-2">
              <Badge variant="destructive" className="text-xs px-1 py-0">
                Diagnóstico: ✓
              </Badge>
              <Badge className="text-xs px-1 py-0 bg-cyan-600">
                Plan: Activo
              </Badge>
            </div>
          )}
        </motion.div>
      </SidebarFooter>
    </Sidebar>
  );
}
