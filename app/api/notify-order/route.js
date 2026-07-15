import { NextResponse } from "next/server";

// Sends a broadcast message to the shop's LINE Official Account whenever a
// new order comes in. Note: LINE Notify was discontinued by LINE in March
// 2025, so this uses the LINE Messaging API "broadcast" endpoint instead —
// it needs a Messaging API channel access token (LINE_CHANNEL_ACCESS_TOKEN),
// not the old LINE Notify token. See setup notes in the project README.
export async function POST(request) {
  try {
    const body = await request.json();
    const { productName, price, buyerName, buyerPhone } = body;

    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    if (!token) {
      // Not configured yet — order still succeeds, just no LINE ping.
      return NextResponse.json({ ok: true, skipped: "no_line_token" });
    }

    const text =
      `🛒 มีออเดอร์ใหม่!\n` +
      `สินค้า: ${productName}\n` +
      `ราคา: ฿${new Intl.NumberFormat("th-TH").format(price)}\n` +
      `ผู้ซื้อ: ${buyerName} (${buyerPhone})\n` +
      `ตรวจสอบและยืนยันได้ที่หน้าแอดมิน`;

    const res = await fetch("https://api.line.me/v2/bot/message/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ messages: [{ type: "text", text }] }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("LINE broadcast failed:", errText);
      return NextResponse.json({ ok: false, error: errText }, { status: 200 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
