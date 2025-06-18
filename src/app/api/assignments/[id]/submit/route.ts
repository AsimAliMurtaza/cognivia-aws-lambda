import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/mongodb";
import Assignment from "@/models/Assignment";
import AssignmentSubmission from "@/models/AssignmentSubmission";
import { uploadFileToS3 } from "@/lib/s3";
import { use } from "react";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const assignmentId = params.id;

  // 📄 Get the uploaded file from FormData
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Invalid or missing file" },
      { status: 400 }
    );
  }

  // 🔍 Check if assignment exists
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    return NextResponse.json(
      { error: "Assignment not found" },
      { status: 404 }
    );
  }

  // ⏳ Optionally check deadline
  if (assignment.dueDate && new Date(assignment.dueDate) < new Date()) {
    return NextResponse.json(
      { error: "Submission deadline has passed" },
      { status: 403 }
    );
  }

  // ⚠️ Check if the student already submitted
  const existing = await AssignmentSubmission.findOne({
    assignmentId,
    studentId: session.user.id,
  });

  if (existing) {
    return NextResponse.json(
      { error: "You have already submitted this assignment" },
      { status: 409 }
    );
  }

  // ☁️ Upload file to S3
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileUrl = await uploadFileToS3(buffer, file.name, file.type);

  // ✅ Save submission
  const submission = await AssignmentSubmission.create({
    assignmentId,
    studentId: session.user.id,
    fileUrl,
  });

  return NextResponse.json({ message: "Submitted successfully", submission });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await AssignmentSubmission.findOne({
    assignmentId: params.id, // ✅ matches schema
    studentId: session.user.id, // ✅ matches schema
  });

  if (!existing) {
    return NextResponse.json({ submitted: false });
  }

  return NextResponse.json({ submitted: true, submission: existing });
}
