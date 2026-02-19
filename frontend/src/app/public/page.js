"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export default function PublicProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublic = async () => {
      try {
        const res = await api.get("/products/public/");
        setProducts(res.data);
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
    <div>
      <h1 className="text-2xl font-bold mb-6">Public Marketplace</h1>
      {products.length === 0 ? (
        <p className="text-gray-500">No approved products available yet.</p>
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