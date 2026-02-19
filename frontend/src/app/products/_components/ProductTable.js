"use client";

import { Pencil, Trash2, CheckCircle, Eye } from "lucide-react";

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onApprove,
  onView,
  canEdit,
  canDelete,
  canApprove,
}) {
  const resolveImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith("http://") || image.startsWith("https://")) return image;

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    const backendBase = apiBase.replace(/\/api\/?$/, "");
    return `${backendBase}${image}`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { bg: "bg-gray-100", text: "text-gray-800", label: "Draft" },
      pending_approval: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending Approval" },
      approved: { bg: "bg-green-100", text: "text-green-800", label: "Approved" },
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <div className="text-gray-500">No products found</div>
      </div>
    );
  }

  return (
    <div className="surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {product.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.image ? (
                    <img
                      src={resolveImageUrl(product.image)}
                      alt={product.name}
                      className="h-12 w-12 rounded object-cover border border-gray-200"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No image</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ${parseFloat(product.price).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(product.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.created_by}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {onView && (
                      <button
                        onClick={() => onView(product)}
                        className="text-gray-600 hover:text-gray-900"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    
                    {canEdit && (
                      <button
                        onClick={() => onEdit(product)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit product"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}

                    {canDelete && (
                      <>
                        <button
                          onClick={() => onDelete(product.id, product.name)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    
                    {canApprove && product.status !== "approved" && (
                      <button
                        onClick={() => onApprove(product.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Approve product"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
