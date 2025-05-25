
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { AppInitializer } from "@/components/AppInitializer";
import { PAESUnifiedDashboard } from "@/components/paes-unified/PAESUnifiedDashboard";

const PAESDashboard = () => {
  return (
    <AppInitializer>
      <AppLayout>
        <div className="container mx-auto py-6 px-4">
          <PAESUnifiedDashboard />
        </div>
      </AppLayout>
    </AppInitializer>
  );
};

export default PAESDashboard;
