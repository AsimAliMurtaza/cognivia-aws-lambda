import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const user = await User.findOne({ email: session?.user?.email });
  return NextResponse.json({ is2FAEnabled: user?.is2FAEnabled ?? false });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { is2FAEnabled } = await req.json();

  await dbConnect();
  const updatedUser = await User.findOneAndUpdate(
    { email: session?.user?.email },
    { is2FAEnabled },
    { new: true }
  );

  return NextResponse.json({ is2FAEnabled: updatedUser.is2FAEnabled });
}
