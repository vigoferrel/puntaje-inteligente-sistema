
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { DiagnosticSkeleton } from "@/components/diagnostic/DiagnosticSkeleton";
import { DiagnosticSelector } from "@/components/diagnostic/DiagnosticSelector";
import { TestResultView } from "@/components/diagnostic/TestResultView";
import { TestRunner } from "@/components/diagnostic/TestRunner";
import { PausedTestBanner } from "@/components/diagnostic/PausedTestBanner";
import { PauseConfirmationDialog } from "@/components/diagnostic/PauseConfirmationDialog";
import { DiagnosticController } from "@/components/diagnostic/DiagnosticController";
import { DiagnosticErrorView } from "@/components/diagnostic/DiagnosticErrorView"; 
import { SkillCompetencyView } from "@/components/diagnostic/SkillCompetencyView";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DetailedResultView } from "@/components/diagnostic/DetailedResultView";
import { RefreshCw, CheckCircle2, Brain, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { useLearningNodes } from "@/hooks/use-learning-nodes";
import { useAuth } from "@/contexts/AuthContext";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Diagnostico = () => {
  console.log("Renderizando página de Diagnóstico");
  const [activeTab, setActiveTab] = useState<string>("competency");
  const { nodes, loading: nodesLoading, fetchLearningNodes } = useLearningNodes();
  const { profile } = useAuth();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState("Inicializando");
  
  // Simular progreso de carga
  useEffect(() => {
    if (loadingProgress < 100) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = Math.min(prev + 5, 100);
          if (newProgress > 30 && newProgress < 60) {
            setLoadingStep("Cargando ejercicios");
          } else if (newProgress >= 60) {
            setLoadingStep("Preparando interfaz");
          }
          return newProgress;
        });
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [loadingProgress]);
  
  // Datos para simular las competencias por habilidad
  // En una implementación real, estos datos vendrían de la API
  const [skillCompetencies, setSkillCompetencies] = useState<Record<TPAESPrueba, {skill: TPAESHabilidad, level: number, hasCompletedDiagnostic: boolean}[]>>({
    'MATEMATICA_1': [
      { skill: 'SOLVE_PROBLEMS', level: 0.65, hasCompletedDiagnostic: true },
      { skill: 'REPRESENT', level: 0.5, hasCompletedDiagnostic: true },
      { skill: 'MODEL', level: 0.72, hasCompletedDiagnostic: true },
      { skill: 'ARGUE_COMMUNICATE', level: 0.45, hasCompletedDiagnostic: true }
    ],
    'MATEMATICA_2': [
      { skill: 'SOLVE_PROBLEMS', level: 0, hasCompletedDiagnostic: false },
      { skill: 'REPRESENT', level: 0, hasCompletedDiagnostic: false },
      { skill: 'MODEL', level: 0, hasCompletedDiagnostic: false },
      { skill: 'ARGUE_COMMUNICATE', level: 0, hasCompletedDiagnostic: false }
    ],
    'COMPETENCIA_LECTORA': [
      { skill: 'INTERPRET_RELATE', level: 0.8, hasCompletedDiagnostic: true },
      { skill: 'EVALUATE_REFLECT', level: 0.6, hasCompletedDiagnostic: true },
      { skill: 'TRACK_LOCATE', level: 0.75, hasCompletedDiagnostic: true }
    ],
    'CIENCIAS': [
      { skill: 'IDENTIFY_THEORIES', level: 0, hasCompletedDiagnostic: false },
      { skill: 'PROCESS_ANALYZE', level: 0, hasCompletedDiagnostic: false },
      { skill: 'SCIENTIFIC_ARGUMENT', level: 0, hasCompletedDiagnostic: false }
    ],
    'HISTORIA': [
      { skill: 'TEMPORAL_THINKING', level: 0.2, hasCompletedDiagnostic: true },
      { skill: 'SOURCE_ANALYSIS', level: 0.3, hasCompletedDiagnostic: true },
      { skill: 'CRITICAL_THINKING', level: 0.35, hasCompletedDiagnostic: true }
    ]
  });
  
  // Cargar nodos de aprendizaje
  useEffect(() => {
    if (profile) {
      fetchLearningNodes();
    }
  }, [profile, fetchLearningNodes]);
  
  const handleNavigateToTest = (prueba: TPAESPrueba) => {
    setActiveTab("tests");
    // Aquí podrías también preseleccionar un test específico basado en la prueba
  };
  
  const handleSelectNode = (nodeId: string) => {
    console.log("Nodo seleccionado:", nodeId);
    // Aquí podrías redirigir al detalle del nodo o iniciar un diagnóstico específico
  };
  
  // Función para convertir cualquier resultado a un Record<TPAESHabilidad, number> completo
  const getSkillResults = (result: any): Record<TPAESHabilidad, number> => {
    // Inicializar valores por defecto
    const defaultResults: Record<TPAESHabilidad, number> = {
      SOLVE_PROBLEMS: 0,
      REPRESENT: 0,
      MODEL: 0,
      INTERPRET_RELATE: 0,
      EVALUATE_REFLECT: 0,
      TRACK_LOCATE: 0,
      ARGUE_COMMUNICATE: 0,
      IDENTIFY_THEORIES: 0,
      PROCESS_ANALYZE: 0,
      APPLY_PRINCIPLES: 0,
      SCIENTIFIC_ARGUMENT: 0,
      TEMPORAL_THINKING: 0,
      SOURCE_ANALYSIS: 0,
      MULTICAUSAL_ANALYSIS: 0,
      CRITICAL_THINKING: 0,
      REFLECTION: 0
    };
    
    // Si no hay resultado o es un objeto vacío, devolver los valores por defecto
    if (!result || Object.keys(result).length === 0) {
      return defaultResults;
    }
    
    // Si hay resultados existentes, combinarlos con los valores predeterminados
    if (result.results && typeof result.results === 'object') {
      return { ...defaultResults, ...result.results };
    }
    
    // Si el objeto ya es un Record de habilidades, combinarlo con los valores predeterminados
    if (typeof result === 'object') {
      return { ...defaultResults, ...result };
    }
    
    return defaultResults;
  };
  
  return (
    <AppLayout>
      <DiagnosticController>
        {({ 
          tests, 
          loading,
          initializing,
          generatingDiagnostic,
          currentTest,
          selectedTestId,
          testStarted,
          currentQuestionIndex,
          answers,
          resultSubmitted,
          showHint,
          testResults,
          pausedProgress,
          showPauseConfirmation,
          error,
          handleTestSelect,
          handleStartTest,
          handleResumeTest,
          handleDiscardProgress,
          handlePauseTest,
          confirmPauseTest,
          handleAnswerSelect,
          handleRequestHint,
          handlePreviousQuestion,
          handleNextQuestion,
          handleFinishTest,
          handleRestartDiagnostic,
          handleRetryInitialization,
          retryCount
        }) => {
          console.log("Estado actual:", { 
            loading, 
            initializing,
            generatingDiagnostic,
            testStarted, 
            resultSubmitted,
            testsCount: tests.length,
            error,
            retryCount
          });
          
          // Determine what message to show during loading
          let loadingMessage = "Cargando diagnósticos...";
          if (initializing) {
            loadingMessage = "Inicializando diagnósticos. Por favor espera...";
          } else if (generatingDiagnostic) {
            loadingMessage = "Cargando diagnóstico básico...";
          }
          
          // Si el test ha comenzado o está mostrando resultados, mostramos esa vista
          if (testStarted || resultSubmitted) {
            return (
              <div className="container py-8">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild><Link to="/">Inicio</Link></BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild><Link to="/diagnostico">Diagnóstico</Link></BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink>{resultSubmitted ? "Resultados" : "Test en progreso"}</BreadcrumbLink>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                
                <div className="my-4">
                  <h1 className="text-3xl font-bold mb-2">Diagnóstico</h1>
                  <p className="text-gray-600 mb-6">
                    Evalúa tus conocimientos y habilidades para crear un plan de estudio personalizado.
                  </p>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {resultSubmitted ? (
                    <DetailedResultView 
                      onRestartDiagnostic={handleRestartDiagnostic} 
                      results={getSkillResults(testResults)}
                      completedAt={testResults?.completedAt}
                    />
                  ) : (
                    <TestRunner 
                      currentTest={currentTest}
                      currentQuestionIndex={currentQuestionIndex}
                      answers={answers}
                      showHint={showHint}
                      onAnswerSelect={handleAnswerSelect}
                      onRequestHint={handleRequestHint}
                      onPreviousQuestion={handlePreviousQuestion}
                      onNextQuestion={handleNextQuestion}
                      onPauseTest={handlePauseTest}
                      onFinishTest={handleFinishTest}
                    />
                  )}
                </motion.div>
  
                <PauseConfirmationDialog 
                  open={showPauseConfirmation} 
                  onOpenChange={(open) => {
                    if (!open) {
                      console.log("Diálogo de pausa cerrado sin confirmar");
                    }
                  }}
                  onConfirm={confirmPauseTest} 
                />
              </div>
            );
          }
          
          // Vista principal con pestañas
          return (
            <div className="container py-8">
              <Breadcrumb className="mb-4">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild><Link to="/">Inicio</Link></BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink>Diagnóstico</BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                  <Brain className="h-8 w-8 text-primary" />
                  Diagnóstico por Competencias
                </h1>
                <p className="text-gray-600 mb-6">
                  Evalúa tus conocimientos y habilidades para crear un plan de estudio personalizado.
                </p>
              </motion.div>
              
              <Alert className="mb-6 bg-blue-50 border-blue-100">
                <Info className="h-4 w-4 text-blue-500" />
                <AlertTitle>Diagnósticos por Competencias</AlertTitle>
                <AlertDescription>
                  Los diagnósticos evalúan tus habilidades por cada competencia PAES. Descubre tu nivel actual y recibe recomendaciones 
                  personalizadas para mejorar en cada área.
                </AlertDescription>
              </Alert>
              
              {pausedProgress && tests.length > 0 && tests.some(test => test.id === pausedProgress.testId) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <PausedTestBanner 
                    testProgress={pausedProgress}
                    test={tests.find(test => test.id === pausedProgress.testId)!}
                    onResumeTest={handleResumeTest}
                    onDiscardProgress={handleDiscardProgress}
                  />
                </motion.div>
              )}
              
              {loading || error ? (
                error ? (
                  <DiagnosticErrorView 
                    error={error}
                    message="Esto puede deberse a una conexión inestable o a un problema temporal con el sistema. Por favor, intenta nuevamente."
                    onRetry={handleRetryInitialization}
                    retryCount={retryCount}
                  />
                ) : (
                  <DiagnosticSkeleton 
                    message={loadingMessage} 
                    generating={generatingDiagnostic} 
                    progress={loadingProgress}
                    step={loadingStep}
                  />
                )
              ) : (
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full mb-6">
                    <TabsTrigger value="competency" className="flex-1 gap-2">
                      <Brain className="h-4 w-4" />
                      Competencias por Prueba
                    </TabsTrigger>
                    <TabsTrigger value="tests" className="flex-1 gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Pruebas Diagnósticas
                    </TabsTrigger>
                  </TabsList>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TabsContent value="competency" className="space-y-6">
                      <SkillCompetencyView 
                        skillLevels={skillCompetencies}
                        availableNodes={nodes.map(node => ({
                          id: node.id,
                          title: node.title,
                          description: node.description,
                          skill: node.skill,
                          difficulty: node.difficulty,
                          estimatedTimeMinutes: node.estimatedTimeMinutes,
                          dependsOn: node.dependsOn || [],
                          progress: Math.random() // En una implementación real, esto vendría de user_node_progress
                        }))}
                        onStartDiagnostic={handleNavigateToTest}
                        onSelectNode={handleSelectNode}
                        loading={nodesLoading}
                      />
                    </TabsContent>
                    
                    <TabsContent value="tests">
                      {tests.length > 0 ? (
                        <DiagnosticSelector 
                          tests={tests}
                          selectedTestId={selectedTestId}
                          onTestSelect={handleTestSelect}
                          onStartTest={handleStartTest}
                          loading={loading}
                        />
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-center p-8 border rounded-lg bg-background"
                        >
                          <div className="flex justify-center mb-4">
                            <div className="rounded-full bg-blue-50 p-3">
                              <Brain className="h-10 w-10 text-blue-600" />
                            </div>
                          </div>
                          <h3 className="text-xl font-medium mb-2">No hay diagnósticos disponibles</h3>
                          <p className="text-muted-foreground mb-4">
                            No se encontraron pruebas diagnósticas. Puede deberse a un problema de conexión o que aún no se han configurado.
                          </p>
                          <Button 
                            onClick={handleRetryInitialization}
                            className="flex items-center gap-2"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Reintentar
                          </Button>
                        </motion.div>
                      )}
                    </TabsContent>
                  </motion.div>
                </Tabs>
              )}
            </div>
          );
        }}
      </DiagnosticController>
    </AppLayout>
  );
};

export default Diagnostico;
