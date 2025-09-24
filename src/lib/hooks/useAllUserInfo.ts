// lib/hooks/useAllUserInfo.ts (updated)
import { useState, useEffect } from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";

export interface ExercisePlan {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  exercises: any[];
  completed_exercises: any[];
}

export interface NutritionPlan {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  breakfast: any[];
  lunch: any[];
  dinner: any[];
  snacks: any[];
  mealsDone: number;
  totalMeals: number;
  lastReset: string;
}

export interface UserPlan {
  id: string;
  user_id: string;
  user_email: string | null;
  user_name: string | null;
  exercise_plan?: ExercisePlan;
  nutrition_plan?: NutritionPlan;
  plan_type: "exercise" | "nutrition";
  created_at?: string;
}

export const useAllUserInfo = () => {
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllUserInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      // First get all users
      const { data: users, error: usersError } = await supabaseAdmin
        .from("users")
        .select("id, email, name");

      if (usersError) throw usersError;

      // Then get all user_info with both exercise and nutrition plans
      const { data: allUserInfo, error: userInfoError } = await supabaseAdmin
        .from("user_info")
        .select("id, exercise_plans, nutrition_plans, created_at, updated_at");

      if (userInfoError) throw userInfoError;

      // Flatten the data to get individual plans
      const flattenedPlans: UserPlan[] = [];

      users.forEach((user) => {
        const userInfo = allUserInfo?.find((info) => info.id === user.id);

        // Process exercise plans
        let exercisePlans: any[] = [];
        if (Array.isArray(userInfo?.exercise_plans)) {
          exercisePlans = userInfo.exercise_plans;
        } else if (typeof userInfo?.exercise_plans === "string") {
          try {
            const parsed = JSON.parse(userInfo.exercise_plans);
            if (Array.isArray(parsed)) {
              exercisePlans = parsed;
            }
          } catch {
            exercisePlans = [];
          }
        }

        exercisePlans.forEach((plan: any) => {
          flattenedPlans.push({
            id: `${user.id}-exercise-${plan.id}`,
            user_id: user.id,
            user_email: user.email,
            user_name: user.name,
            exercise_plan: plan,
            plan_type: "exercise",
            created_at: userInfo?.created_at,
          });
        });

        // Process nutrition plans
        let nutritionPlans: any[] = [];
        if (Array.isArray(userInfo?.nutrition_plans)) {
          nutritionPlans = userInfo.nutrition_plans;
        } else if (typeof userInfo?.nutrition_plans === "string") {
          try {
            const parsed = JSON.parse(userInfo.nutrition_plans);
            if (Array.isArray(parsed)) {
              nutritionPlans = parsed;
            }
          } catch {
            nutritionPlans = [];
          }
        }

        nutritionPlans.forEach((plan: any) => {
          flattenedPlans.push({
            id: `${user.id}-nutrition-${plan.id}`,
            user_id: user.id,
            user_email: user.email,
            user_name: user.name,
            nutrition_plan: plan,
            plan_type: "nutrition",
            created_at: userInfo?.created_at,
          });
        });
      });

      setUserPlans(flattenedPlans);
    } catch (err: any) {
      setError(err.message || "Failed to fetch user info");
      console.error("Error fetching user info:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUserInfo();
  }, []);

  return { userPlans, loading, error, refetch: fetchAllUserInfo };
};
