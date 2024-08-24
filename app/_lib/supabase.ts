import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL || "https://<project>.supabase.co",
  process.env.SUPABASE_KEY || "<your-anon-key>"
);
