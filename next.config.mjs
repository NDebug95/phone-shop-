export default function Footer() {
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || "ร้านมือถือมือสอง";
  const phone = process.env.NEXT_PUBLIC_SHOP_PHONE || "";

  return (
    <footer id="contact" className="border-t border-line bg-ink text-white mt-24">
      <div className="container-shell py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-7 h-7 rounded-lg bg-grad-brand flex items-center justify-center flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-white/95" />
            </span>
            <p className="font-display font-semibold text-lg">{shopName}</p>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">
            โทรศัพท์มือสองทุกเครื่องผ่านการตรวจสอบสภาพจริง
            ก่อนวางขายทุกครั้ง มั่นใจได้ในคุณภาพ
          </p>
        </div>
        <div>
          <p className="font-semibold mb-3 text-sm text-white/90">ติดต่อเรา</p>
          <div className="flex flex-col gap-2 text-sm text-white/60">
            {phone && (
              <a className="hover:text-accent transition-colors" href={`tel:${phone}`}>
                โทร {phone}
              </a>
            )}
            {phone && (
              <a
                className="hover:text-accent transition-colors"
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
          <p className="font-semibold mb-3 text-sm text-white/90">เวลาทำการ</p>
          <p className="text-sm text-white/60">ทุกวัน 09:00 – 19:00 น.</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <p className="text-center text-xs text-white/40">
          © {new Date().getFullYear()} {shopName}. สงวนลิขสิทธิ์.
        </p>
      </div>
    </footer>
  );
}
