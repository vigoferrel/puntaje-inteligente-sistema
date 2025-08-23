
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Timer } from "lucide-react";
import { SimulationController } from "@/components/lectoguia/simulation/SimulationController";

const Simulaciones = () => {
  return (
    <AppLayout>
      <div className="container py-8">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/">Inicio</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Simulaciones</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex items-center mb-6 gap-2">
          <Timer className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Simulaciones PAES</h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Simulaciones completas de la prueba PAES para evaluar tu preparación en condiciones reales de examen.
        </p>
        
        <SimulationController />
      </div>
    </AppLayout>
  );
};

export default Simulaciones;
