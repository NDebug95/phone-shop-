import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const revalidate = 0;

async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export default async function ProductsPage({ searchParams }) {
  const products = await getProducts();
  const q = (searchParams?.q || "").trim().toLowerCase();
  const brand = searchParams?.brand || "";

  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];

  let filtered = products;
  if (brand) filtered = filtered.filter((p) => p.brand === brand);
  if (q) filtered = filtered.filter((p) => p.name.toLowerCase().includes(q));

  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <div className="mb-8">
          <p className="text-[11px] font-mono font-semibold uppercase tracking-widest text-primary mb-1.5">
            คลังสินค้า
          </p>
          <h1 className="font-display font-semibold text-2xl md:text-3xl">สินค้าทั้งหมด</h1>
        </div>

        <form className="mb-6" action="/products" method="get">
          <input
            type="text"
            name="q"
            defaultValue={searchParams?.q || ""}
            placeholder="ค้นหาชื่อรุ่น..."
            className="w-full max-w-md border border-line rounded-full px-5 py-2.5 focus-ring text-sm"
          />
          {brand && <input type="hidden" name="brand" value={brand} />}
        </form>

        {brands.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/products"
              className={`text-xs font-mono font-semibold px-3.5 py-2 rounded-full border transition-colors ${
                !brand ? "bg-ink text-white border-ink" : "border-line text-muted hover:border-primary hover:text-primary"
              }`}
            >
              ทั้งหมด
            </Link>
            {brands.map((b) => (
              <Link
                key={b}
                href={`/products?brand=${encodeURIComponent(b)}`}
                className={`text-xs font-mono font-semibold px-3.5 py-2 rounded-full border transition-colors ${
                  brand === b ? "bg-ink text-white border-ink" : "border-line text-muted hover:border-primary hover:text-primary"
                }`}
              >
                {b}
              </Link>
            ))}
          </div>
        )}

        <p className="text-sm text-muted font-mono mb-4">{filtered.length} รายการ</p>

        {filtered.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-line rounded-2xl bg-surface">
            <p className="text-muted">ไม่พบสินค้าที่ค้นหา</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
