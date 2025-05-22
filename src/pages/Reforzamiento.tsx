
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hammer } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const Reforzamiento = () => {
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
              <BreadcrumbLink>Reforzamiento</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex items-center mb-6 gap-2">
          <Hammer className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Reforzamiento de Habilidades</h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Ejercicios focalizados para reforzar áreas específicas según tu análisis.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Actividades de reforzamiento</CardTitle>
              <CardDescription>
                Ejercicios diseñados para fortalecer tus áreas de oportunidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Las actividades de reforzamiento estarán disponibles próximamente.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Reforzamiento;
