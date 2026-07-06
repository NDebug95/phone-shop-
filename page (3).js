import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

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

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <Header />
      <main>
        {/* Hero — mirrors the confident, full-bleed product-hero pattern */}
        <section className="bg-ink text-white">
          <div className="container-shell py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-4">
                มือถือมือสอง ตรวจสอบแล้ว
              </p>
              <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-tight mb-6">
                คุณภาพที่มั่นใจได้
                <br />
                ในราคาที่คุ้มค่า
              </h1>
              <p className="text-white/70 text-base md:text-lg mb-8 max-w-md">
                ทุกเครื่องผ่านการตรวจเช็คสภาพจริงก่อนวางขาย
                พร้อมแจ้งเกรดและอาการอย่างตรงไปตรงมา
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#products" className="btn-primary">
                  ดูสินค้าทั้งหมด
                </a>
                <a href="#contact" className="btn-secondary !border-white !text-white hover:!bg-white hover:!text-ink">
                  ติดต่อสอบถาม
                </a>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="w-64 h-80 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center">
                <div className="w-40 h-64 rounded-[2rem] bg-gradient-to-b from-white/20 to-white/5 border border-white/10" />
              </div>
            </div>
          </div>
        </section>

        {/* Product grid */}
        <section id="products" className="container-shell py-16 md:py-24">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display font-extrabold text-2xl md:text-3xl">
              สินค้าทั้งหมด
            </h2>
            <p className="text-sm text-muted">{products.length} รายการ</p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-line rounded-2xl">
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
