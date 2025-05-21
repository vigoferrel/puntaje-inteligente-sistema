
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
} from "@/components/ui/sidebar";
import { Home, BookOpen, Settings, Calendar, User, LogOut } from "lucide-react";
import { 
  BarChart3, 
  BookText, 
  GraduationCap, 
  Calculator, 
  MessageCircleQuestion,
  Award
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const NavItem = ({ to, icon: Icon, label, active }: NavItemProps) => (
  <SidebarMenuItem>
    <SidebarMenuButton asChild>
      <Link 
        to={to} 
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300",
          active ? "bg-primary/20 text-primary font-medium" : "hover:bg-secondary text-muted-foreground hover:text-foreground"
        )}
      >
        <Icon size={18} className={active ? "text-primary" : "text-muted-foreground"} />
        <span>{label}</span>
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

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
          <div className="primary-gradient p-1.5 rounded-md flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div className="font-bold text-xl text-foreground">SubeTuPuntaje</div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Principal
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem to="/" icon={Home} label="Inicio" active={currentPath === "/"} />
              <NavItem to="/diagnostico" icon={BarChart3} label="Diagnóstico" active={currentPath === "/diagnostico"} />
              <NavItem to="/lectoguia" icon={MessageCircleQuestion} label="LectoGuía AI" active={currentPath === "/lectoguia"} />
              <NavItem to="/biblioteca" icon={BookOpen} label="Biblioteca" active={currentPath === "/biblioteca"} />
              <NavItem to="/planes" icon={BookText} label="Planes de estudio" active={currentPath.startsWith("/planes")} />
              <NavItem to="/simuladores" icon={Calculator} label="Simuladores" active={currentPath.startsWith("/simuladores")} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Recursos
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem to="/calendario" icon={Calendar} label="Calendario" active={currentPath === "/calendario"} />
              <NavItem to="/becas" icon={Award} label="Becas y Beneficios" active={currentPath === "/becas"} />
              <NavItem to="/ayuda" icon={MessageCircleQuestion} label="Ayuda" active={currentPath === "/ayuda"} />
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
