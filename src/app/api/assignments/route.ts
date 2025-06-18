// POST /api/assignments
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Assignment from "@/models/Assignment";
import Course from "@/models/Course";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    // Create the assignment
    const assignment = await Assignment.create(data);

    // Add assignment ID to course's assignments array
    await Course.findByIdAndUpdate(data.courseId, {
      $push: { assignments: assignment._id },
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("Error creating assignment:", error);
    return NextResponse.json(
      { error: "Failed to create assignment" },
      { status: 500 }
    );
  }
}
