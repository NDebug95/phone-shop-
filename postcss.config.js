"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const STATUS_LABEL = {
  pending: { text: "รอตรวจสอบสลิป", className: "text-white bg-primary" },
  confirmed: { text: "ยืนยันแล้ว", className: "text-white bg-mintDark" },
  rejected: { text: "ปฏิเสธ", className: "text-white bg-accentDark" },
};

function formatPrice(n) {
  return new Intl.NumberFormat("th-TH").format(n);
}

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login?redirect=/account");
        return;
      }
      setUser(data.session.user);
      const { data: orderRows } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", data.session.user.id)
        .order("created_at", { ascending: false });
      setOrders(orderRows || []);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted">
        กำลังโหลด...
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="container-shell py-10 md:py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[11px] font-mono font-semibold uppercase tracking-widest text-primary mb-1.5">
              บัญชีของฉัน
            </p>
            <h1 className="font-display font-semibold text-2xl">{user?.email}</h1>
          </div>
          <button onClick={handleLogout} className="btn-secondary">
            ออกจากระบบ
          </button>
        </div>

        <h2 className="font-display font-semibold text-lg mb-4">ประวัติการสั่งซื้อ</h2>

        {orders.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-line rounded-2xl bg-surface">
            <p className="text-muted">ยังไม่มีประวัติการสั่งซื้อ</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => {
              const status = STATUS_LABEL[o.status] || STATUS_LABEL.pending;
              return (
                <div key={o.id} className="border border-line rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-ink">{o.product_name}</p>
                    <p className="text-sm text-muted font-mono">฿{formatPrice(o.price)}</p>
                    <p className="text-xs text-muted mt-1">
                      {new Date(o.created_at).toLocaleString("th-TH")}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${status.className}`}>
                    {status.text}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
