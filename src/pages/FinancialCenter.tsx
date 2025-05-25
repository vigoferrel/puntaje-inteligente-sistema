
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { AppInitializer } from "@/components/AppInitializer";
import { CinematicFinancialCenter } from "@/components/financial-center";

const FinancialCenter = () => {
  return (
    <AppInitializer>
      <AppLayout>
        <CinematicFinancialCenter />
      </AppLayout>
    </AppInitializer>
  );
};

export default FinancialCenter;
