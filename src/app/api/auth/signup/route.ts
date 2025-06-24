import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password, role } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const newUser = new User({
      email,
      password: hashedPassword,
      verified: false,
      verificationToken,
      role,
    });

    await newUser.save();

    const baseUrl = process.env.NEXTAUTH_URL;
    const verifyLink = `${baseUrl}/verify-email?token=${verificationToken}`;

    await sendVerificationEmail(email, verifyLink);

    return NextResponse.json(
      { message: "User created. Verification email sent." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
