export default function ProductCard({ product }) {
    const resolveImageUrl = (image) => {
      if (!image) return null;
      if (image.startsWith("http://") || image.startsWith("https://")) return image;

      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const backendBase = apiBase.replace(/\/api\/?$/, "");
      return `${backendBase}${image}`;
    };

    const imageUrl = resolveImageUrl(product.image);

    return (
      <div className="surface overflow-hidden h-full">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-44 object-cover"
          />
        )}
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-2 text-slate-900">{product.name}</h3>
          <p className="text-slate-600 mb-4 line-clamp-3">{product.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-slate-900">${product.price}</span>
            <span className="status-approved">Approved</span>
          </div>
        </div>
      </div>
    );
  }
