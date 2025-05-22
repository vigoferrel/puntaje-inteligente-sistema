
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, PlusCircle, FileText, ListChecks } from "lucide-react";
import { useDiagnosticGenerator } from "@/hooks/use-diagnostic-generator";
import { DiagnosticTest } from "@/types/diagnostic";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const GeneradorDiagnostico = () => {
  const [selectedTestId, setSelectedTestId] = useState<number | undefined>(undefined);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [tests, setTests] = useState<{id: number, name: string}[]>([]);
  const [loadingTests, setLoadingTests] = useState(true);
  
  const { 
    loading, 
    diagnostics, 
    generateFullDiagnostic, 
    loadDiagnostics 
  } = useDiagnosticGenerator();
  
  // Cargar los tests disponibles
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoadingTests(true);
        const { data, error } = await supabase
          .from('paes_tests')
          .select('id, name');
        
        if (error) throw error;
        
        setTests(data || []);
      } catch (error) {
        console.error('Error al cargar tests:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los tests disponibles",
          variant: "destructive"
        });
      } finally {
        setLoadingTests(false);
      }
    };
    
    fetchTests();
  }, []);
  
  // Cargar diagnósticos cuando cambie el test seleccionado
  useEffect(() => {
    if (selectedTestId) {
      loadDiagnostics(selectedTestId);
    }
  }, [selectedTestId, loadDiagnostics]);
  
  // Manejar la creación de un nuevo diagnóstico
  const handleCreateDiagnostic = async () => {
    if (!selectedTestId) {
      toast({
        title: "Error",
        description: "Selecciona un tipo de test primero",
        variant: "destructive"
      });
      return;
    }
    
    const diagnosticId = await generateFullDiagnostic(
      selectedTestId,
      selectedTitle || undefined,
      selectedDescription || undefined
    );
    
    if (diagnosticId) {
      // Limpiar campos
      setSelectedTitle("");
      setSelectedDescription("");
      
      toast({
        title: "Éxito",
        description: "Diagnóstico creado correctamente",
      });
    }
  };
  
  return (
    <AppLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Generador de Diagnósticos</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel izquierdo: Selección y creación */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Crear Nuevo Diagnóstico</CardTitle>
                <CardDescription>
                  Selecciona un tipo de test y proporciona un título y descripción para generar un diagnóstico completo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="test-type">Tipo de Test</Label>
                  <Select 
                    value={selectedTestId?.toString()} 
                    onValueChange={(value) => setSelectedTestId(Number(value))}
                    disabled={loadingTests}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo de test" />
                    </SelectTrigger>
                    <SelectContent>
                      {tests.map((test) => (
                        <SelectItem key={test.id} value={test.id.toString()}>
                          {test.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Título del Diagnóstico</Label>
                  <Input
                    id="title"
                    placeholder="Título del diagnóstico"
                    value={selectedTitle}
                    onChange={(e) => setSelectedTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Descripción del diagnóstico"
                    rows={4}
                    value={selectedDescription}
                    onChange={(e) => setSelectedDescription(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleCreateDiagnostic} 
                  disabled={loading || !selectedTestId}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Crear Diagnóstico
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Panel derecho: Lista de diagnósticos */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Diagnósticos Existentes</CardTitle>
                <CardDescription>
                  {selectedTestId 
                    ? `Diagnósticos disponibles para el test seleccionado` 
                    : 'Selecciona un tipo de test para ver los diagnósticos disponibles'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : diagnostics.length > 0 ? (
                  <div className="space-y-4">
                    {diagnostics.map((diagnostic) => (
                      <Card key={diagnostic.id} className="bg-background/50">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{diagnostic.title}</CardTitle>
                            <Badge variant="outline">
                              {diagnostic.questions ? diagnostic.questions.length : 0} ejercicios
                            </Badge>
                          </div>
                          <CardDescription>
                            {diagnostic.description || 'Sin descripción'}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-2 flex justify-between">
                          <Button variant="secondary" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Ver Detalles
                          </Button>
                          <Button variant="outline" size="sm">
                            <ListChecks className="mr-2 h-4 w-4" />
                            Ver Ejercicios
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {selectedTestId 
                      ? 'No hay diagnósticos disponibles para este test. Crea uno nuevo.' 
                      : 'Selecciona un tipo de test para ver los diagnósticos disponibles'}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default GeneradorDiagnostico;
