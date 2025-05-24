
/**
 * Unified type definitions for the diagnostic system
 * This file consolidates all diagnostic-related types to prevent conflicts
 */
import { TPAESHabilidad, TPAESPrueba } from "./system-types";

// Unified PAES Test type
export interface PAESTest {
  id: number;
  name: string;
  code: string;
  description?: string;
  questionsCount: number;
  timeMinutes: number;
  relativeWeight: number;
  complexityLevel: string;
  isRequired: boolean;
  // Legacy properties for backward compatibility
  questions_count?: number;
  time_minutes?: number;
  relative_weight?: number;
  complexity_level?: string;
  is_required?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Unified PAES Skill type
export interface PAESSkill {
  id: number;
  name: string;
  code: string;
  description?: string;
  testId: number;
  skillType: TPAESHabilidad;
  impactWeight: number;
  nodeCount: number;
  applicableTests: string[];
  displayOrder: number;
  // Legacy properties for backward compatibility
  test_id?: number;
  skill_type?: TPAESHabilidad;
  impact_weight?: number;
  node_count?: number;
  applicable_tests?: string[];
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

// Unified Learning Node type
export interface LearningNode {
  id: string;
  title: string;
  description?: string;
  code: string;
  subjectArea: string;
  cognitiveLevel: 'recordar' | 'comprender' | 'aplicar' | 'analizar' | 'evaluar' | 'crear';
  difficulty: 'basic' | 'intermediate' | 'advanced';
  tierPriority: 'tier1_critico' | 'tier2_importante' | 'tier3_complementario';
  testId: number;
  skillId: number;
  position: number;
  domainCategory: string;
  dependsOn: string[];
  estimatedTimeMinutes: number;
  baseWeight: number;
  difficultyMultiplier: number;
  frequencyBonus: number;
  prerequisiteWeight: number;
  adaptiveAdjustment: number;
  bloomComplexityScore: number;
  paesFrequency: number;
  // Legacy properties for backward compatibility
  subject_area?: string;
  cognitive_level?: string;
  tier_priority?: string;
  test_id?: number;
  skill_id?: number;
  domain_category?: string;
  depends_on?: string[];
  estimated_time_minutes?: number;
  base_weight?: number;
  difficulty_multiplier?: number;
  frequency_bonus?: number;
  prerequisite_weight?: number;
  adaptive_adjustment?: number;
  bloom_complexity_score?: number;
  paes_frequency?: number;
  created_at?: string;
  updated_at?: string;
}

// Unified Node Weight type
export interface NodeWeight {
  id: string;
  userId: string;
  nodeId: string;
  calculatedWeight: number;
  careerRelevance: number;
  performanceAdjustment: number;
  lastCalculated: string;
  // Legacy properties for backward compatibility
  user_id?: string;
  node_id?: string;
  calculated_weight?: number;
  career_relevance?: number;
  performance_adjustment?: number;
  last_calculated?: string;
}

// System metrics type
export interface SystemMetrics {
  totalNodes: number;
  tier1Count: number;
  tier2Count: number;
  tier3Count: number;
  distributionByTest: Record<string, number>;
  avgBloomLevel: number;
}

// Data transformation utilities
export const transformPAESTest = (dbTest: any): PAESTest => ({
  id: dbTest.id,
  name: dbTest.name,
  code: dbTest.code,
  description: dbTest.description,
  questionsCount: dbTest.questions_count || dbTest.questionsCount || 0,
  timeMinutes: dbTest.time_minutes || dbTest.timeMinutes || 0,
  relativeWeight: dbTest.relative_weight || dbTest.relativeWeight || 1.0,
  complexityLevel: dbTest.complexity_level || dbTest.complexityLevel || 'basic',
  isRequired: dbTest.is_required ?? dbTest.isRequired ?? true,
});

export const transformPAESSkill = (dbSkill: any): PAESSkill => ({
  id: dbSkill.id,
  name: dbSkill.name,
  code: dbSkill.code,
  description: dbSkill.description,
  testId: dbSkill.test_id || dbSkill.testId || 1,
  skillType: dbSkill.skill_type || dbSkill.skillType || 'INTERPRET_RELATE',
  impactWeight: dbSkill.impact_weight || dbSkill.impactWeight || 1.0,
  nodeCount: dbSkill.node_count || dbSkill.nodeCount || 0,
  applicableTests: dbSkill.applicable_tests || dbSkill.applicableTests || [],
  displayOrder: dbSkill.display_order || dbSkill.displayOrder || 0,
});

export const transformLearningNode = (dbNode: any): LearningNode => ({
  id: dbNode.id,
  title: dbNode.title,
  description: dbNode.description,
  code: dbNode.code,
  subjectArea: dbNode.subject_area || dbNode.subjectArea || 'MATEMATICA_1',
  cognitiveLevel: dbNode.cognitive_level || dbNode.cognitiveLevel || 'comprender',
  difficulty: dbNode.difficulty || 'basic',
  tierPriority: dbNode.tier_priority || dbNode.tierPriority || 'tier2_importante',
  testId: dbNode.test_id || dbNode.testId || 1,
  skillId: dbNode.skill_id || dbNode.skillId || 1,
  position: dbNode.position || 0,
  domainCategory: dbNode.domain_category || dbNode.domainCategory || 'general',
  dependsOn: dbNode.depends_on || dbNode.dependsOn || [],
  estimatedTimeMinutes: dbNode.estimated_time_minutes || dbNode.estimatedTimeMinutes || 45,
  baseWeight: dbNode.base_weight || dbNode.baseWeight || 1.0,
  difficultyMultiplier: dbNode.difficulty_multiplier || dbNode.difficultyMultiplier || 1.0,
  frequencyBonus: dbNode.frequency_bonus || dbNode.frequencyBonus || 0.0,
  prerequisiteWeight: dbNode.prerequisite_weight || dbNode.prerequisiteWeight || 0.0,
  adaptiveAdjustment: dbNode.adaptive_adjustment || dbNode.adaptiveAdjustment || 1.0,
  bloomComplexityScore: dbNode.bloom_complexity_score || dbNode.bloomComplexityScore || 3.0,
  paesFrequency: dbNode.paes_frequency || dbNode.paesFrequency || 0,
});

export const transformNodeWeight = (dbWeight: any): NodeWeight => ({
  id: dbWeight.id,
  userId: dbWeight.user_id || dbWeight.userId,
  nodeId: dbWeight.node_id || dbWeight.nodeId,
  calculatedWeight: dbWeight.calculated_weight || dbWeight.calculatedWeight || 1.0,
  careerRelevance: dbWeight.career_relevance || dbWeight.careerRelevance || 1.0,
  performanceAdjustment: dbWeight.performance_adjustment || dbWeight.performanceAdjustment || 1.0,
  lastCalculated: dbWeight.last_calculated || dbWeight.lastCalculated || new Date().toISOString(),
});
