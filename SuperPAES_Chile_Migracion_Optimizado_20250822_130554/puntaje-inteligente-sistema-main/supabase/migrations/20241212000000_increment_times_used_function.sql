
-- Crear función para incrementar times_used
CREATE OR REPLACE FUNCTION increment_times_used(exercise_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE generated_exercises 
  SET times_used = COALESCE(times_used, 0) + 1
  WHERE id = exercise_id;
END;
$$;
