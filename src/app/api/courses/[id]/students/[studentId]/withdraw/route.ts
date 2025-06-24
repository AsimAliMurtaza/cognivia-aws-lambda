import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Course from "@/models/Course";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; studentId: string } }
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, studentId } = params;
  const { reason } = await req.json();

  console.log("Withdraw request:", { id, studentId, reason });

  if (!reason || reason.trim().length < 3) {
    return NextResponse.json({ error: "Reason is required." }, { status: 400 });
  }

  try {
    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Ensure student is enrolled
    const studentObjectId = new mongoose.Types.ObjectId(studentId);
    if (!course.students.includes(studentObjectId)) {
      return NextResponse.json(
        { error: "Student is not enrolled in this course" },
        { status: 400 }
      );
    }

    // Remove student
    course.students = course.students.filter(
      (id: mongoose.Types.ObjectId) => !id.equals(studentObjectId)
    );
    await course.save();

    return NextResponse.json({
      success: true,
      message: "Student withdrawn successfully",
    });
  } catch (error) {
    console.error("Withdraw error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
