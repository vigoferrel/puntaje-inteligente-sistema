
import { useState, useEffect, useCallback } from "react";
import { TPAESHabilidad } from "@/types/system-types";
import { TLearningNode } from "@/types/system-types";
import { NodeProgress } from "@/hooks/use-learning-nodes";
import { mapSkillToBloomLevel, BloomLevel } from "@/components/lectoguia/skill-visualization/BloomTaxonomyLevel";

interface BloomLevelStrength {
  level: BloomLevel;
  score: number;
  isStrength: boolean;
}

interface BloomRecommendation {
  recommendedNodes: TLearningNode[];
  bloomStrengths: BloomLevelStrength[];
  weakestLevel: BloomLevel | null;
  strongestLevel: BloomLevel | null;
  suggestedFocus: string;
}

// Function to calculate skill level averages by Bloom level
const calculateBloomLevelAverages = (skillLevels: Record<TPAESHabilidad, number>): Record<BloomLevel, number> => {
  // Initialize with zero for all levels
  const bloomAverages: Record<BloomLevel, { sum: number; count: number }> = {
    remember: { sum: 0, count: 0 },
    understand: { sum: 0, count: 0 },
    apply: { sum: 0, count: 0 },
    analyze: { sum: 0, count: 0 },
    evaluate: { sum: 0, count: 0 },
    create: { sum: 0, count: 0 }
  };
  
  // Map each skill to its Bloom level and accumulate values
  Object.entries(skillLevels).forEach(([skill, value]) => {
    const bloomLevel = mapSkillToBloomLevel(skill as TPAESHabilidad);
    bloomAverages[bloomLevel].sum += value;
    bloomAverages[bloomLevel].count += 1;
  });
  
  // Calculate average for each Bloom level
  return Object.entries(bloomAverages).reduce((acc, [level, { sum, count }]) => {
    acc[level as BloomLevel] = count > 0 ? sum / count : 0;
    return acc;
  }, {} as Record<BloomLevel, number>);
};

export const useBloomRecommendations = (
  skillLevels: Record<TPAESHabilidad, number>,
  nodes: TLearningNode[],
  nodeProgress: Record<string, NodeProgress>
): BloomRecommendation => {
  const [recommendations, setRecommendations] = useState<BloomRecommendation>({
    recommendedNodes: [],
    bloomStrengths: [],
    weakestLevel: null,
    strongestLevel: null,
    suggestedFocus: ""
  });
  
  const generateRecommendations = useCallback(() => {
    // Calculate Bloom level averages
    const bloomAverages = calculateBloomLevelAverages(skillLevels);
    
    // Find strongest and weakest levels
    let weakestLevel: BloomLevel | null = null;
    let weakestScore = 1;
    let strongestLevel: BloomLevel | null = null;
    let strongestScore = 0;
    
    const bloomStrengths: BloomLevelStrength[] = [];
    
    Object.entries(bloomAverages).forEach(([level, score]) => {
      const bloomLevel = level as BloomLevel;
      
      // Track weakest/strongest
      if (score < weakestScore) {
        weakestScore = score;
        weakestLevel = bloomLevel;
      }
      
      if (score > strongestScore) {
        strongestScore = score;
        strongestLevel = bloomLevel;
      }
      
      // Determine if this is a strength or weakness
      const isStrength = score > 0.7;
      
      bloomStrengths.push({
        level: bloomLevel,
        score,
        isStrength
      });
    });
    
    // Sort bloom strengths by cognitive complexity
    const orderedLevels: BloomLevel[] = ["remember", "understand", "apply", "analyze", "evaluate", "create"];
    bloomStrengths.sort((a, b) => 
      orderedLevels.indexOf(a.level) - orderedLevels.indexOf(b.level)
    );
    
    // Recommend nodes based on the analysis
    let recommendedNodes: TLearningNode[] = [];
    let suggestedFocus = "";
    
    if (weakestLevel) {
      // Find incomplete nodes targeting the weakest level
      const levelNodes = nodes.filter(node => {
        // Get the bloom level for this node's skill
        const nodeBloomLevel = mapSkillToBloomLevel(node.skill);
        
        // Check if the node targets our weakest level
        if (nodeBloomLevel === weakestLevel) {
          // Make sure the node isn't completed
          const isCompleted = nodeProgress[node.id]?.status === 'completed';
          return !isCompleted;
        }
        
        return false;
      });
      
      recommendedNodes = levelNodes.slice(0, 3);
      
      // Generate suggested focus based on Bloom levels
      if (weakestLevel && strongestLevel) {
        // Suggest development path based on strongest and weakest levels
        const weakestLevelName = weakestLevel.charAt(0).toUpperCase() + weakestLevel.slice(1);
        const strongestLevelName = strongestLevel.charAt(0).toUpperCase() + strongestLevel.slice(1);
        
        suggestedFocus = `Enfócate en mejorar tus habilidades de "${weakestLevelName}" mientras sigues aprovechando tus fortalezas en "${strongestLevelName}".`;
      }
    }
    
    setRecommendations({
      recommendedNodes,
      bloomStrengths,
      weakestLevel,
      strongestLevel,
      suggestedFocus
    });
  }, [skillLevels, nodes, nodeProgress]);
  
  useEffect(() => {
    generateRecommendations();
  }, [generateRecommendations]);
  
  return recommendations;
};
