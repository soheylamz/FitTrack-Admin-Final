// components/NutritionPlanCard.tsx
import { Badge } from "@/components/ui/badge";
import { Apple, Utensils, Coffee, Sun, Moon } from "lucide-react";

interface NutritionPlanCardProps {
  plan: any;
}

export default function NutritionPlanCard({ plan }: NutritionPlanCardProps) {
  const totalCalories = [
    ...(plan.breakfast || []),
    ...(plan.lunch || []),
    ...(plan.dinner || []),
    ...(plan.snacks || []),
  ].reduce((total, meal) => total + (meal.calories || 0), 0);

  const totalMeals =
    (plan.breakfast?.length || 0) +
    (plan.lunch?.length || 0) +
    (plan.dinner?.length || 0) +
    (plan.snacks?.length || 0);

  return (
    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-green-900">{plan.name}</h4>
        <Badge variant="outline" className="bg-white">
          {totalCalories} cal
        </Badge>
      </div>

      {plan.description && (
        <p className="text-sm text-green-700 mb-3">{plan.description}</p>
      )}

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Coffee className="w-4 h-4 text-orange-500" />
          <span>Breakfast: {plan.breakfast?.length || 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-yellow-500" />
          <span>Lunch: {plan.lunch?.length || 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 text-blue-500" />
          <span>Dinner: {plan.dinner?.length || 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <Apple className="w-4 h-4 text-red-500" />
          <span>Snacks: {plan.snacks?.length || 0}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-green-200">
        <div className="flex justify-between text-xs text-green-600">
          <span>
            Meals: {plan.mealsDone || 0}/{plan.totalMeals || totalMeals}
          </span>
          <span>Created: {new Date(plan.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
