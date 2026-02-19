"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import ProductTable from "@/components/ProductTable";
import ProductForm from "@/components/ProductForm";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const canEdit = user.role === "admin" || user.role === "editor";
  const canApprove = user.role === "admin" || user.role === "approver";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products/");
      setProducts(res.data);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}/`, data);
        toast.success("Product updated");
      } else {
        await api.post("/products/", data);
        toast.success("Product created");
      }
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}/`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.patch(`/products/${id}/approve/`);
      toast.success("Product approved");
      fetchProducts();
    } catch (err) {
      toast.error("Approval failed");
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Products</h1>
        {canEdit && (
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            + New Product
          </button>
        )}
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      <ProductTable
        products={products}
        onEdit={startEdit}
        onDelete={handleDelete}
        onApprove={handleApprove}
        canEdit={canEdit}
        canApprove={canApprove}
      />
    </div>
  );
}