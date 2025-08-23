/* eslint-disable react-refresh/only-export-components */

import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useDataInitialization } from '../../hooks/use-data-initialization';
import { Database, Loader, RefreshCw, LogIn, AlertTriangle, Info, BookOpen } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export (...args: unknown[]) => unknown DataManagementPanel() {
  const {
    initializeLearningNodes,
    initializePAESContent,
    checkDatabaseStatus,
    status,
    isLoading,
    isLoadingPAES,
    message,
    error,
    detailedError,
    paesContentStatus
  } = useDataInitialization();
  
  const { user } = useAuth();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          GestiÃ³n de Base de Datos
        </CardTitle>
        <CardDescription>
          Inicializa y administra los datos necesarios para el funcionamiento de la aplicaciÃ³n.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!user && (
          <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900">
            <AlertTitle className="flex items-center gap-2">
              <LogIn className="h-4 w-4" /> 
              AutenticaciÃ³n requerida
            </AlertTitle>
            <AlertDescription className="space-y-2">
              <p>Debes iniciar sesiÃ³n para poder inicializar los nodos de aprendizaje.</p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth">Ir a iniciar sesiÃ³n</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {status.paesSkills === 'empty' || status.paesTests === 'empty' ? (
          <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900">
            <AlertTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> 
              InicializaciÃ³n requerida
            </AlertTitle>
            <AlertDescription>
              <p>Las tablas de habilidades y pruebas deben ser inicializadas. Al hacer clic en "Inicializar Nodos de Aprendizaje" 
              se inicializarÃ¡n todas las tablas necesarias.</p>
            </AlertDescription>
          </Alert>
        ) : null}
        
        {message && !error && (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
            <AlertTitle className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              InformaciÃ³n
            </AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Error
            </AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{error}</p>
              {detailedError && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowDetails(!showDetails)}
                    className="mt-2"
                  >
                    {showDetails ? "Ocultar detalles" : "Mostrar detalles"}
                  </Button>
                  {showDetails && (
                    <pre className="text-xs bg-black/10 p-2 rounded overflow-x-auto mt-2">
                      {detailedError}
                    </pre>
                  )}
                </>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Estado de la base de datos:</div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatusCard 
              title="Nodos de Aprendizaje" 
              status={status.learningNodes} 
              description={getStatusDescription("learningNodes", status.learningNodes)}
            />
            <StatusCard 
              title="Habilidades PAES" 
              status={status.paesSkills} 
              description={getStatusDescription("paesSkills", status.paesSkills)}
            />
            <StatusCard 
              title="Pruebas PAES" 
              status={status.paesTests} 
              description={getStatusDescription("paesTests", status.paesTests)}
            />
            <StatusCard 
              title="Contenido PAES" 
              status={paesContentStatus || 'unknown'} 
              description={getStatusDescription("paesContent", paesContentStatus || 'unknown')}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={checkDatabaseStatus}
          disabled={isLoading || isLoadingPAES}
          className="flex-1 min-w-[150px]"
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
          disabled={isLoading || isLoadingPAES || !user}
          className="flex-1 min-w-[150px]"
          title={!user ? "Debes iniciar sesiÃ³n para inicializar los nodos" : ""}
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Inicializando...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Inicializar Nodos Base
            </>
          )}
        </Button>
        
        <Button
          onClick={initializePAESContent}
          disabled={isLoading || isLoadingPAES || !user || status.learningNodes === 'empty'}
          variant="secondary"
          className="flex-1 min-w-[150px]"
          title={!user ? "Debes iniciar sesiÃ³n para inicializar el contenido PAES" : (status.learningNodes === 'empty' ? "Debes inicializar los nodos base primero" : "")}
        >
          {isLoadingPAES ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Inicializando PAES...
            </>
          ) : (
            <>
              <BookOpen className="mr-2 h-4 w-4" />
              Inicializar Contenido PAES
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

(...args: unknown[]) => unknown getStatusDescription(tableType: string, status: 'loading' | 'empty' | 'populated' | 'error' | 'unknown'): string {
  const descriptions: Record<string, Record<string, string>> = {
    learningNodes: {
      empty: "No hay nodos de aprendizaje cargados",
      populated: "Nodos de aprendizaje cargados correctamente",
      error: "Error al cargar los nodos de aprendizaje",
      loading: "Verificando nodos de aprendizaje...",
      unknown: "Estado de nodos desconocido"
    },
    paesSkills: {
      empty: "No hay habilidades PAES cargadas",
      populated: "Habilidades PAES cargadas correctamente",
      error: "Error al cargar las habilidades PAES",
      loading: "Verificando habilidades PAES...",
      unknown: "Estado de habilidades desconocido"
    },
    paesTests: {
      empty: "No hay pruebas PAES cargadas",
      populated: "Pruebas PAES cargadas correctamente",
      error: "Error al cargar las pruebas PAES",
      loading: "Verificando pruebas PAES...",
      unknown: "Estado de pruebas desconocido"
    },
    paesContent: {
      empty: "No hay contenido PAES cargado",
      populated: "Contenido PAES cargado correctamente",
      error: "Error al cargar el contenido PAES",
      loading: "Verificando contenido PAES...",
      unknown: "Estado del contenido PAES desconocido"
    }
  };

  return descriptions[tableType]?.[status] || "Estado desconocido";
}

interface StatusCardProps {
  title: string;
  status: 'loading' | 'empty' | 'populated' | 'error' | 'unknown';
  description?: string;
}

(...args: unknown[]) => unknown StatusCard({ title, status, description }: StatusCardProps) {
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
      {description && <div className="text-xs text-muted-foreground mt-1">{description}</div>}
    </div>
  );
}


