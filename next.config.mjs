import Link from "next/link";

function formatPrice(n) {
  if (n === null || n === undefined) return "";
  return new Intl.NumberFormat("th-TH").format(n);
}

export default function ProductCard({ product }) {
  const cover = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block rounded-2xl border border-line bg-white overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 focus-ring"
    >
      <div className="aspect-square bg-haze flex items-center justify-center overflow-hidden">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-muted text-sm">ไม่มีรูปภาพ</span>
        )}
      </div>
      <div className="p-4">
        {product.brand && (
          <p className="text-xs uppercase tracking-wide text-muted mb-1">{product.brand}</p>
        )}
        <h3 className="font-semibold text-ink leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          {product.condition && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accentDark">
              {product.condition}
            </span>
          )}
          {product.storage_gb && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-haze text-muted">
              {product.storage_gb}
            </span>
          )}
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-ink">
            ฿{formatPrice(product.price)}
          </span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-sm text-muted line-through">
              ฿{formatPrice(product.original_price)}
            </span>
          )}
        </div>
        {!product.in_stock && (
          <p className="mt-2 text-xs font-semibold text-red-500">ขายแล้ว</p>
        )}
      </div>
    </Link>
  );
}
