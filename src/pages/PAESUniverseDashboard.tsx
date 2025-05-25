
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { AppInitializer } from "@/components/AppInitializer";
import { PAESUniverseDashboard } from "@/components/paes-universe/PAESUniverseDashboard";

const PAESUniversePage = () => {
  return (
    <AppInitializer>
      <AppLayout>
        <div className="h-screen">
          <PAESUniverseDashboard />
        </div>
      </AppLayout>
    </AppInitializer>
  );
};

export default PAESUniversePage;
