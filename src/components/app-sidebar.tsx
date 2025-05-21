
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
import { Home, BookOpen, Settings, Calendar, User } from "lucide-react";
import { 
  BarChart3, 
  BookText, 
  GraduationCap, 
  Calculator, 
  MessageCircleQuestion,
  Award
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";

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
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
          active ? "bg-stp-light text-stp-primary font-medium" : "hover:bg-gray-100"
        )}
      >
        <Icon size={18} className={active ? "text-stp-primary" : "text-gray-500"} />
        <span>{label}</span>
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-stp-primary to-stp-secondary p-1.5 rounded-md">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div className="font-bold text-xl text-stp-dark">SubeTuPuntaje</div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Principal
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem to="/" icon={Home} label="Inicio" active={currentPath === "/"} />
              <NavItem to="/diagnostico" icon={BarChart3} label="Diagnóstico" active={currentPath === "/diagnostico"} />
              <NavItem to="/biblioteca" icon={BookOpen} label="Biblioteca" active={currentPath === "/biblioteca"} />
              <NavItem to="/planes" icon={BookText} label="Planes de estudio" active={currentPath.startsWith("/planes")} />
              <NavItem to="/simuladores" icon={Calculator} label="Simuladores" active={currentPath.startsWith("/simuladores")} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
      
      <SidebarFooter className="px-3 py-3 mt-auto border-t border-gray-200">
        <SidebarMenu>
          <NavItem to="/perfil" icon={User} label="Perfil" active={currentPath === "/perfil"} />
          <NavItem to="/configuracion" icon={Settings} label="Configuración" active={currentPath === "/configuracion"} />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
