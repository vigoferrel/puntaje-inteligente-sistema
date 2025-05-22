
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, PlusCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface DiagnosticoFormProps {
  tests: { id: number; name: string }[];
  loading: boolean;
  loadingTests: boolean;
  onCreateDiagnostic: (testId: number, title: string, description: string) => Promise<void>;
}

export const DiagnosticoForm = ({ 
  tests, 
  loading, 
  loadingTests, 
  onCreateDiagnostic 
}: DiagnosticoFormProps) => {
  const [selectedTestId, setSelectedTestId] = useState<number | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateDiagnostic = async () => {
    if (!selectedTestId) {
      toast({
        title: "Error",
        description: "Selecciona un tipo de test primero",
        variant: "destructive"
      });
      return;
    }
    
    await onCreateDiagnostic(selectedTestId, title, description);
    
    // Limpiar campos
    setTitle("");
    setDescription("");
  };

  return (
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            placeholder="Descripción del diagnóstico"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
  );
};
