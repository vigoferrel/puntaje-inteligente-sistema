
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DiagnosticTest } from "@/types/diagnostic";
import { TPAESPrueba, TPAESHabilidad, getPruebaDisplayName, getHabilidadDisplayName } from "@/types/system-types";
import { BookOpen, Calculator, FlaskConical, Globe, Brain, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DiagnosticSelectorProps {
  tests: DiagnosticTest[];
  selectedTestId: string | null;
  onTestSelect: (testId: string) => void;
  onStartTest: () => void;
  loading: boolean;
}

// Helper para obtener el icono basado en la prueba
const getTestIcon = (testId: number) => {
  switch (testId) {
    case 1:
      return <BookOpen className="w-5 h-5 text-blue-600" />;
    case 2:
      return <Calculator className="w-5 h-5 text-purple-600" />;
    case 3:
      return <Calculator className="w-5 h-5 text-indigo-600" />;
    case 4:
      return <FlaskConical className="w-5 h-5 text-green-600" />;
    case 5:
      return <Globe className="w-5 h-5 text-amber-600" />;
    default:
      return <BookOpen className="w-5 h-5 text-gray-500" />;
  }
};

// Agrupar diagnósticos por tipo de prueba
const groupTestsByType = (tests: DiagnosticTest[]): Record<number, DiagnosticTest[]> => {
  return tests.reduce((acc, test) => {
    if (!acc[test.testId]) {
      acc[test.testId] = [];
    }
    acc[test.testId].push(test);
    return acc;
  }, {} as Record<number, DiagnosticTest[]>);
};

export const DiagnosticSelector = ({
  tests,
  selectedTestId,
  onTestSelect,
  onStartTest,
  loading,
}: DiagnosticSelectorProps) => {
  const groupedTests = groupTestsByType(tests);
  const testTypes = Object.keys(groupedTests).map(Number);
  const defaultTab = testTypes.length > 0 ? testTypes[0].toString() : "1";

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 animate-pulse rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 bg-gray-200 animate-pulse rounded-md" />
          <div className="h-40 bg-gray-200 animate-pulse rounded-md" />
        </div>
      </div>
    );
  }

  if (tests.length === 0) {
    return (
      <Card className="text-center p-6">
        <CardTitle className="mb-4">No hay diagnósticos disponibles</CardTitle>
        <CardDescription>
          No se encontraron pruebas diagnósticas. Inténtalo nuevamente más tarde.
        </CardDescription>
      </Card>
    );
  }

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="mb-4 w-full justify-start overflow-x-auto">
        {testTypes.map((testType) => (
          <TabsTrigger key={testType} value={testType.toString()} className="flex items-center gap-2">
            {getTestIcon(testType)}
            <span>{getPruebaDisplayName(testType as unknown as TPAESPrueba)}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      
      {testTypes.map((testType) => (
        <TabsContent key={testType} value={testType.toString()} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {groupedTests[testType].map((test) => (
              <motion.div 
                key={test.id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className={cn(
                    "cursor-pointer transition-transform h-full",
                    selectedTestId === test.id && "ring-2 ring-primary ring-offset-2"
                  )}
                  onClick={() => onTestSelect(test.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{test.title}</CardTitle>
                        <CardDescription>{test.description}</CardDescription>
                      </div>
                      {getTestIcon(test.testId)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>{test.questions.length} preguntas</span>
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          test.isCompleted 
                            ? "bg-green-100 text-green-800" 
                            : "bg-blue-100 text-blue-800"
                        )}>
                          {test.isCompleted ? "Completado" : "Pendiente"}
                        </span>
                      </div>
                      <p className="mt-1">Tiempo estimado: {Math.ceil(test.questions.length * 2 / 10) * 10} minutos</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant={test.isCompleted ? "outline" : "default"}
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTestSelect(test.id);
                        onStartTest();
                      }}
                    >
                      {test.isCompleted ? 'Repetir diagnóstico' : 'Comenzar diagnóstico'}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {selectedTestId && groupedTests[testType].some(t => t.id === selectedTestId) && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-end mt-4"
            >
              <Button onClick={onStartTest} size="lg" className="gap-2">
                Comenzar diagnóstico seleccionado
                <Brain className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};
