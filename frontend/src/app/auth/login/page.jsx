"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:py-10">
      <header className="app-shell mb-6">
        <div className="surface p-4">
          <p className="text-sm font-medium text-slate-700">Baisoft Marketplace</p>
        </div>
      </header>

      <div className="flex items-center justify-center">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="surface p-8 hidden lg:flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Baisoft</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Marketplace Control Center</h1>
            <p className="mt-4 text-slate-600">Manage products, approvals, and users in one place with clear role-based access.</p>
          </div>
          <p className="text-xs text-slate-500">Secure sign-in required</p>
        </div>

        <div className="surface p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Sign in</h2>
          <p className="text-sm text-slate-600 mt-1">Enter your account credentials to continue.</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="relative block w-full rounded-lg border border-slate-300 py-2.5 px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Username"
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full rounded-lg border border-slate-300 py-2.5 px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}
