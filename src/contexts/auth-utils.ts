
import { supabase } from "@/integrations/supabase/client";

export const signOutUser = async () => {
  await supabase.auth.signOut();
};
