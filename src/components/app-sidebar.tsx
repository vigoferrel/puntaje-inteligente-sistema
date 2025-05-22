
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarMenuSub, 
  SidebarMenuSubButton
} from "@/components/ui/sidebar";
import { 
  Home, 
  Settings, 
  User, 
  LogOut, 
  Sparkles, 
  BarChart3, 
  Target, 
  Brain, 
  BookOpen, 
  PenTool, 
  CheckCircle, 
  ArrowUpRight,
  MessageCircleQuestion,
  Award,
  Calendar,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
  variant?: "primary" | "default" | "muted";
  showBadge?: boolean;
  badgeContent?: string;
}

const NavItem = ({ to, icon: Icon, label, active, variant = "default", showBadge, badgeContent }: NavItemProps) => {
  const getVariantStyles = () => {
    switch(variant) {
      case "primary":
        return active 
          ? "bg-primary text-primary-foreground font-medium" 
          : "hover:bg-primary/10 text-primary hover:text-primary";
      case "muted":
        return active 
          ? "bg-muted text-foreground font-medium" 
          : "hover:bg-muted/80 text-muted-foreground hover:text-foreground";
      default:
        return active 
          ? "bg-secondary text-foreground font-medium" 
          : "hover:bg-secondary text-muted-foreground hover:text-foreground";
    }
  };
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link 
          to={to} 
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300 relative",
            getVariantStyles()
          )}
        >
          <Icon size={18} className={active ? "text-inherit" : "text-inherit"} />
          <span>{label}</span>
          {showBadge && (
            <span className="ml-auto bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
              {badgeContent || "Nuevo"}
            </span>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
    navigate("/auth");
  };

  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SidebarHeader className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-1.5 rounded-md flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div className="font-bold text-xl text-foreground">SubeTuPuntaje</div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Inicio
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem to="/" icon={Home} label="Dashboard" active={currentPath === "/"} />
              <NavItem to="/lectoguia" icon={Sparkles} label="LectoGuía AI" active={currentPath === "/lectoguia"} variant="primary" showBadge={true} badgeContent="AI" />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Ciclo de Aprendizaje
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem to="/diagnostico" icon={BarChart3} label="Diagnóstico" active={currentPath === "/diagnostico"} />
              <NavItem to="/plan" icon={Target} label="Plan Personalizado" active={currentPath.startsWith("/plan")} />
              <NavItem to="/entrenamiento" icon={Brain} label="Entrenamiento" active={currentPath.startsWith("/entrenamiento")} />
              <NavItem to="/contenido" icon={BookOpen} label="Contenido" active={currentPath.startsWith("/contenido")} />
              <NavItem to="/evaluaciones" icon={PenTool} label="Evaluaciones" active={currentPath.startsWith("/evaluaciones")} />
              <NavItem to="/analisis" icon={MessageCircleQuestion} label="Análisis" active={currentPath.startsWith("/analisis")} />
              <NavItem to="/reforzamiento" icon={CheckCircle} label="Reforzamiento" active={currentPath.startsWith("/reforzamiento")} />
              <NavItem to="/simulaciones" icon={ArrowUpRight} label="Simulaciones" active={currentPath.startsWith("/simulaciones")} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Recursos
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem to="/biblioteca" icon={BookOpen} label="Biblioteca" active={currentPath === "/biblioteca"} variant="muted" />
              <NavItem to="/calendario" icon={Calendar} label="Calendario" active={currentPath === "/calendario"} variant="muted" />
              <NavItem to="/becas" icon={Award} label="Becas" active={currentPath === "/becas"} variant="muted" />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="px-3 py-3 mt-auto border-t border-border">
        <SidebarMenu>
          <NavItem to="/perfil" icon={User} label="Perfil" active={currentPath === "/perfil"} />
          <NavItem to="/configuracion" icon={Settings} label="Configuración" active={currentPath === "/configuracion"} />
          <SidebarMenuItem>
            <SidebarMenuButton 
              className="flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300 text-red-400 hover:bg-red-500/10 hover:text-red-500 w-full"
              onClick={handleSignOut}
            >
              <LogOut size={18} className="text-red-400" />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
