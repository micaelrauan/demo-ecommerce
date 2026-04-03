import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

interface CheckoutCartItem {
  id: number;
  variantId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
}

interface CheckoutRequestBody {
  items?: CheckoutCartItem[];
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as CheckoutRequestBody;

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json(
      { error: "O carrinho está vazio" },
      { status: 400 },
    );
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    currency: "brl",
    line_items: body.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "brl",
        unit_amount: item.price,
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : undefined,
        },
      },
    })),
    success_url: `${process.env.NEXTAUTH_URL}/pedido/sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pedido/cancelado`,
    customer_email: session.user?.email || undefined,
    metadata: {
      userId: session.user.id,
      items: JSON.stringify(body.items),
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
