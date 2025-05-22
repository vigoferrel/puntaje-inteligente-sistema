
import { supabase } from '@/integrations/supabase/client';
import { Question, Option } from '@/types/diagnostic';

export async function fetchQuestionById(questionId: string): Promise<Question | null> {
  try {
    const { data, error } = await supabase
      .from('diagnostic_questions')
      .select('*')
      .eq('id', questionId)
      .single();

    if (error) throw error;
    if (!data) return null;
    
    return data as Question;
  } catch (error) {
    console.error('Error fetching question by ID:', error);
    return null;
  }
}

export async function fetchQuestionsByIds(
  questionIds: string[]
): Promise<Question[]> {
  try {
    if (!questionIds || questionIds.length === 0) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('diagnostic_questions')
      .select('*')
      .in('id', questionIds);

    if (error) throw error;
    
    return (data || []).map((question) => question as Question);
  } catch (error) {
    console.error('Error fetching questions by IDs:', error);
    return [];
  }
}
