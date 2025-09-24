// contexts/AuthContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AdminUser {
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded admin credentials (you can move this to environment variables)
const ADMIN_CREDENTIALS = [
  {
    email: "admin@fitness.com",
    password: "admin123", // Change this to a strong password
    name: "Super Admin",
    role: "admin",
  },
  {
    email: "trainer@fitness.com",
    password: "trainer123",
    name: "Head Trainer",
    role: "trainer",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user was previously logged in
    const savedAuth = localStorage.getItem("admin_auth");
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setAdminUser(authData.user);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const admin = ADMIN_CREDENTIALS.find(
      (cred) => cred.email === email && cred.password === password
    );

    if (admin) {
      const userData = {
        name: admin.name,
        email: admin.email,
        role: admin.role,
      };
      setIsAuthenticated(true);
      setAdminUser(userData);
      localStorage.setItem(
        "admin_auth",
        JSON.stringify({
          user: userData,
          timestamp: Date.now(),
        })
      );
      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem("admin_auth");
  };

  const value = {
    isAuthenticated,
    adminUser,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
