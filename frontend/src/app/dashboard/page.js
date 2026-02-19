"use client";

import Link from "next/link";
import TopHeader from "../components/TopHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <TopHeader
        title="Dashboard"
        subtitle="Use quick links below to manage products, users, and public listings."
      />

      <div className="surface p-6">
        <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/products" className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium hover:bg-slate-50">
            Open Products
          </Link>
          <Link href="/users" className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium hover:bg-slate-50">
            Manage Users
          </Link>
          <Link href="/public" className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium hover:bg-slate-50">
            View Public Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
