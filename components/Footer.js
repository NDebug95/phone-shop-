export default function Footer() {
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || "ร้านมือถือมือสอง";
  const phone = process.env.NEXT_PUBLIC_SHOP_PHONE || "";

  return (
    <footer id="contact" className="border-t border-line bg-haze mt-24">
      <div className="container-shell py-14 grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-display font-extrabold text-lg mb-2">{shopName}</p>
          <p className="text-sm text-muted leading-relaxed">
            โทรศัพท์มือสองทุกเครื่องผ่านการตรวจสอบสภาพจริง
            ก่อนวางขายทุกครั้ง มั่นใจได้ในคุณภาพ
          </p>
        </div>
        <div>
          <p className="font-semibold mb-3 text-sm">ติดต่อเรา</p>
          <div className="flex flex-col gap-2 text-sm text-muted">
            {phone && <a className="hover:text-accent" href={`tel:${phone}`}>โทร {phone}</a>}
            {phone && (
              <a
                className="hover:text-accent"
                href={`https://wa.me/${process.env.NEXT_PUBLIC_SHOP_WHATSAPP || phone}`}
                target="_blank"
                rel="noreferrer"
              >
                แชท WhatsApp
              </a>
            )}
          </div>
        </div>
        <div>
          <p className="font-semibold mb-3 text-sm">เวลาทำการ</p>
          <p className="text-sm text-muted">ทุกวัน 09:00 – 19:00 น.</p>
        </div>
      </div>
      <div className="border-t border-line py-5">
        <p className="text-center text-xs text-muted">
          © {new Date().getFullYear()} {shopName}. สงวนลิขสิทธิ์.
        </p>
      </div>
    </footer>
  );
}
