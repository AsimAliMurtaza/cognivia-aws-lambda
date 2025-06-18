// app/api/courses/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Course from "@/models/Course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const course = await Course.findById(params.id);
  if (!course)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(course);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || session?.user?.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const updates = await req.json();
  const course = await Course.findOneAndUpdate(
    { _id: params.id, createdBy: session.user.id },
    updates,
    { new: true }
  );

  if (!course)
    return NextResponse.json(
      { error: "Not found or not allowed" },
      { status: 404 }
    );
  return NextResponse.json(course);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || session?.user?.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const course = await Course.findOneAndDelete({
    _id: params.id,
    createdBy: session.user.id,
  });

  if (!course)
    return NextResponse.json(
      { error: "Not found or not allowed" },
      { status: 404 }
    );
  return NextResponse.json({ message: "Deleted successfully" });
}
