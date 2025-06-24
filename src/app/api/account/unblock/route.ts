import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  const { token } = await req.json();
  await dbConnect();

  const user = await User.findOne({
    unblockToken: token,
    unblockTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 400 }
    );
  }

  user.isAccountLocked = false;
  user.loginAttempts = 0;
  user.unblockToken = null;
  user.unblockTokenExpires = null;
  await user.save();

  return NextResponse.json({
    message: "Your account has been successfully unblocked!",
  });
}
