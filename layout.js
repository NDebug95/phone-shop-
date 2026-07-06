"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const emptyForm = {
  id: null,
  name: "",
  brand: "",
  price: "",
  original_price: "",
  condition: "",
  storage_gb: "",
  color: "",
  description: "",
  in_stock: true,
  images: [],
};

export default function AdminDashboard() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setProducts(data);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/admin");
      } else {
        setCheckingAuth(false);
        loadProducts();
      }
    });
  }, [router, loadProducts]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin");
  }

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setMessage("");
    const uploadedUrls = [];

    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, file);

      if (error) {
        setMessage(`อัปโหลดรูปล้มเหลว: ${error.message}`);
        continue;
      }

      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      uploadedUrls.push(data.publicUrl);
    }

    setForm((f) => ({ ...f, images: [...f.images, ...uploadedUrls] }));
    setUploading(false);
  }

  function removeImage(url) {
    setForm((f) => ({ ...f, images: f.images.filter((img) => img !== url) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      name: form.name,
      brand: form.brand || null,
      price: form.price ? Number(form.price) : 0,
      original_price: form.original_price ? Number(form.original_price) : null,
      condition: form.condition || null,
      storage_gb: form.storage_gb || null,
      color: form.color || null,
      description: form.description || null,
      in_stock: form.in_stock,
      images: form.images,
    };

    let error;
    if (form.id) {
      ({ error } = await supabase.from("products").update(payload).eq("id", form.id));
    } else {
      ({ error } = await supabase.from("products").insert(payload));
    }

    setSaving(false);
    if (error) {
      setMessage(`บันทึกไม่สำเร็จ: ${error.message}`);
      return;
    }

    setMessage(form.id ? "อัปเดตสินค้าเรียบร้อยแล้ว" : "เพิ่มสินค้าเรียบร้อยแล้ว");
    setForm(emptyForm);
    loadProducts();
  }

  function editProduct(p) {
    setForm({
      id: p.id,
      name: p.name || "",
      brand: p.brand || "",
      price: p.price ?? "",
      original_price: p.original_price ?? "",
      condition: p.condition || "",
      storage_gb: p.storage_gb || "",
      color: p.color || "",
      description: p.description || "",
      in_stock: p.in_stock,
      images: p.images || [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteProduct(id) {
    if (!confirm("ต้องการลบสินค้านี้ใช่หรือไม่?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) loadProducts();
  }

  if (checkingAuth) {
    return <div className="min-h-screen flex items-center justify-center text-muted">กำลังตรวจสอบสิทธิ์...</div>;
  }

  return (
    <main className="min-h-screen bg-haze pb-24">
      <header className="bg-white border-b border-line sticky top-0 z-30">
        <div className="container-shell h-16 flex items-center justify-between">
          <h1 className="font-display font-extrabold">แผงควบคุมแอดมิน</h1>
          <div className="flex gap-4 items-center">
            <a href="/" className="text-sm text-muted hover:text-accent">ดูหน้าร้าน</a>
            <button onClick={handleLogout} className="text-sm font-semibold text-red-500">
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      <div className="container-shell pt-8 grid lg:grid-cols-[420px_1fr] gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-line rounded-2xl p-6 h-fit">
          <h2 className="font-bold text-lg mb-4">
            {form.id ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">ชื่อรุ่น *</label>
              <input
                required
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full border border-line rounded-lg px-3 py-2 focus-ring"
                placeholder="เช่น iPhone 13 Pro 128GB"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">ยี่ห้อ</label>
                <input
                  value={form.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                  className="w-full border border-line rounded-lg px-3 py-2 focus-ring"
                  placeholder="Apple, Samsung..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">สี</label>
                <input
                  value={form.color}
                  onChange={(e) => updateField("color", e.target.value)}
                  className="w-full border border-line rounded-lg px-3 py-2 focus-ring"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">ราคาขาย (บาท) *</label>
                <input
                  required
                  type="number"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  className="w-full border border-line rounded-lg px-3 py-2 focus-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ราคาปกติ (ถ้ามี)</label>
                <input
                  type="number"
                  value={form.original_price}
                  onChange={(e) => updateField("original_price", e.target.value)}
                  className="w-full border border-line rounded-lg px-3 py-2 focus-ring"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">เกรดสภาพ</label>
                <select
                  value={form.condition}
                  onChange={(e) => updateField("condition", e.target.value)}
                  className="w-full border border-line rounded-lg px-3 py-2 focus-ring"
                >
                  <option value="">เลือกเกรด</option>
                  <option value="A (สภาพดีมาก)">A (สภาพดีมาก)</option>
                  <option value="B (สภาพดี มีรอยเล็กน้อย)">B (สภาพดี มีรอยเล็กน้อย)</option>
                  <option value="C (ใช้งานได้ปกติ มีรอย)">C (ใช้งานได้ปกติ มีรอย)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ความจุ</label>
                <input
                  value={form.storage_gb}
                  onChange={(e) => updateField("storage_gb", e.target.value)}
                  className="w-full border border-line rounded-lg px-3 py-2 focus-ring"
                  placeholder="128GB"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">รายละเอียดสินค้า</label>
              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={4}
                className="w-full border border-line rounded-lg px-3 py-2 focus-ring"
                placeholder="อาการ, อุปกรณ์ที่แถม, ระยะเวลารับประกัน..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="in_stock"
                checked={form.in_stock}
                onChange={(e) => updateField("in_stock", e.target.checked)}
              />
              <label htmlFor="in_stock" className="text-sm">ยังมีสินค้าพร้อมขาย</label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">รูปภาพสินค้า</label>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
              {uploading && <p className="text-xs text-muted mt-1">กำลังอัปโหลด...</p>}
              {form.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {form.images.map((url) => (
                    <div key={url} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="aspect-square object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs leading-5"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {message && <p className="text-sm mt-4 text-accentDark">{message}</p>}

          <div className="flex gap-3 mt-6">
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? "กำลังบันทึก..." : form.id ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
            </button>
            {form.id && (
              <button
                type="button"
                onClick={() => setForm(emptyForm)}
                className="btn-secondary"
              >
                ยกเลิก
              </button>
            )}
          </div>
        </form>

        {/* List */}
        <div className="bg-white border border-line rounded-2xl overflow-hidden h-fit">
          <table className="w-full text-sm">
            <thead className="bg-haze text-left">
              <tr>
                <th className="p-3">สินค้า</th>
                <th className="p-3">ราคา</th>
                <th className="p-3">สถานะ</th>
                <th className="p-3 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-line">
                  <td className="p-3 flex items-center gap-3">
                    {p.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-haze" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-haze" />
                    )}
                    <span className="font-medium">{p.name}</span>
                  </td>
                  <td className="p-3">฿{new Intl.NumberFormat("th-TH").format(p.price)}</td>
                  <td className="p-3">
                    {p.in_stock ? (
                      <span className="text-xs font-semibold text-green-600">พร้อมขาย</span>
                    ) : (
                      <span className="text-xs font-semibold text-red-500">ขายแล้ว</span>
                    )}
                  </td>
                  <td className="p-3 text-right space-x-3">
                    <button onClick={() => editProduct(p)} className="text-accentDark font-semibold">
                      แก้ไข
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="text-red-500 font-semibold">
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-muted">
                    ยังไม่มีสินค้า เพิ่มสินค้าชิ้นแรกจากฟอร์มด้านซ้าย
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
