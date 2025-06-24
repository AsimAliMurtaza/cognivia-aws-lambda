import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { token } = await req.json();

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    user.verified = true;
    user.verificationToken = null;

    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
