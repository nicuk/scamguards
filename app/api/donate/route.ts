import { NextResponse } from "next/server";
import Stripe from "stripe";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://scamguards.app";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = "myr" } = body;

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum is RM1." },
        { status: 400 }
      );
    }

    if (amount > 10000) {
      return NextResponse.json(
        { error: "Maximum donation is RM10,000." },
        { status: 400 }
      );
    }

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: "Support ScamGuards Malaysia",
              description: `RM${amount} donation to keep ScamGuards free for all Malaysians`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${SITE_URL}/donate/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/donate`,
      metadata: {
        type: "donation",
        amount: amount.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Stripe error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create donation session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
