
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
