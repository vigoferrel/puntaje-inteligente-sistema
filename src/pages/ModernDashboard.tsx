
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { AppInitializer } from "@/components/AppInitializer";
import { ModernDashboardHub } from "@/components/dashboard/modern/ModernDashboardHub";

const ModernDashboard = () => {
  return (
    <AppInitializer>
      <AppLayout>
        <ModernDashboardHub />
      </AppLayout>
    </AppInitializer>
  );
};

export default ModernDashboard;
