
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticQuestion } from "@/types/diagnostic";
import { TPAESPrueba, TPAESHabilidad } from "@/types/system-types";
import { SkillAssessment } from "../engines/skill-assessment-engine";

export interface AIRecommendation {
  type: 'weakness' | 'strength' | 'opportunity';
  skill: TPAESHabilidad;
  description: string;
  actionPlan: string[];
  estimatedImpact: number;
}

export class AIContentGenerator {
  static async generatePersonalizedRecommendations(
    skillAssessments: SkillAssessment[],
    prueba: TPAESPrueba
  ): Promise<AIRecommendation[]> {
    try {
      const recommendations: AIRecommendation[] = [];
      
      // Analyze critical skills
      const criticalSkills = skillAssessments.filter(s => s.recommendedFocus === 'critical');
      
      for (const skill of criticalSkills) {
        recommendations.push({
          type: 'weakness',
          skill: skill.skill,
          description: `Habilidad ${skill.skill} requiere atención inmediata (${skill.currentLevel.toFixed(1)}%)`,
          actionPlan: [
            'Revisar conceptos fundamentales',
            'Practicar ejercicios básicos diariamente',
            'Utilizar recursos de LectoGuía específicos',
            'Evaluar progreso semanalmente'
          ],
          estimatedImpact: Math.max(20, 100 - skill.currentLevel)
        });
      }
      
      // Identify opportunities
      const opportunitySkills = skillAssessments.filter(s => 
        s.recommendedFocus === 'important' && s.currentLevel > 40
      );
      
      for (const skill of opportunitySkills) {
        recommendations.push({
          type: 'opportunity',
          skill: skill.skill,
          description: `Oportunidad de mejora en ${skill.skill} (${skill.currentLevel.toFixed(1)}%)`,
          actionPlan: [
            'Resolver ejercicios de dificultad intermedia',
            'Aplicar estrategias avanzadas',
            'Conectar con otras habilidades'
          ],
          estimatedImpact: Math.min(30, 80 - skill.currentLevel)
        });
      }
      
      return recommendations;
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      return [];
    }
  }

  static async generateAdaptiveQuestions(
    weakSkills: TPAESHabilidad[],
    prueba: TPAESPrueba,
    count: number = 5
  ): Promise<DiagnosticQuestion[]> {
    try {
      // Get nodes related to weak skills
      const { data: relevantNodes } = await supabase
        .from('learning_nodes')
        .select('*')
        .eq('subject_area', prueba)
        .in('skill_id', this.getSkillIds(weakSkills))
        .eq('tier_priority', 'tier1_critico')
        .limit(count);

      if (!relevantNodes || relevantNodes.length === 0) {
        return [];
      }

      // Generate questions based on nodes
      return relevantNodes.map((node, index) => ({
        id: `ai-generated-${node.id}-${index}`,
        question: `Pregunta adaptativa para ${node.title}`,
        options: [
          'A) Opción generada con IA',
          'B) Opción generada con IA',
          'C) Opción generada con IA',
          'D) Opción generada con IA'
        ],
        correctAnswer: 'A) Opción generada con IA',
        skill: weakSkills[index % weakSkills.length],
        prueba,
        explanation: `Pregunta adaptativa generada para reforzar ${node.title}`,
        bloomLevel: node.cognitive_level,
        difficulty: node.difficulty,
        nodeId: node.id,
        paesFrequencyWeight: 2.0
      }));
    } catch (error) {
      console.error('Error generating adaptive questions:', error);
      return [];
    }
  }

  private static getSkillIds(skills: TPAESHabilidad[]): number[] {
    // Map skills to their database IDs - Agregando REFLECTION que faltaba
    const skillIdMap: Record<TPAESHabilidad, number> = {
      'TRACK_LOCATE': 1,
      'INTERPRET_RELATE': 2,
      'EVALUATE_REFLECT': 3,
      'REFLECTION': 16, // Agregando la habilidad faltante
      'SOLVE_PROBLEMS': 4,
      'REPRESENT': 5,
      'MODEL': 6,
      'ARGUE_COMMUNICATE': 7,
      'IDENTIFY_THEORIES': 8,
      'PROCESS_ANALYZE': 9,
      'APPLY_PRINCIPLES': 10,
      'SCIENTIFIC_ARGUMENT': 11,
      'TEMPORAL_THINKING': 12,
      'SOURCE_ANALYSIS': 13,
      'MULTICAUSAL_ANALYSIS': 14,
      'CRITICAL_THINKING': 15
    };
    
    return skills.map(skill => skillIdMap[skill]).filter(Boolean);
  }
}
