"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const STATUS_LABEL = {
  pending: { text: "รอตรวจสอบ", className: "bg-primary text-white" },
  confirmed: { text: "ยืนยันแล้ว", className: "bg-mintDark text-white" },
  rejected: { text: "ปฏิเสธ", className: "bg-accentDark text-white" },
};

function formatPrice(n) {
  return new Intl.NumberFormat("th-TH").format(n);
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [orders, setOrders] = useState([]);

  const loadOrders = useCallback(async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("status", { ascending: true })
      .order("created_at", { ascending: false });
    setOrders(data || []);
  }, []);

  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/admin");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", data.session.user.id)
        .single();
      if (!profile?.is_admin) {
        router.replace("/admin");
        return;
      }
      setChecking(false);
      loadOrders();
    }
    check();
  }, [router, loadOrders]);

  async function updateStatus(id, status) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (!error) loadOrders();
  }

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center text-muted">กำลังตรวจสอบสิทธิ์...</div>;
  }

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <main className="min-h-screen bg-surface pb-24">
      <header className="bg-white border-b border-line sticky top-0 z-30">
        <div className="container-shell h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="font-display font-semibold">แผงควบคุมแอดมิน</Link>
            <Link href="/admin/dashboard" className="text-sm text-muted hover:text-primary">สินค้า</Link>
            <span className="text-sm font-semibold text-primaryDark">ออเดอร์</span>
            <Link href="/admin/settings" className="text-sm text-muted hover:text-primary">ตั้งค่า QR</Link>
          </div>
          <a href="/" className="text-sm text-muted hover:text-primary">ดูหน้าร้าน</a>
        </div>
      </header>

      <div className="container-shell pt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-semibold text-xl">รายการคำสั่งซื้อ</h1>
          {pendingCount > 0 && (
            <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-accent text-white">
              รอตรวจสอบ {pendingCount} รายการ
            </span>
          )}
        </div>

        <div className="bg-white border border-line rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left">
              <tr>
                <th className="p-3">สินค้า / ผู้ซื้อ</th>
                <th className="p-3">ราคา</th>
                <th className="p-3">สลิป</th>
                <th className="p-3">สถานะ</th>
                <th className="p-3 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const status = STATUS_LABEL[o.status] || STATUS_LABEL.pending;
                return (
                  <tr key={o.id} className="border-t border-line align-top">
                    <td className="p-3">
                      <p className="font-medium">{o.product_name}</p>
                      <p className="text-muted text-xs mt-0.5">
                        {o.buyer_name} · {o.buyer_phone}
                      </p>
                      {o.address && <p className="text-muted text-xs">{o.address}</p>}
                      <p className="text-muted text-xs mt-1">
                        {new Date(o.created_at).toLocaleString("th-TH")}
                      </p>
                    </td>
                    <td className="p-3 font-mono">฿{formatPrice(o.price)}</td>
                    <td className="p-3">
                      <a href={o.slip_url} target="_blank" rel="noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={o.slip_url} alt="สลิป" className="w-14 h-14 object-cover rounded-lg border border-line" />
                      </a>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.className}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-3 whitespace-nowrap">
                      {o.status !== "confirmed" && (
                        <button onClick={() => updateStatus(o.id, "confirmed")} className="text-mintDark font-semibold">
                          ยืนยัน
                        </button>
                      )}
                      {o.status !== "rejected" && (
                        <button onClick={() => updateStatus(o.id, "rejected")} className="text-accentDark font-semibold">
                          ปฏิเสธ
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-muted">ยังไม่มีคำสั่งซื้อ</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
