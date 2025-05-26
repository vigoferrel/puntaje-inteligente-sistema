
import { useState, useEffect, useCallback } from 'react';
import { RealExamDiagnosticGenerator } from '@/services/diagnostic/real-exam-diagnostic-generator';
import { DiagnosticTest } from '@/types/diagnostic';
import { useAuth } from '@/contexts/AuthContext';

export interface ExamInfo {
  examCode: string;
  title: string;
  description: string;
  year: number;
  totalQuestions: number;
  isOfficial: boolean;
  status: 'available' | 'loading' | 'error';
}

export const useRealExamDiagnostics = () => {
  const { user } = useAuth();
  const [availableExams, setAvailableExams] = useState<ExamInfo[]>([]);
  const [diagnostics, setDiagnostics] = useState<DiagnosticTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar exámenes oficiales disponibles
  const loadAvailableExams = useCallback(async () => {
    try {
      setLoading(true);
      
      const examsList: ExamInfo[] = [
        {
          examCode: 'PAES-2024-FORM-103',
          title: 'Comprensión Lectora PAES 2024',
          description: 'Examen oficial de Competencia Lectora',
          year: 2024,
          totalQuestions: 65,
          isOfficial: true,
          status: 'available'
        },
        {
          examCode: 'MATEMATICA_M1_2024_FORMA_123',
          title: 'Matemática M1 PAES 2024',
          description: 'Examen oficial de Matemática M1',
          year: 2024,
          totalQuestions: 65,
          isOfficial: true,
          status: 'available'
        },
        {
          examCode: 'MATEMATICA_M2_2024_FORMA_456',
          title: 'Matemática M2 PAES 2024',
          description: 'Examen oficial de Matemática M2',
          year: 2024,
          totalQuestions: 65,
          isOfficial: true,
          status: 'available'
        },
        {
          examCode: 'CIENCIAS_2024_FORMA_789',
          title: 'Ciencias PAES 2024',
          description: 'Examen oficial de Ciencias',
          year: 2024,
          totalQuestions: 80,
          isOfficial: true,
          status: 'available'
        },
        {
          examCode: 'HISTORIA_2024_FORMA_123',
          title: 'Historia PAES 2024',
          description: 'Examen oficial de Historia y Ciencias Sociales',
          year: 2024,
          totalQuestions: 65,
          isOfficial: true,
          status: 'available'
        }
      ];

      setAvailableExams(examsList);
      console.log('📚 Exámenes oficiales cargados:', examsList.length);
    } catch (err) {
      console.error('Error cargando exámenes:', err);
      setError('Error al cargar exámenes oficiales');
    } finally {
      setLoading(false);
    }
  }, []);

  // Generar todos los diagnósticos reales
  const generateAllDiagnostics = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      console.log('🔬 Generando diagnósticos desde exámenes reales...');
      
      const realDiagnostics = await RealExamDiagnosticGenerator.generateAllDiagnostics();
      
      setDiagnostics(realDiagnostics);
      console.log(`✅ ${realDiagnostics.length} diagnósticos reales generados`);
      
      return realDiagnostics;
    } catch (err) {
      console.error('Error generando diagnósticos reales:', err);
      setError('Error al generar diagnósticos reales');
      return [];
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Generar diagnóstico específico por examen
  const generateDiagnosticFromExam = useCallback(async (examCode: string) => {
    try {
      setLoading(true);
      
      // Marcar examen como cargando
      setAvailableExams(prev => prev.map(exam => 
        exam.examCode === examCode 
          ? { ...exam, status: 'loading' as const }
          : exam
      ));

      // Aquí conectarías con el generador específico
      console.log(`🎯 Generando diagnóstico para ${examCode}...`);
      
      // Simular generación exitosa
      setTimeout(() => {
        setAvailableExams(prev => prev.map(exam => 
          exam.examCode === examCode 
            ? { ...exam, status: 'available' as const }
            : exam
        ));
        console.log(`✅ Diagnóstico ${examCode} listo`);
      }, 2000);

    } catch (err) {
      console.error(`Error generando diagnóstico ${examCode}:`, err);
      setAvailableExams(prev => prev.map(exam => 
        exam.examCode === examCode 
          ? { ...exam, status: 'error' as const }
          : exam
      ));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAvailableExams();
  }, [loadAvailableExams]);

  return {
    availableExams,
    diagnostics,
    loading,
    error,
    generateAllDiagnostics,
    generateDiagnosticFromExam,
    refreshExams: loadAvailableExams
  };
};
