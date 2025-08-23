
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const Evaluaciones = () => {
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
              <BreadcrumbLink>Evaluaciones</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex items-center mb-6 gap-2">
          <ClipboardList className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Evaluaciones Periódicas</h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Evaluaciones para medir tu progreso y ajustar tu plan de estudio.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Evaluaciones disponibles</CardTitle>
              <CardDescription>
                Pruebas para valorar tu avance en las diferentes habilidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Las evaluaciones estarán disponibles próximamente.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Evaluaciones;
