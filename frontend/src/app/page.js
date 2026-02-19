"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, CheckCircle2, Package } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import TopHeader from "./components/TopHeader";
import ProductCard from "./products/_components/ProductCard";

function toArray(payload) {
  return Array.isArray(payload) ? payload : payload?.results || [];
}

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [internalProducts, setInternalProducts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setPageLoading(true);
        const [approvedRes, internalRes] = await Promise.all([
          api.get("/products/public/"),
          api.get("/products/"),
        ]);

        setApprovedProducts(toArray(approvedRes.data));
        setInternalProducts(toArray(internalRes.data));
      } catch (error) {
        console.error("Failed to load homepage activity", error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const myRecentActivity = useMemo(() => {
    if (!user) return [];
    return internalProducts
      .filter((product) => product.created_by === user.username)
      .slice(0, 5);
  }, [internalProducts, user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="surface text-center p-8 sm:p-10 max-w-lg w-full">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3 tracking-tight">Baisoft Product Marketplace</h2>
          <p className="text-slate-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TopHeader
        title="Home"
        subtitle="Track your product activity and discover recently approved items."
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="surface p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">My Products</p>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-3xl font-semibold text-slate-900">{myRecentActivity.length}</p>
            <Package className="h-5 w-5 text-indigo-600" />
          </div>
        </article>
        <article className="surface p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">Approved Visible</p>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-3xl font-semibold text-slate-900">{approvedProducts.length}</p>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
        </article>
        <article className="surface p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">Business Activity</p>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-3xl font-semibold text-slate-900">{internalProducts.length}</p>
            <Activity className="h-5 w-5 text-amber-600" />
          </div>
        </article>
      </section>

      <section className="surface p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">Recent Activity For {user.username}</h2>
        <p className="text-sm text-slate-600 mt-1">Latest products created by your account.</p>

        {pageLoading ? (
          <p className="mt-4 text-sm text-slate-500">Loading activity...</p>
        ) : myRecentActivity.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No recent activity yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {myRecentActivity.map((product) => (
              <div key={product.id} className="rounded-lg border border-slate-200 bg-white px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="font-medium text-slate-900">{product.name}</p>
                  <p className="text-xs text-slate-500">Status: {product.status}</p>
                </div>
                <span className="text-sm font-semibold text-slate-800">${product.price}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Recently Approved Products</h2>
        {approvedProducts.length === 0 ? (
          <div className="surface p-6 text-sm text-slate-500">No approved products available yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {approvedProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
