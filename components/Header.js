import Link from "next/link";

export default function Header() {
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || "ร้านมือถือมือสอง";

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-line">
      <div className="container-shell flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-8 h-8 rounded-xl bg-grad-brand flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <span className="w-2.5 h-2.5 rounded-full bg-white/95" />
          </span>
          <span className="font-display font-semibold text-lg tracking-tight text-ink">
            {shopName}
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-ink">
          <Link href="/#products" className="hover:text-primary transition-colors">
            สินค้าทั้งหมด
          </Link>
          <Link href="/#contact" className="hover:text-primary transition-colors">
            ติดต่อเรา
          </Link>
          <Link
            href="/admin"
            className="text-muted hover:text-primary transition-colors hidden sm:inline"
          >
            แอดมิน
          </Link>
        </nav>
      </div>
    </header>
  );
}
