
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { LectoGuiaUnified } from "@/components/lectoguia/LectoGuiaUnified";
import { Toaster } from "@/components/ui/toaster";

/**
 * Página principal de LectoGuía rediseñada
 * Hub central del sistema educativo
 */
const LectoGuia = () => {
  return (
    <AppLayout>
      <LectoGuiaUnified />
      <Toaster />
    </AppLayout>
  );
};

export default LectoGuia;
