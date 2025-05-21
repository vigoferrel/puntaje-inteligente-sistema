
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Menu, User, Bell } from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, loading } = useUserData();

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
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  {!loading && user && (
                    <>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">Estudiante</p>
                    </>
                  )}
                </div>
                <Button size="icon" variant="ghost" className="rounded-full bg-gray-100">
                  <User className="h-5 w-5" />
                </Button>
              </div>
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
