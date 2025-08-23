
-- FASE 2D: ÍNDICES PARA EXÁMENES Y EVALUACIONES
-- Optimiza sistema de evaluaciones PAES

-- Exámenes - Búsquedas principales
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_examenes_codigo 
ON examenes(codigo);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_examenes_tipo_ano 
ON examenes(tipo, año DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_examenes_created_at 
ON examenes(created_at DESC);

-- Preguntas - Relaciones y ordenamiento
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_preguntas_examen_id 
ON preguntas(examen_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_preguntas_numero 
ON preguntas(numero);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_preguntas_examen_numero 
ON preguntas(examen_id, numero);

-- Opciones de respuesta
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_opciones_respuesta_pregunta_id 
ON opciones_respuesta(pregunta_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_opciones_respuesta_pregunta_correcta 
ON opciones_respuesta(pregunta_id, es_correcta);

-- Banco de preguntas
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_banco_preguntas_codigo 
ON banco_preguntas(codigo_pregunta);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_banco_preguntas_prueba_dificultad 
ON banco_preguntas(prueba_paes, nivel_dificultad);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_banco_preguntas_nodo_validada 
ON banco_preguntas(nodo_id, validada);
