"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace(redirect);
    });
  }, [router, redirect]);

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
    router.push(redirect);
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border border-line rounded-2xl p-8 shadow-sm">
        <span className="w-10 h-10 rounded-xl bg-grad-brand flex items-center justify-center mb-4">
          <span className="w-3 h-3 rounded-full bg-white/95" />
        </span>
        <h1 className="font-display font-semibold text-2xl mb-1">เข้าสู่ระบบ</h1>
        <p className="text-sm text-muted mb-6">เข้าสู่ระบบเพื่อสั่งซื้อและดูประวัติออเดอร์</p>

        <label className="block text-sm font-medium mb-1">อีเมล</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-line rounded-lg px-3 py-2 mb-4 focus-ring"
        />

        <label className="block text-sm font-medium mb-1">รหัสผ่าน</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-line rounded-lg px-3 py-2 mb-4 focus-ring"
        />

        {error && <p className="text-sm text-accentDark mb-4">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>

        <p className="text-sm text-muted mt-6 text-center">
          ยังไม่มีบัญชี?{" "}
          <Link href={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-primaryDark font-semibold">
            สมัครสมาชิก
          </Link>
        </p>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
      <Footer />
    </>
  );
}
