import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/mongodb";
import Assignment from "@/models/Assignment";
import AssignmentSubmission from "@/models/AssignmentSubmission";
import { uploadFileToS3 } from "@/lib/s3";

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

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Invalid or missing file" },
      { status: 400 }
    );
  }

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    return NextResponse.json(
      { error: "Assignment not found" },
      { status: 404 }
    );
  }

  if (assignment.dueDate && new Date(assignment.dueDate) < new Date()) {
    return NextResponse.json(
      { error: "Submission deadline has passed" },
      { status: 403 }
    );
  }

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

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileUrl = await uploadFileToS3(buffer, file.name, file.type);

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
    assignmentId: params.id,
    studentId: session.user.id,
  });

  if (!existing) {
    return NextResponse.json({ submitted: false });
  }

  return NextResponse.json({ submitted: true });
}
