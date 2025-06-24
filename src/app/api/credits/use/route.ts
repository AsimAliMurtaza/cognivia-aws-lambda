import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  await connectDB();
  const { userId, amount } = await req.json();

  const user = await User.findById(userId);
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.credits < amount) {
    return NextResponse.json(
      { error: "Insufficient credits" },
      { status: 402 }
    );
  }

  user.credits -= amount;
  await user.save();

  return NextResponse.json({
    message: "Credits deducted",
    credits: user.credits,
  });
}
