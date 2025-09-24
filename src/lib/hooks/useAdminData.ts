// hooks/useAdminData.ts (updated)
import { useState, useEffect } from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";

type AllowedTableNames = "admin_users" | "user_info" | "users";

export const useAdminData = (tableName: AllowedTableNames) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`Fetching data from table: ${tableName}`);

      const { data: result, error: supabaseError } = await supabaseAdmin
        .from(tableName)
        .select("*");
      console.log("Supabase response:", { result, error: supabaseError });

      if (supabaseError) {
        console.error("Supabase error details:", {
          message: supabaseError.message,
          code: supabaseError.code,
          details: supabaseError.details,
          hint: supabaseError.hint,
        });
        throw supabaseError;
      }

      setData(result || []);
    } catch (err: any) {
      const errorMessage = err.message || `Failed to fetch ${tableName}`;
      console.error(`Error fetching ${tableName}:`, {
        message: err.message,
        code: err.code,
        details: err.details,
        stack: err.stack,
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tableName]);

  return { data, loading, error, refetch: fetchData };
};

// Specific hook for users
export const useAdminUsers = () => {
  return useAdminData("users");
};

// Specific hook for profiles
// export const useAdminProfiles = () => {
//   return useAdminData("profiles");
// };
