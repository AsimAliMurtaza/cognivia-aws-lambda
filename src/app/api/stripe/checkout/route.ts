import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil", 
});

export async function POST(req: Request) {
  const { type, priceId, productName, userId, email, metadata = {} } = await req.json();

  if (!type || !priceId || !userId || !email || !productName) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: type === "subscription" ? "subscription" : "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
      metadata: {
        userId,
        type,
        productName,
        ...metadata,
      },
      ...(type === "subscription" && {
        subscription_data: {
          metadata: {
            userId,
            plan: metadata.plan,
            productName,
          },
        },
      }),
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout session error", err);
    return NextResponse.json({ error: "Stripe session creation failed" }, { status: 500 });
  }
}


