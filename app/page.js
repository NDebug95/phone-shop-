import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

export const revalidate = 0;

const BRAND_COLORS = [
  "bg-primary",
  "bg-accent",
  "bg-mint",
  "bg-primaryDark",
  "bg-accentDark",
  "bg-mintDark",
];

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

function getBrandShortcuts(products) {
  const seen = new Map();
  for (const p of products) {
    if (!p.brand) continue;
    seen.set(p.brand, (seen.get(p.brand) || 0) + 1);
  }
  const brands = [...seen.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([brand, count], i) => ({
      brand,
      count,
      color: BRAND_COLORS[i % BRAND_COLORS.length],
    }));
  return brands;
}

export default async function HomePage() {
  const products = await getProducts();
  const brandShortcuts = getBrandShortcuts(products);

  return (
    <>
      <Header />
      <main>
        {/* Hero — a "home screen" motif: headline + app-icon-style brand
            shortcuts, echoing the exact object being sold. */}
        <section className="bg-ink text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(600px circle at 15% 20%, rgba(108,92,231,0.35), transparent 60%), radial-gradient(500px circle at 85% 75%, rgba(255,84,112,0.28), transparent 60%)",
            }}
          />
          <div className="container-shell py-20 md:py-28 relative">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-mint font-mono font-semibold text-xs tracking-widest uppercase mb-4">
                  ● มือถือมือสอง ตรวจสอบแล้วทุกเครื่อง
                </p>
                <h1 className="font-display font-semibold text-4xl md:text-6xl leading-tight mb-6">
                  คุณภาพที่มั่นใจได้
                  <br />
                  <span className="text-gradient">ในราคาที่คุ้มค่า</span>
                </h1>
                <p className="text-white/70 text-base md:text-lg mb-8 max-w-md">
                  ทุกเครื่องผ่านการตรวจเช็คสภาพจริงก่อนวางขาย
                  พร้อมแจ้งเกรดและอาการอย่างตรงไปตรงมา
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="#products" className="btn-accent">
                    ดูสินค้าทั้งหมด
                  </a>
                  <a
                    href="#contact"
                    className="btn-secondary !border-white/25 !text-white hover:!bg-white hover:!text-ink"
                  >
                    ติดต่อสอบถาม
                  </a>
                </div>
              </div>

              {/* Brand shortcuts — real category shortcuts styled like a
                  phone's app grid, not decoration */}
              <div className="hidden md:block">
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-sm">
                  <p className="text-[11px] font-mono text-white/50 mb-4 px-1">
                    เลือกดูตามยี่ห้อ
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    {(brandShortcuts.length > 0
                      ? brandShortcuts
                      : [
                          { brand: "Apple", color: "bg-primary" },
                          { brand: "Samsung", color: "bg-accent" },
                          { brand: "Xiaomi", color: "bg-mint" },
                        ]
                    ).map((b) => (
                      <a
                        key={b.brand}
                        href="#products"
                        className="flex flex-col items-center gap-2 group"
                      >
                        <span
                          className={`w-14 h-14 rounded-2xl ${b.color} flex items-center justify-center text-white font-display font-semibold text-lg shadow-lg group-hover:scale-105 group-hover:-translate-y-0.5 transition-transform`}
                        >
                          {b.brand.charAt(0).toUpperCase()}
                        </span>
                        <span className="text-[11px] text-white/70 font-medium">
                          {b.brand}
                        </span>
                      </a>
                    ))}
                    <a
                      href="#products"
                      className="flex flex-col items-center gap-2 group"
                    >
                      <span className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white/80 font-display font-semibold text-lg group-hover:scale-105 group-hover:-translate-y-0.5 transition-transform">
                        +
                      </span>
                      <span className="text-[11px] text-white/70 font-medium">
                        ทั้งหมด
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product grid */}
        <section id="products" className="container-shell py-16 md:py-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[11px] font-mono font-semibold uppercase tracking-widest text-primary mb-1.5">
                คลังสินค้า
              </p>
              <h2 className="font-display font-semibold text-2xl md:text-3xl">
                สินค้าทั้งหมด
              </h2>
            </div>
            <p className="text-sm text-muted font-mono">{products.length} รายการ</p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-line rounded-2xl bg-surface">
              <p className="text-muted">
                ยังไม่มีสินค้าในระบบ — เข้าสู่หน้าแอดมินเพื่อเพิ่มสินค้าชิ้นแรก
              </p>
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
