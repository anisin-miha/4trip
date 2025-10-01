import { NextResponse } from "next/server";

// NOTE: This is a scaffold for Selfwork "Smart-оплата" integration.
// It expects environment variables with API credentials and will return a payment URL.
// Fill the exact endpoint/headers/body per your Selfwork account settings.

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      amount,
      currency = "RUB",
      orderId,
      description,
      customer,
      successUrl,
      failUrl,
    } = body || {};

    if (!amount || !orderId) {
      return NextResponse.json(
        { error: "amount and orderId are required" },
        { status: 400 },
      );
    }

    const API_KEY = process.env.SELFWORK_API_KEY;
    const SHOP_ID = process.env.SELFWORK_SHOP_ID;
    const API_URL =
      process.env.SELFWORK_API_URL ||
      "https://pro.selfwork.ru/merchant/v1/init"; // реальный init-эндпоинт

    if (!API_KEY) {
      return NextResponse.json(
        { error: "Payment is not configured: missing SELFWORK_API_KEY" },
        { status: 501 },
      );
    }

    // Build payload as per Selfwork docs. This is a likely structure — adjust names to actual spec.
    const payload: Record<string, any> = {
      // NOTE: проверьте точные имена полей по документации Selfwork
      amount: Math.round(Number(amount) * 100) / 100,
      currency,
      order_id: orderId,
      description,
      customer: {
        email: customer?.email,
        phone: customer?.phone,
      },
      success_url: successUrl,
      fail_url: failUrl,
      shop_id: SHOP_ID,
    };

    // Call Selfwork API
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // В зависимости от настроек аккаунта может использоваться один из вариантов авторизации:
        Authorization: `Bearer ${API_KEY}`,
        "X-Api-Key": API_KEY,
      },
      body: JSON.stringify(payload),
      // @ts-ignore
      cache: "no-store",
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: "Selfwork API error", details: json },
        { status: 502 },
      );
    }

    // Normalize response to a common shape
    const paymentUrl = json?.payment_url || json?.url || json?.redirect_url;
    if (!paymentUrl) {
      return NextResponse.json(
        { error: "Payment URL missing in provider response", details: json },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: paymentUrl });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Unexpected server error", details: String(e?.message || e) },
      { status: 500 },
    );
  }
}
