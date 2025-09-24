// lib/supabase-admin.ts (updated with better error handling)
import { createClient } from "@supabase/supabase-js";
import { Database } from "./schema";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl) {
  console.error("NEXT_PUBLIC_SUPABASE_URL is not defined");
  throw new Error("Supabase URL is required");
}

if (!supabaseServiceKey) {
  console.error("NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY is not defined");
  throw new Error("Supabase Service Role Key is required");
}

// Create admin client that bypasses RLS
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        "X-Client-Info": "admin-dashboard",
      },
    },
  }
);

// Test connection on import
(async () => {
  try {
    const { error } = await supabaseAdmin
      .from("users")
      .select("count", { count: "exact", head: true });
    if (error) {
      console.error("Supabase admin connection test failed:", error);
    } else {
      console.log("Supabase admin connection successful");
    }
  } catch (err) {
    console.error("Supabase admin connection error:", err);
  }
})();
