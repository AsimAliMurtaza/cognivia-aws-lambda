import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  await dbConnect();
  const { email, otp } = await req.json();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    if (!user.twoFactorOtp || !user.twoFactorOtpExpiry) {
      console.log("2FA not configured for user");
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    if (new Date() > user.twoFactorOtpExpiry) {
      console.log(
        "OTP expired. Expiry:",
        user.twoFactorOtpExpiry,
        "Now:",
        new Date()
      );
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    if (user.twoFactorOtp !== otp) {
      console.log("OTP mismatch. Stored:", user.twoFactorOtp, "Provided:", otp);
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Clear OTP
    user.twoFactorOtp = null;
    user.twoFactorOtpExpiry = null;
    await user.save();
    console.log("OTP verified and cleared for user:", email);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("OTP verification error:", err);
    return NextResponse.json(
      { error: "OTP verification failed" },
      { status: 500 }
    );
  }
}
