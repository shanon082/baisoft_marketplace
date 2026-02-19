"use client";

import Link from "next/link";
import { Home, LogOut, Package, Users, Globe } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function TopHeader({ title, subtitle }) {
  const { user, logout } = useAuth();
  const isAdmin = user?.is_superuser || user?.role === "admin";

  return (
    <header className="surface p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50">
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link href="/products" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50">
            <Package className="h-4 w-4" />
            Products
          </Link>
          <Link href="/public" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50">
            <Globe className="h-4 w-4" />
            Public
          </Link>
          {isAdmin && (
            <Link href="/users" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50">
              <Users className="h-4 w-4" />
              Users
            </Link>
          )}

          {user ? (
            <>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize">
                {user.username} • {user.role}
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
