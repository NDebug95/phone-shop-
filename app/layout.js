import "./globals.css";

export const metadata = {
  title: "ร้านมือถือมือสอง | คุณภาพตรวจสอบแล้ว ราคาคุ้มค่า",
  description: "เลือกซื้อโทรศัพท์มือสองคุณภาพดี ตรวจสอบทุกเครื่อง รับประกันความพอใจ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
