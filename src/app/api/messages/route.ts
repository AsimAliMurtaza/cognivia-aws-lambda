// app/api/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import Course from "@/models/Course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session?.user?.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { courseId, content } = await req.json();

  if (!courseId || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const message = await Message.create({
    courseId,
    content,
    postedBy: session.user.id,
  });

  await Course.findByIdAndUpdate(courseId, {
    $push: { messages: message._id },
  });

  return NextResponse.json(message, { status: 201 });
}

export async function GET(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session?.user?.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  if (!courseId) {
    return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
  }

  const messages = await Message.find({ courseId })
    .populate("postedBy", "name email")
    .sort({ createdAt: -1 });

  return NextResponse.json(messages, { status: 200 });
}
