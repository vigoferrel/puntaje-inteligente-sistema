
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDataInitialization } from '@/hooks/use-data-initialization';
import { Database, Loader, RefreshCw, LogIn } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export function DataManagementPanel() {
  const {
    initializeLearningNodes,
    checkDatabaseStatus,
    status,
    isLoading,
    message,
    error
  } = useDataInitialization();
  
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Gestión de Base de Datos
        </CardTitle>
        <CardDescription>
          Inicializa y administra los datos necesarios para el funcionamiento de la aplicación.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!user && (
          <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900">
            <AlertTitle className="flex items-center gap-2">
              <LogIn className="h-4 w-4" /> 
              Autenticación requerida
            </AlertTitle>
            <AlertDescription className="space-y-2">
              <p>Debes iniciar sesión para poder inicializar los nodos de aprendizaje.</p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth">Ir a iniciar sesión</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {message && !error && (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
            <AlertTitle>Información</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Estado de la base de datos:</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatusCard 
              title="Nodos de Aprendizaje" 
              status={status.learningNodes} 
            />
            <StatusCard 
              title="Habilidades PAES" 
              status={status.paesSkills} 
            />
            <StatusCard 
              title="Pruebas PAES" 
              status={status.paesTests} 
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={checkDatabaseStatus}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Verificar Estado
            </>
          )}
        </Button>
        
        <Button
          onClick={initializeLearningNodes}
          disabled={isLoading || !user}
          className="w-full sm:w-auto"
          title={!user ? "Debes iniciar sesión para inicializar los nodos" : ""}
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Inicializando...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Inicializar Nodos de Aprendizaje
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

interface StatusCardProps {
  title: string;
  status: 'loading' | 'empty' | 'populated' | 'error' | 'unknown';
}

function StatusCard({ title, status }: StatusCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case 'populated':
        return <Badge className="bg-green-500">Datos cargados</Badge>;
      case 'empty':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Sin datos</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'loading':
        return <Badge variant="outline" className="animate-pulse">Verificando...</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };
  
  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg">
      <div className="text-sm font-medium">{title}</div>
      <div>{getStatusBadge()}</div>
    </div>
  );
}
