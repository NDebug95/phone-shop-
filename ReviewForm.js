import Link from "next/link";
import AuthNav from "./AuthNav";

export default function Header() {
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || "ร้านมือถือมือสอง";

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-line">
      <div className="container-shell flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <span className="w-8 h-8 rounded-xl bg-grad-brand flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <span className="w-2.5 h-2.5 rounded-full bg-white/95" />
          </span>
          <span className="font-display font-semibold text-lg tracking-tight text-ink">
            {shopName}
          </span>
        </Link>
        <nav className="flex items-center gap-5 md:gap-6 text-sm font-medium text-ink">
          <Link href="/products" className="hover:text-primary transition-colors hidden sm:inline">
            สินค้าทั้งหมด
          </Link>
          <Link href="/reviews" className="hover:text-primary transition-colors hidden sm:inline">
            รีวิว
          </Link>
          <Link href="/#contact" className="hover:text-primary transition-colors hidden md:inline">
            ติดต่อเรา
          </Link>
          <AuthNav />
        </nav>
      </div>
    </header>
  );
}
