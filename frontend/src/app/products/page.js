"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import ProductForm from "./_components/ProductForm";
import ProductTable from "./_components/ProductTable";
import ConfirmDialog from "../components/ConfirmDialog";
import TopHeader from "../components/TopHeader";
import toast from "react-hot-toast";
import { PlusCircle, AlertCircle } from "lucide-react";

export default function ProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, productId: null, productName: "" });
  const canEdit = user?.is_superuser || ["admin", "editor", "approver"].includes(user?.role);
  const canDelete = user?.is_superuser || ["admin", "editor"].includes(user?.role);
  const canApprove = user?.is_superuser || ["admin", "approver"].includes(user?.role);

  useEffect(() => {
    if (!authLoading && user) {
      fetchProducts();
    }
  }, [authLoading, user]);

  // Wait for auth to load
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Authentication Error</h3>
        <p className="mt-1 text-sm text-gray-500">Please log in to view products.</p>
      </div>
    );
  }

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products/");
      const payload = res.data;
      setProducts(Array.isArray(payload) ? payload : payload?.results || []);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || "Failed to load products";
      toast.error(errorMessage);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    if (data.image) {
      formData.append("image", data.image);
    }

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated successfully");
      } else {
        await api.post("/products/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product created successfully");
      }
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          err.response?.data?.error ||
                          "Operation failed";
      toast.error(errorMessage);
      console.error("Error saving product:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/products/${deleteConfirm.productId}/`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Delete failed";
      toast.error(errorMessage);
      console.error("Error deleting product:", err);
    } finally {
      setDeleteConfirm({ isOpen: false, productId: null, productName: "" });
    }
  };

  const confirmDelete = (id, name) => {
    setDeleteConfirm({
      isOpen: true,
      productId: id,
      productName: name
    });
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleApprove = async (id) => {
    try {
      await api.patch(`/products/${id}/approve/`);
      toast.success("Product approved successfully");
      fetchProducts();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Approval failed";
      toast.error(errorMessage);
      console.error("Error approving product:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TopHeader
        title="Products"
        subtitle="Manage your business products with role-based actions."
      />

      {/* Header */}
      <div className="surface p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Products</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage your business products
          </p>
        </div>
        {canEdit && !showForm && (
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="inline-flex w-full sm:w-auto items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            New Product
          </button>
        )}
      </div>

      {/* Product Form */}
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

      {/* Products Table */}
      <ProductTable
        products={products}
        onEdit={startEdit}
        onDelete={confirmDelete}
        onApprove={handleApprove}
        canEdit={canEdit}
        canDelete={canDelete}
        canApprove={canApprove}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, productId: null, productName: "" })}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteConfirm.productName}"? This action cannot be undone.`}
      />
    </div>
  );
}
