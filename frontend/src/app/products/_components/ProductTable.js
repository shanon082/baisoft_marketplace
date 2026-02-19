export default function ProductTable({
    products,
    onEdit,
    onDelete,
    onApprove,
    canEdit,
    canApprove,
  }) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">${p.price}</td>
                <td className="px-4 py-2">
                  <span className={`status-${p.status}`}>
                    {p.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {canEdit && (
                    <>
                      <button
                        onClick={() => onEdit(p)}
                        className="text-blue-600 hover:underline mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(p.id)}
                        className="text-red-600 hover:underline mr-3"
                      >
                        Delete
                      </button>
                    </>
                  )}
                  {canApprove && p.status !== "approved" && (
                    <button
                      onClick={() => onApprove(p.id)}
                      className="text-green-600 hover:underline"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }