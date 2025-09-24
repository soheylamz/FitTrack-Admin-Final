// app/page.tsx (corrected)
"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  User,
  Activity,
  Dumbbell,
  TrendingUp,
  Apple,
  Search,
  Plus,
  LogOut,
  RefreshCw,
  Calendar,
  Target,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAdminUsers } from "@/lib/hooks/useAdminData";
import UserDetailsModal from "@/components/UserDetailsModal";
import { useUserInfo } from "@/lib/hooks/useUserInfo";
import { useAllUserInfo } from "@/lib/hooks/useAllUserInfo";

export default function Home() {
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trainingSearchTerm, setTrainingSearchTerm] = useState("");
  const [nutritionSearchTerm, setNutritionSearchTerm] = useState("");

  const { adminUser, logout } = useAuth();
  const {
    data: users,
    loading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useAdminUsers();

  const {
    userInfo,
    loading: userInfoLoading,
    error: userInfoError,
    fetchUserInfo,
    clearUserInfo,
  } = useUserInfo();

  // Use the hook correctly - destructure all returned values
  const {
    userPlans,
    loading: allUserInfoLoading,
    error: allUserInfoError,
    refetch: refetchAllUserInfo,
  } = useAllUserInfo();

  // Filter plans by type
  const exercisePlans = userPlans.filter(
    (plan) => plan.plan_type === "exercise"
  );
  const nutritionPlans = userPlans.filter(
    (plan) => plan.plan_type === "nutrition"
  );

  // Filter training data
  const filteredExercisePlans = exercisePlans.filter(
    (userPlan) =>
      userPlan.user_email
        ?.toLowerCase()
        .includes(trainingSearchTerm.toLowerCase()) ||
      userPlan.user_name
        ?.toLowerCase()
        .includes(trainingSearchTerm.toLowerCase()) ||
      userPlan.exercise_plan?.name
        ?.toLowerCase()
        .includes(trainingSearchTerm.toLowerCase())
  );

  // Filter nutrition data
  const filteredNutritionPlans = nutritionPlans.filter(
    (userPlan) =>
      userPlan.user_email
        ?.toLowerCase()
        .includes(nutritionSearchTerm.toLowerCase()) ||
      userPlan.user_name
        ?.toLowerCase()
        .includes(nutritionSearchTerm.toLowerCase()) ||
      userPlan.nutrition_plan?.name
        ?.toLowerCase()
        .includes(nutritionSearchTerm.toLowerCase())
  );

  // Calculate stats
  const totalExercisePlans = exercisePlans.length;
  const totalNutritionPlans = nutritionPlans.length;
  const activeExercisePlans = exercisePlans.filter(
    (plan) => plan.exercise_plan?.status === "active"
  ).length;

  const handleViewUser = async (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    await fetchUserInfo(user.id);
  };

  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setSelectedUser(null);
      clearUserInfo();
    }
  };

  // Filter users based on search term
  const filteredUsers = users
    ? users.filter(
        (user: any) =>
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (usersError) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Database Error
            </h2>
            <p className="text-gray-600 mb-4">{usersError}</p>
            <Button onClick={refetchUsers}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6 max-w-7xl mx-auto px-6 py-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">{adminUser?.name}</p>
              <p className="text-xs text-gray-600">{adminUser?.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Admin Stats with REAL data */}
        <div className="flex flex-col md:flex-row lg:flex-row justify-center items-center gap-x-10">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white w-1/4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Users</p>
                  <p className="text-2xl font-bold">{filteredUsers.length}</p>
                </div>
                <User className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white w-1/4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Exercise Plans</p>
                  <p className="text-2xl font-bold">{totalExercisePlans}</p>
                </div>
                <Dumbbell className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white w-1/4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Nutrition Plans</p>
                  <p className="text-2xl font-bold">{totalNutritionPlans}</p>
                </div>
                <Apple className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="training">Training Plans</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition Plans</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search users..."
                        className="pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={refetchUsers}
                      disabled={usersLoading}
                    >
                      <RefreshCw
                        className={`w-4 h-4 mr-2 ${
                          usersLoading ? "animate-spin" : ""
                        }`}
                      />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading users...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">ID</th>
                          <th className="text-left p-3">Email</th>
                          <th className="text-left p-3">Name</th>
                          <th className="text-left p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b">
                            <td className="p-3 text-sm font-mono">
                              {user.id.substring(0, 8)}...
                            </td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3">{user.name || "N/A"}</td>
                            <td className="p-3">
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewUser(user)}
                                >
                                  View
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Training Plans Tab */}
          <TabsContent value="training" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Training Plan Management</CardTitle>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search users or plans..."
                        className="pl-10 w-64"
                        value={trainingSearchTerm}
                        onChange={(e) => setTrainingSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={refetchAllUserInfo}
                      disabled={allUserInfoLoading}
                    >
                      <RefreshCw
                        className={`w-4 h-4 mr-2 ${
                          allUserInfoLoading ? "animate-spin" : ""
                        }`}
                      />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {allUserInfoLoading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading training plans...</p>
                  </div>
                ) : allUserInfoError ? (
                  <div className="text-center py-8">
                    <p className="text-red-500 mb-4">{allUserInfoError}</p>
                    <Button onClick={refetchAllUserInfo}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Plan Name</th>
                          <th className="text-left p-3">Status</th>
                          <th className="text-left p-3">Exercises</th>
                          <th className="text-left p-3">Created</th>
                          <th className="text-left p-3">Created By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredExercisePlans.map((userPlan) => (
                          <tr key={userPlan.id} className="border-b">
                            <td className="p-3 font-medium">
                              {userPlan.exercise_plan?.name}
                            </td>
                            <td className="p-3">
                              <Badge
                                variant={
                                  userPlan.exercise_plan?.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {userPlan.exercise_plan?.status}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Target className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm">
                                    {userPlan.exercise_plan?.exercises
                                      ?.length || 0}{" "}
                                    exercises
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {userPlan.exercise_plan?.exercises
                                    ?.slice(0, 3)
                                    .map((ex: any) => ex.name)
                                    .join(", ")}
                                  {(userPlan.exercise_plan?.exercises?.length ??
                                    0) > 3 && "..."}
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-sm">
                              {userPlan.exercise_plan?.createdAt
                                ? new Date(
                                    userPlan.exercise_plan.createdAt
                                  ).toLocaleDateString()
                                : ""}
                            </td>
                            <td className="p-3">
                              <div className="space-y-1">
                                <div className="font-medium">
                                  {userPlan.user_name || "Unknown User"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {userPlan.user_email}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredExercisePlans.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No training plans found
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nutrition Plans Tab */}
          <TabsContent value="nutrition" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Nutrition Plan Management</CardTitle>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search users or diet plans..."
                        className="pl-10 w-64"
                        value={nutritionSearchTerm}
                        onChange={(e) => setNutritionSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={refetchAllUserInfo}
                      disabled={allUserInfoLoading}
                    >
                      <RefreshCw
                        className={`w-4 h-4 mr-2 ${
                          allUserInfoLoading ? "animate-spin" : ""
                        }`}
                      />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {allUserInfoLoading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading nutrition plans...</p>
                  </div>
                ) : allUserInfoError ? (
                  <div className="text-center py-8">
                    <p className="text-red-500 mb-4">{allUserInfoError}</p>
                    <Button onClick={refetchAllUserInfo}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Plan Name</th>
                          <th className="text-left p-3">Meals</th>
                          <th className="text-left p-3">Calories</th>
                          <th className="text-left p-3">Created</th>
                          <th className="text-left p-3">Created By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredNutritionPlans.map((userPlan) => (
                          <tr key={userPlan.id} className="border-b">
                            <td className="p-3 font-medium">
                              {userPlan.nutrition_plan?.name}
                            </td>
                            <td className="p-3">
                              <Badge variant="secondary">
                                {userPlan.nutrition_plan?.mealsDone || 0}/
                                {userPlan.nutrition_plan?.totalMeals || 0}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Apple className="w-4 h-4 text-green-500" />
                                <span>
                                  {[
                                    ...(userPlan.nutrition_plan?.breakfast ||
                                      []),
                                    ...(userPlan.nutrition_plan?.lunch || []),
                                    ...(userPlan.nutrition_plan?.dinner || []),
                                    ...(userPlan.nutrition_plan?.snacks || []),
                                  ].reduce(
                                    (total, meal) =>
                                      total + (meal.calories || 0),
                                    0
                                  )}{" "}
                                  cal
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-sm">
                              {new Date(
                                userPlan.nutrition_plan?.createdAt ?? ""
                              ).toLocaleDateString()}
                            </td>
                            <td className="p-3">
                              <div className="space-y-1">
                                <div className="font-medium">
                                  {userPlan.user_name || "Unknown User"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {userPlan.user_email}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredNutritionPlans.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No nutrition plans found
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* User Details Modal */}
        <UserDetailsModal
          open={isModalOpen}
          onOpenChange={handleModalOpenChange}
          userInfo={userInfo}
          loading={userInfoLoading}
          userData={selectedUser || { id: "", email: "", name: "" }}
        />
      </div>
    </ProtectedRoute>
  );
}
