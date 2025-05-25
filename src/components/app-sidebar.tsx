
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
import { 
  Home, 
  BarChart3, 
  Target, 
  BookOpen, 
  Stethoscope,
  Calculator,
  Microscope,
  History,
  FileText,
  GraduationCap,
  Brain,
  Play
} from "lucide-react";

const menuItems = [
  {
    title: "Inicio",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "PAES Dashboard",
    url: "/paes-dashboard",
    icon: Target,
  },
  {
    title: "Generador de Ejercicios",
    url: "/ejercicios",
    icon: Brain,
  },
  {
    title: "LectoGuía",
    url: "/lectoguia",
    icon: BookOpen,
  },
  {
    title: "Diagnóstico",
    url: "/diagnostico",
    icon: Stethoscope,
  },
  {
    title: "Mi Plan",
    url: "/plan",
    icon: FileText,
  },
];

const paesItems = [
  {
    title: "Competencia Lectora",
    url: "/materia/competencia-lectora",
    exerciseUrl: "/ejercicios/competencia-lectora",
    icon: BookOpen,
    nodes: 30,
    tier1: 14
  },
  {
    title: "Matemática M1",
    url: "/materia/matematica-m1",
    exerciseUrl: "/ejercicios/matematica-m1",
    icon: Calculator,
    nodes: 25,
    tier1: 10
  },
  {
    title: "Matemática M2",
    url: "/materia/matematica-m2",
    exerciseUrl: "/ejercicios/matematica-m2",
    icon: Calculator,
    nodes: 22,
    tier1: 13
  },
  {
    title: "Ciencias",
    url: "/materia/ciencias",
    exerciseUrl: "/ejercicios/ciencias",
    icon: Microscope,
    nodes: 135,
    tier1: 33
  },
  {
    title: "Historia",
    url: "/materia/historia",
    exerciseUrl: "/ejercicios/historia",
    icon: History,
    nodes: 65,
    tier1: 19
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-gray-800 bg-black">
      <SidebarHeader className="p-4 bg-black">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-white">StudyPlatform</span>
            <span className="truncate text-xs text-gray-400">PAES 2024 - 277 Nodos</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 bg-black">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-400 px-2 py-2">
            Navegación Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800 ${
                          isActive ? "bg-gray-800 text-white font-medium" : "text-gray-300 hover:text-white"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-400 px-2 py-2">
            <div className="flex items-center justify-between w-full">
              Materias PAES
              <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-200">
                277
              </Badge>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {paesItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <div className="space-y-1">
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800 text-gray-300 hover:text-white"
                      >
                        <item.icon className="h-4 w-4" />
                        <div className="flex-1">
                          <span className="text-xs">{item.title}</span>
                          <div className="flex gap-1 mt-1">
                            <Badge variant="outline" className="text-xs px-1 py-0 h-4 text-gray-400 border-gray-600">
                              {item.nodes}n
                            </Badge>
                            <Badge variant="destructive" className="text-xs px-1 py-0 h-4">
                              T1:{item.tier1}
                            </Badge>
                          </div>
                        </div>
                      </NavLink>
                    </SidebarMenuButton>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.exerciseUrl}
                        className="flex items-center gap-2 rounded-lg px-6 py-1 text-xs transition-all hover:bg-gray-800 text-gray-400 hover:text-white ml-3"
                      >
                        <Play className="h-3 w-3" />
                        <span>Ejercicios</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-black">
        <div className="rounded-lg bg-gray-900 p-3">
          <div className="text-xs font-medium text-gray-300">Sistema PAES Integrado</div>
          <div className="text-2xl font-bold text-white">277</div>
          <div className="text-xs text-gray-400">nodos de aprendizaje</div>
          <div className="flex gap-1 mt-2">
            <Badge variant="destructive" className="text-xs px-1 py-0">
              T1:89
            </Badge>
            <Badge className="text-xs px-1 py-0 bg-yellow-600">
              T2:108
            </Badge>
            <Badge className="text-xs px-1 py-0 bg-green-600">
              T3:80
            </Badge>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
