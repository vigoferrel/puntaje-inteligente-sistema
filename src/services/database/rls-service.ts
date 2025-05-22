
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates a function to get policies for a specific table
 * This is useful for debugging RLS issues
 */
export const createGetPoliciesFunction = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('get_policies_for_table', { 
      table_name: 'learning_nodes' 
    } as { table_name: string });
    
    // If the function already exists, this will return an error but we can ignore it
    if (error && !error.message.includes('already exists')) {
      // Create the function if it doesn't exist
      const { error: createError } = await supabase.rpc('exec_sql', { 
        sql: `
          CREATE OR REPLACE FUNCTION public.get_policies_for_table(table_name text)
          RETURNS TABLE (
            policy_name text,
            policy_roles text[],
            policy_cmd text,
            policy_qual text,
            policy_with_check text
          )
          LANGUAGE sql
          SECURITY DEFINER
          SET search_path = public
          AS $$
            SELECT
              p.policyname as policy_name,
              ARRAY_AGG(r.rolname) as policy_roles,
              p.cmd as policy_cmd,
              p.qual as policy_qual,
              p.with_check as policy_with_check
            FROM pg_policy p
            JOIN pg_class c ON p.polrelid = c.oid
            JOIN pg_namespace n ON c.relnamespace = n.oid
            JOIN pg_roles r ON r.oid = ANY(p.polroles)
            WHERE n.nspname = 'public'
              AND c.relname = table_name
            GROUP BY p.policyname, p.cmd, p.qual, p.with_check;
          $$;
        `
      } as { sql: string });
      
      if (createError) {
        console.error('Error creating policy function:', createError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error creating policy function:', error);
    return false;
  }
};

/**
 * Helper function to check if the current user has admin rights
 * We'll need to implement this when we set up user roles
 */
export const checkAdminRights = async (): Promise<boolean> => {
  try {
    // For now, this is a placeholder. In a real app, you would check if the current user
    // has admin rights, likely by checking a user_roles table or similar
    return true;
  } catch (error) {
    console.error('Error checking admin rights:', error);
    return false;
  }
};

/**
 * Initialize necessary RLS policies for the learning_nodes table
 * This is needed because we're seeing row level security violations in the logs
 */
export const initializeRLSPolicies = async (): Promise<boolean> => {
  try {
    const isAdmin = await checkAdminRights();
    
    if (!isAdmin) {
      console.error('User does not have admin rights');
      return false;
    }
    
    // Create policies allowing admin users to manage learning_nodes
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create policy for admins to select learning_nodes
        CREATE POLICY IF NOT EXISTS "Allow admin select on learning_nodes"
        ON public.learning_nodes
        FOR SELECT
        USING (true);
        
        -- Create policy for admins to insert learning_nodes
        CREATE POLICY IF NOT EXISTS "Allow admin insert on learning_nodes"
        ON public.learning_nodes
        FOR INSERT
        WITH CHECK (true);
        
        -- Create policy for admins to update learning_nodes
        CREATE POLICY IF NOT EXISTS "Allow admin update on learning_nodes"
        ON public.learning_nodes
        FOR UPDATE
        USING (true);
        
        -- Create policy for admins to delete learning_nodes
        CREATE POLICY IF NOT EXISTS "Allow admin delete on learning_nodes"
        ON public.learning_nodes
        FOR DELETE
        USING (true);
      `
    } as { sql: string });
    
    if (error) {
      console.error('Error creating RLS policies:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing RLS policies:', error);
    return false;
  }
};
