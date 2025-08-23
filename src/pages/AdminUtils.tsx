
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { PhaseManager } from "@/components/admin/PhaseManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const AdminUtils = () => {
  return (
    <AppLayout>
      <div className="container py-8">
        <div className="flex items-center mb-6 gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Herramientas de Administración</h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Esta sección contiene herramientas administrativas para gestionar la aplicación.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PhaseManager />
          
          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
              <CardDescription>
                Este panel de administración permite gestionar diferentes aspectos de la aplicación.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Utiliza estas herramientas con precaución, ya que pueden afectar la experiencia del usuario.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminUtils;
