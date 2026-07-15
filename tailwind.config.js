"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function AuthNav() {
  const [status, setStatus] = useState("loading"); // loading | guest | customer | admin

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (!data.session) {
        setStatus("guest");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", data.session.user.id)
        .single();
      if (!mounted) return;
      setStatus(profile?.is_admin ? "admin" : "customer");
    }

    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (status === "loading") {
    return <span className="w-16 h-4 rounded bg-surface animate-pulse inline-block" />;
  }

  if (status === "guest") {
    return (
      <Link href="/login" className="text-sm font-semibold text-primaryDark hover:text-primary transition-colors">
        เข้าสู่ระบบ
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {status === "admin" && (
        <Link href="/admin/dashboard" className="text-sm text-muted hover:text-primary transition-colors hidden sm:inline">
          แอดมิน
        </Link>
      )}
      <Link href="/account" className="text-sm font-semibold text-primaryDark hover:text-primary transition-colors">
        บัญชีของฉัน
      </Link>
    </div>
  );
}
