
import React from 'react';
import { usePAESCienciasGenerator } from '@/hooks/use-paes-ciencias-generator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Microscope, Flask, Atom, Brain, BookOpen, Target, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export const PAESCienciasControl: React.FC = () => {
  const {
    loading,
    diagnosticoActual,
    ejerciciosActuales,
    faseActual,
    generarDiagnostico,
    generarEjerciciosCiclo,
    avanzarFase,
    exportarResultados,
    obtenerEstadisticas,
    reiniciarEstado
  } = usePAESCienciasGenerator();

  const [areaSeleccionada, setAreaSeleccionada] = useState<string>('Biología');
  const [cantidadPreguntas, setCantidadPreguntas] = useState<number>(15);

  const estadisticas = obtenerEstadisticas();

  const iconosArea = {
    'Biología': Microscope,
    'Física': Atom,
    'Química': Flask
  };

  const getProgresoPorcentaje = () => {
    const fases = ['explorar', 'explicar', 'aplicar', 'evaluar'];
    const indiceActual = fases.indexOf(faseActual);
    return ((indiceActual + 1) / fases.length) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            PAES Ciencias - Generador de Diagnósticos y Ejercicios
          </CardTitle>
          <CardDescription>
            Sistema completo basado en PAES Ciencias Técnico Profesional 2024 - Forma 183
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="diagnostico" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="diagnostico">Diagnóstico</TabsTrigger>
          <TabsTrigger value="ejercicios">Ejercicios por Ciclo</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
        </TabsList>

        {/* Pestaña de Diagnóstico */}
        <TabsContent value="diagnostico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generar Diagnóstico</CardTitle>
              <CardDescription>
                Crea un diagnóstico personalizado basado en preguntas oficiales PAES 2024
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cantidad de Preguntas</label>
                  <Select 
                    value={cantidadPreguntas.toString()} 
                    onValueChange={(value) => setCantidadPreguntas(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 preguntas</SelectItem>
                      <SelectItem value="15">15 preguntas</SelectItem>
                      <SelectItem value="20">20 preguntas</SelectItem>
                      <SelectItem value="25">25 preguntas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Áreas a Incluir</label>
                  <div className="flex gap-2">
                    {['Biología', 'Física', 'Química'].map(area => {
                      const Icon = iconosArea[area as keyof typeof iconosArea];
                      return (
                        <Badge key={area} variant="secondary" className="flex items-center gap-1">
                          <Icon className="h-3 w-3" />
                          {area}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => generarDiagnostico(cantidadPreguntas, ['Biología', 'Física', 'Química'])}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Generando...' : 'Generar Diagnóstico'}
              </Button>

              {diagnosticoActual && (
                <Card className="mt-4">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{diagnosticoActual.metadatos.titulo}</h4>
                        <p className="text-sm text-muted-foreground">
                          {diagnosticoActual.preguntas.length} preguntas generadas
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => exportarResultados(diagnosticoActual.diagnosticoId)}
                        disabled={loading}
                      >
                        Exportar Resultados
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Ejercicios por Ciclo */}
        <TabsContent value="ejercicios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ciclo de Aprendizaje</CardTitle>
              <CardDescription>
                Genera ejercicios adaptativos según la fase del ciclo de aprendizaje
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progreso del Ciclo */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progreso del Ciclo</span>
                  <span className="text-sm text-muted-foreground">
                    Fase: {faseActual}
                  </span>
                </div>
                <Progress value={getProgresoPorcentaje()} className="h-2" />
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {['explorar', 'explicar', 'aplicar', 'evaluar'].map(fase => (
                    <div 
                      key={fase}
                      className={`text-center p-2 rounded ${
                        fase === faseActual ? 'bg-primary text-primary-foreground' :
                        estadisticas.progresoCiclo[fase as keyof typeof estadisticas.progresoCiclo] === 'completado' ? 
                        'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {fase.charAt(0).toUpperCase() + fase.slice(1)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Selección de Área */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Área de Ciencias</label>
                <Select value={areaSeleccionada} onValueChange={setAreaSeleccionada}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Biología">
                      <div className="flex items-center gap-2">
                        <Microscope className="h-4 w-4" />
                        Biología
                      </div>
                    </SelectItem>
                    <SelectItem value="Física">
                      <div className="flex items-center gap-2">
                        <Atom className="h-4 w-4" />
                        Física
                      </div>
                    </SelectItem>
                    <SelectItem value="Química">
                      <div className="flex items-center gap-2">
                        <Flask className="h-4 w-4" />
                        Química
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Botones de Acción */}
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => generarEjerciciosCiclo(areaSeleccionada, faseActual)}
                  disabled={loading}
                  variant="outline"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Generar Ejercicios
                </Button>
                
                <Button 
                  onClick={() => avanzarFase(areaSeleccionada)}
                  disabled={loading || faseActual === 'evaluar'}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Siguiente Fase
                </Button>
              </div>

              {/* Ejercicios Actuales */}
              {ejerciciosActuales.length > 0 && (
                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-2">
                      Ejercicios Generados - Fase: {faseActual}
                    </h4>
                    <div className="space-y-2">
                      {ejerciciosActuales.slice(0, 3).map((ejercicio, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">
                            {ejercicio.question?.substring(0, 100)}...
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">{ejercicio.area}</Badge>
                            <Badge variant="outline">{ejercicio.difficulty}</Badge>
                          </div>
                        </div>
                      ))}
                      {ejerciciosActuales.length > 3 && (
                        <p className="text-sm text-muted-foreground">
                          Y {ejerciciosActuales.length - 3} ejercicios más...
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Estadísticas */}
        <TabsContent value="estadisticas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Diagnósticos Generados
                    </p>
                    <p className="text-2xl font-bold">
                      {diagnosticoActual ? 1 : 0}
                    </p>
                  </div>
                  <Brain className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Ejercicios Disponibles
                    </p>
                    <p className="text-2xl font-bold">
                      {ejerciciosActuales.length}
                    </p>
                  </div>
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Progreso del Ciclo
                    </p>
                    <p className="text-2xl font-bold">
                      {Math.round(getProgresoPorcentaje())}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={reiniciarEstado}
                  className="w-full"
                >
                  Reiniciar Estado
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => generarDiagnostico(15)}
                  disabled={loading}
                  className="w-full"
                >
                  Generar Diagnóstico Rápido
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
