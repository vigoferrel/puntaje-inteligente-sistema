
import React from 'react';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataManagementPanel } from '@/components/settings/DataManagementPanel';
import { Separator } from '@/components/ui/separator';

export default function Settings() {
  return (
    <AppLayout>
      <div className="container py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">
            Administra las configuraciones de la aplicación y la base de datos.
          </p>
        </div>
        
        <Separator />
        
        <Tabs defaultValue="data-management" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3 gap-4">
            <TabsTrigger value="data-management">Base de Datos</TabsTrigger>
            <TabsTrigger value="account">Cuenta</TabsTrigger>
            <TabsTrigger value="appearance">Apariencia</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="data-management" className="space-y-4">
              <DataManagementPanel />
            </TabsContent>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de la Cuenta</CardTitle>
                  <CardDescription>
                    Administra la configuración de tu cuenta y preferencias.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Las opciones de cuenta estarán disponibles próximamente.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Apariencia</CardTitle>
                  <CardDescription>
                    Personaliza la apariencia de la aplicación.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Las opciones de apariencia estarán disponibles próximamente.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AppLayout>
  );
}
