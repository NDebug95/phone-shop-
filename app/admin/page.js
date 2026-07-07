"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/admin/dashboard");
    });
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }
    router.push("/admin/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-haze px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border border-line rounded-2xl p-8 shadow-sm"
      >
        <h1 className="font-display font-extrabold text-2xl mb-1">เข้าสู่ระบบแอดมิน</h1>
        <p className="text-sm text-muted mb-6">จัดการสินค้าในร้านของคุณ</p>

        <label className="block text-sm font-medium mb-1">อีเมล</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-line rounded-lg px-3 py-2 mb-4 focus-ring"
          placeholder="you@example.com"
        />

        <label className="block text-sm font-medium mb-1">รหัสผ่าน</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-line rounded-lg px-3 py-2 mb-4 focus-ring"
          placeholder="••••••••"
        />

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>

        <p className="text-xs text-muted mt-6 leading-relaxed">
          บัญชีแอดมินสร้างจากหน้า Supabase Dashboard ของคุณเท่านั้น
          (ดูวิธีในคู่มือที่แนบมา)
        </p>
      </form>
    </main>
  );
}
