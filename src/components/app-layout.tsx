
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Menu, User, Bell, LogOut } from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { loading } = useUserData();
  const { profile, signOut } = useAuth();
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="bg-white h-16 px-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <SidebarTrigger>
                <Button size="icon" variant="ghost">
                  <Menu className="h-5 w-5" />
                </Button>
              </SidebarTrigger>
            </div>

            <div className="flex items-center gap-4">
              <Button size="icon" variant="ghost" className="rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 cursor-pointer">
                    <div className="text-right hidden sm:block">
                      {!loading && profile && (
                        <>
                          <p className="text-sm font-medium">{profile.name}</p>
                          <p className="text-xs text-gray-500">Estudiante</p>
                        </>
                      )}
                    </div>
                    <Button size="icon" variant="ghost" className="rounded-full bg-gray-100">
                      <User className="h-5 w-5" />
                    </Button>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/perfil")}>Perfil</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/configuracion")}>Configuración</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
                    <LogOut className="h-4 w-4 mr-2" /> Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
