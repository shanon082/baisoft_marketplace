"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
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
        const response = await api.get("/users/me/");   // assumes you have this endpoint
        setUser(response.data);
      } catch (err) {
        console.error("Failed to load user:", err);
        localStorage.removeItem("access_token");
        // Optional: also remove refresh token if you use it
        // localStorage.removeItem("refresh_token");
        toast.error("Session expired. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);   

  const login = async (username, password) => {
    try {
      setLoading(true);   // optional: show loading during login

      const res = await api.post("/token/", { username, password });

      const { access, refresh } = res.data;   // assuming DRF SimpleJWT returns both

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
    // localStorage.removeItem("refresh_token");   // if you use refresh tokens
    setUser(null);
    toast.success("You have been logged out");
    router.push("/login");
  };

  // Optional: refresh token logic (uncomment if needed)
  /*
  const refreshAccessToken = async () => {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) return false;

    try {
      const res = await api.post("/token/refresh/", { refresh });
      localStorage.setItem("access_token", res.data.access);
      return true;
    } catch (err) {
      logout(); // refresh failed → force logout
      return false;
    }
  };
  */

  const value = {
    user,
    loading,
    login,
    logout,
    // refreshAccessToken,   // if you implement refresh
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