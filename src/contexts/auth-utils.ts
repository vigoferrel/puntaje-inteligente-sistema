import { supabase } from "@/integrations/supabase/client";

/**
 * Get the currently authenticated user
 */
export const getAuthUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error("Error getting authenticated user:", error);
    return null;
  }
};

export const signOutUser = async () => {
  await supabase.auth.signOut();
};
