"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import ProductCard from "../products/_components/ProductCard";
import TopHeader from "../components/TopHeader";

export default function PublicProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublic = async () => {
      try {
        const res = await api.get("/products/public/");
        const payload = res.data;
        setProducts(Array.isArray(payload) ? payload : payload?.results || []);
      } catch (err) {
        console.error("Failed to load public products");
      } finally {
        setLoading(false);
      }
    };
    fetchPublic();
  }, []);

  if (loading) return <div>Loading marketplace...</div>;

  return (
    <div className="space-y-6">
      <TopHeader
        title="Public Marketplace"
        subtitle="Browse products that have been approved for public visibility."
      />

      <div className="surface p-5 sm:p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Public Marketplace</h1>
        <p className="text-sm text-slate-600 mt-1">Only approved products appear here.</p>
      </div>
      {products.length === 0 ? (
        <div className="surface p-8 text-center text-slate-500">No approved products available yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
