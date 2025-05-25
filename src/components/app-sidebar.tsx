
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
} from "@/components/ui/sidebar";
import { 
  Home, 
  BarChart3, 
  Target, 
  BookOpen, 
  Stethoscope,
  Calculator,
  Microscope,
  History,
  FileText
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
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) =>
                        isActive ? "bg-primary text-primary-foreground" : ""
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
          <SidebarGroupLabel>Pruebas PAES</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {paesItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
