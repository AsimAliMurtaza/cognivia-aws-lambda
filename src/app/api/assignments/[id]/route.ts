import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Assignment from "@/models/Assignment";
import Course from "@/models/Course";
import { deleteFileFromS3 } from "@/lib/s3";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await req.json();

    // Validate required fields
    if (!data.title || !data.dueDate) {
      return NextResponse.json(
        { error: "Title and due date are required" },
        { status: 400 }
      );
    }

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      params.id,
      data,
      { new: true }
    );

    if (!updatedAssignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedAssignment);
  } catch (error) {
    console.error("Error updating assignment:", error);
    return NextResponse.json(
      { error: "Failed to update assignment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const assignment = await Assignment.findById(params.id);
    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    if (assignment.fileUrl !== "") {
      await deleteFileFromS3(assignment.fileUrl);
    }

    await Assignment.findByIdAndDelete(params.id);

    await Course.findByIdAndUpdate(assignment.courseId, {
      $pull: { assignments: params.id },
    });


    return NextResponse.json(
      { message: "Assignment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return NextResponse.json(
      { error: "Failed to delete assignment" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const assignment = await Assignment.findById(params.id);

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("Error fetching assignment:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignment" },
      { status: 500 }
    );
  }
}
