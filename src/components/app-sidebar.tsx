
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
  GraduationCap
} from "lucide-react";

const menuItems = [
  {
    title: "Inicio",
    url: "/",
    icon: Home,
  },
  {
    title: "Mi Dashboard",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Dashboard PAES",
    url: "/paes-dashboard",
    icon: Target,
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
    url: "/paes-dashboard?test=competencia-lectora",
    icon: BookOpen,
  },
  {
    title: "Matemática M1",
    url: "/paes-dashboard?test=matematica-m1",
    icon: Calculator,
  },
  {
    title: "Matemática M2",
    url: "/paes-dashboard?test=matematica-m2",
    icon: Calculator,
  },
  {
    title: "Ciencias",
    url: "/paes-dashboard?test=ciencias",
    icon: Microscope,
  },
  {
    title: "Historia",
    url: "/paes-dashboard?test=historia",
    icon: History,
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
            <span className="truncate text-xs text-gray-400">PAES 2024</span>
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
              Pruebas PAES
              <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-200">
                5
              </Badge>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {paesItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800 text-gray-300 hover:text-white"
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-xs">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-black">
        <div className="rounded-lg bg-gray-900 p-3">
          <div className="text-xs font-medium text-gray-300">Progreso General</div>
          <div className="text-2xl font-bold text-white">64%</div>
          <div className="text-xs text-gray-400">140 de 277 nodos</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
