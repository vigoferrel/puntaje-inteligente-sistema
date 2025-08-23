
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
              p.polname as policy_name,
              ARRAY_AGG(r.rolname) as policy_roles,
              p.polcmd as policy_cmd,
              p.polqual as policy_qual,
              p.polwithcheck as policy_with_check
            FROM pg_policy p
            JOIN pg_class c ON p.polrelid = c.oid
            JOIN pg_namespace n ON c.relnamespace = n.oid
            JOIN pg_roles r ON r.oid = ANY(p.polroles)
            WHERE n.nspname = 'public'
              AND c.relname = table_name
            GROUP BY p.polname, p.polcmd, p.polqual, p.polwithcheck;
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
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return false;
    }
    
    // For now, any authenticated user is considered an admin
    // In a real application, you'd check a user_roles table
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
    // First ensure the exec_sql function exists
    const execSqlResult = await supabase.rpc('exec_sql', {
      sql: `
        -- Check if the function exists, if not create it
        CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        SET search_path = public
        AS $$
        BEGIN
          EXECUTE sql;
        END;
        $$;
      `
    } as { sql: string });
    
    if (execSqlResult.error) {
      console.error('Error creating exec_sql function:', execSqlResult.error);
      // Try to continue anyway as the function might already exist
    }
    
    // First, verify we can execute commands
    const isAdmin = await checkAdminRights();
    
    if (!isAdmin) {
      console.error('Usuario no autenticado o no tiene permisos de administrador.');
      return false;
    }
    
    // Enable RLS on the table
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Enable RLS on learning_nodes table if not already enabled
        ALTER TABLE IF EXISTS public.learning_nodes ENABLE ROW LEVEL SECURITY;
      `
    } as { sql: string });
    
    if (rlsError) {
      console.error('Error enabling RLS on learning_nodes table:', rlsError);
      return false;
    }
    
    // Create more permissive policies for authenticated users
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Drop existing policies to avoid conflicts
        DROP POLICY IF EXISTS "Allow select on learning_nodes" ON public.learning_nodes;
        DROP POLICY IF EXISTS "Allow insert on learning_nodes" ON public.learning_nodes;
        DROP POLICY IF EXISTS "Allow update on learning_nodes" ON public.learning_nodes;
        DROP POLICY IF EXISTS "Allow delete on learning_nodes" ON public.learning_nodes;
        
        -- Create policy for users to select learning_nodes - any user can read
        CREATE POLICY "Allow select on learning_nodes"
        ON public.learning_nodes
        FOR SELECT
        TO authenticated, anon
        USING (true);
        
        -- Only authenticated users can modify data
        CREATE POLICY "Allow insert on learning_nodes"
        ON public.learning_nodes
        FOR INSERT
        TO authenticated
        WITH CHECK (true);
        
        CREATE POLICY "Allow update on learning_nodes"
        ON public.learning_nodes
        FOR UPDATE
        TO authenticated
        USING (true);
        
        CREATE POLICY "Allow delete on learning_nodes"
        ON public.learning_nodes
        FOR DELETE
        TO authenticated
        USING (true);
      `
    } as { sql: string });
    
    if (error) {
      console.error('Error creating RLS policies:', error);
      return false;
    }
    
    console.log('RLS policies initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing RLS policies:', error);
    return false;
  }
};
