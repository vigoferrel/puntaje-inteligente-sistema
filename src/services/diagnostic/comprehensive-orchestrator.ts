
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticTest } from "@/types/diagnostic";
import { TPAESPrueba } from "@/types/system-types";
import { generateDiagnosticTest } from "@/services/diagnostic-generator";
import { toast } from "@/components/ui/use-toast";

export interface ComprehensiveSystemData {
  diagnosticTests: DiagnosticTest[];
  officialExercises: any[];
  paesSkills: any[];
  systemMetrics: {
    totalNodes: number;
    completedNodes: number;
    availableTests: number;
    isSystemReady: boolean;
  };
  isLoading: boolean;
}

export class ComprehensiveDiagnosticOrchestrator {
  private userId: string;
  private cache: Map<string, any> = new Map();

  constructor(userId: string) {
    this.userId = userId;
  }

  async initializeSystem(): Promise<ComprehensiveSystemData> {
    try {
      console.log('🚀 Inicializando sistema diagnóstico integral...');
      
      // Load all resources in parallel
      const [diagnostics, exercises, skills, nodes] = await Promise.all([
        this.loadOrCreateDiagnostics(),
        this.loadOfficialExercises(),
        this.loadPAESSkills(),
        this.loadLearningNodes()
      ]);

      const systemMetrics = {
        totalNodes: nodes.length,
        completedNodes: Math.floor(nodes.length * 0.3), // Simulated progress
        availableTests: diagnostics.length,
        isSystemReady: diagnostics.length > 0
      };

      console.log(`✅ Sistema inicializado: ${diagnostics.length} diagnósticos, ${exercises.length} ejercicios oficiales`);

      return {
        diagnosticTests: diagnostics,
        officialExercises: exercises,
        paesSkills: skills,
        systemMetrics,
        isLoading: false
      };
    } catch (error) {
      console.error('❌ Error inicializando sistema:', error);
      throw error;
    }
  }

  private async loadOrCreateDiagnostics(): Promise<DiagnosticTest[]> {
    // First, try to load existing diagnostics
    const { data: existingDiagnostics } = await supabase
      .from('diagnostic_tests')
      .select('*')
      .limit(10);

    if (existingDiagnostics && existingDiagnostics.length > 0) {
      console.log(`📋 Cargados ${existingDiagnostics.length} diagnósticos existentes`);
      return existingDiagnostics.map(d => ({
        id: d.id,
        title: d.title,
        description: d.description || '',
        testId: d.test_id,
        questions: [],
        isCompleted: false
      }));
    }

    // If no diagnostics exist, create them automatically
    console.log('🔧 Generando diagnósticos automáticamente...');
    const createdDiagnostics = await this.createDefaultDiagnostics();
    return createdDiagnostics;
  }

  private async createDefaultDiagnostics(): Promise<DiagnosticTest[]> {
    const diagnosticsToCreate = [
      { testId: 1, title: 'Diagnóstico Comprensión Lectora', description: 'Evaluación inicial de habilidades de comprensión lectora' },
      { testId: 2, title: 'Diagnóstico Matemática M1', description: 'Evaluación de conocimientos matemáticos básicos' },
      { testId: 3, title: 'Diagnóstico Matemática M2', description: 'Evaluación de matemáticas avanzadas' },
      { testId: 4, title: 'Diagnóstico Historia', description: 'Evaluación de conocimientos históricos' },
      { testId: 5, title: 'Diagnóstico Ciencias', description: 'Evaluación de competencias científicas' }
    ];

    const createdDiagnostics: DiagnosticTest[] = [];

    for (const diagnostic of diagnosticsToCreate) {
      try {
        const diagnosticId = await generateDiagnosticTest(
          diagnostic.testId,
          diagnostic.title,
          diagnostic.description
        );

        if (diagnosticId) {
          createdDiagnostics.push({
            id: diagnosticId,
            title: diagnostic.title,
            description: diagnostic.description,
            testId: diagnostic.testId,
            questions: [],
            isCompleted: false
          });
        }
      } catch (error) {
        console.warn(`⚠️ No se pudo generar diagnóstico para test ${diagnostic.testId}:`, error);
      }
    }

    if (createdDiagnostics.length === 0) {
      // Create fallback local diagnostics
      console.log('🔄 Creando diagnósticos fallback locales...');
      return this.createFallbackDiagnostics();
    }

    console.log(`✅ Creados ${createdDiagnostics.length} nuevos diagnósticos`);
    return createdDiagnostics;
  }

  private createFallbackDiagnostics(): DiagnosticTest[] {
    return [
      {
        id: 'fallback-cl',
        title: 'Diagnóstico Comprensión Lectora',
        description: 'Evaluación rápida de comprensión lectora',
        testId: 1,
        questions: [],
        isCompleted: false
      },
      {
        id: 'fallback-m1',
        title: 'Diagnóstico Matemática Básica',
        description: 'Evaluación de matemáticas fundamentales',
        testId: 2,
        questions: [],
        isCompleted: false
      }
    ];
  }

  private async loadOfficialExercises(): Promise<any[]> {
    try {
      const { data: exercises } = await supabase
        .from('examenes')
        .select('*')
        .limit(20);

      return exercises || [];
    } catch (error) {
      console.warn('⚠️ No se pudieron cargar ejercicios oficiales:', error);
      return [];
    }
  }

  private async loadPAESSkills(): Promise<any[]> {
    try {
      const { data: skills } = await supabase
        .from('paes_skills')
        .select('*');

      return skills || [];
    } catch (error) {
      console.warn('⚠️ No se pudieron cargar habilidades PAES:', error);
      return [];
    }
  }

  private async loadLearningNodes(): Promise<any[]> {
    try {
      const { data: nodes } = await supabase
        .from('learning_nodes')
        .select('*')
        .limit(100);

      return nodes || [];
    } catch (error) {
      console.warn('⚠️ No se pudieron cargar nodos de aprendizaje:', error);
      return [];
    }
  }

  async startQuantumDiagnostic(): Promise<boolean> {
    try {
      console.log('🔬 Iniciando diagnóstico cuántico...');
      
      toast({
        title: "Iniciando Diagnóstico Cuántico",
        description: "Preparando evaluación personalizada...",
      });

      // Simulate quantum diagnostic initialization
      await new Promise(resolve => setTimeout(resolve, 2000));

      return true;
    } catch (error) {
      console.error('❌ Error iniciando diagnóstico cuántico:', error);
      toast({
        title: "Error",
        description: "No se pudo iniciar el diagnóstico cuántico",
        variant: "destructive"
      });
      return false;
    }
  }
}
