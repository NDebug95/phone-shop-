import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

export const revalidate = 0;

async function getBrandProducts(brand) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("brand", brand)
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export default async function BrandPage({ params }) {
  const brand = decodeURIComponent(params.brand);
  const products = await getBrandProducts(brand);

  return (
    <>
      <Header />
      <main>
        <section className="bg-ink text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(500px circle at 15% 30%, rgba(108,92,231,0.35), transparent 60%), radial-gradient(400px circle at 85% 70%, rgba(255,84,112,0.28), transparent 60%)",
            }}
          />
          <div className="container-shell py-14 md:py-20 relative">
            <p className="text-mint font-mono font-semibold text-xs tracking-widest uppercase mb-3">
              ยี่ห้อ
            </p>
            <h1 className="font-display font-semibold text-3xl md:text-5xl">{brand}</h1>
            <p className="text-white/60 mt-3">{products.length} รุ่นในสต็อก</p>
          </div>
        </section>

        <section className="container-shell py-12 md:py-16">
          {products.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-line rounded-2xl bg-surface">
              <p className="text-muted">ยังไม่มีสินค้ายี่ห้อนี้ในสต็อกตอนนี้</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
