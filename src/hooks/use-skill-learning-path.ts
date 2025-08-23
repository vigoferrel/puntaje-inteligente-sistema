import { useState, useEffect } from "react";
import { TPAESHabilidad } from "@/types/system-types";

export type SkillNode = {
  skill: TPAESHabilidad;
  level: number;
  prerequisites: TPAESHabilidad[];
  isRecommended: boolean;
  isUnlocked: boolean;
  description: string;
};

type SkillLearningPathState = {
  skillNodes: SkillNode[];
  recommendedSkills: TPAESHabilidad[];
  lockedSkills: TPAESHabilidad[];
  loadingPath: boolean;
};

export function useSkillLearningPath(
  skillLevels: Record<string, number>,
  selectedTestId: number
) {
  const [state, setState] = useState<SkillLearningPathState>({
    skillNodes: [],
    recommendedSkills: [],
    lockedSkills: [],
    loadingPath: true,
  });

  // Determine skill dependencies based on Bloom's taxonomy and cognitive complexity
  useEffect(() => {
    // This would ideally come from an API or data source
    // For this implementation, we'll create a simple skill progression model
    const getSkillDependencies = () => {
      // Basic skill dependency map by test ID
      const skillMaps: Record<number, SkillNode[]> = {
        // Test ID 1: Competencia Lectora
        1: [
          {
            skill: "TRACK_LOCATE",
            level: skillLevels["TRACK_LOCATE"] || 0,
            prerequisites: [],
            isRecommended: false,
            isUnlocked: true,
            description: "Habilidad para ubicar información explícita en textos",
          },
          {
            skill: "INTERPRET_RELATE",
            level: skillLevels["INTERPRET_RELATE"] || 0,
            prerequisites: ["TRACK_LOCATE"],
            isRecommended: false,
            isUnlocked: false,
            description: "Habilidad para interpretar y relacionar información en textos",
          },
          {
            skill: "EVALUATE_REFLECT",
            level: skillLevels["EVALUATE_REFLECT"] || 0,
            prerequisites: ["INTERPRET_RELATE"],
            isRecommended: false,
            isUnlocked: false,
            description: "Habilidad para evaluar y reflexionar sobre textos",
          },
        ],
        // Test ID 2: Matemática 1
        2: [
          {
            skill: "SOLVE_PROBLEMS",
            level: skillLevels["SOLVE_PROBLEMS"] || 0,
            prerequisites: [],
            isRecommended: false,
            isUnlocked: true,
            description: "Habilidad para resolver problemas matemáticos básicos",
          },
          {
            skill: "REPRESENT",
            level: skillLevels["REPRESENT"] || 0,
            prerequisites: ["SOLVE_PROBLEMS"],
            isRecommended: false,
            isUnlocked: false,
            description: "Habilidad para representar información matemáticamente",
          },
          {
            skill: "MODEL",
            level: skillLevels["MODEL"] || 0,
            prerequisites: ["REPRESENT"],
            isRecommended: false,
            isUnlocked: false,
            description: "Habilidad para crear modelos matemáticos",
          },
          {
            skill: "ARGUE_COMMUNICATE",
            level: skillLevels["ARGUE_COMMUNICATE"] || 0,
            prerequisites: ["MODEL"],
            isRecommended: false,
            isUnlocked: false,
            description: "Habilidad para argumentar y comunicar razonamientos matemáticos",
          },
        ],
        // Other tests would be included similarly
        3: [
          // Matemática 2 skills
        ],
        4: [
          // Ciencias skills
        ],
        5: [
          // Historia skills
        ],
      };
      
      return skillMaps[selectedTestId] || [];
    };

    // Process the skill nodes to determine their states
    const processSkillNodes = (nodes: SkillNode[]) => {
      const processedNodes = nodes.map(node => {
        // A skill is unlocked if it has no prerequisites or if all its prerequisites have reached at least 70% mastery
        const isUnlocked = node.prerequisites.length === 0 || 
          node.prerequisites.every(prereq => (skillLevels[prereq] || 0) >= 0.7);
        
        // A skill is recommended if it's unlocked and its level is below 70%
        const isRecommended = isUnlocked && node.level < 0.7;
        
        return {
          ...node,
          isUnlocked,
          isRecommended
        };
      });

      const recommendedSkills = processedNodes
        .filter(node => node.isRecommended)
        .map(node => node.skill);
      
      const lockedSkills = processedNodes
        .filter(node => !node.isUnlocked)
        .map(node => node.skill);
      
      return { 
        skillNodes: processedNodes, 
        recommendedSkills, 
        lockedSkills 
      };
    };

    // Update state with processed skill nodes
    const updateState = () => {
      const skillDependencies = getSkillDependencies();
      const processedData = processSkillNodes(skillDependencies);
      
      setState({
        skillNodes: processedData.skillNodes,
        recommendedSkills: processedData.recommendedSkills,
        lockedSkills: processedData.lockedSkills,
        loadingPath: false,
      });
    };

    updateState();
  }, [skillLevels, selectedTestId]);

  return state;
}
