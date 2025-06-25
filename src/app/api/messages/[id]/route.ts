import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const { content } = await req.json();

  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const updated = await Message.findOneAndUpdate(
    { _id: params.id, postedBy: session?.user?.id },
    { $set: { content } },
    { new: true }
  );

  if (!updated)
    return NextResponse.json(
      { error: "Not found or not allowed" },
      { status: 404 }
    );

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);

  const deleted = await Message.findOneAndDelete({
    _id: params.id,
    postedBy: session?.user?.id,
  });

  if (!deleted)
    return NextResponse.json(
      { error: "Not found or not allowed" },
      { status: 404 }
    );

  return NextResponse.json({ message: "Deleted successfully" });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } } // message ID for replying
) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const { content } = await req.json();

  const reply = {
    content,
    postedBy: new mongoose.Types.ObjectId(session?.user?.id),
    createdAt: new Date(),
  };

  const updated = await Message.findByIdAndUpdate(
    params.id,
    { $push: { replies: reply } },
    { new: true }
  );

  return NextResponse.json(updated);
}
