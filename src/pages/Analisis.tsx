
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const Analisis = () => {
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
              <BreadcrumbLink>Análisis</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex items-center mb-6 gap-2">
          <BarChart2 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Análisis de Retroalimentación</h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Análisis detallado de tu desempeño y recomendaciones personalizadas.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de desempeño</CardTitle>
              <CardDescription>
                Estadísticas y métricas de tu progreso en las diferentes áreas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>El análisis de retroalimentación estará disponible próximamente.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Analisis;
