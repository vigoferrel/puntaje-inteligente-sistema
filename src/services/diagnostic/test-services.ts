
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { DiagnosticTest, DiagnosticQuestion } from "@/types/diagnostic";
import { TPAESPrueba } from "@/types/system-types";
import { mapTestIdToEnum } from "@/utils/supabase-mappers";
import { fetchDiagnosticQuestions } from "./question/fetch-questions";
import { fetchOptimizedDiagnosticTests, getTestTypes } from "./optimized-test-services";

/**
 * Main export that uses the optimized version
 */
export const fetchDiagnosticTests = async (userId: string, limit: number = 20) => {
  const { tests } = await fetchOptimizedDiagnosticTests(userId, { limit });
  return tests;
};

// Re-export submitDiagnosticResult from the correct location
export { submitDiagnosticResult, calculateDiagnosticResults } from './results/submit-result';

export { fetchOptimizedDiagnosticTests, getTestTypes };
