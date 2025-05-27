
/**
 * UNIVERSO EDUCATIVO v2.0
 * Experiencias educativas inmersivas y 3D
 */

// Componente principal del universo optimizado
export { OptimizedEducationalUniverse } from './OptimizedEducationalUniverse';

// Re-exportar componente principal con alias
export { EducationalUniverse } from './EducationalUniverse';

// Re-exportar componentes de LectoGuía relacionados con el universo
export { LearningMaterialGenerator } from '@/components/learning-material-generator';

// Visualizaciones y habilidades
export * from '@/components/lectoguia/skill-visualization';

// Generadores de contenido
export { MaterialGenerationHub } from '@/components/learning-material-generator/materials/MaterialGenerationHub';
export { ExerciseGenerator } from '@/components/learning-material-generator/materials/ExerciseGenerator';
export { StudyContentGenerator } from '@/components/learning-material-generator/materials/StudyContentGenerator';
export { AssessmentGenerator } from '@/components/learning-material-generator/materials/AssessmentGenerator';
