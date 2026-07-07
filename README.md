# ร้านมือถือมือสอง (Phone Shop)

เว็บไซต์ขายโทรศัพท์มือสอง สร้างด้วย Next.js + Supabase + Tailwind CSS

## วิธีติดตั้งใช้งาน

ดูคู่มือฉบับเต็มแบบ Step by Step ในไฟล์ `คู่มือติดตั้งเว็บไซต์.md` ที่แนบมาพร้อมกัน
(ครอบคลุมตั้งแต่สมัคร Supabase, สร้างฐานข้อมูล, ไปจนถึง deploy บน Vercel ฟรี)

## คำสั่งที่ใช้บ่อย (สำหรับรันบนเครื่องตัวเอง)

```bash
npm install       # ติดตั้งไลบรารีที่จำเป็น
npm run dev       # รันเว็บไซต์ทดสอบที่ http://localhost:3000
npm run build     # build เว็บไซต์สำหรับใช้งานจริง
```

## โครงสร้างไฟล์สำคัญ

- `app/page.js` — หน้าแรก (แสดงสินค้าทั้งหมด)
- `app/product/[id]/page.js` — หน้ารายละเอียดสินค้า
- `app/admin/page.js` — หน้าล็อกอินแอดมิน
- `app/admin/dashboard/page.js` — หน้าจัดการสินค้า (เพิ่ม/แก้ไข/ลบ)
- `lib/supabaseClient.js` — การเชื่อมต่อฐานข้อมูล Supabase
- `.env.local.example` — ตัวอย่างค่าที่ต้องตั้งค่า (คัดลอกเป็น `.env.local`)
