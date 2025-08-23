-- CIRUGÍA DE BASE DE DATOS - Eliminación de Nodos Problemáticos
-- Context7 Enhanced - Limpieza de los 5 nodos defectuosos

-- Paso 1: Verificar nodos problemáticos antes de la limpieza
SELECT 
  id, 
  title, 
  description,
  char_length(description) as desc_length
FROM learning_nodes 
WHERE 
  description IS NULL 
  OR description = '' 
  OR char_length(description) < 20
  OR title IN (
    'Comprensión Lectora Básica',
    'Análisis de Textos', 
    'Álgebra Básica',
    'Geometría Analítica',
    'Biología Celular'
  );

-- Paso 2: Eliminar nodos problemáticos
DELETE FROM learning_nodes 
WHERE 
  description IS NULL 
  OR description = '' 
  OR char_length(description) < 20
  OR title IN (
    'Comprensión Lectora Básica',
    'Análisis de Textos', 
    'Álgebra Básica',
    'Geometría Analítica',
    'Biología Celular'
  );

-- Paso 3: Verificar limpieza completada
SELECT COUNT(*) as nodos_restantes FROM learning_nodes;

-- Paso 4: Verificar que no quedan nodos problemáticos
SELECT COUNT(*) as nodos_problematicos FROM learning_nodes 
WHERE description IS NULL OR description = '' OR char_length(description) < 20;

-- Paso 5: Mostrar nodos restantes (debe ser > 0)
SELECT 
  id, 
  title, 
  description,
  char_length(description) as desc_length
FROM learning_nodes 
ORDER BY id
LIMIT 10;