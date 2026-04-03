import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const config = { api: { bodyParser: false } };

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  const payload = await request.text();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid signature";
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const items = session.metadata?.items
      ? JSON.parse(session.metadata.items)
      : [];

    // TODO: persistir o pedido no banco quando houver camada de dados.
    console.log("checkout.session.completed", {
      userId: session.metadata?.userId,
      items,
      sessionId: session.id,
      amountTotal: session.amount_total,
    });
  }

  return new Response("ok", { status: 200 });
}
