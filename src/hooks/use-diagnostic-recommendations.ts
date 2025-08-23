
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { TPAESHabilidad } from "@/types/system-types";
import { useDiagnosticHistory } from "@/hooks/diagnostic/results/use-diagnostic-history";
import { useLearningNodes } from "@/hooks/use-learning-nodes";

export const useDiagnosticRecommendations = () => {
  const { profile } = useAuth();
  const { results, loading: loadingDiagnostic } = useDiagnosticHistory();
  const { nodes, nodeProgress, loading: loadingNodes } = useLearningNodes();
  const [recommendedNodeIds, setRecommendedNodeIds] = useState<string[]>([]);
  const [weakestSkills, setWeakestSkills] = useState<TPAESHabilidad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // When diagnostic results and nodes are loaded, calculate recommendations
    if (!loadingDiagnostic && !loadingNodes && results.length > 0) {
      try {
        // Get the latest diagnostic result
        const latestResult = results[0];
        
        if (latestResult && latestResult.results) {
          // Extract skill levels from the results
          const skillLevels = latestResult.results;
          
          // Find the weakest skills (those with lowest scores)
          const sortedSkills = Object.entries(skillLevels)
            .sort(([, scoreA], [, scoreB]) => scoreA - scoreB)
            .slice(0, 3)
            .map(([skill]) => skill as TPAESHabilidad);
            
          setWeakestSkills(sortedSkills);
          
          // Find nodes that target these weak skills and haven't been completed yet
          const recommendedNodes = nodes
            .filter(node => {
              // Node matches one of the weak skills
              const matchesWeakSkill = sortedSkills.includes(node.skill as TPAESHabilidad);
              
              // Node hasn't been completed yet
              const nodeCompleted = nodeProgress[node.id]?.progress === 100;
              
              return matchesWeakSkill && !nodeCompleted;
            })
            .slice(0, 3) // Get top 3 recommendations
            .map(node => node.id);
            
          setRecommendedNodeIds(recommendedNodes);
        }
      } catch (error) {
        console.error("Error calculating diagnostic recommendations:", error);
      }
      
      setLoading(false);
    }
  }, [loadingDiagnostic, loadingNodes, results, nodes, nodeProgress]);

  return {
    loading: loading || loadingDiagnostic || loadingNodes,
    weakestSkills,
    recommendedNodeIds,
    nextRecommendedNodeId: recommendedNodeIds.length > 0 ? recommendedNodeIds[0] : null
  };
};
