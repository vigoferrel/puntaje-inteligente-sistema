
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full grid grid-rows-[auto_1fr] lg:grid-cols-[auto_1fr] lg:grid-rows-1">
        <AppSidebar />
        
        <div className="flex flex-col min-h-screen lg:min-h-0">
          <AppHeader />
          
          <main className="flex-1 overflow-auto bg-background">
            <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
