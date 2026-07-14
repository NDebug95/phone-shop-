import Link from "next/link";
import GradeGauge from "./GradeGauge";

function formatPrice(n) {
  if (n === null || n === undefined) return "";
  return new Intl.NumberFormat("th-TH").format(n);
}

export default function ProductCard({ product }) {
  const cover = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block rounded-2xl border border-line bg-white overflow-hidden hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30 transition-all duration-200 focus-ring"
    >
      <div className="aspect-square bg-surface flex items-center justify-center overflow-hidden relative">
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
        {!product.in_stock && (
          <span className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-ink/85 text-white backdrop-blur">
            ขายแล้ว
          </span>
        )}
      </div>
      <div className="p-4">
        {product.brand && (
          <p className="text-[11px] font-mono font-semibold uppercase tracking-wide text-primary mb-1">
            {product.brand}
          </p>
        )}
        <h3 className="font-display font-semibold text-ink leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {product.condition && <GradeGauge condition={product.condition} compact />}
          {product.storage_gb && (
            <span className="text-[11px] font-mono font-semibold px-2 py-1 rounded-full bg-surface text-muted">
              {product.storage_gb}
            </span>
          )}
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-display font-semibold text-ink">
            ฿{formatPrice(product.price)}
          </span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-sm text-muted line-through font-mono">
              ฿{formatPrice(product.original_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
