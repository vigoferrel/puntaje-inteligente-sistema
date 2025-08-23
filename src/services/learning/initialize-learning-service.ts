
import { supabase } from "@/integrations/supabase/client";
import { createDefaultLearningNodes, DEFAULT_LEARNING_NODES } from "./default-learning-nodes";
import { initializePAESContent } from "./paes-content-service";

/**
 * Ensures that learning nodes exist in the database
 */
export async function ensureLearningNodesExist(): Promise<boolean> {
  try {
    console.log("🔍 Checking if learning nodes exist...");
    
    // Check if we have any learning nodes
    const { count, error } = await supabase
      .from('learning_nodes')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error("Error checking learning nodes:", error);
      return false;
    }
    
    if (count === 0) {
      console.log("📚 No learning nodes found. Creating default nodes...");
      
      const success = await createDefaultLearningNodes();
      if (!success) {
        console.error("Failed to create default learning nodes");
        return false;
      }
      
      console.log(`✅ Created ${DEFAULT_LEARNING_NODES.length} default learning nodes`);
    } else {
      console.log(`✅ Found ${count} existing learning nodes`);
    }
    
    // Initialize PAES content
    await initializePAESContent();
    
    return true;
  } catch (error) {
    console.error("Error in ensureLearningNodesExist:", error);
    return false;
  }
}

/**
 * Initialize user learning progress if needed
 */
export async function initializeUserLearningProgress(userId: string): Promise<boolean> {
  try {
    console.log(`🔍 Checking learning progress for user ${userId}...`);
    
    // Check if user has any progress
    const { count, error } = await supabase
      .from('user_node_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error checking user progress:", error);
      return false;
    }
    
    if (count === 0) {
      console.log("📊 No progress found. User can start with any available node.");
    } else {
      console.log(`✅ Found ${count} progress records for user`);
    }
    
    return true;
  } catch (error) {
    console.error("Error in initializeUserLearningProgress:", error);
    return false;
  }
}

/**
 * Initialize PAES learning nodes using existing data structure
 */
export async function initializePAESNodes(): Promise<{ success: number; failed: number; errors: string[] }> {
  try {
    console.log("🎯 Initializing PAES-specific learning nodes...");
    
    // Check if we already have PAES nodes
    const { data: existingNodes, error: checkError } = await supabase
      .from('learning_nodes')
      .select('id, code')
      .ilike('code', 'PAES_%');
    
    if (checkError) {
      console.error("Error checking existing PAES nodes:", checkError);
      return { success: 0, failed: 1, errors: [checkError.message] };
    }
    
    if (existingNodes && existingNodes.length > 0) {
      console.log(`✅ PAES nodes already exist: ${existingNodes.length}`);
      return { success: existingNodes.length, failed: 0, errors: ['PAES nodes already exist'] };
    }
    
    // Get available skills and tests from database
    const { data: skills, error: skillsError } = await supabase
      .from('paes_skills')
      .select('*')
      .limit(5);
    
    const { data: tests, error: testsError } = await supabase
      .from('paes_tests')
      .select('*')
      .limit(3);
    
    if (skillsError || testsError) {
      console.error("Error fetching reference data:", { skillsError, testsError });
      return { success: 0, failed: 1, errors: ['Reference data not available'] };
    }
    
    if (!skills || skills.length === 0 || !tests || tests.length === 0) {
      console.warn("No skills or tests found for PAES initialization");
      return { success: 0, failed: 1, errors: ['Missing reference data'] };
    }
    
    // Create PAES learning nodes
    const paesNodes = skills.slice(0, 3).map((skill, index) => ({
      code: `PAES_${skill.code}_${index + 1}`,
      title: `Nodo PAES: ${skill.name}`,
      description: skill.description || `Nodo de aprendizaje para habilidad ${skill.name}`,
      subject_area: "PAES",
      domain_category: skill.code,
      difficulty: "intermediate" as const,
      cognitive_level: "aplicar" as const,
      tier_priority: "tier1_critico" as const,
      position: 100 + index,
      skill_id: skill.id,
      test_id: tests[index % tests.length]?.id || tests[0]?.id
    }));
    
    const { data: createdNodes, error: insertError } = await supabase
      .from('learning_nodes')
      .insert(paesNodes)
      .select();
    
    if (insertError) {
      console.error("Error creating PAES nodes:", insertError);
      return { success: 0, failed: paesNodes.length, errors: [insertError.message] };
    }
    
    console.log(`✅ Successfully created ${createdNodes?.length || 0} PAES nodes`);
    return { success: createdNodes?.length || 0, failed: 0, errors: [] };
    
  } catch (error) {
    console.error("Error in initializePAESNodes:", error);
    return { success: 0, failed: 1, errors: [error instanceof Error ? error.message : 'Unknown error'] };
  }
}
