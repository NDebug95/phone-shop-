"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone } },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      router.push(redirect);
    } else {
      // Email confirmation is required before this account can sign in
      setNeedsConfirm(true);
    }
  }

  if (needsConfirm) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm bg-white border border-line rounded-2xl p-8 shadow-sm text-center">
          <h1 className="font-display font-semibold text-xl mb-2">ยืนยันอีเมลของคุณ</h1>
          <p className="text-sm text-muted">
            เราส่งลิงก์ยืนยันไปที่ {email} แล้ว กรุณาเปิดอีเมลและกดยืนยัน
            ก่อนเข้าสู่ระบบครั้งแรก
          </p>
          <Link href="/login" className="btn-primary inline-flex mt-6">
            ไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border border-line rounded-2xl p-8 shadow-sm">
        <span className="w-10 h-10 rounded-xl bg-grad-brand flex items-center justify-center mb-4">
          <span className="w-3 h-3 rounded-full bg-white/95" />
        </span>
        <h1 className="font-display font-semibold text-2xl mb-1">สมัครสมาชิก</h1>
        <p className="text-sm text-muted mb-6">สมัครฟรี เพื่อสั่งซื้อและติดตามออเดอร์</p>

        <label className="block text-sm font-medium mb-1">ชื่อ-นามสกุล</label>
        <input
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border border-line rounded-lg px-3 py-2 mb-4 focus-ring"
        />

        <label className="block text-sm font-medium mb-1">เบอร์โทร</label>
        <input
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-line rounded-lg px-3 py-2 mb-4 focus-ring"
        />

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
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-line rounded-lg px-3 py-2 mb-4 focus-ring"
        />

        {error && <p className="text-sm text-accentDark mb-4">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
        </button>

        <p className="text-sm text-muted mt-6 text-center">
          มีบัญชีอยู่แล้ว?{" "}
          <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-primaryDark font-semibold">
            เข้าสู่ระบบ
          </Link>
        </p>
      </form>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>
      <Footer />
    </>
  );
}
