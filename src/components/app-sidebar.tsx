
import React from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/ui/sidebar";
import {
  Home,
  GraduationCap,
  BookOpenCheck,
  Menu,
  Settings,
  Brain,
  FileText,
  BarChartHorizontal,
  Crown,
  Wrench,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

export const AppSidebar = () => {
  const { profile } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  // Verificar si el usuario tiene rol de administrador
  // Fix: Check if user email includes 'admin' instead of checking role property
  const isAdmin = profile?.email?.includes('admin');

  const navItems = [
    {
      name: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/",
      showBadge: false,
    },
    {
      name: "Mi Plan",
      icon: <GraduationCap className="h-5 w-5" />,
      path: "/plan",
      showBadge: false,
    },
    {
      name: "LectoGuía",
      icon: <Brain className="h-5 w-5" />,
      path: "/lectoguia",
      showBadge: true,
    },
    {
      name: "Diagnóstico",
      icon: <BookOpenCheck className="h-5 w-5" />,
      path: "/diagnostico",
      showBadge: false,
    },
    {
      name: "Simulacros",
      icon: <FileText className="h-5 w-5" />,
      path: "/simulacros",
      showBadge: true,
      comingSoon: true,
    },
    {
      name: "Resultados",
      icon: <BarChartHorizontal className="h-5 w-5" />,
      path: "/resultados",
      showBadge: false,
      comingSoon: true,
    },
  ];

  const adminItems = [
    {
      name: "Generador de Diagnósticos",
      icon: <Wrench className="h-5 w-5" />,
      path: "/admin/generador-diagnostico",
    },
  ];

  return (
    <Sidebar
      className="border-r"
      collapsed={isMobile}
      open={open}
      onOpenChange={setOpen}>
      <div className="pb-12 h-full flex flex-col">
        <div className="py-4 px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Crown className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">PAES PRO</span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(!open)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <Separator />

        <div className="space-y-4 py-4 flex-1 overflow-auto">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              PREPARACIÓN
            </h2>
            <div className="space-y-1">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    to={item.comingSoon ? "#" : item.path}
                    key={index}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 transition-all hover:text-primary",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground",
                      item.comingSoon && "opacity-50 pointer-events-none"
                    )}>
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span
                        className={cn(
                          "text-sm",
                          isActive && "font-semibold"
                        )}>
                        {item.name}
                      </span>
                    </div>
                    {item.showBadge && (
                      <Badge variant="default" className="text-xs">
                        Nuevo
                      </Badge>
                    )}
                    {item.comingSoon && (
                      <Badge variant="outline" className="text-xs">
                        Pronto
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {isAdmin && (
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                ADMINISTRACIÓN
              </h2>
              <div className="space-y-1">
                {adminItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      to={item.path}
                      key={index}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2 transition-all hover:text-primary",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground"
                      )}>
                      <div className="flex items-center space-x-3">
                        {item.icon}
                        <span
                          className={cn(
                            "text-sm",
                            isActive && "font-semibold"
                          )}>
                          {item.name}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <Separator />
        <div className="p-4">
          <Link
            to="/settings"
            className="flex items-center space-x-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
            <Settings className="h-5 w-5" />
            <span className="text-sm">Configuración</span>
          </Link>
        </div>
      </div>
    </Sidebar>
  );
};
