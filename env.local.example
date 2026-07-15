import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewForm from "@/components/ReviewForm";

export const revalidate = 0;

async function getReviews(productId) {
  let query = supabase
    .from("reviews")
    .select("*, products(name)")
    .order("created_at", { ascending: false });
  if (productId) query = query.eq("product_id", productId);
  const { data, error } = await query;
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

async function getProducts() {
  const { data } = await supabase.from("products").select("id, name").order("name");
  return data || [];
}

function Stars({ rating }) {
  return (
    <span className="text-accent tracking-tight" aria-label={`${rating} จาก 5 ดาว`}>
      {"★".repeat(rating)}
      <span className="text-line">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default async function ReviewsPage({ searchParams }) {
  const productId = searchParams?.product || "";
  const [reviews, products] = await Promise.all([getReviews(productId), getProducts()]);
  const avg =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <div className="mb-8">
          <p className="text-[11px] font-mono font-semibold uppercase tracking-widest text-primary mb-1.5">
            เสียงจากลูกค้า
          </p>
          <h1 className="font-display font-semibold text-2xl md:text-3xl mb-2">รีวิว</h1>
          {avg && (
            <p className="text-sm text-muted">
              คะแนนเฉลี่ย <Stars rating={Math.round(avg)} /> {avg} จาก {reviews.length} รีวิว
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-[1fr_360px] gap-10">
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-line rounded-2xl bg-surface">
                <p className="text-muted">ยังไม่มีรีวิว เป็นคนแรกที่รีวิวสิ!</p>
              </div>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="border border-line rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-ink">{r.reviewer_name}</p>
                    <Stars rating={r.rating} />
                  </div>
                  {r.products?.name && (
                    <p className="text-xs font-mono text-primary mb-2">{r.products.name}</p>
                  )}
                  {r.comment && <p className="text-muted leading-relaxed">{r.comment}</p>}
                  <p className="text-xs text-muted mt-3">
                    {new Date(r.created_at).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))
            )}
          </div>

          <div>
            <ReviewForm products={products} presetProductId={productId} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
