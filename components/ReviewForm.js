"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ReviewForm({ products, presetProductId }) {
  const router = useRouter();
  const [session, setSession] = useState(undefined); // undefined = loading
  const [productId, setProductId] = useState(presetProductId || "");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!session) {
      router.push("/login?redirect=/reviews");
      return;
    }
    if (!productId) {
      setMessage("กรุณาเลือกสินค้าที่ต้องการรีวิว");
      return;
    }
    setSaving(true);
    setMessage("");

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", session.user.id)
      .single();

    const { error } = await supabase.from("reviews").insert({
      user_id: session.user.id,
      product_id: productId,
      reviewer_name: profile?.full_name || "ลูกค้า",
      rating,
      comment,
    });

    setSaving(false);
    if (error) {
      setMessage(`ส่งรีวิวไม่สำเร็จ: ${error.message}`);
      return;
    }
    setComment("");
    setMessage("ขอบคุณสำหรับรีวิว!");
    router.refresh();
  }

  if (session === undefined) return null;

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-line rounded-2xl p-6">
      <h2 className="font-display font-semibold text-lg mb-4">เขียนรีวิว</h2>

      {!session && (
        <p className="text-sm text-muted mb-4">
          กรุณา{" "}
          <a href="/login?redirect=/reviews" className="text-primaryDark font-semibold">
            เข้าสู่ระบบ
          </a>{" "}
          ก่อนเขียนรีวิว
        </p>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">สินค้าที่ต้องการรีวิว</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full border border-line rounded-lg px-3 py-2 focus-ring"
            disabled={!session}
          >
            <option value="">เลือกสินค้า</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">คะแนน</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setRating(n)}
                disabled={!session}
                className={`text-2xl leading-none ${n <= rating ? "text-accent" : "text-line"}`}
                aria-label={`${n} ดาว`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ความคิดเห็น</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            disabled={!session}
            className="w-full border border-line rounded-lg px-3 py-2 focus-ring"
            placeholder="บอกเล่าประสบการณ์การใช้งาน..."
          />
        </div>
      </div>

      {message && <p className="text-sm mt-3 text-primaryDark">{message}</p>}

      <button type="submit" disabled={saving} className="btn-primary mt-4">
        {saving ? "กำลังส่ง..." : session ? "ส่งรีวิว" : "เข้าสู่ระบบเพื่อรีวิว"}
      </button>
    </form>
  );
}
