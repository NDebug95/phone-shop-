"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function formatPrice(n) {
  return new Intl.NumberFormat("th-TH").format(n);
}

export default function CheckoutPage({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [qrUrl, setQrUrl] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [slipFile, setSlipFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.replace(`/login?redirect=/checkout/${params.id}`);
        return;
      }
      setUser(sessionData.session.user);

      const [{ data: profile }, { data: productRow }, { data: setting }] = await Promise.all([
        supabase.from("profiles").select("full_name, phone").eq("id", sessionData.session.user.id).single(),
        supabase.from("products").select("*").eq("id", params.id).single(),
        supabase.from("site_settings").select("value").eq("key", "payment_qr_url").single(),
      ]);

      if (profile) {
        setBuyerName(profile.full_name || "");
        setBuyerPhone(profile.phone || "");
      }
      setProduct(productRow || null);
      setQrUrl(setting?.value || "");
      setLoading(false);
    }
    load();
  }, [params.id, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!slipFile) {
      setError("กรุณาแนบรูปสลิปการโอนเงิน");
      return;
    }
    setSubmitting(true);

    try {
      const ext = slipFile.name.split(".").pop();
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("payment-slips")
        .upload(path, slipFile);
      if (uploadError) throw uploadError;

      const { data: pub } = supabase.storage.from("payment-slips").getPublicUrl(path);

      const { error: insertError } = await supabase.from("orders").insert({
        user_id: user.id,
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        buyer_name: buyerName,
        buyer_phone: buyerPhone,
        address: address || null,
        slip_url: pub.publicUrl,
      });
      if (insertError) throw insertError;

      // Best-effort notification — order is already saved even if this fails
      fetch("/api/notify-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.name,
          price: product.price,
          buyerName,
          buyerPhone,
        }),
      }).catch(() => {});

      setDone(true);
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted">
        กำลังโหลด...
      </div>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="container-shell py-20 text-center text-muted">ไม่พบสินค้านี้</main>
        <Footer />
      </>
    );
  }

  if (done) {
    return (
      <>
        <Header />
        <main className="container-shell py-20 text-center max-w-md mx-auto">
          <span className="w-14 h-14 rounded-full bg-mint/15 text-mintDark flex items-center justify-center text-2xl mx-auto mb-4">
            ✓
          </span>
          <h1 className="font-display font-semibold text-2xl mb-2">รับคำสั่งซื้อแล้ว!</h1>
          <p className="text-muted mb-8">
            ทีมงานจะตรวจสอบสลิปการโอนเงินและยืนยันออเดอร์ของคุณเร็ว ๆ นี้
            ติดตามสถานะได้ที่หน้าบัญชีของฉัน
          </p>
          <div className="flex gap-3 justify-center">
            <a href="/account" className="btn-primary">ดูสถานะออเดอร์</a>
            <a href="/products" className="btn-secondary">เลือกซื้อสินค้าอื่น</a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14 max-w-3xl mx-auto">
        <h1 className="font-display font-semibold text-2xl mb-8">ยืนยันคำสั่งซื้อ</h1>

        <div className="border border-line rounded-2xl p-5 flex items-center gap-4 mb-8">
          {product.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt={product.name} className="w-16 h-16 rounded-lg object-cover bg-surface" />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-surface" />
          )}
          <div className="flex-1">
            <p className="font-semibold text-ink">{product.name}</p>
            <p className="text-sm text-muted">{product.condition}</p>
          </div>
          <p className="font-display font-semibold text-lg text-gradient">
            ฿{formatPrice(product.price)}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-surface rounded-2xl p-6 text-center">
            <p className="font-semibold mb-4">สแกน QR เพื่อโอนเงิน</p>
            {qrUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrUrl} alt="QR ชำระเงิน" className="w-56 h-56 object-contain mx-auto rounded-xl bg-white p-3" />
            ) : (
              <p className="text-sm text-muted py-16">
                ร้านค้ายังไม่ได้ตั้งค่า QR รับเงิน กรุณาติดต่อร้านค้าโดยตรง
              </p>
            )}
            <p className="font-display font-semibold text-xl mt-4">
              ยอดโอน ฿{formatPrice(product.price)}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium mb-1">ชื่อผู้สั่งซื้อ *</label>
            <input
              required
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="w-full border border-line rounded-lg px-3 py-2 mb-4 focus-ring"
            />

            <label className="block text-sm font-medium mb-1">เบอร์โทร *</label>
            <input
              required
              value={buyerPhone}
              onChange={(e) => setBuyerPhone(e.target.value)}
              className="w-full border border-line rounded-lg px-3 py-2 mb-4 focus-ring"
            />

            <label className="block text-sm font-medium mb-1">ที่อยู่จัดส่ง (ถ้ามี)</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full border border-line rounded-lg px-3 py-2 mb-4 focus-ring"
            />

            <label className="block text-sm font-medium mb-1">แนบสลิปการโอนเงิน *</label>
            <input
              required
              type="file"
              accept="image/*"
              onChange={(e) => setSlipFile(e.target.files?.[0] || null)}
              className="mb-4 text-sm"
            />

            {error && <p className="text-sm text-accentDark mb-4">{error}</p>}

            <button type="submit" disabled={submitting} className="btn-accent w-full">
              {submitting ? "กำลังส่งคำสั่งซื้อ..." : "ยืนยันการสั่งซื้อ"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
