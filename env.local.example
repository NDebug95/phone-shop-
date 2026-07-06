import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";

export const revalidate = 0;

function formatPrice(n) {
  if (n === null || n === undefined) return "";
  return new Intl.NumberFormat("th-TH").format(n);
}

async function getProduct(id) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const phone = process.env.NEXT_PUBLIC_SHOP_PHONE || "";
  const whatsapp = process.env.NEXT_PUBLIC_SHOP_WHATSAPP || phone;
  const images = product.images && product.images.length > 0 ? product.images : [];

  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <div className="aspect-square rounded-2xl bg-haze overflow-hidden mb-4">
              {images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={images[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted">
                  ไม่มีรูปภาพ
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.slice(1).map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt={`${product.name} ${i + 2}`}
                    className="aspect-square object-cover rounded-lg bg-haze"
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            {product.brand && (
              <p className="text-xs uppercase tracking-widest text-muted mb-2">{product.brand}</p>
            )}
            <h1 className="font-display font-extrabold text-3xl md:text-4xl mb-4">
              {product.name}
            </h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {product.condition && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent/10 text-accentDark">
                  เกรด {product.condition}
                </span>
              )}
              {product.storage_gb && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-haze text-muted">
                  {product.storage_gb}
                </span>
              )}
              {product.color && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-haze text-muted">
                  สี{product.color}
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-3xl font-extrabold">฿{formatPrice(product.price)}</span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-lg text-muted line-through">
                  ฿{formatPrice(product.original_price)}
                </span>
              )}
            </div>

            {!product.in_stock && (
              <p className="text-sm font-semibold text-red-500 mb-4">สินค้านี้ถูกจำหน่ายแล้ว</p>
            )}

            {product.description && (
              <p className="text-muted leading-relaxed whitespace-pre-line mb-8 mt-4">
                {product.description}
              </p>
            )}

            {product.in_stock && (
              <div className="flex flex-wrap gap-4">
                {phone && (
                  <a href={`tel:${phone}`} className="btn-primary">
                    โทรสอบถาม {phone}
                  </a>
                )}
                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
                      `สนใจสินค้า: ${product.name}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                  >
                    แชท WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
