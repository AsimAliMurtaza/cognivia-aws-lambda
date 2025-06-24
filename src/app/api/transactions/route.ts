import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/options"; 

export async function GET(req: NextRequest) {
  console.log(req.ip);
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const transactions = await Transaction.find({
    userEmail: session.user.email,
  }).sort({
    purchasedAt: -1,
  });

  return NextResponse.json({ transactions });
}
