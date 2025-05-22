
export async function fetchUserExerciseHistory(userId: string): Promise<ExerciseAttempt[]> {
  if (!userId) {
    throw new Error("User ID is required to fetch exercise history");
  }

  const { data, error } = await supabase
    .from('lectoguia_exercise_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });
  
  if (error) throw error;
  
  return data ? data.map((attempt: any) => ({
    id: attempt.id,
    exerciseId: attempt.exercise_id,
    userId: attempt.user_id,
    selectedOption: attempt.selected_option,
    isCorrect: attempt.is_correct,
    skillType: attempt.skill_type,
    prueba: attempt.prueba || 'COMPETENCIA_LECTORA', // Include prueba with fallback
    completedAt: attempt.completed_at
  })) : [];
}
