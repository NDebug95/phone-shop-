import Link from "next/link";

export default function Header() {
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || "ร้านมือถือมือสอง";

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-line">
      <div className="container-shell flex items-center justify-between h-16">
        <Link href="/" className="font-display font-extrabold text-lg tracking-tight">
          {shopName}
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-ink">
          <Link href="/#products" className="hover:text-accent transition-colors">
            สินค้าทั้งหมด
          </Link>
          <Link href="/#contact" className="hover:text-accent transition-colors">
            ติดต่อเรา
          </Link>
          <Link href="/admin" className="text-muted hover:text-accent transition-colors">
            แอดมิน
          </Link>
        </nav>
      </div>
    </header>
  );
}
