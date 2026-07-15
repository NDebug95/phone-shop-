"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [qrUrl, setQrUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

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
      const { data: setting } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "payment_qr_url")
        .single();
      setQrUrl(setting?.value || "");
      setChecking(false);
    }
    check();
  }, [router]);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage("");

    const ext = file.name.split(".").pop();
    const path = `qr-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, file);

    if (uploadError) {
      setMessage(`อัปโหลดไม่สำเร็จ: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data: pub } = supabase.storage.from("product-images").getPublicUrl(path);

    const { error: updateError } = await supabase
      .from("site_settings")
      .upsert({ key: "payment_qr_url", value: pub.publicUrl });

    setUploading(false);
    if (updateError) {
      setMessage(`บันทึกไม่สำเร็จ: ${updateError.message}`);
      return;
    }

    setQrUrl(pub.publicUrl);
    setMessage("อัปเดต QR รับเงินเรียบร้อยแล้ว");
  }

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center text-muted">กำลังตรวจสอบสิทธิ์...</div>;
  }

  return (
    <main className="min-h-screen bg-surface pb-24">
      <header className="bg-white border-b border-line sticky top-0 z-30">
        <div className="container-shell h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="font-display font-semibold">แผงควบคุมแอดมิน</Link>
            <Link href="/admin/dashboard" className="text-sm text-muted hover:text-primary">สินค้า</Link>
            <Link href="/admin/orders" className="text-sm text-muted hover:text-primary">ออเดอร์</Link>
            <span className="text-sm font-semibold text-primaryDark">ตั้งค่า QR</span>
          </div>
          <a href="/" className="text-sm text-muted hover:text-primary">ดูหน้าร้าน</a>
        </div>
      </header>

      <div className="container-shell pt-8 max-w-md">
        <h1 className="font-display font-semibold text-xl mb-4">QR รับเงิน</h1>
        <div className="bg-white border border-line rounded-2xl p-6 text-center">
          {qrUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrUrl} alt="QR รับเงินปัจจุบัน" className="w-48 h-48 object-contain mx-auto mb-4 rounded-xl border border-line p-2" />
          ) : (
            <p className="text-muted mb-4">ยังไม่ได้อัปโหลด QR รับเงิน</p>
          )}
          <input type="file" accept="image/*" onChange={handleUpload} />
          {uploading && <p className="text-xs text-muted mt-2">กำลังอัปโหลด...</p>}
          {message && <p className="text-sm mt-2 text-primaryDark">{message}</p>}
          <p className="text-xs text-muted mt-4 leading-relaxed">
            อัปโหลดรูป QR PromptPay หรือ QR ธนาคารของคุณ ลูกค้าจะเห็นรูปนี้ในหน้าชำระเงินทุกครั้ง
          </p>
        </div>
      </div>
    </main>
  );
}
