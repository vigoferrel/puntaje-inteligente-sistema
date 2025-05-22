
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const Entrenamiento = () => {
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
              <BreadcrumbLink>Entrenamiento</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex items-center mb-6 gap-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Entrenamiento de Habilidades</h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Mejora tus habilidades con ejercicios específicos adaptados a tu nivel.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ejercicios personalizados</CardTitle>
              <CardDescription>
                Ejercicios diseñados según tus resultados de diagnóstico
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Los contenidos de entrenamiento estarán disponibles próximamente.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Entrenamiento;
