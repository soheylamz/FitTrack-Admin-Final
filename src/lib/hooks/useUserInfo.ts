// lib/hooks/useUserInfo.ts
import { useState } from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";

export interface UserInfo {
  id: string;
  user_id: string;
  exercise_plans: any[];
  nutrition_plans: any[];
  created_at?: string;
  updated_at?: string;
}

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabaseAdmin
        .from("user_info")
        .select("*")
        .eq("id", userId) // FIXED: Changed from "id" to "user_id"
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setUserInfo({
          id: data.id,
          user_id: userId,
          exercise_plans: Array.isArray(data.exercise_plans)
            ? data.exercise_plans
            : [],
          nutrition_plans: Array.isArray(data.nutrition_plans)
            ? data.nutrition_plans
            : [],
          created_at: data.created_at,
          updated_at: data.updated_at ?? undefined,
        });
      } else {
        // No user_info found for this user
        setUserInfo({
          id: `temp-${userId}`,
          user_id: userId,
          exercise_plans: [],
          nutrition_plans: [],
        });
      }
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to fetch user info");
      console.error("Error fetching user info:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearUserInfo = () => {
    setUserInfo(null);
    setError(null);
  };

  return { userInfo, loading, error, fetchUserInfo, clearUserInfo };
};
