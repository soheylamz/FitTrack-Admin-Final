// components/UserDetailsModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Dumbbell, Apple, Calendar, X } from "lucide-react";
import { UserInfo } from "@/lib/hooks/useUserInfo";
import { useEffect } from "react";

interface UserDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userInfo: UserInfo | null;
  loading: boolean;
  userData: {
    id: string;
    email: string;
    name?: string;
  };
}

export default function UserDetailsModal({
  open,
  onOpenChange,
  userInfo,
  loading,
  userData,
}: UserDetailsModalProps) {
  useEffect(() => {
    console.log("user info", userInfo);
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            User Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic User Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-semibold mb-2">Basic Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">ID:</span>
                <p className="font-mono text-xs">{userData.id}</p>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <p>{userData.email}</p>
              </div>
              <div>
                <span className="text-gray-600">Name:</span>
                <p>{userData.name || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* Exercise Plans */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Dumbbell className="w-4 h-4" />
                Exercise Plans
              </h3>
              <Badge variant="outline" className="bg-white">
                {userInfo?.exercise_plans?.length || 0}
              </Badge>
            </div>
            {userInfo?.exercise_plans?.length ? (
              <div className="space-y-1">
                {userInfo.exercise_plans.slice(0, 3).map((plan, index) => (
                  <div
                    key={index}
                    className="text-sm p-2 bg-white rounded border"
                  >
                    <p className="font-medium">
                      {plan.name || `Plan ${index + 1}`}
                    </p>
                    <p className="text-xs text-gray-600">
                      {plan.duration || "No duration specified"}
                    </p>
                  </div>
                ))}
                {userInfo.exercise_plans.length > 3 && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    +{userInfo.exercise_plans.length - 3} more plans
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No exercise plans</p>
            )}
          </div>

          {/* Nutrition Plans */}
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Apple className="w-4 h-4" />
                Nutrition Plans
              </h3>
              <Badge variant="outline" className="bg-white">
                {userInfo?.nutrition_plans?.length || 0}
              </Badge>
            </div>
            {userInfo?.nutrition_plans?.length ? (
              <div className="space-y-1">
                {userInfo.nutrition_plans.slice(0, 3).map((plan, index) => (
                  <div
                    key={index}
                    className="text-sm p-2 bg-white rounded border"
                  >
                    <p className="font-medium">
                      {plan.name || `Diet ${index + 1}`}
                    </p>
                    <p className="text-xs text-gray-600">
                      {plan.calories
                        ? `${plan.calories} calories`
                        : "No details"}
                    </p>
                  </div>
                ))}
                {userInfo.nutrition_plans.length > 3 && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    +{userInfo.nutrition_plans.length - 3} more plans
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No nutrition plans</p>
            )}
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <Dumbbell className="w-6 h-6 mx-auto mb-1 text-purple-600" />
              <p className="text-2xl font-bold">
                {userInfo?.exercise_plans?.length || 0}
              </p>
              <p className="text-xs text-gray-600">Total Workouts</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg text-center">
              <Apple className="w-6 h-6 mx-auto mb-1 text-orange-600" />
              <p className="text-2xl font-bold">
                {userInfo?.nutrition_plans?.length || 0}
              </p>
              <p className="text-xs text-gray-600">Diet Plans</p>
            </div>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading user data...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
