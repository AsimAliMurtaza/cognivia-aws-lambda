import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import dBConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import User from "@/models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

const creditMap = {
  Basic: 200,
  Pro: 400,
  Premium: 700,
  "100 Credits": 100,
  "500 Credits": 500,
  "1000 Credits": 1000,
};

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    await dBConnect();

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer"],
    });

    const transactionData = {
      stripeSessionId: session.id,
      userEmail: session.customer_email,
      amount: session.amount_total,
      currency: session.currency,
      status: session.payment_status,
      paymentMethod: session.payment_method_types[0],
      purchasedAt: new Date(),
      productPlan: session.metadata?.productName || "Unknown",
    };

    const existing = await Transaction.findOne({ stripeSessionId: session.id });
    if (!existing) {
      await Transaction.create(transactionData);

      const productName = session.metadata?.productName || "Unknown";
      // Update user's credit count
      if (session.customer_email && session.metadata?.productName) {
        const credits = creditMap[productName as keyof typeof creditMap] || 0;
        await User.findOneAndUpdate(
          { email: session.customer_email },
          { $inc: { credits } }
        );
      }
    }

    return NextResponse.json(transactionData);
  } catch (error) {
    console.error("Stripe API Error:", (error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
