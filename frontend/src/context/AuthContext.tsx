"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user from token on mount (only once)
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/users/me/");  
        setUser(response.data);
      } catch (err) {
        console.error("Failed to load user:", err);
        localStorage.removeItem("access_token");
        toast.error("Session expired. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);   

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);

      const res = await api.post("/token/", { username, password });

      const { access, refresh } = res.data;   

      localStorage.setItem("access_token", access);
      if (refresh) {
        localStorage.setItem("refresh_token", refresh);
      }

      // Immediately fetch current user
      const userRes = await api.get("/users/me/");
      setUser(userRes.data);

      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      const message =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        "Invalid username or password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    toast.success("You have been logged out");
    router.push("/auth/login");
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};