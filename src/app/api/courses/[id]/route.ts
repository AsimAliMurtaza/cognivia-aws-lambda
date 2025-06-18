import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import Assignment from "@/models/Assignment";
import CourseModel from "@/models/Course";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  mongoose.models.Assignment = Assignment; // Ensure Assignment model is registered

  // ❗️This works because Assignment is registered above
  const course = await CourseModel.findById(params.id).populate("assignments");

  if (!course) {
    return new Response("Not found", { status: 404 });
  }

  return Response.json(course);
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
  const updated = await CourseModel.findOneAndUpdate(
    { _id: params.id, createdBy: session.user.id },
    updates,
    { new: true }
  );

  if (!updated) {
    return NextResponse.json(
      { error: "Not found or not allowed" },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
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

  const deleted = await CourseModel.findOneAndDelete({
    _id: params.id,
    createdBy: session.user.id,
  });

  if (!deleted) {
    return NextResponse.json(
      { error: "Not found or not allowed" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Deleted successfully" });
}
